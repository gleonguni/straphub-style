import { X, Minus, Plus, ShoppingBag, Truck, Loader2, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, ShopifyProduct, CartItem, isAccessory, getDeviceCompatibility } from "@/lib/shopify";
import { toast } from "sonner";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 25;

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, isLoading, updateQuantity, removeItem, createCheckout, addItem } = useCartStore();
  const { data: allProducts } = useShopifyProducts(50);
  
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const currencyCode = items[0]?.price.currencyCode || 'GBP';

  // Get accessory recommendations based on cart items - must match exact device compatibility
  const accessoryRecommendations = useMemo(() => {
    if (!allProducts || items.length === 0) return [];
    
    // Get brands AND models from cart items for precise matching
    const cartCompatibility: Array<{ brand: string; models: string[] }> = [];
    items.forEach(item => {
      const compat = getDeviceCompatibility(item.product.node.title);
      if (compat.brand !== 'universal') {
        cartCompatibility.push(compat);
      }
    });
    
    // Get variant IDs already in cart
    const cartVariantIds = new Set(items.map(i => i.variantId));
    
    // Find accessories that match cart items precisely
    const accessories = allProducts.filter(p => {
      const isAcc = isAccessory(p.node.title, p.node.description);
      if (!isAcc) return false;
      
      // Check if any variant is already in cart
      const hasInCart = p.node.variants.edges.some(v => cartVariantIds.has(v.node.id));
      if (hasInCart) return false;
      
      // If no cart items with brand preference, show all accessories
      if (cartCompatibility.length === 0) return true;
      
      // Check if accessory matches cart items
      const accCompat = getDeviceCompatibility(p.node.title);
      
      // Accessory must match at least one cart item's brand
      const matchesBrand = cartCompatibility.some(cartItem => 
        accCompat.brand === cartItem.brand || accCompat.brand === 'universal'
      );
      
      if (!matchesBrand) return false;
      
      // If accessory has specific models and cart item has specific models, they should overlap
      if (accCompat.models.length > 0) {
        const hasModelMatch = cartCompatibility.some(cartItem => {
          // If cart item has no specific models, brand match is enough
          if (cartItem.models.length === 0) return true;
          // Check for model overlap
          return accCompat.models.some(accModel => 
            cartItem.models.some(cartModel => {
              // Normalize for comparison
              const accNum = accModel.replace(/\D/g, '');
              const cartNum = cartModel.replace(/\D/g, '');
              return accNum === cartNum;
            })
          );
        });
        if (!hasModelMatch) return false;
      }
      
      return true;
    });
    
    return accessories.slice(0, 2);
  }, [allProducts, items]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      console.log('Starting checkout with items:', items);
      const checkoutUrl = await createCheckout();
      console.log('Checkout URL received:', checkoutUrl);
      
      if (checkoutUrl) {
        // Try window.open first (works best for external redirects)
        const newWindow = window.open(checkoutUrl, '_blank');
        
        if (newWindow) {
          console.log('Checkout opened in new tab');
          toast.success("Checkout opened!", {
            description: "Complete your purchase in the new tab.",
          });
          onClose();
        } else {
          // Popup was blocked - try direct navigation
          console.log('Popup blocked, trying direct navigation');
          toast.info("Opening checkout...", {
            description: "If checkout doesn't open, click the link below.",
            action: {
              label: "Open Checkout",
              onClick: () => window.open(checkoutUrl, '_blank'),
            },
            duration: 10000,
          });
          
          // Try location.href as fallback
          setTimeout(() => {
            window.location.href = checkoutUrl;
          }, 500);
        }
      } else {
        console.error('No checkout URL returned');
        toast.error("Failed to create checkout", {
          description: "Please try again or contact support.",
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Checkout failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  const handleAddUpsell = (product: ShopifyProduct) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    if (!firstVariant) return;

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      variantImage: firstVariant.image?.url,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: product.node.title,
      position: "top-center",
    });
  };

  // Get the image to display for a cart item - prioritize variant image
  const getCartItemImage = (item: CartItem) => {
    // First try the stored variant image
    if (item.variantImage) {
      return item.variantImage;
    }
    
    // Then try to find the variant's image from the product data
    const variant = item.product.node.variants.edges.find(
      v => v.node.id === item.variantId
    );
    if (variant?.node.image?.url) {
      return variant.node.image.url;
    }
    
    // Fallback to first product image
    return item.product.node.images.edges[0]?.node.url || '/placeholder.svg';
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-xl z-50 transform transition-transform duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="p-4 bg-muted flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Spend {formatPrice(amountToFreeShipping.toString(), currencyCode)} more for free shipping!
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Looks like you haven't added anything yet!
            </p>
            <Button onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {items.map((item) => {
                const image = getCartItemImage(item);
                return (
                  <div key={item.variantId} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <img 
                      src={image} 
                      alt={item.product.node.title}
                      className="w-20 h-20 object-contain rounded-md bg-white p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.product.node.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variantTitle !== "Default Title" ? item.variantTitle : ""}
                      </p>
                      <p className="font-semibold mt-1">
                        {formatPrice(item.price.amount, item.price.currencyCode)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          className="qty-btn rounded"
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          className="qty-btn rounded"
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeItem(item.variantId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Accessory Upsell Section */}
              {accessoryRecommendations.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Complete your order</span>
                  </div>
                  <div className="space-y-2">
                    {accessoryRecommendations.map((product) => {
                      const price = product.node.priceRange.minVariantPrice.amount;
                      const compareAt = product.node.compareAtPriceRange?.minVariantPrice?.amount;
                      const hasDiscount = compareAt && parseFloat(compareAt) > parseFloat(price);
                      
                      return (
                        <div key={product.node.id} className="flex items-center gap-3 p-2 border border-border rounded-lg bg-background">
                          <Link 
                            to={`/products/${product.node.handle}`}
                            onClick={onClose}
                            className="w-12 h-12 flex-shrink-0"
                          >
                            <img 
                              src={product.node.images.edges[0]?.node.url || '/placeholder.svg'} 
                              alt={product.node.title}
                              className="w-full h-full object-contain rounded bg-white p-0.5"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium line-clamp-1">{product.node.title}</p>
                            <div className="flex items-center gap-1">
                              <span className={cn("text-xs font-semibold", hasDiscount && "text-success")}>
                                {formatPrice(price)}
                              </span>
                              {hasDiscount && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                  {formatPrice(compareAt)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 px-2"
                            onClick={() => handleAddUpsell(product)}
                          >
                            Add
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="border-t border-border p-4 space-y-4 flex-shrink-0 bg-background">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold">
                  {formatPrice(subtotal.toString(), currencyCode)}
                </span>
              </div>
              {subtotal >= FREE_SHIPPING_THRESHOLD && (
                <p className="text-sm text-success flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  Free shipping applied!
                </p>
              )}
              <Button 
                className="w-full bg-success hover:bg-success/90" 
                size="lg" 
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Checkout...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Checkout
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Secure checkout powered by Shopify
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}