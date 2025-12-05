import { Link } from "react-router-dom";

const brands = [
  { name: "Apple Watch", href: "/collections/apple-watch", emoji: "🍎" },
  { name: "Samsung", href: "/collections/samsung", emoji: "📱" },
  { name: "Garmin", href: "/collections/garmin", emoji: "⌚" },
  { name: "Fitbit", href: "/collections/fitbit", emoji: "💪" },
  { name: "Huawei", href: "/collections/huawei", emoji: "📲" },
  { name: "Xiaomi", href: "/collections/xiaomi", emoji: "🎯" },
  { name: "Amazfit", href: "/collections/amazfit", emoji: "⚡" },
  { name: "Google", href: "/collections/google", emoji: "🔍" },
  { name: "Polar", href: "/collections/polar", emoji: "❄️" },
  { name: "Fossil", href: "/collections/fossil", emoji: "🦴" },
  { name: "TomTom", href: "/collections/tomtom", emoji: "🗺️" },
  { name: "Universal", href: "/collections/universal", emoji: "🔗" },
];

export function BrandShowcase() {
  return (
    <section className="py-10 border-y border-border">
      <div className="container">
        <h3 className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
          Shop by brand
        </h3>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={brand.href}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                {brand.emoji}
              </span>
              <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
