<script setup lang="ts">
import type { Project } from '~~/github'

const title = ''
useHead({ title })
useSeoMeta({ title })

const config = useRuntimeConfig()

const base =
  config.app.baseURL.endsWith('/') ? config.app.baseURL : `${config.app.baseURL}/`

const { data: repositories } = await useFetch<Project[]>(
  `${base}repos.json`,
  { default: () => [], server: false }
)

const { data } = await useFetch<{ languages: { name: string }[] }>(
  `${base}github-languages.json`,
  { default: () => ({ languages: [] }), server: false }
)

const languages = computed(() => data.value.languages)
</script>

<template>
  <div class="flex w-full flex-col gap-12 pb-8">
    <Hero :languages="languages" />
    <Projects :projects="repositories || []" />
    <BlogPosts />
    <!--<Contact />-->
  </div>
</template>
