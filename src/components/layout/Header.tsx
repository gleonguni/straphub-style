import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const watchBrands = [{
  name: "Apple Watch",
  href: "/collections/apple-watch",
  searchQuery: "apple"
}, {
  name: "Samsung",
  href: "/collections/samsung",
  searchQuery: "samsung"
}, {
  name: "Garmin",
  href: "/collections/garmin",
  searchQuery: "garmin"
}, {
  name: "Fitbit",
  href: "/collections/fitbit",
  searchQuery: "fitbit"
}, {
  name: "Huawei",
  href: "/collections/huawei",
  searchQuery: "huawei"
}, {
  name: "Xiaomi",
  href: "/collections/xiaomi",
  searchQuery: "xiaomi"
}, {
  name: "Amazfit",
  href: "/collections/amazfit",
  searchQuery: "amazfit"
}, {
  name: "Google Pixel",
  href: "/collections/google",
  searchQuery: "google"
}, {
  name: "Polar",
  href: "/collections/polar",
  searchQuery: "polar"
}, {
  name: "Fossil",
  href: "/collections/fossil",
  searchQuery: "fossil"
}, {
  name: "Universal",
  href: "/collections/universal",
  searchQuery: "universal"
}];
const strapTypes = [{
  name: "Silicone",
  href: "/collections/silicone"
}, {
  name: "Leather",
  href: "/collections/leather"
}, {
  name: "Metal",
  href: "/collections/metal"
}, {
  name: "Nylon",
  href: "/collections/nylon"
}, {
  name: "Milanese",
  href: "/collections/milanese"
}];
const accessoryBrands = [{
  name: "Apple Watch",
  href: "/collections/accessories-apple"
}, {
  name: "Samsung",
  href: "/collections/accessories-samsung"
}, {
  name: "Universal",
  href: "/collections/accessories-universal"
}];
interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}
export function Header({
  cartCount = 0,
  onCartClick
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accessoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  };
  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  };
  const handleAccessoriesEnter = () => {
    if (accessoriesTimeoutRef.current) {
      clearTimeout(accessoriesTimeoutRef.current);
    }
    setIsAccessoriesOpen(true);
  };
  const handleAccessoriesLeave = () => {
    accessoriesTimeoutRef.current = setTimeout(() => {
      setIsAccessoriesOpen(false);
    }, 150);
  };
  return <header className="sticky top-0 z-40 bg-header border-b border-border">
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 -ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              
              <span className="font-bold text-xl md:text-2xl text-foreground tracking-tight">
                Strap<span className="text-primary">Hub</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            
            {/* All Straps Dropdown Trigger */}
            <div className="relative" onMouseEnter={handleMegaMenuEnter} onMouseLeave={handleMegaMenuLeave}>
              <Link to="/collections/all" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors py-4">
                All Straps
                <ChevronDown className={cn("w-4 h-4 transition-transform", isMegaMenuOpen && "rotate-180")} />
              </Link>
              
              {/* Mega Menu - Positioned relative to trigger */}
              <div className={cn("absolute left-1/2 -translate-x-1/2 top-full w-[800px] bg-background shadow-lg border border-border rounded-lg z-50 transition-all duration-200", isMegaMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none")}>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Shop by Brand */}
                    <div className="col-span-2">
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Shop by Brand
                      </h3>
                      <div className="grid grid-cols-3 gap-1">
                        {watchBrands.map(brand => <Link key={brand.name} to={brand.href} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted hover:text-primary transition-colors" onClick={() => setIsMegaMenuOpen(false)}>
                            {brand.name}
                          </Link>)}
                      </div>
                    </div>
                    
                    {/* Shop by Material */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Shop by Material
                      </h3>
                      <div className="space-y-1">
                        {strapTypes.map(type => <Link key={type.name} to={type.href} className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsMegaMenuOpen(false)}>
                            {type.name}
                          </Link>)}
                      </div>
                      
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-6">
                        Featured
                      </h3>
                      <div className="space-y-1">
                        <Link to="/collections/new-arrivals" className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsMegaMenuOpen(false)}>
                          New Arrivals
                        </Link>
                        <Link to="/collections/bestsellers" className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsMegaMenuOpen(false)}>
                          Best Sellers
                        </Link>
                        <Link to="/collections/sale" className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-sale" onClick={() => setIsMegaMenuOpen(false)}>
                          Sale Items
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessories Dropdown */}
            <div className="relative" onMouseEnter={handleAccessoriesEnter} onMouseLeave={handleAccessoriesLeave}>
              <Link to="/collections/accessories" className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors py-4">
                Accessories
                <ChevronDown className={cn("w-4 h-4 transition-transform", isAccessoriesOpen && "rotate-180")} />
              </Link>
              
              <div className={cn("absolute left-1/2 -translate-x-1/2 top-full w-[200px] bg-background shadow-lg border border-border rounded-lg z-50 transition-all duration-200", isAccessoriesOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none")}>
                <div className="p-3 space-y-1">
                  <Link to="/collections/accessories" className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsAccessoriesOpen(false)}>
                    All Accessories
                  </Link>
                  {accessoryBrands.map(brand => <Link key={brand.name} to={brand.href} className="block p-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium" onClick={() => setIsAccessoriesOpen(false)}>
                      {brand.name}
                    </Link>)}
                </div>
              </div>
            </div>
            
            <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("fixed inset-0 top-16 bg-background z-50 transform transition-transform duration-300 md:hidden", isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-4 space-y-2 overflow-y-auto h-full pb-20">
          {/* Search on Mobile */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="search" placeholder="Search straps..." className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <Link to="/" className="block py-3 text-lg font-medium border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>

          {/* All Straps Accordion */}
          <div className="border-b border-border">
            <button className="flex items-center justify-between w-full py-3 text-lg font-medium" onClick={() => setExpandedMobileSection(expandedMobileSection === "straps" ? null : "straps")}>
              All Straps
              <ChevronRight className={cn("w-5 h-5 transition-transform", expandedMobileSection === "straps" && "rotate-90")} />
            </button>
            {expandedMobileSection === "straps" && <div className="pb-4 pl-4 space-y-2 animate-fade-in">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">By Brand</p>
                {watchBrands.map(brand => <Link key={brand.name} to={brand.href} className="block py-2 text-sm hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    {brand.name}
                  </Link>)}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-4">By Material</p>
                {strapTypes.map(type => <Link key={type.name} to={type.href} className="block py-2 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    {type.name}
                  </Link>)}
              </div>}
          </div>

          {/* Accessories Accordion */}
          <div className="border-b border-border">
            <button className="flex items-center justify-between w-full py-3 text-lg font-medium" onClick={() => setExpandedMobileSection(expandedMobileSection === "accessories" ? null : "accessories")}>
              Accessories
              <ChevronRight className={cn("w-5 h-5 transition-transform", expandedMobileSection === "accessories" && "rotate-90")} />
            </button>
            {expandedMobileSection === "accessories" && <div className="pb-4 pl-4 space-y-2 animate-fade-in">
                <Link to="/collections/accessories" className="block py-2 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                  All Accessories
                </Link>
                {accessoryBrands.map(brand => <Link key={brand.name} to={brand.href} className="block py-2 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    {brand.name}
                  </Link>)}
              </div>}
          </div>

          <Link to="/contact" className="block py-3 text-lg font-medium border-b border-border" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>
        </div>
      </div>
    </header>;
}