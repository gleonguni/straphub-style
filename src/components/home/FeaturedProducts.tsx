import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { ShopifyProductCard } from "@/components/products/ShopifyProductCard";
import { Button } from "@/components/ui/button";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

export function FeaturedProducts() {
  const { data: products, isLoading, error } = useShopifyProducts(4);

  if (isLoading) {
    return (
      <section className="py-14 md:py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <section className="py-14 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              {error ? "Failed to load products" : "No products found"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 md:py-20 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-1">Best Sellers</h2>
            <p className="text-muted-foreground">Our most popular straps</p>
          </div>
          <Button asChild variant="ghost" className="hidden md:flex">
            <Link to="/collections/all" className="flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.node.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ShopifyProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button asChild>
            <Link to="/collections/all">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
