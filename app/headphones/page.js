import CategoryStorePage from '@/components/storefront/CategoryStorePage';

export const metadata = {
  title: 'Competitive Studio & Gaming Headphones | Open-Back & Wireless | VYNTRO',
  description: 'Audiophile grade studio reference and wireless gaming headphones. Filter by Open-Back vs Closed-Back, 2.4GHz Wireless vs Studio Wired with price range meter.',
};

const FILTER_GROUPS = [
  {
    id: 'acoustic',
    title: 'ACOUSTIC ARCHITECTURE',
    options: [
      { id: 'open-back', label: 'Open-Back Studio Reference' },
      { id: 'closed-back', label: 'Closed-Back Isolation' },
    ],
  },
  {
    id: 'connection',
    title: 'CONNECTIVITY',
    options: [
      { id: 'wireless', label: '2.4GHz Wireless Low Latency' },
      { id: 'wired', label: 'Studio Wired (3.5mm / 6.35mm)' },
    ],
  },
  {
    id: 'features',
    title: 'COMFORT & FEATURES',
    options: [
      { id: 'boom-mic', label: 'Detachable Boom Mic' },
      { id: 'velour', label: 'Breathable Velour Pads' },
    ],
  },
];

const INITIAL_HEADPHONES = [
  {
    id: 'hp-1',
    name: 'VYNTRO Sonar Pro Open-Back Reference',
    slug: 'vyntro-sonar-pro-open-back',
    category: 'Headphones',
    selling_price: 21999,
    discount_percentage: 12,
    collections: ['open-back', 'wired', 'velour', 'best-sellers'],
    tags: ['open-back', 'wired', 'velour', 'studio', 'soundstage'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '53mm neodymium dynamic drivers, open acoustic honeycomb grill, memory foam velour pads, detachable oxygen-free copper cable',
    description: 'Breathtakingly vast 3D holographic soundstage. Pinpoint footstep distance and elevation with uncompressed audiophile clarity.',
  },
  {
    id: 'hp-2',
    name: 'HyperX Cloud III Wireless',
    slug: 'hyperx-cloud-iii-wireless',
    category: 'Headphones',
    selling_price: 27500,
    discount_percentage: 0,
    collections: ['closed-back', 'wireless', 'boom-mic', 'hot-picks'],
    tags: ['closed-back', 'wireless', 'boom-mic', 'hyperx', 'battery'],
    images: ['/red_mousepad.jpg'],
    material_specs: '120-hour massive battery life, DTS Headphone:X Spatial Audio, 2.4GHz low-latency wireless dongle, 10mm ultra-clear mic',
    description: 'Legendary esports comfort. Up to 120 hours of non-stop wireless gameplay on a single charge with impenetrable outside noise isolation.',
  },
  {
    id: 'hp-3',
    name: 'Beyerdynamic DT 990 Pro 80Ω',
    slug: 'beyerdynamic-dt-990-pro',
    category: 'Headphones',
    selling_price: 36900,
    discount_percentage: 5,
    collections: ['open-back', 'wired', 'velour'],
    tags: ['open-back', 'wired', 'velour', 'beyer', 'german', 'audiophile'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: 'Handcrafted in Germany, spring steel headband, 80 Ohm impedance for universal PC amp compatibility, silver velour ear pads',
    description: 'The benchmark of studio sound. Sparkling highs and transparent acoustic bass response praised by professional audio engineers and streamers.',
  },
  {
    id: 'hp-4',
    name: 'VYNTRO Shadow 2.4G Low-Latency Wireless',
    slug: 'vyntro-shadow-wireless',
    category: 'Headphones',
    selling_price: 14999,
    discount_percentage: 15,
    collections: ['closed-back', 'wireless', 'boom-mic', 'best-sellers'],
    tags: ['closed-back', 'wireless', 'boom-mic', 'budget', 'bluetooth'],
    images: ['/jjk_mousepad.jpg'],
    material_specs: 'Dual-mode 2.4GHz + Bluetooth 5.3, 50mm titanium diaphragm drivers, flip-to-mute cardioid microphone, 45-hour battery',
    description: 'Lag-free tournament wireless audio engineered with acoustic isolation to shut out household background distractions completely.',
  },
  {
    id: 'hp-5',
    name: 'Sennheiser HD560S Audiophile Reference',
    slug: 'sennheiser-hd560s-reference',
    category: 'Headphones',
    selling_price: 41500,
    discount_percentage: 0,
    collections: ['open-back', 'wired', 'velour'],
    tags: ['open-back', 'wired', 'velour', 'sennheiser', 'reference'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'],
    material_specs: '120 Ohm polymer blend transducer, angled driver placement mimicking monitor speakers, 6.35mm to 3.5mm gold-plated adapter',
    description: 'Neutral, uncolored sound reproduction for players who want to hear the game exactly as developers and sound designers mastered it.',
  },
  {
    id: 'hp-6',
    name: 'Audio-Technica ATH-M50x Studio Monitor',
    slug: 'ath-m50x-studio-monitor',
    category: 'Headphones',
    selling_price: 33000,
    discount_percentage: 8,
    collections: ['closed-back', 'wired'],
    tags: ['closed-back', 'wired', 'audio-technica', 'dj', 'bass'],
    images: ['/red_mousepad.jpg'],
    material_specs: '45mm large-aperture drivers, 90-degree swiveling earcups, 3 detachable cables included (coiled, straight, short)',
    description: 'Deep, tight bass and crisp articulation. 90-degree swiveling earcups make one-ear monitoring and travel seamless.',
  },
];

export default function HeadphonesPage() {
  return (
    <CategoryStorePage
      eyebrow="SPATIAL SOUNDSTAGE // TOURNAMENT PERFORMANCE"
      titlePrefix="STUDIO & GAMING"
      titleAccent="HEADPHONES"
      description="Immersive open-back acoustics and zero-latency wireless headsets. Pinpoint every directional soundwave across the battlefield."
      matchingCategories={['Headphones']}
      filterGroups={FILTER_GROUPS}
      initialPlaceholders={INITIAL_HEADPHONES}
    />
  );
}
