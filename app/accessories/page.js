import CategoryStorePage from '@/components/storefront/CategoryStorePage';

export const metadata = {
  title: 'Gaming Peripheral Accessories | Aviator Cables & Wrist Rests | VYNTRO',
  description: 'Elevate your gaming battlestation with custom coiled aviator cables, ergonomic artisan wrist rests, and high-speed glass mouse skates. Filter with live price meter.',
};

const FILTER_GROUPS = [
  {
    id: 'type',
    title: 'ACCESSORY TYPE',
    options: [
      { id: 'cables', label: 'Coiled Aviator Cables' },
      { id: 'wrist-rests', label: 'Artisan Wrist Rests' },
      { id: 'skates', label: 'Glass Mouse Skates' },
      { id: 'bundles', label: 'Desk Bundles & Bungees' },
    ],
  },
  {
    id: 'material',
    title: 'MATERIAL FINISH',
    options: [
      { id: 'acrylic', label: 'Frosted Acrylic & Resin' },
      { id: 'wood', label: 'Solid Walnut Wood' },
      { id: 'metal', label: 'CNC Aluminum & Metal' },
    ],
  },
];

const INITIAL_ACCESSORIES = [
  {
    id: 'acc-1',
    name: 'VYNTRO Coiled Aviator Cable — Crimson Red',
    slug: 'vyntro-coiled-aviator-cable-crimson',
    category: 'Accessories',
    selling_price: 3999,
    discount_percentage: 15,
    collections: ['cables', 'metal', 'best-sellers'],
    tags: ['cables', 'aviator', 'metal', 'coiled', 'usb-c', 'red'],
    images: ['/red_mousepad.jpg'],
    material_specs: 'Double-sleeved Paracord + Techflex, 4-pin GX16 metal detachable aviator connector, gold-plated USB-C',
    description: 'Tightly reversed double-wound coil that never sags. Engineered to deliver clean power delivery and immaculate desk aesthetics.',
  },
  {
    id: 'acc-2',
    name: 'Frosted Acrylic Wrist Rest — 75% Layout',
    slug: 'frosted-acrylic-wrist-rest-75',
    category: 'Wrist Rests',
    selling_price: 2799,
    discount_percentage: 10,
    collections: ['wrist-rests', 'acrylic', 'hot-picks'],
    tags: ['wrist-rests', 'acrylic', 'ergonomic', 'clean', 'frosted'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'],
    material_specs: 'Matte frosted solid cast acrylic, 18mm ergonomic slope, 4 rubber anti-slip bump-ons included',
    description: 'Eliminate wrist extension strain with a silky-smooth matte acrylic surface that gently diffuses keyboard RGB lighting.',
  },
  {
    id: 'acc-3',
    name: 'Superglide V2 Flawless Glass Skates',
    slug: 'superglide-v2-glass-skates',
    category: 'Accessories',
    selling_price: 4200,
    discount_percentage: 0,
    collections: ['skates', 'best-sellers'],
    tags: ['skates', 'glass', 'speed', 'ptfe', 'aluminosilicate'],
    images: ['/jjk_mousepad.jpg'],
    material_specs: 'Ultra-tough aluminosilicate tempered glass, perfectly rounded micro-curved bevels, 3M precision adhesive',
    description: 'Practically zero static friction. Turn any mouse into a frictionless air-hockey puck for effortless tracking and flicking.',
  },
  {
    id: 'acc-4',
    name: 'Solid Walnut Wooden Wrist Rest — 65%',
    slug: 'solid-walnut-wooden-wrist-rest-65',
    category: 'Wrist Rests',
    selling_price: 3499,
    discount_percentage: 0,
    collections: ['wrist-rests', 'wood'],
    tags: ['wrist-rests', 'wood', 'walnut', 'natural', 'ergonomic'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '100% natural North American walnut wood, hand-sanded with organic beeswax oil finish, anti-warp geometry',
    description: 'Warm organic wood grain providing firm ergonomic elevation. Smoothly beveled for hours of typing and gaming comfort.',
  },
  {
    id: 'acc-5',
    name: 'Magnetic Weighted Mouse Bungee',
    slug: 'magnetic-weighted-mouse-bungee',
    category: 'Accessories',
    selling_price: 2199,
    discount_percentage: 10,
    collections: ['bundles', 'metal'],
    tags: ['bundles', 'bungee', 'metal', 'cable-management'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: 'Heavy cast-iron base (320g), flexible silicone cable arm, anti-skid bottom vacuum pad',
    description: 'Completely eliminates cable drag and friction. Gives wired mice the completely unrestricted feel of a wireless mouse.',
  },
  {
    id: 'acc-6',
    name: 'VYNTRO Battlestation Ultimate Bundle',
    slug: 'vyntro-battlestation-ultimate-bundle',
    category: 'Bundles',
    selling_price: 7999,
    discount_percentage: 20,
    collections: ['bundles', 'cables', 'wrist-rests', 'best-sellers'],
    tags: ['bundles', 'cables', 'wrist-rests', 'value', 'gift'],
    images: ['/red_mousepad.jpg'],
    material_specs: 'Includes: Crimson Aviator Cable + Frosted Wrist Rest + Magnetic Bungee + Microfiber Cleaning Cloth',
    description: 'The complete peripheral upgrade kit at a 20% bundle discount. Instantly transform your entire desk into a cohesive esports station.',
  },
];

export default function AccessoriesPage() {
  return (
    <CategoryStorePage
      eyebrow="DESK RIG UPGRADES // AVIATOR CABLES & WRIST RESTS"
      titlePrefix="PERIPHERAL"
      titleAccent="ACCESSORIES"
      description="Refine your setup aesthetics and ergonomics with artisan coiled aviator cables, acoustic-grade wrist rests, and friction-free glass skates."
      matchingCategories={['Accessories', 'Wrist Rests', 'Bundles']}
      filterGroups={FILTER_GROUPS}
      initialPlaceholders={INITIAL_ACCESSORIES}
    />
  );
}
