<template>
  <section class="max-w-3xl">
    <h1 class="text-4xl font-bold mb-4">My Resume</h1>

    <p class="text-gray-600 dark:text-gray-400 mb-6">
      A one-page overview of my experience, projects, and technical background.
    </p>

    <div class="flex gap-6">
      <a
        href="../resume.pdf"
        target="_blank"
        class="text-lg underline underline-offset-8"
      >
        view pdf
      </a>
      <a
        href="../resume.pdf"
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

<script setup lang="ts">
import { ref, onMounted } from "vue";

const lastUpdated = ref<string>("");

onMounted(async () => {
  try {
    const res = await $fetch.raw("../resume.pdf", { method: "HEAD" });
    const lastModified = res.headers.get("last-modified");

    if (lastModified) {
      lastUpdated.value = new Date(lastModified).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
  } catch {
    lastUpdated.value = "";
  }
});
</script>

