import { Link } from "react-router-dom";

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
    <section className="py-10 md:py-14 border-y border-border bg-gradient-to-b from-muted/30 to-transparent overflow-hidden">
      <div className="container px-4">
        <h3 className="text-center text-sm md:text-base font-semibold text-foreground mb-6 md:mb-8">
          Shop by Brand
        </h3>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              to={brand.href}
              className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-border bg-background 
                hover:border-primary hover:bg-primary/5 hover:shadow-md hover:scale-105
                transition-all duration-200 ease-out group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-sm md:text-base font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
