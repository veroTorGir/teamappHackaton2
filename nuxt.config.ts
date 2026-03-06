// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  devtools: { enabled: true },

  app: {
    head: {
      link: [
        { rel: 'apple-touch-icon', href: '/icon.png' }
      ],
      meta: [
        { name: 'theme-color', content: '#1E1E1E' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'TeamApp' },
      ]
    }
  },

  runtimeConfig: {
    public: {
      baseURL: 'https://teamapp.uner.gy',
      version: '2.0.0',
    }
  },

  auth: {
    baseURL: 'https://teamapp.uner.gy',
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
      addDefaultCallbackUrl: false,
    },
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/api/token/', method: 'post' },
        signOut: false,
        signUp: false,
        getSession: { path: '/api/accounts/user/', method: 'get' },
      },

      token: {
        signInResponseTokenPointer: '/access',
        type: 'Bearer',
        cookieName: 'token.access',
        headerName: 'Authorization',
        maxAgeInSeconds: 60 * 60 * 24, // 30 days
        sameSiteAttribute: 'lax',
        cookieDomain: '',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: false,
      },

      refresh: {
        isEnabled: true,
        endpoint: { path: '/api/token/refresh/', method: 'post' },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/refresh',
          refreshResponseTokenPointer: '/access',
          refreshRequestTokenPointer: '/refresh',
          cookieName: 'token.refresh',
          maxAgeInSeconds: 60 * 60 * 24 * 30, // 30 days
          sameSiteAttribute: 'lax',
          secureCookieAttribute: false,
          cookieDomain: '',
          httpOnlyCookieAttribute: false,
        }
      },

      session: {
        dataType: {
          pk: 'number',
          username: 'string',
          email: 'string',
          first_name: 'string',
          last_name: 'string'
        }
      }
    }
  },

  modules: ['@nuxtjs/tailwindcss', // '@sidebase/nuxt-auth',
  '@vite-pwa/nuxt', '@nuxt/fonts', '@sidebase/nuxt-auth'],

  fonts: {
    families: [
      { 
        name: 'Poppins', 
        provider: 'google',
        weights: [200, 300, 400, 600]
      }
    ]
  },

  css: [
    '@/assets/css/main.css' 
  ],

  components: true,

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['icon.png', 'apple-touch-icon.png'],
    manifest: {
      name: 'TeamApp',
      short_name: 'TeamApp',
      lang: 'es',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      theme_color: '#1E1E1E',
      background_color: '#1E1E1E',
      icons: [
        { src: '/icon.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,png,svg,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
    },
  },
})