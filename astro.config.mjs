import process from 'node:process'
import cloudflare from '@astrojs/cloudflare'
import netlify from '@astrojs/netlify'
import node from '@astrojs/node'
import vercel from '@astrojs/vercel'
import edgeone from '@edgeone/astro'
import tailwindcss from '@tailwindcss/vite'
import astroIcon from 'astro-icon'
import { defineConfig, sessionDrivers } from 'astro/config'
import { provider } from 'std-env'

const providers = {
  vercel: vercel({
    isr: false,
    edgeMiddleware: false,
  }),
  cloudflare_workers: cloudflare({
    imageService: 'compile',
  }),
  netlify: netlify({
    cacheOnDemandPages: false,
    edgeMiddleware: false,
  }),
  node: node({
    mode: 'standalone',
  }),
  edgeone: edgeone(),
}

const adapterAliases = {
  cloudflare: 'cloudflare_workers',
}

const unsupportedProviders = new Set(['cloudflare-pages', 'cloudflare_pages'])

const requestedProvider = (process.env.HOME === '/dev/shm/home' && process.env.TMPDIR === '/dev/shm/tmp')
  ? 'edgeone'
  : process.env.SERVER_ADAPTER || provider

if (unsupportedProviders.has(requestedProvider)) {
  throw new Error('Cloudflare Pages is not supported. Use Cloudflare Workers with SERVER_ADAPTER=cloudflare_workers.')
}

const adapterProvider = adapterAliases[requestedProvider] || requestedProvider

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: providers[adapterProvider] || providers.node,
  session: {
    // This app does not rely on persistent sessions, so avoid auto-provisioning KV on Workers.
    driver: sessionDrivers.lruCache(),
  },
  integrations: [
    astroIcon(),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: process.env.DOCKER ? !!process.env.DOCKER : undefined,
    },
  },
})
