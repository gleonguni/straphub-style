import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Minus, Plus, Truck, RefreshCw, Shield, ChevronDown, Loader2 } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ShopifyProductCard } from "@/components/products/ShopifyProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShopifyProduct, useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, calculateDiscount, CartItem } from "@/lib/shopify";
import { toast } from "sonner";

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");

  const { data: product, isLoading, error } = useShopifyProduct(id || "");
  const { data: relatedProducts } = useShopifyProducts(4);
  const { addItem } = useCartStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

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
            <Button asChild>
              <Link to="/collections/all">Browse All Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const price = selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount;
  const discount = calculateDiscount(price, compareAtPrice);
  const hasFreeShipping = parseFloat(price) >= 25;
  const images = product.images.edges;

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
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.title} x ${quantity}`,
      position: "top-center",
    });
  };

  const accordionSections = [
    { id: "description", title: "Description", content: product.description || "No description available." },
    { id: "shipping", title: "Shipping & Returns", content: "Free UK shipping on orders over £25. Same-day dispatch on orders placed before 9pm. 100-day hassle-free returns." },
  ];

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
                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                  <img 
                    src={images[selectedImage]?.node.url || '/placeholder.svg'}
                    alt={images[selectedImage]?.node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                          selectedImage === index ? "border-primary" : "border-transparent"
                        )}
                      >
                        <img src={image.node.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {product.vendor || "StrapHub"}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={cn(
                    "text-2xl font-bold",
                    discount > 0 && "text-sale"
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
                  {selectedVariant?.availableForSale && (
                    <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded">In Stock</span>
                  )}
                </div>

                {/* Variant Selection */}
                {product.options.length > 0 && product.options[0].name !== "Title" && (
                  <div className="mb-6">
                    {product.options.map((option) => (
                      <div key={option.name} className="mb-4">
                        <p className="text-sm font-medium mb-3">
                          {option.name}: <span className="text-muted-foreground">{selectedVariant?.selectedOptions.find(o => o.name === option.name)?.value}</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => {
                            const variantIndex = product.variants.edges.findIndex(v => 
                              v.node.selectedOptions.some(o => o.name === option.name && o.value === value)
                            );
                            const isSelected = selectedVariant?.selectedOptions.some(o => o.name === option.name && o.value === value);
                            
                            return (
                              <button
                                key={value}
                                onClick={() => variantIndex >= 0 && setSelectedVariantIndex(variantIndex)}
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
                    ))}
                  </div>
                )}

                {/* Quantity & Add to Cart */}
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center border border-border rounded-lg">
                    <button 
                      className="qty-btn rounded-l-lg"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      className="qty-btn rounded-r-lg"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant?.availableForSale}
                  >
                    {selectedVariant?.availableForSale ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>

                {/* Trust Icons */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-8">
                  <div className="text-center">
                    <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs">Free Shipping £25+</p>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs">100-Day Returns</p>
                  </div>
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs">Secure Checkout</p>
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="border-t border-border">
                  {accordionSections.map((section) => (
                    <div key={section.id} className="border-b border-border">
                      <button
                        className="flex items-center justify-between w-full py-4 font-medium"
                        onClick={() => setExpandedSection(
                          expandedSection === section.id ? null : section.id
                        )}
                      >
                        {section.title}
                        <ChevronDown className={cn(
                          "w-4 h-4 transition-transform",
                          expandedSection === section.id && "rotate-180"
                        )} />
                      </button>
                      {expandedSection === section.id && (
                        <div className="pb-4 text-sm text-muted-foreground whitespace-pre-line animate-fade-in">
                          {section.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold mb-6">You may also like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts
                    .filter(p => p.node.handle !== id)
                    .slice(0, 4)
                    .map((product) => (
                      <ShopifyProductCard
                        key={product.node.id}
                        product={product}
                      />
                    ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />

        {/* Sticky Add to Cart Mobile */}
        <div className="sticky-atc">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold">{formatPrice(price)}</p>
              <p className="text-xs text-muted-foreground">
                {selectedVariant?.title !== "Default Title" ? selectedVariant?.title : ""}
              </p>
            </div>
            <Button 
              className="flex-1" 
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              Add to Cart
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
