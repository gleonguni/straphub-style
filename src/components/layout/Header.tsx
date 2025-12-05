import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const watchBrands = [
  { name: "Apple Watch", href: "/collections/apple-watch", image: "🍎" },
  { name: "Samsung", href: "/collections/samsung", image: "📱" },
  { name: "Garmin", href: "/collections/garmin", image: "⌚" },
  { name: "Fitbit", href: "/collections/fitbit", image: "💪" },
  { name: "Huawei", href: "/collections/huawei", image: "📲" },
  { name: "Xiaomi", href: "/collections/xiaomi", image: "🎯" },
  { name: "Amazfit", href: "/collections/amazfit", image: "⚡" },
  { name: "Google Pixel", href: "/collections/google", image: "🔍" },
  { name: "Polar", href: "/collections/polar", image: "❄️" },
  { name: "Fossil", href: "/collections/fossil", image: "🦴" },
  { name: "Universal", href: "/collections/universal", image: "🔗" },
];

const strapTypes = [
  { name: "Silicone", href: "/collections/silicone" },
  { name: "Leather", href: "/collections/leather" },
  { name: "Metal", href: "/collections/metal" },
  { name: "Nylon", href: "/collections/nylon" },
  { name: "Milanese", href: "/collections/milanese" },
];

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartCount = 0, onCartClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg md:text-xl">S</span>
              </div>
              <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
                Strap<span className="text-primary">Hub</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            
            {/* All Straps Dropdown Trigger */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                All Straps
                <ChevronDown className={cn("w-4 h-4 transition-transform", isMegaMenuOpen && "rotate-180")} />
              </button>
            </div>

            <Link 
              to="/collections/accessories" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Accessories
            </Link>
            
            <Link 
              to="/contact" 
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mega Menu - Full Width Dropdown */}
      <div 
        className={cn(
          "absolute left-0 right-0 top-full bg-background shadow-lg border-t border-border z-50 transition-all duration-200 hidden md:block",
          isMegaMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onMouseEnter={() => setIsMegaMenuOpen(true)}
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <div className="container py-8">
          <div className="grid grid-cols-4 gap-8">
            {/* Shop by Brand */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Shop by Brand
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {watchBrands.map((brand) => (
                  <Link
                    key={brand.name}
                    to={brand.href}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMegaMenuOpen(false)}
                  >
                    <span className="text-lg">{brand.image}</span>
                    <span className="text-sm font-medium">{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Shop by Material */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Shop by Material
              </h3>
              <div className="space-y-2">
                {strapTypes.map((type) => (
                  <Link
                    key={type.name}
                    to={type.href}
                    className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    onClick={() => setIsMegaMenuOpen(false)}
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Featured */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Featured
              </h3>
              <div className="space-y-2">
                <Link 
                  to="/collections/new-arrivals" 
                  className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                  onClick={() => setIsMegaMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link 
                  to="/collections/bestsellers" 
                  className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                  onClick={() => setIsMegaMenuOpen(false)}
                >
                  Best Sellers
                </Link>
                <Link 
                  to="/collections/sale" 
                  className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-sale"
                  onClick={() => setIsMegaMenuOpen(false)}
                >
                  Sale Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-16 bg-background z-50 transform transition-transform duration-300 md:hidden",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {/* Search on Mobile */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search straps..."
              className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Link 
            to="/" 
            className="block py-3 text-lg font-medium border-b border-border"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>

          {/* All Straps Accordion */}
          <div className="border-b border-border">
            <button
              className="flex items-center justify-between w-full py-3 text-lg font-medium"
              onClick={() => setExpandedMobileSection(expandedMobileSection === "straps" ? null : "straps")}
            >
              All Straps
              <ChevronRight className={cn(
                "w-5 h-5 transition-transform",
                expandedMobileSection === "straps" && "rotate-90"
              )} />
            </button>
            {expandedMobileSection === "straps" && (
              <div className="pb-4 pl-4 space-y-2 animate-fade-in">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">By Brand</p>
                {watchBrands.map((brand) => (
                  <Link
                    key={brand.name}
                    to={brand.href}
                    className="flex items-center gap-2 py-2 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{brand.image}</span>
                    {brand.name}
                  </Link>
                ))}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-4">By Material</p>
                {strapTypes.map((type) => (
                  <Link
                    key={type.name}
                    to={type.href}
                    className="block py-2 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {type.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link 
            to="/collections/accessories" 
            className="block py-3 text-lg font-medium border-b border-border"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Accessories
          </Link>

          <Link 
            to="/contact" 
            className="block py-3 text-lg font-medium border-b border-border"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}