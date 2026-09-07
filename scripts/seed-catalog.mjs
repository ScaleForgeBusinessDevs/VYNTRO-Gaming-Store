import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

export const PRODUCTS = [
  // ===================== MICE =====================
  {
    name: 'Razer DeathAdder V3',
    slug: 'razer-deathadder-v3',
    category: 'Mice',
    cost_price: 13999,
    selling_price: 19499,
    discount_percentage: 0,
    stock_quantity: 45,
    collections: ['fps', 'best-sellers', 'wired'],
    images: ['/Gaming Mouse 🎮🖱️.jpg', '/mouse_cat.jpg'],
    description: 'Ergonomic wired esports mouse engineered for top-tier competitive FPS performance. Features ultra-lightweight 59g chassis, Focus Pro 30K optical sensor, true 8000Hz polling rate, and gen-3 optical switches rated for 90 million clicks.',
    material_specs: '59g ergonomic shell, Razer Focus Pro 30K Optical Sensor, True 8000Hz polling rate, Gen-3 Optical Switches (90M clicks), Speedflex cable',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Keep dry. Clean optical sensor with compressed air. Wipe shell with a clean microfiber cloth.',
    is_active: true,
  },
  {
    name: 'Razer Viper V3 Pro',
    slug: 'razer-viper-v3-pro',
    category: 'Mice',
    cost_price: 32000,
    selling_price: 44499,
    discount_percentage: 5,
    stock_quantity: 30,
    collections: ['fps', 'wireless', 'pro-gear', 'hot-picks', 'claw', 'fingertip'],
    images: ['/Razer Viper V3 Pro Sentinels Edition Review _ Ultra-Light 54g Wireless Gaming Mouse.jpg', '/Gaming Mouse 🎮🖱️.jpg'],
    description: 'The definitive wireless esports weapon. Symmetrical 54g ultra-lightweight shape, Focus Pro 35K Gen-2 Optical Sensor, up to 8000Hz wireless polling via HyperPolling dongle, and up to 95 hours of competitive battery life.',
    material_specs: '54g symmetrical chassis, Razer Focus Pro 35K Optical Sensor Gen-2, 8000Hz HyperPolling wireless, up to 95h battery life, 100% PTFE mouse feet',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Recharge using supplied USB-C Speedflex cable. Clean mouse skates with isopropyl wipe.',
    is_active: true,
  },
  {
    name: 'Logitech G Pro X Superlight 2',
    slug: 'logitech-g-pro-x-superlight-2',
    category: 'Mice',
    cost_price: 32000,
    selling_price: 44499,
    discount_percentage: 0,
    stock_quantity: 38,
    collections: ['fps', 'wireless', 'minimalistic', 'best-sellers', 'claw', 'palm'],
    images: ['/Gaming Mouse 🎮🖱️.jpg', '/mouse_cat.jpg'],
    description: 'The champion mouse of international esports. Upgraded with LIGHTFORCE hybrid optical-mechanical switches, HERO 2 32K sensor, 2000Hz/4000Hz wireless polling, and up to 95 hours of marathon battery life at just 60g.',
    material_specs: '60g minimalist chassis, HERO 2 32K Sensor (500+ IPS), LIGHTFORCE Hybrid Optical-Mechanical Switches, LIGHTSPEED wireless, USB-C charging',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Keep dry. Store dongle securely when traveling. Clean shell with dry microfiber cloth.',
    is_active: true,
  },
  {
    name: 'Razer Basilisk V3 Pro',
    slug: 'razer-basilisk-v3-pro',
    category: 'Mice',
    cost_price: 32000,
    selling_price: 44499,
    discount_percentage: 0,
    stock_quantity: 22,
    collections: ['mmo', 'wireless', 'rgb', 'palm'],
    images: ['/Gaming Mouse 🎮🖱️.jpg'],
    description: 'Advanced ergonomic gaming mouse featuring the revolutionary Razer HyperScroll Tilt Wheel with free-spin and tactile modes, 11 programmable buttons, 13-zone Chroma RGB lighting with full underglow, and Focus Pro 30K sensor.',
    material_specs: '112g ergonomic right-handed shell, HyperScroll Tilt Wheel, Focus Pro 30K Optical Sensor, 11 programmable buttons, 13-zone Razer Chroma RGB',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Use soft brush to remove dust around scroll wheel. Wipe grip zones with mild damp cloth.',
    is_active: true,
  },
  {
    name: 'Logitech G502 X Plus',
    slug: 'logitech-g502-x-plus',
    category: 'Mice',
    cost_price: 32000,
    selling_price: 44499,
    discount_percentage: 0,
    stock_quantity: 40,
    collections: ['mmo', 'wireless', 'rgb', 'best-sellers', 'palm'],
    images: ['/Gaming Mouse 🎮🖱️.jpg'],
    description: 'The latest evolution of the world’s most popular gaming mouse. Redesigned with LIGHTFORCE hybrid switches, LIGHTSYNC 8-LED dynamic RGB lighting, HERO 25K sub-micron sensor, and reversible/removable DPI-shift button.',
    material_specs: '106g ergonomic design, LIGHTFORCE optical-mechanical switches, HERO 25K Sensor, LIGHTSYNC 8-LED active RGB, LIGHTSPEED wireless + POWERPLAY compatible',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe shell with microfiber cloth. Keep charging contacts clean.',
    is_active: true,
  },

  // ===================== KEYBOARDS =====================
  {
    name: 'Wooting 60HE',
    slug: 'wooting-60he',
    category: 'Keyboards',
    cost_price: 35000,
    selling_price: 48999,
    discount_percentage: 0,
    stock_quantity: 15,
    collections: ['benchmark', 'imported', 'minimalistic', 'rapid-trigger', '60%'],
    images: ['/keyboard_cat.jpg'],
    description: 'The undisputed benchmark for competitive gaming keyboards. 60% compact layout powered by Lekker Hall Effect magnetic switches. Features true Rapid Trigger technology with 0.1mm to 4.0mm customizable analog actuation per key.',
    material_specs: '60% compact layout, Gateron x Lekker Magnetic Hall Effect switches, Rapid Trigger (0.1–4.0mm actuation), hot-swappable switch sockets, PBT keycaps',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Calibrate via Wootility web software. Clean with keycap puller and compressed air.',
    is_active: true,
  },
  {
    name: 'Razer Huntsman V3 Pro TKL',
    slug: 'razer-huntsman-v3-pro-tkl',
    category: 'Keyboards',
    cost_price: 46000,
    selling_price: 63999,
    discount_percentage: 5,
    stock_quantity: 20,
    collections: ['fps', 'analog', 'pro-gear', 'hot-picks', '80%'],
    images: ['/keyboard_cat.jpg'],
    description: 'Tenkeyless analog optical gaming keyboard engineered for pro-level tactical shooters. Gen-2 Analog Optical Switches with Rapid Trigger mode, quick onboard actuation adjustment with LED array indicator, and textured doubleshot PBT keycaps.',
    material_specs: 'Tenkeyless (TKL 80%) layout, Razer Analog Optical Gen-2 Switches, Rapid Trigger 0.1–4.0mm, textured doubleshot PBT keycaps, brushed 5052 aluminum top plate, magnetic leatherette wrist rest',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Detach magnetic wrist rest before moving. Clean keycaps with damp cloth.',
    is_active: true,
  },
  {
    name: 'SteelSeries Apex Pro TKL',
    slug: 'steelseries-apex-pro-tkl',
    category: 'Keyboards',
    cost_price: 44000,
    selling_price: 61499,
    discount_percentage: 0,
    stock_quantity: 25,
    collections: ['fps', 'analog', 'best-sellers', '80%'],
    images: ['/keyboard_cat.jpg'],
    description: 'World’s fastest keyboard featuring OmniPoint 2.0 adjustable hyper-magnetic switches with Rapid Trigger. Integrated OLED Smart Display delivers direct settings info, Discord alerts, and game stats at a glance.',
    material_specs: 'TKL 80% form factor, OmniPoint 2.0 Adjustable Magnetic Switches (0.2–3.8mm), OLED Smart Display, Series 5000 aircraft-grade aluminum frame, per-key dynamic RGB',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Keep OLED screen clean with dry microfiber cloth. Do not use chemical solvents.',
    is_active: true,
  },
  {
    name: 'Logitech G Pro X TKL',
    slug: 'logitech-g-pro-x-tkl',
    category: 'Keyboards',
    cost_price: 40000,
    selling_price: 55999,
    discount_percentage: 0,
    stock_quantity: 28,
    collections: ['fps', 'wireless', 'pro-gear', '80%'],
    images: ['/keyboard_cat.jpg'],
    description: 'Engineered with and for tournament champions. LIGHTSPEED wireless technology with pro-grade GX mechanical switches, dual-shot PBT keycaps, customizable LIGHTSYNC RGB, and dedicated game mode switch in a compact travel-ready design.',
    material_specs: 'TKL 80% competitive design, Hot-swappable GX mechanical switches, LIGHTSPEED wireless + Bluetooth + USB-C wired, dual-shot PBT keycaps, hard-shell travel case included',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Store in included hardshell carrying case during transit. Clean dust using compressed air.',
    is_active: true,
  },
  {
    name: 'Corsair K70 RGB Pro',
    slug: 'corsair-k70-rgb-pro',
    category: 'Keyboards',
    cost_price: 34000,
    selling_price: 47499,
    discount_percentage: 0,
    stock_quantity: 32,
    collections: ['rgb', 'best-sellers', '100%'],
    images: ['/keyboard_cat.jpg'],
    description: 'Iconic full-size mechanical keyboard equipped with authentic Cherry MX switches, durable brushed aluminum frame, AXON 8,000Hz hyper-processing, tournament mode lock switch, and precision-molded PBT double-shot keycaps.',
    material_specs: 'Full-size 104-key layout, Genuine Cherry MX switches, Corsair AXON 8000Hz hyper-polling, precision PBT double-shot keycaps, aluminum top plate, dedicated volume roller',
    warranty_period: '2 Years',
    delivery_time: '2–4 business days',
    care_instructions: 'Disconnect USB cable prior to cleaning. Wipe aluminum top plate with microfiber cloth.',
    is_active: true,
  },

  // ===================== IEMS =====================
  {
    name: 'SIMGOT EM6L',
    slug: 'simgot-em6l',
    category: 'IEMs',
    cost_price: 12000,
    selling_price: 16999,
    discount_percentage: 0,
    stock_quantity: 50,
    collections: ['budget-friendly', 'hybrid-driver', 'hot-picks', 'hybrid'],
    images: ['/IEMs_cat.jpg'],
    description: 'High-precision hybrid in-ear monitors equipped with 1 Dynamic Driver and 4 Balanced Armatures per ear. Tuned to the H-2019 target curve for exceptional 3D directional positioning in tactical shooters like CS2 and Valorant.',
    material_specs: '1DD + 4BA hybrid 5-driver acoustic system, high-precision 3D-printed resin cavity, CNC aluminum alloy faceplate, detachable silver-plated OFC 2-pin 0.78mm cable',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Clean nozzle earwax filters with included brush. Store in dry pouch away from moisture.',
    is_active: true,
  },
  {
    name: 'Truthear ZERO: RED',
    slug: 'truthear-zero-red',
    category: 'IEMs',
    cost_price: 11000,
    selling_price: 15499,
    discount_percentage: 0,
    stock_quantity: 42,
    collections: ['budget-friendly', 'dual-dynamic', 'best-sellers', 'dynamic'],
    images: ['/IEMs_cat.jpg'],
    description: 'Collaboratively tuned with Crinacle. Features dual polyurethane suspension composite liquid crystal dome dynamic drivers (10mm woofer + 7.8mm tweeter) delivering crystal-clear footsteps and punchy sub-bass without masking mid-frequencies.',
    material_specs: 'Dual dynamic drivers (10mm + 7.8mm LCP), medical-grade 3D DLP resin shell, 0.78mm 2-pin detachable cable, 10-ohm bass impedance adapter included',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Keep drivers dry. Regularly swap or clean silicone tips with warm water (detached from IEMs).',
    is_active: true,
  },
  {
    name: 'Final Audio VR3000',
    slug: 'final-audio-vr3000',
    category: 'IEMs',
    cost_price: 10000,
    selling_price: 13999,
    discount_percentage: 0,
    stock_quantity: 35,
    collections: ['gaming', 'low-latency', 'fps', 'dynamic'],
    images: ['/IEMs_cat.jpg'],
    description: 'Engineered in Japan specifically for spatial audio in gaming and VR. Features Final’s f-Core DU dynamic driver with ultra-accurate spatial acoustic localization that pinpoints audio distance and vertical elevation flawlessly.',
    material_specs: '6mm high-precision f-Core DU dynamic driver, lightweight ABS ergonomic housing (20g), oxygen-free copper cable with inline controller & microphone, Final Type-E ear tips',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Handle cable gently at strain reliefs. Store in protective pouch when not in use.',
    is_active: true,
  },
  {
    name: 'Moondrop Aria 2',
    slug: 'moondrop-aria-2',
    category: 'IEMs',
    cost_price: 16000,
    selling_price: 22499,
    discount_percentage: 0,
    stock_quantity: 44,
    collections: ['audiophile', 'minimalistic', 'hot-picks', 'dynamic'],
    images: ['/IEMs_cat.jpg'],
    description: 'Next-generation single dynamic driver IEM featuring a newly developed TiN ceramic-coated spherical dome composite diaphragm. Delivers ultra-low distortion, wide soundstage, and immaculate vocal presence with screw-in swappable audio plugs.',
    material_specs: 'TiN ceramic-coated dynamic driver, alloy casting CNC-milled shell with brass acoustic nozzle, modular cable with 3.5mm & 4.4mm balanced plugs',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Unscrew modular plugs gently when swapping. Clean brass nozzle mesh periodically.',
    is_active: true,
  },
  {
    name: '7Hz Salnotes Zero 2',
    slug: '7hz-salnotes-zero-2',
    category: 'IEMs',
    cost_price: 42000 / 10,
    selling_price: 5999,
    discount_percentage: 0,
    stock_quantity: 60,
    collections: ['budget-friendly', 'entry-level', 'best-sellers', 'dynamic'],
    images: ['/IEMs_cat.jpg'],
    description: 'The undisputed king of budget gaming IEMs. Upgraded 10mm dynamic driver with flexible PU+LCP diaphragm providing enhanced low-frequency punch and accurate positional audio cues without treble harshness.',
    material_specs: '10mm composite PU+LCP dynamic driver, stainless steel faceplate with ergonomic resin body, high-purity silver-plated OFC detachable 0.78mm 2-pin cable',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Avoid pulling directly on cable wires; hold the 2-pin housing when detaching.',
    is_active: true,
  },

  // ===================== ACCESSORIES / MOUSEPADS =====================
  {
    name: 'SteelSeries QcK Heavy',
    slug: 'steelseries-qck-heavy',
    category: 'Accessories',
    cost_price: 7000,
    selling_price: 9999,
    discount_percentage: 0,
    stock_quantity: 55,
    collections: ['mousepad', 'cloth', 'best-sellers'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg', '/tactical-mousepad.jpg'],
    description: 'The heavyweight legend used by esports pros worldwide. Features an extra thick 6mm non-slip rubber base that eliminates uneven desk surfaces, micro-woven cloth surface optimized for both low and high DPI mouse tracking, and durable stitched perimeter.',
    material_specs: '900×300×6mm (XL), legendary QcK micro-woven cloth surface, extra thick 6mm natural rubber non-slip base, wash-resistant',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Hand wash gently with lukewarm water and mild dish soap. Air dry flat. Do not machine dry.',
    is_active: true,
  },
  {
    name: 'ZOWIE G-SR III',
    slug: 'zowie-g-sr-iii',
    category: 'Accessories',
    cost_price: 11000,
    selling_price: 15499,
    discount_percentage: 0,
    stock_quantity: 30,
    collections: ['mousepad', 'cloth', 'pro-gear', 'hot-picks'],
    images: ['/tactical-mousepad.jpg', '/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    description: 'The gold standard esports control surface for tactical FPS titles like CS2 and Valorant. Newly upgraded uniform high-density rubber base with moisture-resistant micro-texture cloth provides consistent stopping power and smooth glide.',
    material_specs: '490×420×3.5mm, specialized high-density flat rubber base, humidity-resistant tight cloth weave, anti-fray stitched edge',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe surface with microfiber cloth. Keep away from direct sunlight.',
    is_active: true,
  },
  {
    name: 'Logitech G640',
    slug: 'logitech-g640',
    category: 'Accessories',
    cost_price: 6000,
    selling_price: 8499,
    discount_percentage: 0,
    stock_quantity: 40,
    collections: ['mousepad', 'cloth', 'minimalistic'],
    images: ['/sakura-mousepad.jpg', '/red_mousepad.jpg'],
    description: 'Large cloth gaming mousepad featuring moderate surface friction ideal for low-DPI flick maneuvers in competitive shooters. Clean consistent surface texture matched specifically to Logitech G sensors.',
    material_specs: '460×400×3mm, heat-treated moderate friction cloth weave, flexible non-slip natural rubber base, rolled-edge packaging',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Clean surface gently with damp cloth. Do not bend backwards.',
    is_active: true,
  },
  {
    name: 'Razer Gigantus V2',
    slug: 'razer-gigantus-v2',
    category: 'Accessories',
    cost_price: 5000,
    selling_price: 6999,
    discount_percentage: 0,
    stock_quantity: 48,
    collections: ['mousepad', 'cloth', 'best-sellers'],
    images: ['/red_mousepad.jpg', '/sakura-mousepad.jpg'],
    description: 'Soft gaming mouse mat with textured micro-weave cloth surface for fluid swipes and pixel-precise aim. High-density thick rubber foam with non-slip base ensures the pad stays anchored during intense firefights.',
    material_specs: 'Available in L/XXL, textured micro-weave cloth, 3mm thick high-density rubber foam base, anti-slip grooved rubber bottom',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Wipe clean with a damp cloth. Avoid harsh abrasive cleaners.',
    is_active: true,
  },
  {
    name: 'Razer Strider',
    slug: 'razer-strider',
    category: 'Accessories',
    cost_price: 8000,
    selling_price: 11499,
    discount_percentage: 0,
    stock_quantity: 25,
    collections: ['mousepad', 'hybrid', 'hot-picks'],
    images: ['/dragon-wave-mousepad.jpg', '/tactical-mousepad.jpg'],
    description: 'Hybrid mouse mat that combines the frictionless speed of a hard surface with the rollable portability and comfort of a soft mat. Engineered with a water-resistant warp-proof surface and reinforced anti-fray stitched borders.',
    material_specs: '450×400×3mm, hybrid polyester hard/soft weave surface, water-resistant hydrophobic coating, grooved anti-slip rubber base, seamless stitched edges',
    warranty_period: '1 Year',
    delivery_time: '2–4 business days',
    care_instructions: 'Water-resistant surface: wipe spills instantly with dry towel. Rinse with cool water if needed.',
    is_active: true,
  },
];

async function seed() {
  console.log(`Starting insertion of ${PRODUCTS.length} products into Supabase...`);

  for (const p of PRODUCTS) {
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
        console.log(`Updated: ${p.name} (PKR ${p.selling_price})`);
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(p);

      if (error) {
        console.error(`Error inserting "${p.name}":`, error.message);
      } else {
        console.log(`Inserted: ${p.name} (PKR ${p.selling_price})`);
      }
    }
  }

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`\nDone! Total products currently in Supabase: ${count}`);
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
