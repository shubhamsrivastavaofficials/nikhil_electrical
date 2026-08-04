import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Products from '@/components/home/Products';
import Gallery from '@/components/home/Gallery';
import About from '@/components/home/About';
import Testimonials from '@/components/home/Testimonials';
import CtaBanner from '@/components/home/CtaBanner';
import Contact from '@/components/home/Contact';

export const revalidate = 60; // ISR: refresh content every 60s so admin edits show up fast

async function getHomeData() {
  try {
    const [services, products, gallery, testimonials] = await Promise.all([
      prisma.service.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.product.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' }, take: 12 }),
      prisma.testimonial.findMany({ where: { isApproved: true }, orderBy: { sortOrder: 'asc' } }),
    ]);
    return { services, products, gallery, testimonials };
  } catch {
    // DB not yet connected/seeded — render gracefully with empty state
    return { services: [], products: [], gallery: [], testimonials: [] };
  }
}

export default async function HomePage() {
  const { services, products, gallery, testimonials } = await getHomeData();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services services={services} />
        <WhyChooseUs />
        <Products products={products} />
        <Gallery images={gallery} />
        <About />
        <Testimonials testimonials={testimonials} />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
