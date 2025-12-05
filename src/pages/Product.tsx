import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Truck, RefreshCw, Shield, ChevronDown, ChevronLeft, ChevronRight, Loader2, Check, X, ThumbsUp, ThumbsDown, Clock, Leaf, Package } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { TrustGuaranteeSection } from "@/components/home/TrustGuaranteeSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, calculateDiscount, CartItem } from "@/lib/shopify";
import { toast } from "sonner";

// Countdown timer hook
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(20, 0, 0, 0); // 8pm cutoff

      // If past 8pm, set cutoff to next day
      if (now > cutoff) {
        cutoff.setDate(cutoff.getDate() + 1);
      }

      const diff = cutoff.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return timeLeft;
}

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);

  const { data: product, isLoading, error } = useShopifyProduct(id || "");
  const { data: relatedProducts } = useShopifyProducts(8);
  const { addItem } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const countdown = useCountdown();

  // Get the selected variant
  const selectedVariant = product?.variants.edges[selectedVariantIndex]?.node;

  // Filter images to ONLY show selected variant image
  const filteredImages = useMemo(() => {
    if (!product) return [];
    
    // If variant has a specific image, ONLY show that image
    if (selectedVariant?.image?.url) {
      const variantImageUrl = selectedVariant.image.url;
      const variantImage = product.images.edges.find(img => img.node.url === variantImageUrl);
      if (variantImage) {
        return [variantImage];
      }
    }
    
    // Fallback to first image only if no variant image
    return product.images.edges.length > 0 ? [product.images.edges[0]] : [];
  }, [product, selectedVariant]);

  // Reset image selection when variant changes
  useEffect(() => {
    setSelectedImage(0);
    setMobileImageIndex(0);
  }, [selectedVariantIndex]);

  // Smart variant selection that preserves other options
  const handleOptionChange = (optionName: string, optionValue: string) => {
    if (!product) return;
    
    // Get current selected options
    const currentOptions = selectedVariant?.selectedOptions || [];
    
    // Build new options array
    const newOptions = currentOptions.map(opt => 
      opt.name === optionName ? { ...opt, value: optionValue } : opt
    );
    
    // Find variant that matches all new options
    const matchingVariantIndex = product.variants.edges.findIndex(v => 
      v.node.selectedOptions.every(opt => 
        newOptions.find(newOpt => newOpt.name === opt.name && newOpt.value === opt.value)
      )
    );
    
    if (matchingVariantIndex >= 0) {
      setSelectedVariantIndex(matchingVariantIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product not found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button asChild className="bg-success hover:bg-success/90">
              <Link to="/collections/all">Browse All Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const price = selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount;
  const discount = calculateDiscount(price, compareAtPrice);
  const hasFreeShipping = parseFloat(price) >= 25;
  const isInStock = selectedVariant?.availableForSale ?? true;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem: CartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: product.title,
      position: "top-center",
    });
  };

  // Get variant image for color swatches
  const getVariantImage = (optionValue: string, optionName: string) => {
    const variant = product.variants.edges.find(v =>
      v.node.selectedOptions.some(o => o.name === optionName && o.value === optionValue)
    );
    return variant?.node.image?.url;
  };

  // Parse description to preserve formatting with proper HTML parsing
  const formatDescription = (description: string) => {
    if (!description) return null;
    
    // Check if description contains HTML tags
    const hasHtml = /<[^>]+>/.test(description);
    
    if (hasHtml) {
      // Return formatted HTML with proper styling
      return (
        <div 
          className="prose prose-sm max-w-none text-muted-foreground
            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-4 [&_h1]:mb-2
            [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-3 [&_h3]:mb-2
            [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-foreground [&_h4]:mt-3 [&_h4]:mb-1
            [&_p]:mb-3 [&_p]:leading-relaxed
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
            [&_li]:text-muted-foreground
            [&_strong]:text-foreground [&_strong]:font-semibold
            [&_br]:block [&_br]:mb-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      );
    }
    
    // Plain text fallback - split by line breaks and process
    const lines = description.split(/\n+/).filter(line => line.trim());
    
    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          const trimmed = line.trim();
          
          // Check if it looks like a heading (short, ends with colon, or all caps)
          if (trimmed.length < 50 && (trimmed.endsWith(':') || trimmed === trimmed.toUpperCase())) {
            return <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">{trimmed}</h4>;
          }
          
          // Check if it's a bullet point
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
            return <li key={index} className="ml-4 text-muted-foreground list-disc">{trimmed.substring(1).trim()}</li>;
          }
          
          return <p key={index} className="text-muted-foreground leading-relaxed">{trimmed}</p>;
        })}
      </div>
    );
  };

  // Mobile carousel navigation
  const nextMobileImage = () => {
    setMobileImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevMobileImage = () => {
    setMobileImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  // Get main product image for compatibility badge
  const mainProductImage = filteredImages[0]?.node.url || '/placeholder.svg';

  // Handle quick add for related products
  const handleQuickAdd = (relatedProduct: typeof relatedProducts[0]) => {
    const firstVariant = relatedProduct.node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem: CartItem = {
      product: relatedProduct,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: relatedProduct.node.title,
      position: "top-center",
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.title} | StrapHub UK</title>
        <meta name="description" content={`${product.title} - ${formatPrice(price)}. ${product.description?.slice(0, 150) || ""}...`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          {/* Breadcrumbs */}
          <div className="container py-4">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/collections/all" className="hover:text-foreground">All Straps</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.title}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="container pb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Mobile Carousel */}
                <div className="md:hidden relative">
                  <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                    <img 
                      src={filteredImages[mobileImageIndex]?.node.url || '/placeholder.svg'}
                      alt={filteredImages[mobileImageIndex]?.node.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {filteredImages.length > 1 && (
                    <>
                      <button 
                        onClick={prevMobileImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center shadow-md"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={nextMobileImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 rounded-full flex items-center justify-center shadow-md"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {filteredImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setMobileImageIndex(index)}
                            className={cn(
                              "w-2 h-2 rounded-full transition-colors",
                              mobileImageIndex === index ? "bg-primary" : "bg-background/60"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Desktop Gallery */}
                <div className="hidden md:block">
                  <div className="aspect-square bg-muted rounded-xl overflow-hidden border border-border">
                    <img 
                      src={filteredImages[selectedImage]?.node.url || '/placeholder.svg'}
                      alt={filteredImages[selectedImage]?.node.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {filteredImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                      {filteredImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={cn(
                            "aspect-square rounded-lg overflow-hidden border-2 transition-all",
                            selectedImage === index 
                              ? "border-primary ring-2 ring-primary/20" 
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <img src={image.node.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.vendor || "StrapHub"}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={cn(
                    "text-2xl font-bold",
                    discount > 0 && "text-success"
                  )}>
                    {formatPrice(price)}
                  </span>
                  {compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price) && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(compareAtPrice)}
                      </span>
                      <span className="badge-sale">Save {discount}%</span>
                    </>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {hasFreeShipping && (
                    <span className="badge-free-shipping flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Free Shipping
                    </span>
                  )}
                  {isInStock ? (
                    <span className="badge-in-stock">
                      <span className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-success-foreground" />
                      </span>
                      In Stock
                    </span>
                  ) : (
                    <span className="badge-out-of-stock">
                      <span className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-destructive-foreground" />
                      </span>
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Variant Selection */}
                {product.options.length > 0 && product.options[0].name !== "Title" && (
                  <div className="mb-6">
                    {product.options.map((option) => {
                      const isColorOption = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');
                      
                      return (
                        <div key={option.name} className="mb-4">
                          <p className="text-sm font-medium mb-3">
                            {option.name}: <span className="text-muted-foreground">
                              {selectedVariant?.selectedOptions.find(o => o.name === option.name)?.value}
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {option.values.map((value) => {
                              const isSelected = selectedVariant?.selectedOptions.some(
                                o => o.name === option.name && o.value === value
                              );
                              const variantImage = isColorOption ? getVariantImage(value, option.name) : null;
                              
                              if (isColorOption && variantImage) {
                                // Image-based swatch for colors
                                return (
                                  <button
                                    key={value}
                                    onClick={() => handleOptionChange(option.name, value)}
                                    className={cn(
                                      "w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                                      isSelected 
                                        ? "border-primary ring-2 ring-primary/20" 
                                        : "border-border hover:border-primary/50"
                                    )}
                                    title={value}
                                  >
                                    <img src={variantImage} alt={value} className="w-full h-full object-cover" />
                                  </button>
                                );
                              }
                              
                              // Text-based button for non-color options or colors without images
                              return (
                                <button
                                  key={value}
                                  onClick={() => handleOptionChange(option.name, value)}
                                  className={cn(
                                    "px-4 py-2 border rounded-lg text-sm font-medium transition-colors",
                                    isSelected 
                                      ? "border-primary bg-primary text-primary-foreground" 
                                      : "border-border hover:border-primary"
                                  )}
                                >
                                  {value}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add to Cart */}
                <Button 
                  size="lg" 
                  className={cn(
                    "w-full mb-4",
                    isInStock ? "bg-success hover:bg-success/90" : "bg-muted text-muted-foreground"
                  )}
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                >
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                {/* Compatible With Badge */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                    <img src={mainProductImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">This product is compatible with</p>
                    <p className="text-sm font-medium text-success">
                      {product.title.toLowerCase().includes('apple') ? 'Apple Watch' : 
                       product.title.toLowerCase().includes('samsung') ? 'Samsung Galaxy Watch' :
                       product.title.toLowerCase().includes('garmin') ? 'Garmin Watches' :
                       'Multiple Watch Brands'}
                    </p>
                  </div>
                </div>

                {/* Promotional Box with Countdown */}
                <div className="bg-sale/15 border border-sale/40 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sale font-semibold">
                      <Clock className="w-4 h-4" />
                      Same day shipping?
                    </div>
                    <div className="flex items-center gap-1 bg-background rounded px-2 py-1">
                      <span className="font-mono text-sm font-bold">{String(countdown.hours).padStart(2, '0')}</span>
                      <span className="text-muted-foreground">:</span>
                      <span className="font-mono text-sm font-bold">{String(countdown.minutes).padStart(2, '0')}</span>
                      <span className="text-muted-foreground">:</span>
                      <span className="font-mono text-sm font-bold">{String(countdown.seconds).padStart(2, '0')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-1">Order within the countdown for same-day dispatch!</p>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-success" />
                      <span>Free shipping on orders over £25</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="w-4 h-4 text-success" />
                      <span>30-day return policy, free exchanges</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="w-4 h-4 text-success" />
                      <span>100% sustainable delivery using letterbox parcel</span>
                    </div>
                  </div>
                </div>

                {/* Trust Icons */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-6">
                  <div className="text-center">
                    <Truck className="w-5 h-5 mx-auto mb-1 text-success" />
                    <p className="text-xs">Free Shipping £25+</p>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="w-5 h-5 mx-auto mb-1 text-success" />
                    <p className="text-xs">30-Day Returns</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-success" />
                    <p className="text-xs">Secure Checkout</p>
                  </div>
                </div>

                {/* Description Accordion */}
                <div className="border-t border-border">
                  <div className="border-b border-border">
                    <button
                      className="flex items-center justify-between w-full py-4 font-medium"
                      onClick={() => setExpandedSection(expandedSection === "description" ? null : "description")}
                    >
                      Description
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        expandedSection === "description" && "rotate-180"
                      )} />
                    </button>
                    <div className={cn(
                      "overflow-hidden transition-all duration-300",
                      expandedSection === "description" ? "max-h-[800px] pb-4" : "max-h-0"
                    )}>
                      <div className="text-sm">
                        {formatDescription(product.description || "No description available.")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pros and Cons - Always Open */}
                <div className="border-b border-border py-4">
                  <h3 className="font-medium mb-4">Pros & Cons</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </span>
                      <span className="text-sm">High-quality materials for lasting durability</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </span>
                      <span className="text-sm">Perfect fit guarantee with easy installation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-success" />
                      </span>
                      <span className="text-sm">Comfortable for all-day wear</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-destructive" />
                      </span>
                      <span className="text-sm">May require break-in period for optimal comfort</span>
                    </div>
                  </div>
                </div>

                {/* Product Specifications Accordion */}
                <div className="border-b border-border">
                  <button
                    className="flex items-center justify-between w-full py-4 font-medium"
                    onClick={() => setExpandedSection(expandedSection === "specs" ? null : "specs")}
                  >
                    Product Specifications
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      expandedSection === "specs" && "rotate-180"
                    )} />
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    expandedSection === "specs" ? "max-h-[500px] pb-4" : "max-h-0"
                  )}>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">
                          {product.title.toLowerCase().includes('leather') ? 'Genuine Leather' :
                           product.title.toLowerCase().includes('silicone') ? 'Premium Silicone' :
                           product.title.toLowerCase().includes('metal') ? 'Stainless Steel' :
                           product.title.toLowerCase().includes('nylon') ? 'Woven Nylon' :
                           'Premium Quality'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Compatibility</span>
                        <span className="font-medium">
                          {product.title.toLowerCase().includes('apple') ? 'Apple Watch' :
                           product.title.toLowerCase().includes('samsung') ? 'Samsung Galaxy' :
                           'Universal'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Closure Type</span>
                        <span className="font-medium">Pin & Tuck</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Water Resistant</span>
                        <span className="font-medium">
                          {product.title.toLowerCase().includes('leather') ? 'Splash Resistant' : 'Yes'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery & Returns Accordion */}
                <div className="border-b border-border">
                  <button
                    className="flex items-center justify-between w-full py-4 font-medium"
                    onClick={() => setExpandedSection(expandedSection === "shipping" ? null : "shipping")}
                  >
                    Delivery & Returns
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      expandedSection === "shipping" && "rotate-180"
                    )} />
                  </button>
                  <div className={cn(
                    "overflow-hidden transition-all duration-300",
                    expandedSection === "shipping" ? "max-h-[500px] pb-4" : "max-h-0"
                  )}>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Free UK Shipping:</strong> On orders over £25</p>
                      <p><strong className="text-foreground">Standard Delivery:</strong> 2-5 working days</p>
                      <p><strong className="text-foreground">Same-Day Dispatch:</strong> Order before 8pm</p>
                      <p><strong className="text-foreground">Returns:</strong> 30-day hassle-free returns</p>
                    </div>
                  </div>
                </div>

                {/* You May Also Like - Horizontal Cards */}
                {relatedProducts && relatedProducts.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">You might also like:</h3>
                    </div>
                    <div className="space-y-3">
                      {relatedProducts
                        .filter(p => p.node.handle !== id)
                        .slice(0, 2)
                        .map((relatedProduct) => {
                          const relatedPrice = relatedProduct.node.priceRange.minVariantPrice.amount;
                          const relatedCompareAt = relatedProduct.node.variants.edges[0]?.node.compareAtPrice?.amount;
                          const relatedDiscount = calculateDiscount(relatedPrice, relatedCompareAt);
                          
                          return (
                            <div key={relatedProduct.node.id} className="flex gap-3 p-2 border border-border rounded-lg">
                              <Link to={`/products/${relatedProduct.node.handle}`} className="w-16 h-16 flex-shrink-0">
                                <img 
                                  src={relatedProduct.node.images.edges[0]?.node.url || '/placeholder.svg'} 
                                  alt={relatedProduct.node.title}
                                  className="w-full h-full object-cover rounded"
                                />
                              </Link>
                              <div className="flex-1 min-w-0">
                                <Link to={`/products/${relatedProduct.node.handle}`}>
                                  <p className="text-sm font-medium truncate hover:text-primary">
                                    {relatedProduct.node.title}
                                  </p>
                                </Link>
                                <div className="flex items-center gap-2">
                                  <span className={cn("text-sm font-semibold", relatedDiscount > 0 && "text-success")}>
                                    {formatPrice(relatedPrice)}
                                  </span>
                                  {relatedCompareAt && parseFloat(relatedCompareAt) > parseFloat(relatedPrice) && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      {formatPrice(relatedCompareAt)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-success hover:bg-success/90 flex-shrink-0 self-center"
                                onClick={() => handleQuickAdd(relatedProduct)}
                              >
                                Add to order
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <TrustGuaranteeSection />
        </main>

        <Footer />

        {/* Sticky Add to Cart Mobile */}
        <div className="sticky-atc">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className={cn("font-semibold", discount > 0 && "text-success")}>
                {formatPrice(price)}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedVariant?.title !== "Default Title" ? selectedVariant?.title : ""}
              </p>
            </div>
            <Button 
              className={cn(
                "flex-1",
                isInStock ? "bg-success hover:bg-success/90" : "bg-muted"
              )}
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </Button>
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

export default Product;