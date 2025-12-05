import { Truck, RefreshCw, Shield, CreditCard } from "lucide-react";

export function TrustGuaranteeSection() {
  return (
    <section className="py-12 bg-primary/10 border-t border-primary/20">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Why Shop With Us?</h2>
          <p className="text-muted-foreground">We're committed to providing the best shopping experience</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <Truck className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold mb-1">Free UK Shipping</h3>
            <p className="text-sm text-muted-foreground">On orders over £25</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold mb-1">30-Day Returns</h3>
            <p className="text-sm text-muted-foreground">Hassle-free returns</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold mb-1">Secure Checkout</h3>
            <p className="text-sm text-muted-foreground">SSL encrypted payments</p>
          </div>
          
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-success" />
            </div>
            <h3 className="font-semibold mb-1">Pay Your Way</h3>
            <p className="text-sm text-muted-foreground">All major cards accepted</p>
          </div>
        </div>
      </div>
    </section>
  );
}