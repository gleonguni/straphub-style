import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Filter, X, ChevronDown, Grid3X3, LayoutGrid, Loader2 } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ShopifyProductCard } from "@/components/products/ShopifyProductCard";
import { TrustGuaranteeSection } from "@/components/home/TrustGuaranteeSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { ShopifyProduct } from "@/lib/shopify";

// Filter mappings for brand/material-based collections
const brandFilters: Record<string, string[]> = {
  "apple-watch": ["apple"],
  "samsung": ["samsung", "galaxy"],
  "garmin": ["garmin"],
  "fitbit": ["fitbit"],
  "huawei": ["huawei"],
  "xiaomi": ["xiaomi", "mi band"],
  "amazfit": ["amazfit"],
  "google": ["google", "pixel"],
  "polar": ["polar"],
  "fossil": ["fossil"],
  "tomtom": ["tomtom"],
  "universal": ["universal"],
};

const materialFilters: Record<string, string[]> = {
  "silicone": ["silicone", "sport", "rubber"],
  "leather": ["leather", "genuine leather"],
  "metal": ["metal", "stainless", "steel", "milanese"],
  "nylon": ["nylon", "woven", "fabric"],
  "milanese": ["milanese", "mesh", "loop"],
};

const filterOptions = {
  brand: ["Apple", "Samsung", "Garmin", "Fitbit", "Huawei", "Xiaomi", "Google", "Polar", "Fossil"],
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
  "huawei": "Huawei Watch Straps",
  "xiaomi": "Xiaomi Watch Straps",
  "amazfit": "Amazfit Watch Straps",
  "google": "Google Pixel Watch Straps",
  "polar": "Polar Watch Straps",
  "fossil": "Fossil Watch Straps",
  "tomtom": "TomTom Watch Straps",
  "universal": "Universal Watch Straps",
  "leather": "Leather Straps",
  "silicone": "Silicone Straps",
  "metal": "Metal & Milanese",
  "nylon": "Nylon Straps",
  "milanese": "Milanese Loop Straps",
  "accessories": "Watch Accessories",
  "accessories-apple": "Apple Watch Accessories",
  "accessories-samsung": "Samsung Watch Accessories",
  "accessories-universal": "Universal Accessories",
  "new-arrivals": "New Arrivals",
  "bestsellers": "Best Sellers",
  "sale": "Sale Items",
};

// Filter products based on collection slug
function filterProductsByCollection(products: ShopifyProduct[], slug: string): ShopifyProduct[] {
  if (slug === "all") return products;
  
  // Check if it's a brand-based collection
  const brandKeywords = brandFilters[slug];
  if (brandKeywords) {
    return products.filter(product => {
      const searchText = `${product.node.title} ${product.node.description} ${product.node.vendor}`.toLowerCase();
      return brandKeywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }
  
  // Check if it's a material-based collection
  const materialKeywords = materialFilters[slug];
  if (materialKeywords) {
    return products.filter(product => {
      const searchText = `${product.node.title} ${product.node.description}`.toLowerCase();
      // Also check variant titles for material info
      const variantText = product.node.variants.edges.map(v => v.node.title).join(' ').toLowerCase();
      const fullText = `${searchText} ${variantText}`;
      return materialKeywords.some(keyword => fullText.includes(keyword.toLowerCase()));
    });
  }
  
  // Special collections
  if (slug === "accessories") {
    return products.filter(product => {
      const searchText = `${product.node.title} ${product.node.description}`.toLowerCase();
      return searchText.includes("accessor") || searchText.includes("charger") || searchText.includes("case") || searchText.includes("stand");
    });
  }
  
  if (slug === "sale") {
    return products.filter(product => {
      const compareAtPrice = product.node.compareAtPriceRange?.minVariantPrice?.amount;
      const price = product.node.priceRange.minVariantPrice.amount;
      return compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);
    });
  }
  
  return products;
}

// Apply additional filters
function applyFilters(products: ShopifyProduct[], selectedFilters: Record<string, string[]>): ShopifyProduct[] {
  let filtered = [...products];
  
  // Brand filter
  if (selectedFilters.brand && selectedFilters.brand.length > 0) {
    filtered = filtered.filter(product => {
      const searchText = `${product.node.title} ${product.node.description} ${product.node.vendor}`.toLowerCase();
      return selectedFilters.brand.some(brand => searchText.includes(brand.toLowerCase()));
    });
  }
  
  // Material filter
  if (selectedFilters.material && selectedFilters.material.length > 0) {
    filtered = filtered.filter(product => {
      const searchText = `${product.node.title} ${product.node.description}`.toLowerCase();
      const variantText = product.node.variants.edges.map(v => v.node.title).join(' ').toLowerCase();
      const fullText = `${searchText} ${variantText}`;
      return selectedFilters.material.some(material => fullText.includes(material.toLowerCase()));
    });
  }
  
  // Color filter
  if (selectedFilters.color && selectedFilters.color.length > 0) {
    filtered = filtered.filter(product => {
      const searchText = `${product.node.title} ${product.node.description}`.toLowerCase();
      const variantText = product.node.variants.edges.map(v => v.node.title).join(' ').toLowerCase();
      const fullText = `${searchText} ${variantText}`;
      return selectedFilters.color.some(color => fullText.includes(color.toLowerCase()));
    });
  }
  
  // Price filter
  if (selectedFilters.price && selectedFilters.price.length > 0) {
    filtered = filtered.filter(product => {
      const price = parseFloat(product.node.priceRange.minVariantPrice.amount);
      return selectedFilters.price.some(range => {
        if (range === "Under £15") return price < 15;
        if (range === "£15 - £25") return price >= 15 && price <= 25;
        if (range === "£25 - £40") return price > 25 && price <= 40;
        if (range === "Over £40") return price > 40;
        return true;
      });
    });
  }
  
  return filtered;
}

// Sort products
function sortProducts(products: ShopifyProduct[], sortBy: string): ShopifyProduct[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => 
        parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount)
      );
    case "price-high":
      return sorted.sort((a, b) => 
        parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount)
      );
    case "name-az":
      return sorted.sort((a, b) => a.node.title.localeCompare(b.node.title));
    case "name-za":
      return sorted.sort((a, b) => b.node.title.localeCompare(a.node.title));
    default:
      return sorted;
  }
}

