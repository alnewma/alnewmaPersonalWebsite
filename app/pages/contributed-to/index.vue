<script setup lang="ts">
const title = 'Open Source contributions';

useHead({
  title,
});

useSeoMeta({
  title,
});

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
  `${config.app.baseURL}contributions.json`,
  {
    default: () => [],
    server: false,
  }
)
</script>

<template>
  <div class="flex w-full flex-col gap-12 pb-8">
    <Projects
      :projects="repositories ?? []"
      title="Open Source contributions"
    />
  </div>
</template>
