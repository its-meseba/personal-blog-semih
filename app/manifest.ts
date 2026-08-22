import { MetadataRoute } from 'next'

import { LIGHT, THEME_COLOR } from './styles/tokens'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mehmet Semih Babacan - Software Engineer & Tech Entrepreneur',
    short_name: 'Semih Babacan',
    description: 'Software engineer with 3 years of experience, ex-CEO of Solace Technology, building AI-native products and scalable systems.',
    start_url: '/',
    display: 'standalone',
    background_color: THEME_COLOR.light,
    theme_color: LIGHT.accentField,
    orientation: 'portrait-primary',
    categories: ['technology', 'thoughts', 'portfolio', 'engineering'],
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
