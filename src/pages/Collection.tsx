import { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Filter, X, ChevronDown, Grid3X3, LayoutGrid } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock products - will come from Shopify
const mockProducts = [
  { id: "1", name: "Premium Leather Strap - Classic Brown", brand: "StrapHub", price: 29.99, compareAtPrice: 39.99, image: "https://images.unsplash.com/photo-1434493789847-2a75b0eb32ac?w=500&h=500&fit=crop", badge: "sale" as const },
  { id: "2", name: "Sport Silicone Band - Midnight Black", brand: "StrapHub", price: 14.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", badge: "bestseller" as const },
  { id: "3", name: "Milanese Loop - Silver", brand: "StrapHub", price: 26.99, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop" },
  { id: "4", name: "Nylon Alpine Loop - Storm Blue", brand: "StrapHub", price: 19.99, compareAtPrice: 24.99, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop", badge: "new" as const },
  { id: "5", name: "Titanium Link Bracelet", brand: "StrapHub", price: 49.99, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop" },
  { id: "6", name: "Ocean Band - Marine", brand: "StrapHub", price: 34.99, image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop" },
  { id: "7", name: "Solo Loop - Product Red", brand: "StrapHub", price: 18.99, image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop" },
  { id: "8", name: "Modern Buckle - Chalk", brand: "StrapHub", price: 32.99, compareAtPrice: 42.99, image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=500&h=500&fit=crop", badge: "sale" as const },
];

const filterOptions = {
  material: ["Silicone", "Leather", "Metal", "Nylon", "Milanese"],
  size: ["38/40mm", "42/44mm", "45/49mm"],
  color: ["Black", "White", "Brown", "Blue", "Red", "Silver", "Gold"],
  price: ["Under £15", "£15 - £25", "£25 - £40", "Over £40"],
};

const collectionNames: Record<string, string> = {
  "all": "All Straps",
  "apple-watch": "Apple Watch Straps",
  "samsung": "Samsung Watch Straps",
  "garmin": "Garmin Straps",
  "fitbit": "Fitbit Straps",
  "leather": "Leather Straps",
  "silicone": "Silicone Straps",
  "metal": "Metal & Milanese",
  "nylon": "Nylon Straps",
};

const Collection = () => {
  const { slug = "all" } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [gridSize, setGridSize] = useState<"large" | "small">("large");
  const [expandedFilter, setExpandedFilter] = useState<string | null>("material");

  const collectionName = collectionNames[slug] || "All Straps";

  return (
    <>
      <Helmet>
        <title>{collectionName} | StrapHub UK</title>
        <meta name="description" content={`Shop ${collectionName.toLowerCase()} at StrapHub. Free UK shipping over £25. 100-day returns.`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={0} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          {/* Collection Header */}
          <div className="bg-muted py-8 md:py-12">
            <div className="container">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{collectionName}</h1>
              <p className="text-muted-foreground">
                {mockProducts.length} products
              </p>
            </div>
          </div>

          <div className="container py-8">
            <div className="flex gap-8">
              {/* Desktop Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <h2 className="font-semibold mb-4">Filters</h2>
                  
                  {Object.entries(filterOptions).map(([key, options]) => (
                    <div key={key} className="filter-section">
                      <button
                        className="flex items-center justify-between w-full py-2 font-medium capitalize"
                        onClick={() => setExpandedFilter(expandedFilter === key ? null : key)}
                      >
                        {key}
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          expandedFilter === key && "rotate-180"
                        )} />
                      </button>
                      {expandedFilter === key && (
                        <div className="space-y-2 pb-2 animate-fade-in">
                          {options.map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="outline"
                    className="lg:hidden"
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>

                  <div className="flex items-center gap-4 ml-auto">
                    <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Sort by: Featured</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Newest</option>
                      <option>Best Selling</option>
                    </select>

                    <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
                      <button
                        className={cn(
                          "p-1.5 rounded",
                          gridSize === "large" && "bg-muted"
                        )}
                        onClick={() => setGridSize("large")}
                      >
                        <LayoutGrid className="w-4 h-4" />
                      </button>
                      <button
                        className={cn(
                          "p-1.5 rounded",
                          gridSize === "small" && "bg-muted"
                        )}
                        onClick={() => setGridSize("small")}
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className={cn(
                  "grid gap-4 md:gap-6",
                  gridSize === "large" 
                    ? "grid-cols-2 md:grid-cols-3" 
                    : "grid-cols-2 md:grid-cols-4"
                )}>
                  {mockProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onQuickAdd={() => console.log("Quick add:", product.id)}
                    />
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-10 text-center">
                  <Button variant="outline" size="lg">
                    Load More Products
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Mobile Filter Modal */}
        <div className={cn(
          "fixed inset-0 bg-background z-50 transform transition-transform lg:hidden",
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key} className="filter-section">
                  <button
                    className="flex items-center justify-between w-full py-2 font-medium capitalize"
                    onClick={() => setExpandedFilter(expandedFilter === key ? null : key)}
                  >
                    {key}
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      expandedFilter === key && "rotate-180"
                    )} />
                  </button>
                  {expandedFilter === key && (
                    <div className="space-y-3 pb-2">
                      {options.map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1">Clear All</Button>
              <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
            </div>
          </div>
        </div>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={[]}
          onUpdateQuantity={() => {}}
          onRemove={() => {}}
        />
      </div>
    </>
  );
};

export default Collection;
