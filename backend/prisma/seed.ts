import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

/** Photos are named by what they actually depict so products stay matched to the right imagery. */
const PHOTO = {
  haloRingOnBox: 'photo-1605100804763-247f67b3557e',
  roseGoldBangle: 'photo-1611591437281-460bfbe1220a',
  layeredChainsWorn: 'photo-1611652022419-a9419f74343d',
  sapphireDropEarrings: 'photo-1535632066927-ab7c9ab60908',
  pearlNecklaceInBox: 'photo-1515562141207-7a88fb7ce338',
  pinkHaloRing: 'photo-1603561591411-07134e71a2a9',
  braceletsOnWrists: 'photo-1596944924616-7b38e7cfac36',
  goldHoopsOnBook: 'photo-1603974372039-adc49044b6bd',
  ringFlatlay: 'photo-1608042314453-ae338d80c427',
  petalGemRing: 'photo-1602751584552-8ba73aad10e1',
  diamondPendant: 'photo-1598560917505-59a3ad559071',
  fineGoldChain: 'photo-1599643478518-a784e5dc4c8f',
  diamondBracelet: 'photo-1573408301185-9146fe634ad0',
  pendantWorn: 'photo-1600721391689-2564bb8055de',
  pearlPendantWorn: 'photo-1611085583191-a3b181a88401',
  bridalGoldSet: 'photo-1601121141461-9d6647bca1ed',
  goldChainBracelet: 'photo-1602173574767-37ac01994b2a',
  diamondStuds: 'photo-1588444650733-d0767b753fc8',
  silverChainPendant: 'photo-1589128777073-263566ae5e4d',
  roseGoldDrops: 'photo-1629224316810-9d8805b95e76',
  blueDropEarrings: 'photo-1630019852942-f89202989a59',
  ornateGoldRing: 'photo-1611955167811-4711904bb9f8',
} as const;

const categories = [
  {
    name: 'Rings',
    slug: 'rings',
    description: 'Solitaires, stacking bands and statement rings crafted for everyday elegance.',
    imageUrl: img(PHOTO.haloRingOnBox),
    position: 1,
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Delicate chains, pendants and layered pieces that frame every neckline.',
    imageUrl: img(PHOTO.layeredChainsWorn),
    position: 2,
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Tennis bracelets, cuffs and charm designs finished by hand.',
    imageUrl: img(PHOTO.diamondBracelet),
    position: 3,
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Studs, hoops and drops in recycled gold and freshwater pearl.',
    imageUrl: img(PHOTO.sapphireDropEarrings),
    position: 4,
  },
  {
    name: 'Bridal',
    slug: 'bridal',
    description: 'Heirloom-worthy sets for the day you will remember forever.',
    imageUrl: img(PHOTO.bridalGoldSet),
    position: 5,
  },
];

type SeedProduct = {
  title: string;
  category: string;
  price: number;
  comparePrice?: number;
  material: string;
  stock: number;
  isPopular?: boolean;
  isNewArrival?: boolean;
  description: string;
  images: string[];
};

