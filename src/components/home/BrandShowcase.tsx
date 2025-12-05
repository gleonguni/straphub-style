import { Link } from "react-router-dom";
import { Watch } from "lucide-react";

const brands = [
  { name: "Apple Watch", href: "/collections/apple-watch" },
  { name: "Samsung", href: "/collections/samsung" },
  { name: "Garmin", href: "/collections/garmin" },
  { name: "Fitbit", href: "/collections/fitbit" },
  { name: "Huawei", href: "/collections/huawei" },
  { name: "Xiaomi", href: "/collections/xiaomi" },
  { name: "Amazfit", href: "/collections/amazfit" },
  { name: "Google", href: "/collections/google" },
  { name: "Polar", href: "/collections/polar" },
  { name: "Fossil", href: "/collections/fossil" },
  { name: "TomTom", href: "/collections/tomtom" },
  { name: "Universal", href: "/collections/universal" },
];

export function BrandShowcase() {
  return (
    <section className="py-8 md:py-10 border-y border-border overflow-hidden">
      <div className="container px-4">
        <h3 className="text-center text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 md:mb-6">
          Shop by brand
        </h3>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={brand.href}
              className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Watch className="w-5 h-5 md:w-7 md:h-7 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-[10px] md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}