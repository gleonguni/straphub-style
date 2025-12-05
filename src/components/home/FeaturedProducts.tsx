import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";

// Sample products - these would come from Shopify
const featuredProducts = [
  {
    id: "1",
    name: "Premium Leather Strap - Apple Watch",
    brand: "StrapHub",
    price: 29.99,
    compareAtPrice: 39.99,
    image: "https://images.unsplash.com/photo-1434493789847-2a75b0eb32ac?w=500&h=500&fit=crop",
    badge: "sale" as const,
  },
  {
    id: "2",
    name: "Sport Silicone Band - Samsung Galaxy Watch",
    brand: "StrapHub",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    badge: "bestseller" as const,
  },
  {
    id: "3",
    name: "Milanese Loop - Apple Watch 44mm",
    brand: "StrapHub",
    price: 26.99,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
  },
  {
    id: "4",
    name: "Nylon Alpine Loop - All Sizes",
    brand: "StrapHub",
    price: 19.99,
    compareAtPrice: 24.99,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop",
    badge: "new" as const,
  },
];

export function FeaturedProducts() {
  const handleQuickAdd = (productId: string) => {
    console.log("Quick add:", productId);
    // This would integrate with Shopify cart
  };

  return (
    <section className="py-14 md:py-20 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Best Sellers</h2>
            <p className="text-muted-foreground">Our most popular straps</p>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link to="/collections/bestsellers" className="flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                {...product}
                onQuickAdd={() => handleQuickAdd(product.id)}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild>
            <Link to="/collections/bestsellers">View All Best Sellers</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
