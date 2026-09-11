import CategoryStorePage from '@/components/storefront/CategoryStorePage';

export const metadata = {
  title: 'Competitive Gaming Mice | 8000Hz Polling & Wireless | VYNTRO',
  description: 'Shop competitive tournament gaming mice. Filter simultaneously by Wireless vs Wired, Claw Grip, Fingertip Grip, and Palm Grip with interactive price range meter.',
};

const FILTER_GROUPS = [
  {
    id: 'connectivity',
    title: 'CONNECTIVITY',
    options: [
      { id: 'wireless', label: 'Wireless 2.4GHz' },
      { id: 'wired', label: 'Wired Speed' },
    ],
  },
  {
    id: 'grip',
    title: 'GRIP STYLE',
    options: [
      { id: 'claw', label: 'Claw Grip' },
      { id: 'fingertip', label: 'Fingertip Grip' },
      { id: 'palm', label: 'Palm Grip' },
    ],
  },
  {
    id: 'features',
    title: 'SPECIFICATIONS',
    options: [
      { id: '8k', label: '8000Hz Polling' },
      { id: 'ultralight', label: 'Ultra-Light (<50g)' },
    ],
  },
];

const INITIAL_MICE = [
  {
    id: 'mouse-1',
    name: 'VYNTRO Apex 8K Wireless',
    slug: 'vyntro-apex-8k-wireless',
    category: 'Mice',
    selling_price: 18999,
    discount_percentage: 10,
    collections: ['wireless', 'claw', 'fingertip', '8k', 'ultralight', 'best-sellers'],
    tags: ['wireless', 'claw', 'fingertip', '8k', 'ultralight', 'paw3395'],
    images: ['/red_mousepad.jpg'],
    material_specs: '49g carbon chassis, PAW3395 optical sensor 26,000 DPI, Nordic 52840 MCU, 8000Hz polling rate',
    description: 'Zero wireless latency. Ultra-symmetrical ergonomic shell tailored specifically for aggressive claw and fingertip grip players.',
  },
  {
    id: 'mouse-2',
    name: 'Pulsar X2V2 Mini Wireless',
    slug: 'pulsar-x2v2-mini-wireless',
    category: 'Mice',
    selling_price: 21500,
    discount_percentage: 5,
    collections: ['wireless', 'claw', 'fingertip', 'ultralight'],
    tags: ['wireless', 'claw', 'fingertip', 'ultralight', 'pulsar'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '51g lightweight build, optical switches zero debounce delay, 2.4GHz lag-free dongle',
    description: 'Engineered for small-to-medium hands. Crisp optical micro-switches prevent accidental double clicks in high-stress clutch rounds.',
  },
  {
    id: 'mouse-3',
    name: 'Lamzu Maya 4K Wireless',
    slug: 'lamzu-maya-4k-wireless',
    category: 'Mice',
    selling_price: 22900,
    discount_percentage: 0,
    collections: ['wireless', 'fingertip', 'claw', 'ultralight', 'hot-picks'],
    tags: ['wireless', 'fingertip', 'claw', 'ultralight', '4k', 'lamzu'],
    images: ['/jjk_mousepad.jpg'],
    material_specs: '45g featherweight design, custom tuned Huano blue pink dots, web-based driver software',
    description: 'The pinnacle of fingertip control. Extremely low profile hump enables unmatched vertical aim adjustments in dynamic shooters.',
  },
  {
    id: 'mouse-4',
    name: 'Endgame Gear OP1 8K Wired',
    slug: 'endgame-gear-op1-8k-wired',
    category: 'Mice',
    selling_price: 14500,
    discount_percentage: 0,
    collections: ['wired', 'claw', '8k'],
    tags: ['wired', 'claw', '8k', 'endgame', 'speed'],
    images: ['/red_mousepad.jpg'],
    material_specs: '50.5g wired tournament mouse, true 8000Hz USB polling, Flex Cord 5.0 frictionless cable, mechanical switches',
    description: 'Unmatched 0.125ms click latency. Built exclusively for purist competitive claw grippers who demand instantaneous input registration.',
  },
  {
    id: 'mouse-5',
    name: 'VYNTRO Phantom Pro Wireless',
    slug: 'vyntro-phantom-pro-wireless',
    category: 'Mice',
    selling_price: 12999,
    discount_percentage: 15,
    collections: ['wireless', 'palm', 'claw', 'best-sellers'],
    tags: ['wireless', 'palm', 'claw', 'ergonomic', 'lightweight'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: '58g sculpted ergonomic contour, PTFE speed glides, 90-hour battery life with USB-C rapid charge',
    description: 'Maximum palm support for prolonged gaming marathons. Full thumb flare and relaxed contour designed to eliminate wrist fatigue.',
  },
  {
    id: 'mouse-6',
    name: 'DeathAdder V3 Tournament Wired',
    slug: 'deathadder-v3-tournament-wired',
    category: 'Mice',
    selling_price: 16200,
    discount_percentage: 0,
    collections: ['wired', 'palm', '8k'],
    tags: ['wired', 'palm', '8k', 'ergonomic', 'speed'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'],
    material_specs: '59g iconic ergonomic contour, Focus Pro 30K Optical Sensor, 8000Hz polling rate',
    description: 'The standard of competitive palm grip ergonomics. Unparalleled stability during high-speed low-sensitivity arm sweeps.',
  },
  {
    id: 'mouse-7',
    name: 'Zaunkoenig M2K Carbon Fiber',
    slug: 'zaunkoenig-m2k-carbon-fiber',
    category: 'Mice',
    selling_price: 34999,
    discount_percentage: 0,
    collections: ['wired', 'fingertip', '8k', 'ultralight'],
    tags: ['wired', 'fingertip', '8k', 'ultralight', 'carbon'],
    images: ['/red_mousepad.jpg'],
    material_specs: '24g full carbon-fiber unibody, pure fingertip design, Omron D2F switches, 8000Hz MCU',
    description: 'The lightest competitive gaming mouse on Earth. Handcrafted carbon fiber crafted for the purest, fastest micro-aim possible.',
  },
];

export default function MicePage() {
  return (
    <CategoryStorePage
      // eyebrow="8000HZ POLLING // ULTRA-LIGHTWEIGHT ERGONOMICS"
      titlePrefix="COMPETITIVE"
      titleAccent="MICE"
      description="Zero latency, featherweight shells, and flagship optical sensors. Multi-filter by your exact grip style and wireless/wired setup."
      matchingCategories={['Mice']}
      filterGroups={FILTER_GROUPS}
      initialPlaceholders={INITIAL_MICE}
    />
  );
}
