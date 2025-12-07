import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, RefreshCw } from "lucide-react";
import heroImage from "@/assets/hero-lifestyle.jpg";

export function HeroSection() {
  return (
    <section className="relative h-[450px] sm:h-[520px] md:h-[620px] lg:h-[720px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Woman wearing smartwatch with stylish strap" 
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="container relative h-full flex items-center px-4 sm:px-6">
        <div className="max-w-xl text-background">
          <p className="text-sm sm:text-base text-background/80 uppercase tracking-widest mb-2 sm:mb-3 font-medium animate-fade-up">
            Premium Watch Straps
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.95] mb-4 sm:mb-5 animate-fade-up">
            Elevate Your
            <br />
            <span className="text-primary-foreground bg-primary/20 backdrop-blur-sm px-2 -ml-2">Style</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-background/90 mb-6 sm:mb-8 animate-fade-up leading-relaxed max-w-md" style={{
            animationDelay: "0.1s"
          }}>
            UK's finest collection of smartwatch straps. Apple, Samsung, Garmin & more.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-up" style={{
            animationDelay: "0.15s"
          }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base group shadow-lg">
              <Link to="/collections/all">
                Shop All Straps
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background/40 bg-background/10 text-background hover:bg-background/20 backdrop-blur-sm text-sm sm:text-base">
              <Link to="/collections/apple-watch">Apple Watch</Link>
            </Button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap gap-4 sm:gap-6 animate-fade-up text-xs sm:text-sm text-background/80" style={{
            animationDelay: "0.2s"
          }}>
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              Free UK Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" />
              30-Day Returns
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}