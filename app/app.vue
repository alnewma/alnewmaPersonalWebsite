<script setup lang="ts">
const baseTitle = 'Alex Newman';
const baseDescription =
  'Computer science student at Clemson University.';
const baseOgImage = '/og-image.png';
const ogType = 'website';
const author = 'Alex Newman';
const ogSiteName = 'Alex Newman';

function titleTemplate(title?: string) {
  if (title?.length && title !== baseTitle) {
    return `${title} | Alex Newman`;
  }
  return baseTitle;
}

useHead({
  title: baseTitle,
  titleTemplate,
});

useSeoMeta({
  author,
  description: baseDescription,
  ogDescription: baseDescription,
  ogImage: baseOgImage,
  ogSiteName,
  ogTitle: baseTitle,
  ogType,
  title: baseTitle,
  titleTemplate,
});
</script>

<template>
  <div class="container mx-auto flex h-full min-h-screen flex-col px-8 py-4">
    <Navigation />

    <NuxtPage />
  </div>
</template>
