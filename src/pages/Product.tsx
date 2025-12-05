import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Minus, Plus, Truck, RefreshCw, Shield, ChevronDown, Star } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock product data - will come from Shopify
const mockProduct = {
  id: "1",
  name: "Premium Leather Strap - Apple Watch",
  brand: "StrapHub",
  price: 29.99,
  compareAtPrice: 39.99,
  description: "Elevate your Apple Watch with our premium genuine leather strap. Crafted from top-grain Italian leather, this strap combines classic elegance with modern durability.",
  features: [
    "Genuine Italian leather",
    "Stainless steel buckle",
    "Quick-release spring bars",
    "Fits all Apple Watch sizes",
    "Water-resistant coating",
  ],
  compatibility: "Apple Watch Series 1-10, SE, Ultra",
  images: [
    "https://images.unsplash.com/photo-1434493789847-2a75b0eb32ac?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=800&fit=crop",
  ],
  colors: [
    { name: "Brown", value: "#8B4513" },
    { name: "Black", value: "#1a1a1a" },
    { name: "Tan", value: "#D2B48C" },
    { name: "Navy", value: "#1e3a5f" },
  ],
  sizes: ["38/40mm", "42/44/45mm", "49mm Ultra"],
};

const relatedProducts = [
  { id: "2", name: "Sport Silicone Band - Midnight Black", brand: "StrapHub", price: 14.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop" },
  { id: "3", name: "Milanese Loop - Silver", brand: "StrapHub", price: 26.99, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop" },
  { id: "4", name: "Nylon Alpine Loop - Storm Blue", brand: "StrapHub", price: 19.99, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop" },
  { id: "5", name: "Titanium Link Bracelet", brand: "StrapHub", price: 49.99, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&h=500&fit=crop" },
];

const accordionSections = [
  { id: "description", title: "Description", content: mockProduct.description },
  { id: "features", title: "Key Features", content: mockProduct.features.map(f => `• ${f}`).join("\n") },
  { id: "compatibility", title: "Compatibility", content: mockProduct.compatibility },
  { id: "shipping", title: "Shipping & Returns", content: "Free UK shipping on orders over £25. Same-day dispatch on orders placed before 9pm. 100-day hassle-free returns." },
  { id: "reviews", title: "Reviews", content: "Be the first to write a review!" },
];

const Product = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState(mockProduct.sizes[1]);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("description");

  const discount = mockProduct.compareAtPrice 
    ? Math.round(((mockProduct.compareAtPrice - mockProduct.price) / mockProduct.compareAtPrice) * 100)
    : 0;
  const hasFreeShipping = mockProduct.price >= 25;

  return (
    <>
      <Helmet>
        <title>{mockProduct.name} | StrapHub UK</title>
        <meta name="description" content={`${mockProduct.name} - £${mockProduct.price}. ${mockProduct.description.slice(0, 150)}...`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={0} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          {/* Breadcrumbs */}
          <div className="container py-4">
            <nav className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/collections/all" className="hover:text-foreground">All Straps</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{mockProduct.name}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="container pb-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-xl overflow-hidden">
                  <img 
                    src={mockProduct.images[selectedImage]}
                    alt={mockProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {mockProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                        selectedImage === index ? "border-primary" : "border-transparent"
                      )}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:sticky lg:top-24 lg:self-start">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  {mockProduct.brand}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{mockProduct.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">No reviews yet</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={cn(
                    "text-2xl font-bold",
                    mockProduct.compareAtPrice && "text-sale"
                  )}>
                    £{mockProduct.price.toFixed(2)}
                  </span>
                  {mockProduct.compareAtPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        £{mockProduct.compareAtPrice.toFixed(2)}
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
                  <span className="bg-muted px-2 py-0.5 text-xs font-medium rounded">In Stock</span>
                </div>

                {/* Color Selection */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">
                    Color: <span className="text-muted-foreground">{selectedColor.name}</span>
                  </p>
                  <div className="flex gap-2">
                    {mockProduct.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "swatch",
                          selectedColor.name === color.name && "selected"
                        )}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">
                    Size: <span className="text-muted-foreground">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {mockProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "px-4 py-2 border rounded-lg text-sm font-medium transition-colors",
                          selectedSize === size 
                            ? "border-primary bg-primary text-primary-foreground" 
                            : "border-border hover:border-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

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
                  <Button size="lg" className="flex-1">
                    Add to Cart
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
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">You may also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onQuickAdd={() => console.log("Quick add:", product.id)}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />

        {/* Sticky Add to Cart Mobile */}
        <div className="sticky-atc">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-semibold">£{mockProduct.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{selectedColor.name} / {selectedSize}</p>
            </div>
            <Button className="flex-1">Add to Cart</Button>
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

export default Product;
