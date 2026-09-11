import CategoryStorePage from '@/components/storefront/CategoryStorePage';

export const metadata = {
  title: 'Gaming In-Ear Monitors (IEMs) | Directional Footstep Audio | VYNTRO',
  description: 'Precision gaming in-ear monitors tuned for tactical FPS shooters. Multi-filter by driver type, competitive FPS footsteps, and detachable 2-pin cables.',
};

const FILTER_GROUPS = [
  {
    id: 'driver',
    title: 'DRIVER ARCHITECTURE',
    options: [
      { id: 'hybrid', label: 'Hybrid Multi-Driver (DD+BA)' },
      { id: 'planar', label: 'Planar Magnetic' },
      { id: 'dynamic', label: 'Single Dynamic Driver' },
    ],
  },
  {
    id: 'tuning',
    title: 'AUDIO PROFILE & FEATURES',
    options: [
      { id: 'fps-tuning', label: 'FPS Footsteps & Cues' },
      { id: 'detachable', label: 'Detachable 2-Pin Cable' },
      { id: 'isolating', label: 'Noise Isolating Ear-Tips' },
    ],
  },
];

const INITIAL_IEMS = [
  {
    id: 'iem-1',
    name: 'VYNTRO Phantom FPS Precision IEM',
    slug: 'vyntro-phantom-fps-precision-iem',
    category: 'IEMs',
    selling_price: 8499,
    discount_percentage: 15,
    collections: ['hybrid', 'fps-tuning', 'detachable', 'best-sellers'],
    tags: ['hybrid', 'fps-tuning', 'detachable', 'iem', 'esports', 'audio'],
    images: ['/red_mousepad.jpg'],
    material_specs: '1 Dynamic Bass Driver + 1 Balanced Armature, silver-plated OFC 2-pin cable, medical-grade resin shell',
    description: 'Acoustically tuned specifically for pin-point directional awareness. Hear footfalls, bomb defuses, and reload clicks before enemies see you.',
  },
  {
    id: 'iem-2',
    name: 'Tangzu Wan’er S.G Studio Edition',
    slug: 'tangzu-waner-sg-studio-edition',
    category: 'IEMs',
    selling_price: 5499,
    discount_percentage: 0,
    collections: ['dynamic', 'detachable', 'isolating'],
    tags: ['dynamic', 'detachable', 'isolating', 'tangzu', 'budget'],
    images: ['/Sakura Landscape Mousepad Mountain Pink White Mouse Pad Rubber Bottom Game Pad Office accessories.jpg'],
    material_specs: '10mm PET diaphragm dynamic driver, ergonomic transparent faceplate, 0.78mm 2-pin connector',
    description: 'Renowned audiophile clarity in an accessible price tier. Smooth mids and sparkling highs with rich soundstage.',
  },
  {
    id: 'iem-3',
    name: 'Truthear Hexa 1DD+3BA Hybrid',
    slug: 'truthear-hexa-hybrid',
    category: 'IEMs',
    selling_price: 18900,
    discount_percentage: 5,
    collections: ['hybrid', 'fps-tuning', 'detachable', 'hot-picks'],
    tags: ['hybrid', 'fps-tuning', 'detachable', 'truthear', 'hexa'],
    images: ['/jjk_mousepad.jpg'],
    material_specs: '1 Dynamic + 3 Balanced Armature hybrid configuration, 3D printed DLP cavity, polyurethane acoustic tubes',
    description: 'The premier choice for competitive esports audio. Exceptional instrumental and spatial separation with surgical imaging.',
  },
  {
    id: 'iem-4',
    name: 'Moondrop Chu II Type-C DSP',
    slug: 'moondrop-chu-ii-dsp',
    category: 'IEMs',
    selling_price: 6200,
    discount_percentage: 0,
    collections: ['dynamic', 'isolating'],
    tags: ['dynamic', 'isolating', 'moondrop', 'dsp', 'type-c'],
    images: ['/Zindoo XXL Gaming Mouse Mat 900 x 400 mm.jpg'],
    material_specs: 'Zinc alloy electroplated body, interchangeable brass acoustic nozzle, built-in high-res DAC Type-C plug',
    description: 'Plug-and-play USB Type-C high fidelity audio with customizable DSP EQ profiles tuned for both mobile and PC setups.',
  },
  {
    id: 'iem-5',
    name: 'Simgot EM6L Phoenix Hybrid',
    slug: 'simgot-em6l-phoenix-hybrid',
    category: 'IEMs',
    selling_price: 26500,
    discount_percentage: 10,
    collections: ['hybrid', 'fps-tuning', 'detachable'],
    tags: ['hybrid', 'fps-tuning', 'detachable', 'simgot', 'phoenix'],
    images: ['/Wave MTG gaming mat, dragon 350x600x2mm mouse pad MTG MTG DTCG CCG RPG, collection card, soft rubber.jpg'],
    material_specs: '1DD + 4BA hybrid system, mirror-finish resin faceplate, QDC-style detachable braided audio lead',
    description: 'Unmatched 3D binaural depth perception. Accurately judge vertical elevation and precise distances of opposing players.',
  },
  {
    id: 'iem-6',
    name: 'VYNTRO Tactical Stealth IEM',
    slug: 'vyntro-tactical-stealth-iem',
    category: 'IEMs',
    selling_price: 4999,
    discount_percentage: 10,
    collections: ['dynamic', 'fps-tuning', 'isolating', 'best-sellers'],
    tags: ['dynamic', 'fps-tuning', 'isolating', 'budget', 'stealth'],
    images: ['/red_mousepad.jpg'],
    material_specs: 'Dual-cavity magnetic driver, inline noise-cancelling microphone, memory foam ear tips included',
    description: 'Zero ear fatigue during marathon 8-hour sessions. Lightweight feather shell with passive 26dB ambient noise isolation.',
  },
];

export default function IEMsPage() {
  return (
    <CategoryStorePage
      // eyebrow="PINPOINT DIRECTIONAL AUDIO // DUAL-DRIVER SPATIAL TUNING"
      titlePrefix="GAMING"
      titleAccent="IEMS"
      description="Zero audio latency and surgical spatial separation. In-ear monitors tuned specifically to reveal opponent footfalls and subtle audio cues."
      matchingCategories={['IEMs']}
      filterGroups={FILTER_GROUPS}
      initialPlaceholders={INITIAL_IEMS}
    />
  );
}
