import { Link } from "react-router-dom";
import { Plus, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopifyProduct, formatPrice, calculateDiscount, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export function ShopifyProductCard({ product }: ShopifyProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice?.amount;
  const discount = calculateDiscount(
    node.priceRange.minVariantPrice.amount,
    compareAtPrice
  );
  const hasFreeShipping = price >= 25;
  const firstVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node.url || '/placeholder.svg';
  const imageAlt = node.images.edges[0]?.node.altText || node.title;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) {
      toast.error("No variants available");
      return;
    }

    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <div className="product-card group bg-card rounded-lg overflow-hidden shadow-product">
      {/* Image Container */}
      <Link to={`/products/${node.handle}`} className="relative block aspect-square bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}
        </div>

        {hasFreeShipping && (
          <div className="absolute top-3 right-3">
            <span className="badge-free-shipping flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Free Ship
            </span>
          </div>
        )}
      </Link>

      {/* Quick Add Button */}
      <button 
        onClick={handleQuickAdd}
        className="quick-add bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {node.vendor || "StrapHub"}
        </p>
        <Link to={`/products/${node.handle}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {node.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className={cn(
            "font-semibold",
            discount > 0 && "text-sale"
          )}>
            {formatPrice(node.priceRange.minVariantPrice.amount, node.priceRange.minVariantPrice.currencyCode)}
          </span>
          {compareAtPrice && parseFloat(compareAtPrice) > price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(compareAtPrice, node.priceRange.minVariantPrice.currencyCode)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
