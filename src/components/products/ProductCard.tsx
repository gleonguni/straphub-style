import { Link } from "react-router-dom";
import { Plus, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  imageHover?: string;
  badge?: "sale" | "bestseller" | "new";
  onQuickAdd?: () => void;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  compareAtPrice,
  image,
  imageHover,
  badge,
  onQuickAdd,
}: ProductCardProps) {
  const discount = compareAtPrice 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  const hasFreeShipping = price >= 25;

  return (
    <div className="product-card group bg-card rounded-lg overflow-hidden shadow-product">
      {/* Image Container */}
      <Link to={`/products/${id}`} className="relative block aspect-square bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {imageHover && (
          <img 
            src={imageHover} 
            alt={name}
            className="product-image-secondary w-full h-full object-cover"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {badge === "sale" && (
            <span className="badge-sale">Sale</span>
          )}
          {badge === "bestseller" && (
            <span className="badge-bestseller">Best Seller</span>
          )}
          {badge === "new" && (
            <span className="bg-foreground text-background px-2 py-0.5 text-xs font-semibold rounded">New</span>
          )}
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
        onClick={(e) => {
          e.preventDefault();
          onQuickAdd?.();
        }}
        className="quick-add bg-primary text-primary-foreground py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{brand}</p>
        <Link to={`/products/${id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className={cn(
            "font-semibold",
            compareAtPrice && "text-sale"
          )}>
            £{price.toFixed(2)}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              £{compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
