<template>
  <nav class="sticky top-0 inset-x-0 z-50 w-full backdrop-blur bg-white/80 dark:bg-black/60">
    <div class="max-w-5xl px-6 py-4 flex items-center gap-8">
      <NuxtLink to="/" class="navlink text-3xl lowercase text-black-primary dark:text-white-primary">
        home
      </NuxtLink>
      <NuxtLink to="/resume" class="navlink text-3xl lowercase text-black-primary dark:text-white-primary">
        resume
      </NuxtLink>
    </div>
  </nav>
</template>


<style scoped>
/* Clean underline animation (no underline by default) */
.navlink {
  position: relative;
  text-decoration: none;
}

/* the underline */
.navlink::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms ease;
  background: currentColor; /* matches light/dark text color */
}

/* hover underline */
.navlink:hover::after {
  transform: scaleX(1);
}

/* active route underline (Nuxt adds aria-current="page") */
.navlink[aria-current="page"]::after {
  transform: scaleX(1);
}
</style>
