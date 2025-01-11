import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import Pages from 'vite-plugin-pages'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'], // Direktoriji koje treba pratiti
      extensions: ['vue'],      // Ekstenzije koje će se automatski uvoziti
      deep: true,               // Pretražuje i poddirektorij
      dts: 'src/components.d.ts', // Generira TypeScript deklaracije
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    Pages({
      dirs: 'src/pages', // Direktorij za stranice
    }),
  ]
})