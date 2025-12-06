import { Helmet } from "react-helmet-async";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useState } from "react";

const ShippingPolicy = () => {
  useScrollToTop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <Helmet>
        <title>Shipping Policy | StrapHub UK</title>
        <meta name="description" content="Learn about StrapHub's shipping policy, delivery times, and tracking information." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-8">Shipping Policy</h1>
              
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <p className="text-muted-foreground leading-relaxed">
                    We appreciate your trust in our products and want to ensure your order arrives safely and on time. Please read our shipping policy carefully before placing your order.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Shipping Availability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We currently ship only within the United Kingdom. All orders are processed and dispatched from our UK-based fulfillment centers to ensure fast and reliable delivery.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Order Processing / Handling Time</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Orders are typically processed within 24 hours (1 day) Monday to Friday, excluding public holidays. Orders placed before 5pm GMT will be processed the same day.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Once your order is shipped, you'll receive a dispatch confirmation email containing tracking details.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Transit Time</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use trusted UK courier partners such as Royal Mail, DPD, and Evri for all deliveries.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-semibold">Express Delivery: 2–5 business days</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Please note that delivery times may vary depending on your location and courier schedules. Delays caused by external factors (e.g., weather, strikes, or postal congestion) are beyond our control.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Shipping Costs</h2>
                  <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <p className="font-semibold text-success">We offer FREE shipping on all UK orders!</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    <strong>Estimated Total Delivery Time:</strong> 3–6 business days (processing + transit) depending on location.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Order Cut-Off and Dispatch</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Orders placed before <strong>5 PM (GMT)</strong> on business days will be processed the same day.</li>
                    <li>Orders placed after this time or on weekends/public holidays will be processed on the next working day.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Tracking Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Once your order has been dispatched, you will receive a tracking number via email. You can use this number to monitor your parcel through the courier's online tracking portal.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    If you haven't received your tracking details within 3 business days of purchase, please contact us at <a href="mailto:info@smartstrapseurope.co.uk" className="text-primary hover:underline">info@smartstrapseurope.co.uk</a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Please double-check your shipping address during checkout. StrapHub cannot be held responsible for delayed or lost deliveries due to incorrect or incomplete address details.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    If you notice an error after placing your order, contact us immediately. We'll do our best to correct it before dispatch.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Damaged or Missing Parcels</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If your package arrives damaged, incomplete, or missing, please contact us within 48 hours of delivery at <a href="mailto:info@smartstrapseurope.co.uk" className="text-primary hover:underline">info@smartstrapseurope.co.uk</a> with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                    <li>Your order number</li>
                    <li>Photos of the packaging and damaged items (if applicable)</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    We'll work quickly to resolve the issue by arranging a replacement or refund as appropriate.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Order Delays</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    While most orders arrive within the expected timeframe, unforeseen circumstances (such as courier delays or extreme weather) may occasionally cause delays. We will notify you promptly if we become aware of significant disruptions.
                  </p>
                </section>

                <section className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Contact Us</h3>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about your shipment or need assistance, please contact us:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li><strong>Store name:</strong> StrapHub</li>
                    <li><strong>Phone:</strong> <a href="tel:+447523999152" className="text-primary hover:underline">+44 7523 999152</a></li>
                    <li><strong>Email:</strong> <a href="mailto:info@smartstrapseurope.co.uk" className="text-primary hover:underline">info@smartstrapseurope.co.uk</a></li>
                    <li><strong>Address:</strong> 2 Langs Road, Armagh, County Armagh, BT60 1ET, United Kingdom</li>
                    <li><strong>Office Hours:</strong> Monday to Friday between 9:00 am to 5:00 pm (GMT)</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  );
};

export default ShippingPolicy;
