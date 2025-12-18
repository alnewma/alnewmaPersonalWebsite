<script setup lang="ts">
import { switchHighlightColor } from '~/colors';

defineProps<{
  languages?: Array<{ name: string }>;
}>();

const hiddenLanguages = ['other', 'netrw', 'json', 'markdown'];
const defaultLanguages = ['Java', 'Python', 'GDScript'];

function formatLanguageText(inputLanguages?: string[]) {
  const source =
    Array.isArray(inputLanguages) && inputLanguages.length
      ? inputLanguages
      : defaultLanguages;

  const pickedLanguages = source
    .filter(
      (lang) =>
        lang &&
        lang.length &&
        !hiddenLanguages.includes(lang.toLowerCase())
    )
    .slice(0, 3);

  const formatted = (() => {
    const list = pickedLanguages.length
      ? pickedLanguages
      : defaultLanguages.slice(0, 3);

    if (list.length === 1) return list[0];
    if (list.length === 2) return `${list[0]} and ${list[1]}`;
    return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
  })();

  return `Lately, my projects have been mainly in ${formatted}.`;
}

// Keep only the highlight color change on hover/focus
function highlightHover() {
  switchHighlightColor();
}
</script>

<template>
  <section
    id="about"
    class="grid grid-cols-1 items-center gap-4 lg:grid-cols-2"
  >
    <div class="flex flex-col gap-4">
      <h1
        class="text-5xl font-bold text-black-primary lg:text-6xl dark:text-white-primary"
      >
        <span
          class="text-[color:var(--highlight)] duration-300"
          @mouseenter="highlightHover"
          @focus="highlightHover"
        >
          Hi,
        </span>
        I'm Alex Newman
      </h1>

      <p class="text-xl text-black-primary dark:text-white-primary">
        I am a computer science major at Clemson University with minors in
        Artificial Intelligence and Biological Sciences.
        {{
          formatLanguageText(languages?.map((l) => l.name) || defaultLanguages)
        }}
      </p>

      <p class="text-dark-primary text-xl dark:text-white-primary">
        I currently work for the Clemson GRIT Lab,
        <!--
        <a
          class="underline"
          href="https://cavea.io?utm_source=mhouge.dk"
          rel="noreferrer noopener"
          target="_blank"
          >jobWebsite.com</a
        >
        -->
        where we are organizing and mapping dozens of demographic datasets for public query. Some
        other projects I've worked on include:
      </p>

      <ul
        class="mb-4 ml-8 list-disc text-xl text-black-primary dark:text-white-primary"
      >
        <li>An automatated moderation bot for GroupMe</li>

        <li>
          A video game
          <a
            class="underline"
            href="https://store.steampowered.com/app/2542650/Sole_Seeker/"
            rel="noreferrer noopener"
            target="_blank"
            >published</a
          >
          on the Steam Marketplace
        </li>

        <li>VR previews of proposed walking trails with a local organization</li>
      </ul>

      <div class="flex gap-4">
        <GithubLink />
        <LinkedInLink />
      </div>
    </div>

    <NuxtPicture
      alt="Image of Alex Newman"
      class="order-first mx-auto w-9/12 lg:order-1 lg:mr-0 lg:w-fit lg:text-right max-w-xs xl:max-w-full"
      :img-attrs="{ class: 'mr-auto lg:mr-0 ml-auto lg:text-right' }"
      src="/alex-newman-image.png"
    />
  </section>
</template>
