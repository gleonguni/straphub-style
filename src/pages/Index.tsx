import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustSection } from "@/components/home/TrustSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { useCartStore } from "@/stores/cartStore";

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <Helmet>
        <title>StrapHub - Premium Smartwatch Straps | UK's Best Selection</title>
        <meta name="description" content="Shop premium smartwatch straps for Apple Watch, Samsung, Garmin & more. Free UK shipping over £25. 30-day returns. Same-day dispatch." />
      </Helmet>

      <div className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-full">
        <AnnouncementBar />
        <Header 
          cartCount={totalItems} 
          onCartClick={() => setIsCartOpen(true)} 
        />
        
        <main className="flex-1 overflow-x-hidden">
          <HeroSection />
          <TrustSection />
          <FeaturedCollections />
          <BrandShowcase />
          <FeaturedProducts />
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </>
  );
};

export default Index;
