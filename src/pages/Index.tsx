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

// Mock cart state - will integrate with Shopify
const mockCartItems = [
  {
    id: "1",
    name: "Premium Leather Strap - Apple Watch 44mm",
    variant: "Brown / 44mm",
    price: 29.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1434493789847-2a75b0eb32ac?w=200&h=200&fit=crop",
  },
];

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(mockCartItems);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(items => items.filter(item => item.id !== id));
    } else {
      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>StrapHub - Premium Smartwatch Straps | UK's Best Selection</title>
        <meta name="description" content="Shop premium smartwatch straps for Apple Watch, Samsung, Garmin & more. Free UK shipping over £25. 100-day returns. Same-day dispatch." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header 
          cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
          onCartClick={() => setIsCartOpen(true)} 
        />
        
        <main className="flex-1">
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
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemoveItem}
        />
      </div>
    </>
  );
};

export default Index;
