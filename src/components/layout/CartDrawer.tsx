import { X, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const FREE_SHIPPING_THRESHOLD = 25;

export function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

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
        "fixed inset-y-0 right-0 w-full max-w-md bg-background shadow-xl z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
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
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <div className="p-4 bg-muted">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-sm">
                  {amountToFreeShipping > 0 
                    ? `Spend £${amountToFreeShipping.toFixed(2)} more for free shipping!`
                    : "You've unlocked free shipping!"
                  }
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
                Looks like you haven't added any straps yet!
              </p>
              <Button onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>
                      <p className="font-semibold mt-1">£{item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          className="qty-btn rounded"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          className="qty-btn rounded"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => onRemove(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upsell */}
                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <p className="text-sm font-medium text-primary mb-2">Complete your look</p>
                  <p className="text-xs text-muted-foreground">
                    Add a screen protector for 50% off!
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Add for £4.99
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-semibold">£{subtotal.toFixed(2)}</span>
                </div>
                {subtotal >= FREE_SHIPPING_THRESHOLD && (
                  <p className="text-sm text-success flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Free shipping applied!
                  </p>
                )}
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout powered by Shopify
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
