import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";
import solid from '@astrojs/solid-js';
import basicSsl from '@vitejs/plugin-basic-ssl'


// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [solid()],
  adapter: vercel(),
  redirects: {
    '/login/verify': '/login'
  },
  /*vite: {
    plugins: [basicSsl()],
    server: {
      https: true,
    },
  }*/
});