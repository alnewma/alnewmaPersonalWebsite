import { writeFile, mkdir } from 'node:fs/promises'

const USERNAME = process.env.GITHUB_USERNAME
const TOKEN = process.env.GITHUB_TOKEN
const OUT_DIR = 'public'

if (!USERNAME) {
  console.error('Missing GITHUB_USERNAME')
  process.exit(1)
}

const headers = {
  Accept: 'application/vnd.github+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
}

async function gh(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

const pickRepo = (r) => ({
  name: r.name,
  full_name: r.full_name,
  html_url: r.html_url,
  description: r.description,
  homepage: r.homepage,
  language: r.language,
  topics: r.topics ?? [],
  stargazers_count: r.stargazers_count,
  forks_count: r.forks_count,
  updated_at: r.updated_at,
})

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const repos = await gh(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
  )

  const personalRepos = repos
    .filter(r => !r.fork)
    .map(pickRepo)

  await writeFile(
    `${OUT_DIR}/repos.json`,
    JSON.stringify(personalRepos, null, 2)
  )

  const languageSet = new Set(
    personalRepos.map(r => r.language).filter(Boolean)
  )

  const languages = [...languageSet]
    .sort()
    .map(name => ({ name }))

  await writeFile(
    `${OUT_DIR}/github-languages.json`,
    JSON.stringify({ languages }, null, 2)
  )

  const contributions = await gh(
    `https://api.github.com/search/repositories?q=contributor:${USERNAME}&sort=updated&per_page=100`
  )

  const contributedRepos = contributions.items
    .filter(r => r.owner.login !== USERNAME)
    .map(pickRepo)

  await writeFile(
    `${OUT_DIR}/contributions.json`,
    JSON.stringify(contributedRepos, null, 2)
  )

  console.log('✔ GitHub JSON generated')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
