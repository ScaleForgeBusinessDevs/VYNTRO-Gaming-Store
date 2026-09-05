import CategoryStorePage from '@/components/storefront/CategoryStorePage';

export const metadata = {
  title: 'Mechanical & Rapid Trigger Hall Effect Keyboards | VYNTRO',
  description: 'Shop competitive Hall Effect Rapid Trigger and gasket-mounted mechanical keyboards. Multi-filter by switch type, form factor, and connectivity with price meter.',
};

const FILTER_GROUPS = [
  {
    id: 'size',
    title: 'SIZE PERCENTAGE',
    options: [
      { id: '60%', label: '60%' },
      { id: '70%', label: '70%' },
      { id: '75%', label: '75%' },
      { id: '80%', label: '80%' },
      { id: '100%', label: '100%' },
    ],
  },
];

const INITIAL_KEYBOARDS = [
  {
    id: 'kb-1',
    name: 'VYNTRO Forge 65% Rapid Trigger HE',
    slug: 'vyntro-forge-65-rapid-trigger-he',
    category: 'Keyboards',
    selling_price: 24999,
    discount_percentage: 10,
    collections: ['70%', '70', '65', 'rapid-trigger', 'best-sellers'],
    tags: ['70%', '70', 'rapid-trigger', 'he', 'hall-effect', '65', 'wired', 'magnetic'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '70% form factor, 0.1mm to 4.0mm adjustable actuation, 8000Hz polling rate, CNC aluminum plate',
    description: 'Instant counter-strafing and instantaneous reset. Magnetic hall effect sensors register input with zero analog deadzone.',
  },
  {
    id: 'kb-2',
    name: 'Rainy75 Pro CNC Aluminum Gasket',
    slug: 'rainy75-pro-cnc-aluminum-gasket',
    category: 'Keyboards',
    selling_price: 29500,
    discount_percentage: 5,
    collections: ['75%', '75', 'mechanical', 'hot-picks'],
    tags: ['75%', '75', 'mechanical', 'wireless', 'gasket', 'aluminum', 'thock'],
    images: ['/red_mousepad.jpg'],
    material_specs: '75% form factor, full 6063 CNC anodized aluminum, 5-layer sound dampening, FR4 flex-cut plate',
    description: 'Creamy acoustics straight out of the box. Tri-mode 2.4GHz / Bluetooth 5.2 / wired connectivity with custom HMX linear switches.',
  },
  {
    id: 'kb-3',
    name: 'DrunkDeer A75 Magnetic Switch',
    slug: 'drunkdeer-a75-magnetic-switch',
    category: 'Keyboards',
    selling_price: 25999,
    discount_percentage: 0,
    collections: ['75%', '75', 'rapid-trigger'],
    tags: ['75%', '75', 'rapid-trigger', 'wired', 'magnetic', 'drunkdeer'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'],
    material_specs: '75% form factor, IP66 water resistant PCB, adjustable snap tap function, continuous rapid trigger, aluminum rotary knob',
    description: 'Tournament favorite for Valorant and Apex Legends. Web configurator allows per-key sensitivity customization on the fly.',
  },
  {
    id: 'kb-4',
    name: 'VYNTRO Stealth 68 Wireless',
    slug: 'vyntro-stealth-68-wireless',
    category: 'Keyboards',
    selling_price: 14999,
    discount_percentage: 15,
    collections: ['70%', '70', '65', 'mechanical', 'best-sellers'],
    tags: ['70%', '70', 'mechanical', '65', 'wireless', 'stealth', 'linear'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: '70% form factor (68 keys), hot-swappable 5-pin PCB, pre-lubed yellow linear switches, silicone gasket mounts',
    description: 'Compact space-saving desk footprint giving maximum mouse sweep clearance. Clean, quiet, and ultra-responsive.',
  },
  {
    id: 'kb-5',
    name: 'Wooting 60HE Tournament Custom',
    slug: 'wooting-60he-tournament-custom',
    category: 'Keyboards',
    selling_price: 42000,
    discount_percentage: 0,
    collections: ['60%', '60', 'rapid-trigger', 'hot-picks'],
    tags: ['60%', '60', 'rapid-trigger', 'wired', 'wooting', 'esports'],
    images: ['/jjk_mousepad.jpg'],
    material_specs: '60% ultra-compact layout, Lekker Hall Effect switches, Wootility web software, tachyon ultra-low latency mode',
    description: 'The definitive gold standard in competitive esports keyboards. 0.1ms true latency with customizable dynamic keystroke actuation.',
  },
  {
    id: 'kb-6',
    name: 'VYNTRO Tournament TKL Linear',
    slug: 'vyntro-tournament-tkl-linear',
    category: 'Keyboards',
    selling_price: 11999,
    discount_percentage: 10,
    collections: ['80%', '80', 'tkl', 'mechanical'],
    tags: ['80%', '80', 'mechanical', 'tkl', 'wired', 'rgb', 'budget'],
    images: ['/red_mousepad.jpg'],
    material_specs: '80% TKL tournament layout, solid steel top plate, detachable braided USB-C, per-key RGB backlighting',
    description: 'Tenkeyless tournament layout retaining dedicated F-row and arrow keys while liberating critical mousepad space.',
  },
  {
    id: 'kb-7',
    name: 'VYNTRO Titan 100% Full-Size Wireless',
    slug: 'vyntro-titan-100-full-size-wireless',
    category: 'Keyboards',
    selling_price: 18999,
    discount_percentage: 8,
    collections: ['100%', '100', 'full', 'mechanical'],
    tags: ['100%', '100', 'mechanical', 'full-size', 'numpad', 'wireless'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '100% full-size 104-key layout with dedicated numpad, tri-mode wireless, hot-swap sockets, volume roller',
    description: 'Complete full-size command station with dedicated numerical pad, tactile multimedia roller, and dual connectivity.',
  },
];

export default function KeyboardsPage() {
  return (
    <CategoryStorePage
      eyebrow="RAPID TRIGGER // MAGNETIC HALL EFFECT PERFORMANCE"
      titlePrefix="MECHANICAL & HE"
      titleAccent="KEYBOARDS"
      description="Magnetic Hall Effect rapid trigger boards and custom acoustic gasket mounts. Dial in actuation down to 0.1mm."
      matchingCategories={['Keyboards']}
      filterGroups={FILTER_GROUPS}
      initialPlaceholders={INITIAL_KEYBOARDS}
    />
  );
}
