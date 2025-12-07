import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    name: "Apple Watch",
    description: "Series 1-11, SE & Ultra",
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop",
    href: "/collections/apple-watch",
    color: "from-slate-900/95 to-slate-800/90",
  },
  {
    name: "Samsung Galaxy",
    description: "All Galaxy Watch models",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
    href: "/collections/samsung",
    color: "from-blue-950/95 to-blue-900/90",
  },
  {
    name: "Leather Straps",
    description: "Premium leather for every watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    href: "/collections/leather",
    color: "from-amber-900/95 to-amber-800/90",
  },
  {
    name: "Metal & Milanese",
    description: "Stainless steel & mesh",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop",
    href: "/collections/metal",
    color: "from-zinc-800/95 to-zinc-700/90",
  },
  {
    name: "Silicone Sport",
    description: "Comfortable & durable",
    image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&h=600&fit=crop",
    href: "/collections/silicone",
    color: "from-teal-900/95 to-teal-800/90",
  },
  {
    name: "Garmin",
    description: "Fenix, Forerunner & more",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
    href: "/collections/garmin",
    color: "from-emerald-900/95 to-emerald-800/90",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="container px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">Find the best strap for you</h2>
          <p className="text-sm md:text-base text-muted-foreground">Browse by brand or material</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.name}
              to={collection.href}
              className="group relative aspect-square rounded-xl overflow-hidden animate-fade-up shadow-md hover:shadow-lg transition-shadow"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-75 group-hover:opacity-65 transition-opacity`}
              />

              <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-end text-background">
                <h3 className="font-bold text-sm md:text-xl mb-0.5 md:mb-1 group-hover:translate-x-1 transition-transform">
                  {collection.name}
                </h3>
                <p className="text-xs md:text-sm text-background/80 mb-1 md:mb-2 line-clamp-1">{collection.description}</p>
                <span className="hidden md:inline-flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
