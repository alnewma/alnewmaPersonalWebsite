<script setup lang="ts">
import type { Project } from '~~/github'

const title = 'Open Source contributions'

useHead({ title })
useSeoMeta({ title })

const config = useRuntimeConfig()

// ensure correct path for GitHub Pages + dev
const base =
  config.app.baseURL.endsWith('/') ? config.app.baseURL : `${config.app.baseURL}/`

const { data: repositories } = await useFetch<Project[]>(
  `${base}contributions.json`,
  {
    default: () => [],
    server: false,
  }
)
</script>

<template>
  <!-- Entire section is hidden if there are no contributions -->
  <div
    v-if="repositories && repositories.length"
    class="flex w-full flex-col gap-12 pb-8"
  >
    <Projects
      :projects="repositories"
      title="Open Source contributions"
    />
  </div>
</template>
