import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const collections = [{
  name: "Apple Watch",
  description: "Series 1-10, SE & Ultra",
  image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop",
  href: "/collections/apple-watch",
  color: "from-slate-800 to-slate-900"
}, {
  name: "Samsung Galaxy",
  description: "All Galaxy Watch models",
  image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
  href: "/collections/samsung",
  color: "from-blue-900 to-blue-950"
}, {
  name: "Leather Straps",
  description: "Premium leather for every watch",
  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
  href: "/collections/leather",
  color: "from-amber-800 to-amber-900"
}, {
  name: "Metal & Milanese",
  description: "Stainless steel & mesh",
  image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&h=600&fit=crop",
  href: "/collections/metal",
  color: "from-zinc-700 to-zinc-800"
}, {
  name: "Silicone Sport",
  description: "Comfortable & durable",
  image: "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&h=600&fit=crop",
  href: "/collections/silicone",
  color: "from-teal-700 to-teal-800"
}, {
  name: "Garmin",
  description: "Fenix, Forerunner & more",
  image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop",
  href: "/collections/garmin",
  color: "from-green-800 to-green-900"
}];
export function FeaturedCollections() {
  return <section className="py-14 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Find the best strap for you </h2>
          <p className="text-muted-foreground">Browse by brand or material</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {collections.map((collection, index) => <Link key={collection.name} to={collection.href} className="group relative aspect-square rounded-xl overflow-hidden animate-fade-up" style={{
          animationDelay: `${index * 0.1}s`
        }}>
              <img src={collection.image} alt={collection.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-70 group-hover:opacity-60 transition-opacity`} />
              
              <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end text-background">
                <h3 className="font-bold text-lg md:text-xl mb-1 group-hover:translate-x-1 transition-transform">
                  {collection.name}
                </h3>
                <p className="text-sm text-background/80 mb-2">{collection.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>)}
        </div>
      </div>
    </section>;
}