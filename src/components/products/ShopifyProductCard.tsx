import { Link } from "react-router-dom";
import { Plus, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShopifyProduct, formatPrice, calculateDiscount, CartItem } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  selectedColor?: string;
}

// Map color names to CSS colors
const colorMap: Record<string, string> = {
  gold: '#D4AF37',
  silver: '#C0C0C0',
  grey: '#808080',
  gray: '#808080',
  black: '#1a1a1a',
  white: '#FFFFFF',
  blue: '#3B82F6',
  navy: '#1e3a5a',
  red: '#EF4444',
  pink: '#EC4899',
  purple: '#8B5CF6',
  green: '#22C55E',
  brown: '#8B4513',
  tan: '#D2B48C',
  beige: '#F5F5DC',
  orange: '#F97316',
  yellow: '#EAB308',
  rose: '#FB7185',
  'rose gold': '#B76E79',
  rosegold: '#B76E79',
  starlight: '#F5F5DC',
  midnight: '#191970',
  graphite: '#383838',
  space: '#1a1a1a',
};

const getColorValue = (colorName: string): string => {
  const lowerColor = colorName.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (lowerColor.includes(key)) {
      return value;
    }
  }
  return '#888888';
};

export function ShopifyProductCard({ product, selectedColor }: ShopifyProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareAtPrice = node.compareAtPriceRange?.minVariantPrice?.amount;
  const discount = calculateDiscount(
    node.priceRange.minVariantPrice.amount,
    compareAtPrice
  );
  const hasFreeShipping = price >= 25;
  
  // Extract unique colors from variants - check multiple possible option names
  const uniqueColors = Array.from(new Set(
    node.variants.edges
      .flatMap(v => v.node.selectedOptions || [])
      .filter(opt => {
        const name = opt.name.toLowerCase();
        return name === 'color' || name === 'colour' || name === 'style' || name.includes('color');
      })
      .map(opt => opt.value)
  )).slice(0, 4);
  
  // Find variant matching selected color filter
  const matchingVariant = selectedColor
    ? node.variants.edges.find(v => 
        v.node.title.toLowerCase().includes(selectedColor.toLowerCase()) ||
        v.node.selectedOptions?.some(opt => 
          opt.name.toLowerCase() === 'color' && 
          opt.value.toLowerCase().includes(selectedColor.toLowerCase())
        )
      )?.node
    : null;
  
  const firstVariant = matchingVariant || node.variants.edges[0]?.node;
  
  // Find image for the matching variant
  const getProductImage = () => {
    if (selectedColor && node.images.edges.length > 0) {
      const colorVariantImage = node.images.edges.find(img => {
        const altText = img.node.altText?.toLowerCase() || '';
        const url = img.node.url.toLowerCase();
        const colorLower = selectedColor.toLowerCase();
        return altText.includes(colorLower) || url.includes(colorLower);
      });
      if (colorVariantImage) return colorVariantImage.node.url;
      
      if (matchingVariant) {
        const variantIndex = node.variants.edges.findIndex(v => v.node.id === matchingVariant.id);
        if (variantIndex >= 0 && node.images.edges[variantIndex]) {
          return node.images.edges[variantIndex].node.url;
        }
      }
    }
    return node.images.edges[0]?.node.url || '/placeholder.svg';
  };
  
  const image = getProductImage();
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
      <Link to={`/products/${node.handle}`} className="relative block aspect-square bg-muted overflow-hidden">
        <img 
          src={image} 
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="badge-sale">Save {discount}%</span>
          )}
        </div>

        {hasFreeShipping && (
          <div className="absolute top-3 right-3">
            <span className="badge-free-shipping flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Free Shipping
            </span>
          </div>
        )}
        
        {uniqueColors.length > 1 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1">
            {uniqueColors.map((color, index) => (
              <div
                key={index}
                className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-sm"
                style={{ backgroundColor: getColorValue(color) }}
                title={color}
              />
            ))}
          </div>
        )}
      </Link>

      <button 
        onClick={handleQuickAdd}
        className="quick-add bg-success text-success-foreground py-3 flex items-center justify-center gap-2 text-sm font-medium hover:bg-success/90 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Quick Add
      </button>

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
            discount > 0 && "text-success"
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