const Collection = () => {
  const { slug = "all" } = useParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [gridSize, setGridSize] = useState<"large" | "small">("large");
  const [expandedFilter, setExpandedFilter] = useState<string | null>("brand");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("featured");

  const totalItems = useCartStore((state) => state.getTotalItems());
  const { data: products, isLoading, error } = useShopifyProducts(50);
  
  const collectionName = collectionNames[slug] || "All Straps";

  // Filter and sort products
  const displayedProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = filterProductsByCollection(products, slug);
    filtered = applyFilters(filtered, selectedFilters);
    filtered = sortProducts(filtered, sortBy);
    
    return filtered;
  }, [products, slug, selectedFilters, sortBy]);

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
  };

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

  return (
    <>
      <Helmet>
        <title>{collectionName} | StrapHub UK</title>
        <meta name="description" content={`Shop ${collectionName.toLowerCase()} at StrapHub. Free UK shipping over £25. 100-day returns.`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          {/* Collection Header */}
          <div className="bg-muted py-8 md:py-12">
            <div className="container">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{collectionName}</h1>
              <p className="text-muted-foreground">
                {isLoading ? "Loading..." : `${displayedProducts.length} products`}
              </p>
            </div>
          </div>

          <div className="container py-8">
            <div className="flex gap-8">
              {/* Desktop Filters */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">Filters</h2>
                    {hasActiveFilters && (
                      <button 
                        onClick={clearAllFilters}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  
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
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                checked={selectedFilters[key]?.includes(option) || false}
                                onChange={() => handleFilterChange(key, option)}
                              />
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
                    {hasActiveFilters && (
                      <span className="ml-1 bg-primary text-primary-foreground text-xs px-1.5 rounded-full">
                        {Object.values(selectedFilters).flat().length}
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center gap-4 ml-auto">
                    <select 
                      className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name-az">Name: A to Z</option>
                      <option value="name-za">Name: Z to A</option>
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

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground">Failed to load products</p>
                  </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && displayedProducts.length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-muted-foreground mb-4">No products found</p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearAllFilters}>
                        Clear filters
                      </Button>
                    )}
                  </div>
                )}

                {/* Product Grid */}
                {displayedProducts.length > 0 && (
                  <div className={cn(
                    "grid gap-4 md:gap-6",
                    gridSize === "large" 
                      ? "grid-cols-2 md:grid-cols-3" 
                      : "grid-cols-2 md:grid-cols-4"
                  )}>
                    {displayedProducts.map((product) => (
                      <ShopifyProductCard
                        key={product.node.id}
                        product={product}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <TrustGuaranteeSection />
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
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                            checked={selectedFilters[key]?.includes(option) || false}
                            onChange={() => handleFilterChange(key, option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1" onClick={clearAllFilters}>
                Clear All
              </Button>
              <Button className="flex-1 bg-success hover:bg-success/90" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </>
  );
};

export default Collection;