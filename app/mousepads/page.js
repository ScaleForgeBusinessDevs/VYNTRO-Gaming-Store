import CategoryStorePage from '@/components/storefront/CategoryStorePage';

export const metadata = {
  title: 'Precision Gaming Mousepads & Deskmats | VYNTRO',
  description: 'Explore VYNTRO precision gaming mousepads and XXL deskmats. Filter by Minimalistic, FPS, Abstract, Fantasy, and Anime styles with instant price filtering.',
};

const FILTER_GROUPS = [
  {
    id: 'theme',
    title: 'THEME & ARTWORK',
    options: [
      { id: 'minimalistic', label: 'Minimalistic' },
      { id: 'fps', label: 'FPS Tactical' },
      { id: 'abstract', label: 'Abstract & Waves' },
      { id: 'fantasy', label: 'Fantasy & Mythic' },
      { id: 'anime', label: 'Anime & Manga' },
    ],
  },
  {
    id: 'lighting',
    title: 'LIGHTING',
    options: [
      { id: 'rgb', label: 'RGB Edge-Lit' },
      { id: 'non-rgb', label: 'Non-RGB (Standard)' },
    ],
  },
  {
    id: 'size',
    title: 'SIZE',
    options: [
      { id: 'basic', label: 'Basic' },
      { id: 'large', label: 'Large' },
      { id: 'xl', label: 'XL' },
      { id: 'xxl', label: 'XXL' },
      { id: 'xxxl', label: 'XXXL' },
    ],
  },
];

const INITIAL_MOUSEPADS = [
  {
    id: 'pad-1',
    name: 'Red Void Cybermat XXL',
    slug: 'red-void-cybermat-xxl',
    category: 'XXL Deskmats',
    selling_price: 3499,
    discount_percentage: 15,
    collections: ['fps', 'xxl', 'best-sellers', 'speed'],
    tags: ['fps', 'speed', 'xxl', 'red', 'tactical'],
    images: ['/red_mousepad.jpg'],
    material_specs: '900×400mm, 4mm high-density micro-woven cloth, anti-fray stitched edge, non-slip rubber base',
    description: 'Engineered for tournament-level micro-adjustments in tactical shooters. Frictionless speed glide with stopping power.',
  },
  {
    id: 'pad-2',
    name: 'Sakura Mountain Landscape',
    slug: 'sakura-mountain-landscape',
    category: 'XXL Deskmats',
    selling_price: 3299,
    discount_percentage: 10,
    collections: ['anime', 'minimalistic', 'xxl', 'control'],
    tags: ['anime', 'minimalistic', 'control', 'xxl', 'pink', 'white'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'],
    material_specs: '900×400mm, 4mm plush thickness, ultra-smooth poly-blend surface with water-resistant coating',
    description: 'Clean aesthetic pastel mountain artwork infused with Japanese cherry blossoms. Balanced speed and control.',
  },
  {
    id: 'pad-3',
    name: 'Dragon Wave Mythic Deskmat',
    slug: 'dragon-wave-mythic-deskmat',
    category: 'XXL Deskmats',
    selling_price: 3799,
    discount_percentage: 0,
    collections: ['fantasy', 'abstract', 'xxl', 'speed'],
    tags: ['fantasy', 'abstract', 'dragon', 'speed', 'xxl'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '900×400mm, 4mm military-grade stitched border, textured dynamic glide for optical sensors',
    description: 'Summon ancient mythical dragons in a tempest storm. Premium vivid thermal transfer printing that will never fade.',
  },
  {
    id: 'pad-4',
    name: 'Domain Expansion Cursed Pad',
    slug: 'domain-expansion-cursed-pad',
    category: 'XXL Deskmats',
    selling_price: 3599,
    discount_percentage: 12,
    collections: ['anime', 'xxl', 'hot-picks', 'control'],
    tags: ['anime', 'manga', 'control', 'xxl', 'cursed', 'black-red'],
    images: ['/jjk_mousepad.jpg'],
    material_specs: '900×400mm, 4mm thick rubber cushioning, anti-slip herringbone texture, high-DPI tracking',
    description: 'Unleash special grade tactical performance. Dark, intense anime line-art with deep blacks and vibrant crimson tones.',
  },
  {
    id: 'pad-5',
    name: 'Monochrome Topo Stealth',
    slug: 'monochrome-topo-stealth',
    category: 'XXL Deskmats',
    selling_price: 2999,
    discount_percentage: 0,
    collections: ['minimalistic', 'abstract', 'xxl', 'speed'],
    tags: ['minimalistic', 'abstract', 'topo', 'topography', 'speed', 'xxl', 'stealth'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: '900×400mm, 4mm premium dense foam base, contour topographical line vectors in sleek monochrome',
    description: 'For clean desk setup enthusiasts. Ultra-minimal contour elevation map designed to blend seamlessly with any setup.',
  },
  {
    id: 'pad-6',
    name: 'Apex Neon RGB Cyberdesk',
    slug: 'apex-neon-rgb-cyberdesk',
    category: 'RGB Deskmats',
    selling_price: 4999,
    discount_percentage: 20,
    collections: ['fps', 'rgb', 'hot-picks'],
    tags: ['rgb', 'fps', 'speed', 'glowing', 'lighting', 'xxl'],
    images: ['/red_mousepad.jpg'],
    material_specs: '900×400mm, 14-mode optical fiber RGB perimeter lighting, plug & play USB controller, braided cable',
    description: '360-degree radiant illumination powered by fiber-optic diffusion. Cycle between static colors and dynamic breath pulses.',
  },
  {
    id: 'pad-7',
    name: 'Nordic Clean Slate Deskmat',
    slug: 'nordic-clean-slate-deskmat',
    category: 'XXL Deskmats',
    selling_price: 2799,
    discount_percentage: 0,
    collections: ['minimalistic', 'control'],
    tags: ['minimalistic', 'clean', 'grey', 'control', 'xxl'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: '900×400mm, 3.5mm thick low-profile rubber base, muted charcoal finish, water-repellent surface',
    description: 'Understated elegance. Zero loud branding, just pure clean textured cloth engineered for both office and gaming.',
  },
  {
    id: 'pad-8',
    name: 'Ghost Division Tactical FPS',
    slug: 'ghost-division-tactical-fps',
    category: 'XXL Deskmats',
    selling_price: 3699,
    discount_percentage: 10,
    collections: ['fps', 'speed', 'best-sellers'],
    tags: ['fps', 'military', 'speed', 'xxl', 'tactical'],
    images: ['/red_mousepad.jpg'],
    material_specs: '900×400mm, 4mm moisture-proof woven surface, precision zero-friction coating for tracking',
    description: 'Designed specifically for competitive flicking, target acquisition, and micro-corrections in CS2 and Valorant.',
  },
];

export default function MousepadsPage() {
  return (
    <CategoryStorePage
      // eyebrow="COMPETITIVE ESPORTS SURFACES // SPEED & CONTROL"
      titlePrefix="PRECISION"
      titleAccent="DESKMATS"
      description="Custom-crafted 900×400mm tournament deskmats engineered for zero-drag glide, pixel-precise tracking, and desk aesthetic perfection."
      matchingCategories={['Mousepads', 'XXL Deskmats', 'RGB Deskmats', 'Bundles']}
      filterGroups={FILTER_GROUPS}
      initialPlaceholders={INITIAL_MOUSEPADS}
    />
  );
}
