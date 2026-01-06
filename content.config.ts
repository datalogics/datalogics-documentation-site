import { z } from 'zod'
import { defineContentConfig, defineCollection, property } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.{md,yml,yaml}',
        // Exclude all dot files except .navigation.yml (required for navigation)
        exclude: ['**/.!(navigation.yml)', '**/node_modules/**', '**/.nuxt/**', '**/.output/**']
      },
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        icon: property(z.string().optional()).editor({ input: 'icon' }),
        navigation: z.object({
          redirect: z.string().optional(),
        }).optional(),
        seo: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
        }).optional(),
      }).passthrough(), // Allow additional properties from frontmatter
    }),
  },
})
