import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

interface StickyCartProps {
  onClick: () => void;
}

export function StickyCart({ onClick }: StickyCartProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  if (totalItems === 0) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3",
        "bg-primary text-primary-foreground rounded-full shadow-lg",
        "hover:bg-primary/90 transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "animate-fade-up"
      )}
    >
      <ShoppingBag className="w-5 h-5" />
      <span className="font-semibold">{totalItems}</span>
      <span className="hidden sm:inline text-sm">View Cart</span>
    </button>
  );
}