const products: SeedProduct[] = [
  {
    title: 'Zyra Solitaire Ring',
    category: 'rings',
    price: 489,
    comparePrice: 560,
    material: '18k Rose Gold · 0.5ct Moissanite',
    stock: 12,
    isPopular: true,
    isNewArrival: true,
    description:
      'A single brilliant-cut stone raised on a slender rose gold band. The six-prong basket setting lifts the stone toward the light, making it read far larger than its carat weight. Designed to be worn alone or stacked with a plain band.',
    images: [img(PHOTO.haloRingOnBox), img(PHOTO.pinkHaloRing), img(PHOTO.ringFlatlay)],
  },
  {
    title: 'Petale Diamond Band',
    category: 'rings',
    price: 645,
    material: '14k Yellow Gold · Pavé Diamonds',
    stock: 8,
    isPopular: true,
    description:
      'Twenty-two pavé-set diamonds curve around a softly domed band, echoing the edge of a petal. Comfortable enough for daily wear, refined enough for the occasion.',
    images: [img(PHOTO.petalGemRing), img(PHOTO.ringFlatlay)],
  },
  {
    title: 'Luna Stacking Set',
    category: 'rings',
    price: 275,
    comparePrice: 320,
    material: 'Sterling Silver · Rhodium Finish',
    stock: 20,
    isNewArrival: true,
    description:
      'Three whisper-thin bands — one plain, one twisted, one beaded — designed to be worn together or apart. Sold as a set of three.',
    images: [img(PHOTO.ringFlatlay), img(PHOTO.ornateGoldRing)],
  },
  {
    title: 'Celeste Pearl Drop Necklace',
    category: 'necklaces',
    price: 398,
    material: '18k Gold Vermeil · Freshwater Pearl',
    stock: 15,
    isPopular: true,
    isNewArrival: true,
    description:
      'A single baroque freshwater pearl suspended from a fine cable chain. No two pearls are identical, so every piece carries its own quiet character. Adjustable 16–18".',
    images: [
      img(PHOTO.pearlPendantWorn),
      img(PHOTO.pearlNecklaceInBox),
      img(PHOTO.diamondPendant),
    ],
  },
  {
    title: 'Aurora Layered Chain',
    category: 'necklaces',
    price: 312,
    material: '14k Gold Filled',
    stock: 18,
    isPopular: true,
    description:
      'Two chains in one clasp — a fine box chain paired with a slightly heavier curb — so the layered look never tangles. A modern staple that dresses up a plain neckline.',
    images: [img(PHOTO.layeredChainsWorn), img(PHOTO.fineGoldChain)],
  },
  {
    title: 'Ivy Emerald Pendant',
    category: 'necklaces',
    price: 720,
    comparePrice: 850,
    material: '18k Gold · Natural Emerald',
    stock: 5,
    description:
      'A bezel-set emerald in a deep forest tone, hung from an 18" chain. The bezel protects the softer stone while keeping the silhouette clean.',
    images: [img(PHOTO.diamondPendant), img(PHOTO.pendantWorn)],
  },
  {
    title: 'Serene Tennis Bracelet',
    category: 'bracelets',
    price: 890,
    material: '18k White Gold · Lab Diamonds',
    stock: 6,
    isPopular: true,
    description:
      'A continuous line of lab-grown diamonds in a flexible four-prong setting that moves with the wrist. Fitted with a double-locking clasp for peace of mind.',
    images: [img(PHOTO.diamondBracelet), img(PHOTO.roseGoldBangle)],
  },
  {
    title: 'Mila Chain Cuff',
    category: 'bracelets',
    price: 240,
    material: '18k Gold Vermeil',
    stock: 22,
    isNewArrival: true,
    description:
      'The weight of a chain bracelet with the ease of a cuff — it slips on without a clasp and holds its shape. Polished by hand to a mirror finish.',
    images: [img(PHOTO.goldChainBracelet), img(PHOTO.braceletsOnWrists)],
  },
  {
    title: 'Rosalind Charm Bracelet',
    category: 'bracelets',
    price: 335,
    material: 'Sterling Silver · Rose Gold Plated',
    stock: 14,
    description:
      'A delicate rolo chain with three removable charms — a crescent, a heart and an initial disc. Add or swap charms as the collection grows.',
    images: [img(PHOTO.roseGoldBangle), img(PHOTO.braceletsOnWrists)],
  },
  {
    title: 'Vera Pearl Studs',
    category: 'earrings',
    price: 168,
    material: '14k Gold · Akoya Pearl',
    stock: 30,
    isPopular: true,
    isNewArrival: true,
    description:
      'Classic 7mm Akoya pearls on solid gold posts with secure screw backs. The pair that belongs in every jewellery box.',
    images: [img(PHOTO.diamondStuds), img(PHOTO.goldHoopsOnBook)],
  },
  {
    title: 'Halo Huggie Hoops',
    category: 'earrings',
    price: 215,
    comparePrice: 265,
    material: '18k Gold Vermeil · Cubic Zirconia',
    stock: 25,
    isPopular: true,
    description:
      'Snug 12mm huggies lined with a halo of tiny stones. Light enough to sleep in, bright enough for evening.',
    images: [img(PHOTO.goldHoopsOnBook), img(PHOTO.sapphireDropEarrings)],
  },
  {
    title: 'Elowen Drop Earrings',
    category: 'earrings',
    price: 289,
    material: '14k Gold Filled · Moonstone',
    stock: 11,
    isNewArrival: true,
    description:
      'A faceted moonstone teardrop that catches blue fire as it moves. Hung from a slim gold hook that stays comfortable through long evenings.',
    images: [img(PHOTO.blueDropEarrings), img(PHOTO.roseGoldDrops)],
  },
  {
    title: 'Everly Bridal Set',
    category: 'bridal',
    price: 1450,
    comparePrice: 1690,
    material: '18k White Gold · Lab Diamonds',
    stock: 4,
    isPopular: true,
    description:
      'An engagement ring and matching contour band designed to sit flush together. The pair is sold as a set and can be resized once at no cost.',
    images: [img(PHOTO.haloRingOnBox), img(PHOTO.pearlNecklaceInBox)],
  },
  {
    title: 'Grace Pearl Tiara Comb',
    category: 'bridal',
    price: 520,
    material: 'Gold Plated Brass · Freshwater Pearl',
    stock: 7,
    isNewArrival: true,
    description:
      'Hand-wired pearls and crystal sprays on a flexible comb that grips without pulling. Photographs beautifully against both loose waves and an updo.',
    images: [img(PHOTO.bridalGoldSet), img(PHOTO.pearlPendantWorn)],
  },
];

async function main() {
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('Seeding categories...');
  const categoryMap = new Map<string, string>();
  for (const category of categories) {
    const created = await prisma.category.create({ data: category });
    categoryMap.set(created.slug, created.id);
  }

  console.log('Seeding products...');
  let index = 0;
  for (const product of products) {
    const { category, images, ...rest } = product;
    // Stagger createdAt so "New Arrivals" ordering is deterministic after seeding.
    const createdAt = new Date(Date.now() - (products.length - index) * 60 * 60 * 1000);
    index += 1;

    await prisma.product.create({
      data: {
        ...rest,
        slug: rest.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-'),
        categoryId: categoryMap.get(category)!,
        inStock: rest.stock > 0,
        createdAt,
        images: {
          create: images.map((url, i) => ({
            url,
            alt: rest.title,
            isPrimary: i === 0,
            position: i,
          })),
        },
      },
    });
  }

  console.log('Seeding a sample order...');
  const sample = await prisma.product.findFirst({ include: { images: true } });
  if (sample) {
    await prisma.order.create({
      data: {
        orderNumber: 'ZYR-DEMO01',
        customerName: 'Nadia Rahman',
        phone: '+8801712345678',
        address: 'House 14, Road 7, Banani',
        city: 'Dhaka',
        subtotal: sample.price * 2,
        total: sample.price * 2,
        status: 'Pending',
        items: {
          create: [
            {
              productId: sample.id,
              title: sample.title,
              imageUrl: sample.images[0]?.url,
              unitPrice: sample.price,
              quantity: 2,
              lineTotal: sample.price * 2,
            },
          ],
        },
      },
    });
  }

  const { ensureAdmin, ADMIN_USERNAME } = await import('../src/admin');
  await ensureAdmin();
  console.log(`Admin ready — ${ADMIN_USERNAME}`);

  console.log(`Done — ${categories.length} categories, ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
