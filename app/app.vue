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
  <div class="min-h-screen flex flex-col">
    <Navigation />

    <main class="container mx-auto flex-1 px-8 py-4">
      <NuxtPage />
    </main>
  </div>
</template>
