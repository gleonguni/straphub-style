import { useState, useCallback } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isInStock?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "icon";
}

export const AddToCartButton = ({
  onClick,
  disabled = false,
  isInStock = true,
  className,
  size = "lg",
  variant = "default",
}: AddToCartButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled || !isInStock || isAdding) return;

    setIsAdding(true);
    onClick();

    // Show success state
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);

      // Reset after showing success
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }, 300);
  }, [onClick, disabled, isInStock, isAdding]);

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "h-9 w-9 transition-all duration-300",
          isAdded && "bg-success text-success-foreground",
          isAdding && "scale-95",
          className
        )}
        onClick={handleClick}
        disabled={disabled || !isInStock}
      >
        {isAdded ? (
          <Check className="w-4 h-4 animate-scale-in" />
        ) : (
          <ShoppingCart className={cn(
            "w-4 h-4 transition-transform duration-200",
            isAdding && "scale-75"
          )} />
        )}
      </Button>
    );
  }

  return (
    <Button
      size={size}
      className={cn(
        "w-full transition-all duration-300 relative overflow-hidden",
        isInStock
          ? isAdded
            ? "bg-success hover:bg-success/90"
            : "bg-success hover:bg-success/90"
          : "bg-muted text-muted-foreground",
        isAdding && "scale-[0.98]",
        className
      )}
      onClick={handleClick}
      disabled={disabled || !isInStock}
    >
      <span
        className={cn(
          "flex items-center justify-center gap-2 transition-all duration-300",
          isAdding && "opacity-0 scale-95",
          isAdded && "opacity-0 scale-95"
        )}
      >
        {isInStock ? "Add to Cart" : "Out of Stock"}
      </span>
      
      {/* Success state */}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300",
          isAdded ? "opacity-100 scale-100" : "opacity-0 scale-110"
        )}
      >
        <Check className="w-5 h-5" />
        Added!
      </span>
      
      {/* Loading pulse */}
      {isAdding && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
    </Button>
  );
};
