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
              <li><Link to="/payment-methods" className="hover:text-background transition-colors">Payment Methods</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4 text-background">Policies</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/terms" className="hover:text-background transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-background transition-colors">Cookie Policy</Link></li>
              <li><Link to="/refund" className="hover:text-background transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-semibold mb-4 text-background">My Account</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/account/login" className="hover:text-background transition-colors">Login</Link></li>
              <li><Link to="/account/register" className="hover:text-background transition-colors">Register</Link></li>
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
                <span>+44 20 3053 1572</span>
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
              <svg className="h-8 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#1A1F71" />
                <path d="M21.5 21.5L23.5 10.5H26.5L24.5 21.5H21.5Z" fill="white" />
                <path d="M33 10.7C32.4 10.5 31.4 10.3 30.2 10.3C27.2 10.3 25.1 11.8 25.1 14C25.1 15.7 26.6 16.6 27.8 17.2C29 17.8 29.4 18.2 29.4 18.7C29.4 19.5 28.4 19.9 27.5 19.9C26.2 19.9 25.5 19.7 24.4 19.2L23.9 19L23.4 22C24.3 22.4 25.8 22.7 27.4 22.7C30.6 22.7 32.6 21.2 32.6 18.9C32.6 17.5 31.7 16.5 29.9 15.6C28.8 15.1 28.1 14.7 28.1 14.2C28.1 13.7 28.7 13.2 29.9 13.2C30.9 13.2 31.7 13.4 32.3 13.6L32.6 13.7L33 10.7Z" fill="white" />
                <path d="M38.5 10.5C37.9 10.5 37.4 10.7 37.1 11.3L32.5 21.5H35.7L36.3 19.8H40.2L40.6 21.5H43.5L41 10.5H38.5ZM37.1 17.4C37.4 16.6 38.5 13.7 38.5 13.7C38.5 13.7 38.8 12.9 39 12.4L39.2 13.6C39.2 13.6 39.9 16.8 40 17.4H37.1Z" fill="white" />
                <path d="M19.5 10.5L16.5 18L16.2 16.6C15.6 14.8 14 12.8 12.2 11.8L15 21.5H18.2L22.7 10.5H19.5Z" fill="white" />
                <path d="M13.5 10.5H8.5L8.5 10.7C12.2 11.6 14.6 13.8 15.5 16.5L14.5 11.3C14.4 10.7 13.9 10.5 13.5 10.5Z" fill="#F9A533" />
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#F5F5F5" />
                <circle cx="20" cy="16" r="10" fill="#EA001B" />
                <circle cx="30" cy="16" r="10" fill="#F79E1B" />
                <path d="M25 8.5C27.5 10.5 29 13 29 16C29 19 27.5 21.5 25 23.5C22.5 21.5 21 19 21 16C21 13 22.5 10.5 25 8.5Z" fill="#FF5F00" />
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#003087" />
                <path d="M19.5 11H16.5C16.2 11 16 11.2 15.9 11.5L14.5 20.5C14.5 20.7 14.6 20.8 14.8 20.8H16.2C16.5 20.8 16.7 20.6 16.8 20.3L17.2 17.8C17.2 17.5 17.5 17.3 17.8 17.3H19C21.5 17.3 23 16 23.4 13.6C23.6 12.5 23.4 11.7 22.9 11.2C22.3 10.5 21.1 11 19.5 11Z" fill="white" />
                <path d="M28.5 14.3C28.3 15.6 27.3 15.6 26.3 15.6H25.7L26.1 13.4C26.1 13.2 26.3 13.1 26.5 13.1H26.7C27.4 13.1 28.1 13.1 28.4 13.5C28.6 13.7 28.6 13.9 28.5 14.3ZM28.1 11H24.8C24.5 11 24.3 11.2 24.2 11.5L22.8 20.5C22.8 20.7 22.9 20.8 23.1 20.8H24.7C24.9 20.8 25 20.7 25.1 20.5L25.5 18C25.5 17.7 25.8 17.5 26.1 17.5H27.3C29.8 17.5 31.3 16.2 31.7 13.8C31.9 12.7 31.7 11.9 31.2 11.4C30.5 10.5 29.5 11 28.1 11Z" fill="white" />
                <path d="M37.5 17.3H36.1C35.9 17.3 35.8 17.4 35.7 17.6L35.6 17.9L35.4 17.6C34.9 16.9 33.9 16.7 32.9 16.7C30.5 16.7 28.5 18.5 28.1 21C27.9 22.2 28.2 23.4 28.9 24.2C29.5 24.9 30.4 25.2 31.5 25.2C33.3 25.2 34.3 24 34.3 24L34.2 24.3C34.2 24.5 34.3 24.6 34.5 24.6H35.8C36.1 24.6 36.3 24.4 36.4 24.1L37.8 17.6C37.8 17.4 37.7 17.3 37.5 17.3Z" fill="#009CDE" />
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#000" />
                <path d="M12 16C12 13.5 13.5 11.3 15.7 10.3C15.3 10.1 14.8 10 14.3 10C11.4 10 9 12.7 9 16C9 19.3 11.4 22 14.3 22C14.8 22 15.3 21.9 15.7 21.7C13.5 20.7 12 18.5 12 16Z" fill="white" />
                <path d="M18 10C17.5 10 17 10.1 16.6 10.3C18.8 11.3 20.3 13.5 20.3 16C20.3 18.5 18.8 20.7 16.6 21.7C17 21.9 17.5 22 18 22C20.9 22 23.3 19.3 23.3 16C23.3 12.7 20.9 10 18 10Z" fill="white" />
                <path d="M16.2 12C15.3 12.9 14.8 14.4 14.8 16C14.8 17.6 15.3 19.1 16.2 20C17.1 19.1 17.6 17.6 17.6 16C17.6 14.4 17.1 12.9 16.2 12Z" fill="white" />
                <text x="26" y="19" fill="white" fontSize="8" fontFamily="system-ui" fontWeight="600">Pay</text>
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#F5F5F5" />
                <path d="M10 16.5L11.5 11H14L15.5 16.5L17 11H19.5L16.5 21H14L12.5 15.5L11 21H8.5L10 16.5Z" fill="#5F6368" />
                <path d="M21 11H28V13H23.5V15H27.5V17H23.5V19H28V21H21V11Z" fill="#5F6368" />
                <path d="M30 11H32.5V19H37V21H30V11Z" fill="#5F6368" />
                <path d="M39 11H41.5V21H39V11Z" fill="#5F6368" />
                <circle cx="40.2" cy="9" r="1.2" fill="#4285F4" />
                <circle cx="42.5" cy="9" r="1.2" fill="#EA4335" />
                <circle cx="40.2" cy="11.3" r="1.2" fill="#FBBC05" />
                <circle cx="42.5" cy="11.3" r="1.2" fill="#34A853" />
              </svg>
              <svg className="h-8 w-auto" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="32" rx="4" fill="#FFB3C7" />
                <path d="M11 10H14.5L17.5 18L20.5 10H24L18.5 22H16.5L11 10Z" fill="#0A0B09" />
                <text x="26" y="19" fill="#0A0B09" fontSize="9" fontFamily="system-ui" fontWeight="700">klarna.</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>;
}