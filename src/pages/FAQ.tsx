import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Mail, MessageCircle, Clock, Truck, RefreshCw, CreditCard, Package, Shield } from "lucide-react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";
import { useScrollToTop } from "@/hooks/useScrollToTop";

interface FAQItem {
  question: string;
  answer: string;
}

const faqCategories = [
  {
    title: "Shipping & Delivery",
    icon: Truck,
    faqs: [
      {
        question: "Do you offer free shipping?",
        answer: "Yes! We offer free UK shipping on all orders over £25. Orders under £25 have a small shipping fee of £2.99."
      },
      {
        question: "How long does delivery take?",
        answer: "Standard UK delivery takes 2-5 working days. We dispatch same-day for orders placed before 5pm on weekdays."
      },
      {
        question: "What is the same-day dispatch cutoff?",
        answer: "Orders placed before 5pm (Monday to Friday) are dispatched the same day. Orders placed after 5pm or on weekends will be dispatched the next working day."
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we only ship within the UK. We're working on expanding our delivery options to more countries soon!"
      }
    ]
  },
  {
    title: "Returns & Refunds",
    icon: RefreshCw,
    faqs: [
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy on all items. If you're not completely satisfied, you can return your purchase within 30 days for a full refund or exchange."
      },
      {
        question: "How do I return an item?",
        answer: "Simply contact us at support@straphub.co.uk with your order number and reason for return. We'll provide you with a returns label and instructions."
      },
      {
        question: "When will I receive my refund?",
        answer: "Once we receive your returned item, refunds are processed within 3-5 working days. The refund will appear on your original payment method."
      },
      {
        question: "Can I exchange my item for a different size or colour?",
        answer: "Absolutely! We offer free exchanges. Contact us and we'll arrange for the replacement to be sent out as soon as possible."
      }
    ]
  },
  {
    title: "Orders & Payment",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay."
      },
      {
        question: "Can I track my order?",
        answer: "Yes! Once your order is dispatched, you'll receive an email with tracking information so you can follow your delivery every step of the way."
      },
      {
        question: "Can I cancel or modify my order?",
        answer: "If you need to cancel or modify your order, please contact us as soon as possible. We can usually accommodate changes if the order hasn't been dispatched yet."
      },
      {
        question: "Is my payment information secure?",
        answer: "Absolutely. We use industry-standard SSL encryption and all payments are processed through Shopify's secure payment gateway. We never store your card details."
      }
    ]
  },
  {
    title: "Products & Compatibility",
    icon: Package,
    faqs: [
      {
        question: "How do I know if a strap will fit my watch?",
        answer: "Each product page clearly shows compatibility information. You can also use our filter options to browse straps specifically for your watch brand and model."
      },
      {
        question: "Are your straps genuine Apple/Samsung products?",
        answer: "Our straps are high-quality third-party alternatives designed to fit perfectly with your smartwatch. They offer the same look and feel at a fraction of the price."
      },
      {
        question: "What materials are your straps made from?",
        answer: "We offer straps in various materials including premium silicone, genuine leather, stainless steel, nylon, and milanese mesh. Material details are listed on each product page."
      },
      {
        question: "Do your straps come with installation tools?",
        answer: "Most of our straps feature quick-release pins for tool-free installation. For straps that require tools, we include them in the package at no extra cost."
      }
    ]
  }
];

const FAQ = () => {
  useScrollToTop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const totalItems = useCartStore((state) => state.getTotalItems());

  const toggleItem = (categoryIndex: number, faqIndex: number) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | StrapHub UK</title>
        <meta name="description" content="Find answers to common questions about shipping, returns, payments, and products at StrapHub. Free UK shipping over £25, 30-day returns." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-primary/10 to-background py-12 md:py-16">
            <div className="container text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">How can we help?</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Find answers to common questions below, or contact our friendly support team for personalised assistance.
              </p>
            </div>
          </section>

          {/* Quick Info Boxes */}
          <section className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over £25</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">Same-Day Dispatch</p>
                <p className="text-xs text-muted-foreground">Order before 5pm</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <RefreshCw className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">Hassle-free policy</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-sm font-medium">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">SSL encrypted</p>
              </div>
            </div>
          </section>

          {/* FAQ Categories */}
          <section className="container py-8 md:py-12">
            <div className="max-w-3xl mx-auto space-y-8">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-4 md:p-6 bg-muted/50 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold">{category.title}</h2>
                  </div>
                  
                  <div className="divide-y divide-border">
                    {category.faqs.map((faq, faqIndex) => {
                      const key = `${categoryIndex}-${faqIndex}`;
                      const isExpanded = expandedItems[key];
                      
                      return (
                        <div key={faqIndex} className="group">
                          <button
                            onClick={() => toggleItem(categoryIndex, faqIndex)}
                            className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/30 transition-colors"
                          >
                            <span className="font-medium pr-4">{faq.question}</span>
                            <ChevronDown className={cn(
                              "w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )} />
                          </button>
                          <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isExpanded ? "max-h-96" : "max-h-0"
                          )}>
                            <p className="px-4 md:px-5 pb-4 md:pb-5 text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-muted py-12 md:py-16">
            <div className="container">
              <div className="max-w-2xl mx-auto text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
                <p className="text-muted-foreground mb-6">
                  Our friendly support team is here to help. We typically respond within 24 hours.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a 
                    href="mailto:support@straphub.co.uk"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    support@straphub.co.uk
                  </a>
                  <a 
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Contact Form
                  </a>
                </div>
                
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Business Hours:</strong> Monday - Friday, 9am - 5pm GMT
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      </div>
    </>
  );
};

export default FAQ;