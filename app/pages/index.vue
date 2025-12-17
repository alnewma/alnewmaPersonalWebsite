<script setup lang="ts">
const title = ''

useHead({ title })
useSeoMeta({ title })

const config = useRuntimeConfig()

const { data: repositories } = await useFetch<any[]>(
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
