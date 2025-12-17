<script setup lang="ts">
const title = ''

useHead({ title })
useSeoMeta({ title })

const config = useRuntimeConfig()

type Repo = {
  name: string
  full_name: string
  html_url: string
  description: string | null
  homepage: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  updated_at: string
}

const { data: repositories } = await useFetch<Repo[]>(
  `${config.app.baseURL}repos.json`,
  { default: () => [], server: false }
)

const { data } = await useFetch<{ languages: { name: string }[] }>(
  `${config.app.baseURL}github-languages.json`,
  { default: () => ({ languages: [] }), server: false }
)

const languages = computed(() => data.value.languages)
</script>

<template>
  <div class="flex w-full flex-col gap-12 pb-8">
    <Hero :languages="languages" />
    <Projects :projects="repositories || []" />
    <BlogPosts />
    <Contact />
  </div>
</template>
