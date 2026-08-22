import { MetadataRoute } from 'next'

import { SITE_DESCRIPTION, SITE_TITLE } from './author'
import { LIGHT, THEME_COLOR } from './styles/tokens'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_TITLE,
    short_name: 'Semih Babacan',
    // One source: `app/author.ts`.
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: THEME_COLOR.light,
    theme_color: LIGHT.accentField,
    orientation: 'portrait-primary',
    categories: ['technology', 'thoughts', 'portfolio', 'productivity'],
    lang: 'en',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/opengraph-image',
        type: 'image/png',
        sizes: '1200x630',
        form_factor: 'wide',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
