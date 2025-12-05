import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-lifestyle.jpg";
export function HeroSection() {
  return <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Woman wearing smartwatch with stylish strap" className="w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content */}
      <div className="container relative h-full flex items-center">
        <div className="max-w-xl text-background">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 animate-fade-up">
            WATCH<br />
            <span className="text-primary-foreground">YOUR</span><br />
            WRIST
          </h1>
          <p className="text-lg md:text-xl text-background/90 mb-6 animate-fade-up" style={{
          animationDelay: "0.1s"
        }}>
            Premium smartwatch straps for every style.<br />
            All brands. All materials. All you.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-up" style={{
          animationDelay: "0.2s"
        }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/collections/all">Shop All Straps  </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-background/30 bg-background/10 text-background hover:bg-background/20 backdrop-blur-sm">
              <Link to="/collections/apple-watch">Apple Watch</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-medium text-foreground">1</span>
        <span className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center text-sm font-medium text-background">2</span>
      </div>
    </section>;
}