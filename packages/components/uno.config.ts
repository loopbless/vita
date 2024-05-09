import { presetShadcn } from '@vita/unocss-config'
import { defineConfig, presetUno, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetShadcn()],
  transformers: [transformerVariantGroup()],
})