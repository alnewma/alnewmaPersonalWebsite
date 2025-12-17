import { writeFile, mkdir } from 'node:fs/promises'

const PRIMARY_LANGUAGES = new Set(['GDScript', 'C#', 'C', 'Java', 'Python'])

const IGNORED_LANGUAGES = new Set([
  'GLSL',
  'HLSL',
  'ShaderLab',
  'GAP',
  'Mathematica',
])

const USERNAME = process.env.GITHUB_USERNAME
const TOKEN = process.env.GITHUB_TOKEN
const OUT_DIR = 'public'

const RECENT_PERSONAL_REPOS_FOR_HERO = 3
const RECENT_CONTRIBUTIONS = 3
const TOP_LANGS_PER_REPO = 3

if (!USERNAME) {
  console.error('Missing GITHUB_USERNAME')
  process.exit(1)
}

if (!TOKEN) {
  console.error('Missing GITHUB_TOKEN (required for pinned repos via GraphQL)')
  process.exit(1)
}

const headers = {
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${TOKEN}`,
}

async function gh(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} (${url})`)
  return res.json()
}

async function ghGraphQL(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} (GraphQL)`)
  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors)}`)
  }
  return json.data
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length)
  let i = 0

  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await mapper(items[idx], idx)
    }
  }

  await Promise.all(Array.from({ length: limit }, worker))
  return results
}

function selectLanguages(langObj, fallbackLanguage, max = TOP_LANGS_PER_REPO) {
  const entries = Object.entries(langObj)
    .filter(([name]) => !IGNORED_LANGUAGES.has(name))
    .sort((a, b) => b[1] - a[1])

  if (!entries.length && fallbackLanguage) return [{ name: fallbackLanguage }]

  const present = new Set(entries.map(([name]) => name))
  const primary = [...PRIMARY_LANGUAGES].filter((lang) => present.has(lang))
  const secondary = entries
    .map(([name]) => name)
    .filter((name) => !primary.includes(name))

  return [...primary, ...secondary].slice(0, max).map((name) => ({ name }))
}

// ✅ accepts a languages_url string + fallback language string
async function getTopLanguages(languagesUrl, fallbackLanguage) {
  try {
    const langObj = await gh(languagesUrl)
    return selectLanguages(langObj, fallbackLanguage, TOP_LANGS_PER_REPO)
  } catch {
    return fallbackLanguage ? [{ name: fallbackLanguage }] : []
  }
}

/**
 * 1) PINNED REPOS (Projects)
 */
async function getPinnedRepos(username) {
  const query = `
    query ($login: String!) {
      user(login: $login) {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              description
              url
              homepageUrl
              stargazerCount
              forkCount
              updatedAt
              owner { login }
            }
          }
        }
      }
    }
  `
  const data = await ghGraphQL(query, { login: username })
  return (data.user?.pinnedItems?.nodes ?? []).filter(Boolean)
}

async function normalizePinnedRepo(p) {
  const languages_url = `https://api.github.com/repos/${p.owner.login}/${p.name}/languages`
  const languages = await getTopLanguages(languages_url, null)

  return {
    name: p.name,
    description: p.description ?? null,
    url: p.url,
    homepageUrl: p.homepageUrl ?? null,
    languages,
    topics: [],
    stargazers_count: p.stargazerCount,
    forks_count: p.forkCount,
    updated_at: p.updatedAt,
  }
}

/**
 * 2) REST repo normalization (for hero sources + contributions)
 */
async function normalizeRestRepoWithTopLangs(r) {
  const languages = await getTopLanguages(r.languages_url, r.language)

  return {
    name: r.name,
    description: r.description ?? null,
    url: r.html_url,
    homepageUrl: r.homepage ?? null,
    languages,
    topics: r.topics ?? [],
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    updated_at: r.updated_at,
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  // Projects: pinned repos
  const pinned = await getPinnedRepos(USERNAME)
  const pinnedRepos = await mapWithConcurrency(pinned, 6, normalizePinnedRepo)
  await writeFile(`${OUT_DIR}/repos.json`, JSON.stringify(pinnedRepos, null, 2))

  // Hero languages: derived from most recent personal repos
  const personalReposAll = await gh(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
  )

  const recentPersonal = personalReposAll
    .filter((r) => !r.fork)
    .slice(0, RECENT_PERSONAL_REPOS_FOR_HERO)

  const recentPersonalWithLangs = await mapWithConcurrency(
    recentPersonal,
    6,
    normalizeRestRepoWithTopLangs
  )

  const languageSet = new Set()
  for (const repo of recentPersonalWithLangs) {
    for (const lang of repo.languages ?? []) {
      if (lang?.name) languageSet.add(lang.name)
    }
  }

  const heroLanguages = [...languageSet].sort().map((name) => ({ name }))
  await writeFile(
    `${OUT_DIR}/github-languages.json`,
    JSON.stringify({ languages: heroLanguages }, null, 2)
  )

  // Contributions: most recent 3 contributed repos
  const contributions = await gh(
    `https://api.github.com/search/repositories?q=contributor:${USERNAME}&sort=updated&per_page=100`
  )

  const contributedBase = (contributions.items ?? [])
    .filter((r) => r.owner?.login !== USERNAME)
    .slice(0, RECENT_CONTRIBUTIONS)

  const contributedRepos = await mapWithConcurrency(
    contributedBase,
    6,
    normalizeRestRepoWithTopLangs
  )

  await writeFile(
    `${OUT_DIR}/contributions.json`,
    JSON.stringify(contributedRepos, null, 2)
  )

  console.log('✔ GitHub JSON generated (pinned + recent contributions + hero languages)')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
