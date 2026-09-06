/**
 * VYNTRO Bundles
 * ─────────────────────────────────────────────────────────────────────────────
 * Each bundle references existing product slugs.
 * The bundle page auto-fetches those products from Supabase (or falls back to
 * PLACEHOLDER_PRODUCTS) and calculates retail value vs bundle price.
 *
 * TO ADD A NEW BUNDLE: copy one of the objects below, give it a unique id/slug,
 * pick product slugs, set your bundle price, and you're done.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const BUNDLES = [
  {
    id: 'bundle-essentials',
    slug: 'essentials-setup',
    name: 'The Essentials Setup',
    tagline: 'Everything you need. Nothing you don\'t.',
    description:
      'The perfect entry point into a clean, capable battlestation. A premium deskmat, an ultra-light wireless mouse, and a braided cable that ties it all together — curated to work in harmony.',
    bundlePrice: 10999,
    image: '/red_mousepad.jpg',
    productSlugs: [
      'midnight-black-xl',
      'vortex-wireless-mouse',
      'coiled-aviator-cable',
    ],
  },
  {
    id: 'bundle-streamer',
    slug: 'streamer-setup',
    name: 'The Streamer Setup',
    tagline: 'Look good. Sound better.',
    description:
      'Built for creators who demand visual flair and audiophile-grade sound. A vivid RGB deskmat sets the scene while the dual-driver IEMs deliver crystal-clear audio for streaming, gaming, or music.',
    bundlePrice: 7999,
    image: '/dragon-wave-mousepad.jpg',
    productSlugs: [
      'rgb-horizon-mat',
      'aether-gaming-iems',
      'coiled-aviator-cable',
    ],
  },
  {
    id: 'bundle-battlestation',
    slug: 'full-battlestation',
    name: 'The Full Battlestation',
    tagline: 'Gear up. No compromises.',
    description:
      'The complete competitive setup. A stealthy XL deskmat, a Hall-Effect keyboard built for tournament play, and a precision wireless mouse — every component chosen for peak performance.',
    bundlePrice: 21999,
    image: '/tactical-mousepad.jpg',
    productSlugs: [
      'stealth-grey-xxl',
      'spectre-he-keyboard',
      'vortex-wireless-mouse',
    ],
  },
];

/** Helper — find a single bundle by slug */
export function getBundleBySlug(slug) {
  return BUNDLES.find((b) => b.slug === slug) ?? null;
}
