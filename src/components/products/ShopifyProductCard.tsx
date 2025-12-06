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

// Map color names to CSS gradient colors for premium look
const colorMap: Record<string, { base: string; gradient: string }> = {
  gold: { base: '#D4AF37', gradient: 'linear-gradient(135deg, #F5D76E 0%, #D4AF37 50%, #AA8C2C 100%)' },
  silver: { base: '#C0C0C0', gradient: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 50%, #A0A0A0 100%)' },
  grey: { base: '#808080', gradient: 'linear-gradient(135deg, #9A9A9A 0%, #808080 50%, #666666 100%)' },
  gray: { base: '#808080', gradient: 'linear-gradient(135deg, #9A9A9A 0%, #808080 50%, #666666 100%)' },
  black: { base: '#1a1a1a', gradient: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 50%, #000000 100%)' },
  white: { base: '#FFFFFF', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 50%, #E8E8E8 100%)' },
  blue: { base: '#3B82F6', gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #2563EB 100%)' },
  navy: { base: '#1e3a5a', gradient: 'linear-gradient(135deg, #2d4a6a 0%, #1e3a5a 50%, #0f2a4a 100%)' },
  red: { base: '#EF4444', gradient: 'linear-gradient(135deg, #F87171 0%, #EF4444 50%, #DC2626 100%)' },
  pink: { base: '#EC4899', gradient: 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #DB2777 100%)' },
  purple: { base: '#8B5CF6', gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)' },
  green: { base: '#22C55E', gradient: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 50%, #16A34A 100%)' },
  brown: { base: '#8B4513', gradient: 'linear-gradient(135deg, #A0522D 0%, #8B4513 50%, #6B3410 100%)' },
  tan: { base: '#D2B48C', gradient: 'linear-gradient(135deg, #E0C9A6 0%, #D2B48C 50%, #C4A672 100%)' },
  beige: { base: '#F5F5DC', gradient: 'linear-gradient(135deg, #FFFFF0 0%, #F5F5DC 50%, #E5E5CC 100%)' },
  orange: { base: '#F97316', gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)' },
  yellow: { base: '#EAB308', gradient: 'linear-gradient(135deg, #FACC15 0%, #EAB308 50%, #CA8A04 100%)' },
  rose: { base: '#FB7185', gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 50%, #F43F5E 100%)' },
  'rose gold': { base: '#B76E79', gradient: 'linear-gradient(135deg, #D4A5A5 0%, #B76E79 50%, #9A5A64 100%)' },
  rosegold: { base: '#B76E79', gradient: 'linear-gradient(135deg, #D4A5A5 0%, #B76E79 50%, #9A5A64 100%)' },
  starlight: { base: '#F5F5DC', gradient: 'linear-gradient(135deg, #FFFFF5 0%, #F5F5DC 50%, #E8E8D0 100%)' },
  midnight: { base: '#191970', gradient: 'linear-gradient(135deg, #2a2a80 0%, #191970 50%, #0a0a60 100%)' },
  graphite: { base: '#383838', gradient: 'linear-gradient(135deg, #505050 0%, #383838 50%, #202020 100%)' },
  space: { base: '#1a1a1a', gradient: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 50%, #000000 100%)' },
  natural: { base: '#C4A77D', gradient: 'linear-gradient(135deg, #D4B78D 0%, #C4A77D 50%, #B4976D 100%)' },
  cream: { base: '#FFFDD0', gradient: 'linear-gradient(135deg, #FFFFF0 0%, #FFFDD0 50%, #F5F3C0 100%)' },
  olive: { base: '#808000', gradient: 'linear-gradient(135deg, #9A9A00 0%, #808000 50%, #666600 100%)' },
  teal: { base: '#008080', gradient: 'linear-gradient(135deg, #00A0A0 0%, #008080 50%, #006060 100%)' },
  burgundy: { base: '#800020', gradient: 'linear-gradient(135deg, #A00030 0%, #800020 50%, #600010 100%)' },
  coral: { base: '#FF7F50', gradient: 'linear-gradient(135deg, #FF9F70 0%, #FF7F50 50%, #E56030 100%)' },
  mint: { base: '#98FF98', gradient: 'linear-gradient(135deg, #B8FFB8 0%, #98FF98 50%, #78DF78 100%)' },
  lavender: { base: '#E6E6FA', gradient: 'linear-gradient(135deg, #F0F0FF 0%, #E6E6FA 50%, #D6D6EA 100%)' },
  charcoal: { base: '#36454F', gradient: 'linear-gradient(135deg, #46555F 0%, #36454F 50%, #26353F 100%)' },
  copper: { base: '#B87333', gradient: 'linear-gradient(135deg, #D89050 0%, #B87333 50%, #985020 100%)' },
};

const getColorStyle = (colorName: string): { background: string } => {
  const lowerColor = colorName.toLowerCase().trim();
  
  // Direct match first
  if (colorMap[lowerColor]) {
    return { background: colorMap[lowerColor].gradient };
  }
  
  // Partial match - prioritize longer matches first
  const sortedKeys = Object.keys(colorMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lowerColor.includes(key)) {
      return { background: colorMap[key].gradient };
    }
  }
  
  // Fallback gradient
  return { background: 'linear-gradient(135deg, #9A9A9A 0%, #888888 50%, #666666 100%)' };
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
      <Link to={`/products/${node.handle}`} className="relative block aspect-square bg-muted overflow-hidden p-3 md:p-4">
        <div className="w-full h-full bg-background rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt={imageAlt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

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
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 flex items-center gap-0.5 md:gap-1">
            {uniqueColors.map((color, index) => (
              <div
                key={index}
                className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full border border-black/20 shadow-sm ring-1 ring-white/50"
                style={getColorStyle(color)}
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
