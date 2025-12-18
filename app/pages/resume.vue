<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const lastUpdated = ref("");
const config = useRuntimeConfig();

const resumeUrl = computed(() => {
  const base = config.app.baseURL.endsWith("/") ? config.app.baseURL : `${config.app.baseURL}/`;
  return `${base}resume.pdf`;
});

onMounted(async () => {
  try {
    const res = await $fetch.raw(resumeUrl.value, { method: "HEAD" });
    const lastModified = res.headers.get("last-modified");

    if (lastModified) {
      lastUpdated.value = new Date(lastModified).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    } else {
      lastUpdated.value = "";
    }
  } catch {
    lastUpdated.value = "";
  }
});
</script>


<template>
  <section class="max-w-3xl">
    <h1 class="text-4xl font-bold mb-4">My Resume</h1>

    <p class="text-gray-600 dark:text-gray-400 mb-6">
      A one-page overview of my experience, projects, and technical background.
    </p>

    <div class="flex gap-6">
      <a
        :href="resumeUrl"
        target="_blank"
        rel="noreferrer noopener"
        class="text-lg underline underline-offset-8"
      >
        view pdf
      </a>
      <a
        :href="resumeUrl"
        download
        class="text-lg underline underline-offset-8"
      >
        download pdf
      </a>
    </div>

    <hr class="my-8 border-gray-200 dark:border-gray-700" />

    <p class="text-sm text-gray-500 dark:text-gray-400">
      last updated:
      <span v-if="lastUpdated">{{ lastUpdated }}</span>
      <span v-else>—</span>
    </p>
  </section>
</template>
