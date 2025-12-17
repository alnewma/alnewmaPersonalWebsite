import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        {
          href: '/apple-touch-icon.png',
          rel: 'apple-touch-icon',
          sizes: '180x180',
        },
        {
          href: '/favicon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          href: '/favicon-16x16.png',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          href: '/site.webmanifest',
          rel: 'manifest',
        },
        {
          color: '#5bbad5',
          href: '/safari-pinned-tab.svg',
          rel: 'mask-icon',
        },
        {
          href: 'https://fonts.googleapis.com',
          rel: 'preconnect',
        },
        {
          crossorigin: '',
          href: 'https://fonts.gstatic.com',
          rel: 'preconnect',
        },
        {
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          rel: 'stylesheet',
        },
      ],
      meta: [
        {
          content: '#da532c',
          name: 'msapplication-TileColor',
        },
        {
          content: '#ffffff',
          name: 'theme-color',
        },
      ],
    },
  },

  compatibilityDate: '2024-10-11',

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['shell', 'go'],
          theme: {
            default: 'one-dark-pro',
          },
        },
      },
    },
  },

  css: ['~/assets/css/main.css'],

  devtools: {
    enabled: true,
  },

  eslint: {
    checker: true,
    config: {
      stylistic: false,
      typescript: {
        strict: true,
      },
    },
  },

  experimental: {
    payloadExtraction: true,
    sharedPrerenderData: true,
    writeEarlyHints: true,
  },

  modules: ['@nuxtjs/seo', '@nuxt/image', '@nuxt/content', '@nuxt/eslint'],

  nitro: {
    minify: true,
    preset: 'github_pages',
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/sitemap.xml'
        //'/leetcode'
      ],
    },
  },

  robots: {
    robotsTxt: false,
    credits: false,
    disallow: ['/404'],
    enabled: true,
  },

  routeRules: {
    '/': {
      prerender: true,
    },
    '/blog/*': {
      prerender: true,
    },
  },

  site: {
    indexable: true,
    url: 'https://alnewma.github.io',
    defaultLocale: 'en',
  },

  sitemap: {
    cacheMaxAgeSeconds: 3600,
    credits: false,
    discoverImages: true,
    enabled: true,
  },

  ssr: true,

  telemetry: false,

  vite: {
    plugins: [tailwindcss()],
  },
});
