import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Instagram, Youtube, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
export function Footer() {
  return <footer className="bg-foreground text-background">
      {/* Trust Bar */}
      <div className="border-b border-background/10">
        <div className="container py-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-background/80">
            <span>✓ Free shipping on all orders above £25</span>
            <span>✓ 100-day return policy</span>
            <span>✓ Same-day dispatch (order by 9pm)</span>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-background/10">
        <div className="container py-10">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">Stay in the loop</h3>
            <p className="text-background/70 mb-4 text-sm">
              Sign up for our newsletter and receive exclusive discounts!
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 bg-background/10 rounded-lg text-sm placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-primary" />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Information</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-background transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
              <li><Link to="/delivery-returns" className="hover:text-background transition-colors">Delivery & Returns</Link></li>
              
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Policies</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              
              <li><Link to="/refund" className="hover:text-background transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-semibold mb-4 text-background">My Account</h4>
            <ul className="space-y-2 text-sm text-background/70">
              
              
              <li><Link to="/account/orders" className="hover:text-background transition-colors">My Orders</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>2 Langs Road <br />Armagh, BT60 1ET <br />United Kingdom</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+44 75 2399 152 </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@straphub.co.uk</span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="border-t border-background/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} StrapHub. All rights reserved.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {/* Payment Icons */}
              
              
              
              
              
              
            </div>
          </div>
        </div>
      </div>
    </footer>;
}