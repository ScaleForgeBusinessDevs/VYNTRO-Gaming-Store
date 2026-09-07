import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const SIZE_ENCODING = '__SIZES__{"Basic":800,"Large":1200,"XL":1500,"XXL":2000,"XXXL":3200}__SIZES__';

export const MOUSEPADS = [
  // ── 1. MINIMALISTIC (2) ───────────────────────────────────
  {
    name: 'Monochrome Topo Stealth Deskmat',
    slug: 'monochrome-topo-stealth-deskmat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 50,
    collections: ['minimalistic', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'control'],
    images: ['/maybe_notext.jpeg', '/tactical-mousepad.jpg'],
    description: 'Sleek monochromatic topographic contour elevation line-art tailored for pristine, distraction-free setups. Premium micro-textured poly-weave surface provides effortless mouse tracking with consistent stopping power.',
    material_specs: `High-density natural rubber base, anti-fray precision stitched edges, water-resistant coating. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe clean with a damp microfiber cloth. Air dry flat. Do not machine wash.',
    is_active: true,
  },
  {
    name: 'Nordic Slate Minimalist Mat',
    slug: 'nordic-slate-minimalist-mat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 45,
    collections: ['minimalistic', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'best-sellers'],
    images: ['/sakura-mousepad.jpg', '/maybe.jpeg'],
    description: 'Subtle architectural grid lines and clean Scandinavian aesthetics. Built for high-productivity workspaces and aesthetic gaming desk setups.',
    material_specs: `Ultra-dense micro-weave cloth, anti-slip herringbone backing, 4mm plush thickness. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe clean with a damp microfiber cloth. Air dry flat. Do not machine wash.',
    is_active: true,
  },

  // ── 2. FPS TACTICAL (2) ───────────────────────────────────
  {
    name: 'Redline Tactical Strike Mat',
    slug: 'redline-tactical-strike-mat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 60,
    collections: ['fps', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'speed', 'hot-picks'],
    images: ['/red_mousepad.jpg', '/mousepad-hd.png'],
    description: 'Calibrated specifically for tournament tactical shooters. Low dynamic friction delivers lightning-fast crosshair flicks with consistent stopping power for pinpoint micro-adjustments in CS2 and Valorant.',
    material_specs: `Frictionless speed weave, military-grade reinforced border stitching, 4mm natural rubber base. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Clean with damp cloth. Keep away from direct excessive heat.',
    is_active: true,
  },
  {
    name: 'Ghost Recon Precision FPS Deskmat',
    slug: 'ghost-recon-precision-fps-deskmat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 40,
    collections: ['fps', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'control', 'best-sellers'],
    images: ['/tactical-mousepad.jpg', '/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    description: 'Tactical HUD geometric telemetry pattern with high stopping power. Engineered for low-DPI arm aimers who demand absolute control in high-stakes competitive clutch rounds.',
    material_specs: `Textured control fabric, 4mm zero-slip rubber grip, heat-treated anti-fray edge. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe surface with microfiber cloth. Air dry completely.',
    is_active: true,
  },

  // ── 3. ABSTRACT AND WAVES (2) ─────────────────────────────
  {
    name: 'Great Kanagawa Dark Wave Deskmat',
    slug: 'great-kanagawa-dark-wave-deskmat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 55,
    collections: ['abstract', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'speed', 'best-sellers'],
    images: ['/dragon-wave-mousepad.jpg', '/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    description: 'An intense modern reimagining of the iconic Japanese great wave with deep indigo and storm froth aesthetics. High-speed multi-directional glide optimized for optical sensors.',
    material_specs: `High-definition thermal sublimation print (fade-proof), ultra-smooth surface, non-slip textured rubber base. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Hand wash gently with cool water and mild soap. Air dry flat.',
    is_active: true,
  },
  {
    name: 'Neon Fluid Abyssal Waves Mat',
    slug: 'neon-fluid-abyssal-waves-mat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 35,
    collections: ['abstract', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'speed'],
    images: ['/mousepad-trimmed.png', '/dragon-wave-mousepad.jpg'],
    description: 'Mesmerizing psychedelic liquid marble flow with fluid neon currents. High-speed glide surface that makes every mouse swipe feel smooth and effortless.',
    material_specs: `Silky smooth poly-blend fabric, water-repellent surface finish, reinforced low-profile stitching. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe spills instantly with dry towel. Rinse with cool water if needed.',
    is_active: true,
  },

  // ── 4. FANTASY AND MYTHIC (2) ─────────────────────────────
  {
    name: 'Dragon Sovereign Mythic Battlemat',
    slug: 'dragon-sovereign-mythic-battlemat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 45,
    collections: ['fantasy', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'hot-picks'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg', '/dragon-wave-mousepad.jpg'],
    description: 'Summon the elder storm dragon across your battlestation. Mythic fantasy artwork rendered in rich chromatic depth with extreme detail and vibrant contrast.',
    material_specs: `Premium textured cloth weave, 4mm cushioned rubber core, 360-degree precision anti-fray stitching. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Clean with damp cloth. Air dry flat away from sunlight.',
    is_active: true,
  },
  {
    name: 'Celestial Phoenix Rebirth Deskmat',
    slug: 'celestial-phoenix-rebirth-deskmat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 50,
    collections: ['fantasy', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'best-sellers'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg', '/red_mousepad.jpg'],
    description: 'Ascend with the mythical golden firebird spreading wings across celestial constellations. Balanced glide engineered for both tracking and rapid flick maneuvers.',
    material_specs: `Optical sensor-tuned micro-texture, spill-resistant nano coating, heavy natural rubber base. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe spills immediately. Air dry flat.',
    is_active: true,
  },

  // ── 5. ANIME AND MANGA (2) ────────────────────────────────
  {
    name: 'Domain Curse Anime Deskmat',
    slug: 'domain-curse-anime-deskmat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 50,
    collections: ['anime', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'hot-picks', 'best-sellers'],
    images: ['/jjk_mousepad.jpg'],
    description: 'Unleash malevolent cursed energy with high-contrast manga screentone art. Crisp deep inks and striking red accents create an unforgettable battle station centerpiece.',
    material_specs: `Ultra-dense woven microfiber, anti-curling rubber bottom, seamless edge stitching. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe clean with a damp cloth. Do not machine wash.',
    is_active: true,
  },
  {
    name: 'Sakura Blossom Neo-Tokyo Manga Mat',
    slug: 'sakura-blossom-neo-tokyo-manga-mat',
    category: 'XXL Deskmats',
    cost_price: 450,
    selling_price: 800,
    discount_percentage: 0,
    stock_quantity: 40,
    collections: ['anime', 'non-rgb', 'basic', 'large', 'xl', 'xxl', 'xxxl', 'control'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg', '/sakura-mousepad.jpg'],
    description: 'Serene cherry blossom mountain sanctuary blended with retro cyberpunk anime aesthetics. Ultra-soft touch cloth for comfortable marathon gaming sessions.',
    material_specs: `Comfort cloth surface, 4mm wrist-friendly cushioning, anti-skid rubber base, anti-fray hemmed edge. ${SIZE_ENCODING}`,
    warranty_period: '6 Months',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe gently with damp cloth and mild soap. Air dry completely.',
    is_active: true,
  },
];

async function seed() {
  console.log(`Starting insertion of ${MOUSEPADS.length} mousepads into Supabase...`);

  for (const p of MOUSEPADS) {
    const { data: existing } = await supabase
      .from('products')
      .select('id, slug')
      .eq('slug', p.slug)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('products')
        .update(p)
        .eq('id', existing.id);

      if (error) {
        console.error(`Error updating "${p.name}":`, error.message);
      } else {
        console.log(`Updated: ${p.name}`);
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(p);

      if (error) {
        console.error(`Error inserting "${p.name}":`, error.message);
      } else {
        console.log(`Inserted: ${p.name}`);
      }
    }
  }

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`\nDone! Total products in Supabase: ${count}`);
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
