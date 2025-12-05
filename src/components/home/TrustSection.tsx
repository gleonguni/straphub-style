import { Truck, RefreshCw, Zap, Heart } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders above £25",
  },
  {
    icon: RefreshCw,
    title: "100-Day Returns",
    description: "Free exchanges & easy returns",
  },
  {
    icon: Zap,
    title: "Same-Day Dispatch",
    description: "Order before 9pm",
  },
  {
    icon: Heart,
    title: "Happy Customers",
    description: "Thousands of 5-star reviews",
  },
];

export function TrustSection() {
  return (
    <section className="bg-trust py-10 md:py-14">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div 
              key={item.title} 
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-3">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1">{item.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
