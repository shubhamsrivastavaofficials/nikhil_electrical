import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ---------- Admin ----------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@newnikhilelectrical.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Nikhil (Admin)',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Admin ready → ${adminEmail} / (password from SEED_ADMIN_PASSWORD)`);

  // ---------- Services ----------
  const services = [
    {
      title: 'Motor Binding & Rewinding',
      slug: 'motor-binding-rewinding',
      description:
        'Expert rewinding and binding for single-phase & three-phase motors — water pump motors, agricultural motors, and industrial motors. Precision coil work with tested output.',
      icon: 'CircuitBoard',
      sortOrder: 1,
    },
    {
      title: 'Fan Binding & Fan Repair',
      slug: 'fan-binding-repair',
      description:
        'Ceiling fan, table fan and exhaust fan binding and complete repair — noise fix, speed issues, capacitor change and full servicing.',
      icon: 'Fan',
      sortOrder: 2,
    },
    {
      title: 'Electrical Wire Wholesale',
      slug: 'electrical-wire-wholesale',
      description:
        'Bulk and wholesale supply of ISI-marked copper wires and cables for homes, shops and industrial use at competitive dealer rates.',
      icon: 'Cable',
      sortOrder: 3,
    },
    {
      title: 'Scrap Copper & Wire Purchase',
      slug: 'scrap-copper-purchase',
      description:
        'We purchase scrap copper, old motor coils and waste wiring at fair market rates — quick weighing and instant cash payment.',
      icon: 'Recycle',
      sortOrder: 4,
    },
    {
      title: 'House Wiring',
      slug: 'house-wiring',
      description:
        'Complete concealed & open house wiring for new construction and rewiring for old homes, done to safety-first standards.',
      icon: 'Home',
      sortOrder: 5,
    },
    {
      title: 'Electrical Repair Services',
      slug: 'electrical-repair',
      description:
        'General electrical fault-finding and repair — short circuits, switchboard issues, MCB tripping, and appliance connections.',
      icon: 'Wrench',
      sortOrder: 6,
    },
    {
      title: 'LED Lights, Switches & MCB',
      slug: 'led-switches-mcb',
      description:
        'Wide range of branded LED lights, modular switches, MCBs, distribution boards and electrical accessories in stock.',
      icon: 'Lightbulb',
      sortOrder: 7,
    },
    {
      title: 'Complete Electrical Solutions',
      slug: 'complete-electrical-solutions',
      description:
        'From design to installation — one-stop electrical solutions for homes, shops, and small industries in Lalganj & Rae Bareli.',
      icon: 'ShieldCheck',
      sortOrder: 8,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
  }

  // ---------- Products ----------
  const products = [
    { name: 'Copper Armoured Wire (1.5 sq mm)', slug: 'copper-wire-1-5', category: 'Wires', description: 'ISI-marked, high-conductivity copper wire suitable for domestic wiring.', sortOrder: 1, isFeatured: true },
    { name: 'Copper Wire (2.5 sq mm)', slug: 'copper-wire-2-5', category: 'Wires', description: 'Heavy-duty copper wire for higher load circuits and industrial use.', sortOrder: 2 },
    { name: 'Modular Switch Plate', slug: 'modular-switch-plate', category: 'Switches', description: 'Sleek modular switches with anti-flame polycarbonate body.', sortOrder: 3, isFeatured: true },
    { name: 'MCB Single Pole', slug: 'mcb-single-pole', category: 'MCB', description: 'Miniature circuit breaker for overload and short-circuit protection.', sortOrder: 4 },
    { name: 'MCB Distribution Box (8-way)', slug: 'mcb-distribution-box-8way', category: 'MCB', description: 'Metal distribution board with 8-way MCB mounting.', sortOrder: 5 },
    { name: 'LED Bulb 9W', slug: 'led-bulb-9w', category: 'LED Lights', description: 'Energy-saving 9W LED bulb, cool daylight & warm white options.', sortOrder: 6, isFeatured: true },
    { name: 'LED Panel Light 18W', slug: 'led-panel-18w', category: 'LED Lights', description: 'Slim ceiling panel light for homes, shops and offices.', sortOrder: 7 },
    { name: 'Ceiling Fan (High Speed)', slug: 'ceiling-fan-high-speed', category: 'Fans', description: 'High-speed ceiling fans with rewinding & repair support included.', sortOrder: 8, isFeatured: true },
    { name: 'Exhaust Fan', slug: 'exhaust-fan', category: 'Fans', description: 'Durable exhaust fans for kitchens and bathrooms.', sortOrder: 9 },
    { name: 'PVC Conduit Pipe & Accessories', slug: 'pvc-conduit-pipe', category: 'Accessories', description: 'Complete range of conduit pipes, junction boxes and clamps.', sortOrder: 10 },
    { name: 'Electrical Tape & Connectors', slug: 'electrical-tape-connectors', category: 'Accessories', description: 'Insulation tape, wire connectors and joint accessories.', sortOrder: 11 },
    { name: 'Capacitors (Fan & Motor)', slug: 'capacitors-fan-motor', category: 'Accessories', description: 'Genuine capacitors for fans and single-phase motors.', sortOrder: 12 },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  // ---------- Testimonials ----------
  const testimonials = [
    { name: 'Rakesh Kumar', location: 'Lalganj, Rae Bareli', message: 'Motor binding ka kaam bahut accha aur time par hua. Rate bhi fair tha. Highly recommended for motor repair.', rating: 5, sortOrder: 1 },
    { name: 'Suresh Verma', location: 'Rae Bareli', message: 'Wholesale wire lena tha shop ke liye — best quality aur genuine ISI mark wire mila. Ab yahi se leta hoon.', rating: 5, sortOrder: 2 },
    { name: 'Anita Devi', location: 'Tikona Park, Lalganj', message: 'Ghar ki wiring bahut safai se ki, koi problem nahi aayi aaj tak. Staff bhi bahut helpful hai.', rating: 5, sortOrder: 3 },
    { name: 'Mohammad Irfan', location: 'Lalganj', message: 'Fan repair ke liye gaya tha, same day mil gaya theek hoke. Price bhi reasonable.', rating: 4, sortOrder: 4 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
