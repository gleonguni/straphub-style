import { Helmet } from "react-helmet-async";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useState } from "react";

const TermsOfService = () => {
  useScrollToTop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <Helmet>
        <title>Terms of Service | StrapHub UK</title>
        <meta name="description" content="Read StrapHub's terms of service and conditions for using our website and services." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
              
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <p className="text-muted-foreground leading-relaxed">
                    Our Terms of Service ("Terms") govern your access to and use of our website, smartstrapseurope.co.uk, and any related services provided by StrapHub ("StrapHub", "we", "us", or "our"). By using our site, you agree to be bound by these Terms. Please read them carefully before proceeding.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">General Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    This website is operated by StrapHub. Throughout the site, the terms "we," "us," and "our" refer to StrapHub. We offer this website, including all information, tools, and services available from it, to you conditioned upon your acceptance of all terms, conditions, and policies stated here.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    By visiting our site or purchasing from us, you engage in our "Service" and agree to be bound by these Terms, including any additional terms and policies referenced herein.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Online Store Terms</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>You must be at least 18 years old or the age of majority in your jurisdiction to use this site.</li>
                    <li>You may not use our products for any illegal or unauthorized purpose, nor may you violate any laws in your jurisdiction.</li>
                    <li>You agree not to transmit any worms, viruses, or any code of a destructive nature.</li>
                    <li>A breach or violation of any of the Terms will result in an immediate termination of your access to our Services.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Products and Availability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We make every effort to display our products as accurately as possible, including colors, dimensions, and features. However, we cannot guarantee that your device's display will accurately reflect the product colors.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    All products are subject to availability. We reserve the right to discontinue any product at any time or limit the quantities of any products offered.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>All prices are listed in British Pounds (GBP) unless stated otherwise.</li>
                    <li>Prices include VAT where applicable.</li>
                    <li>Shipping costs (if any) are displayed at checkout before you confirm your purchase.</li>
                    <li>We reserve the right to modify prices at any time without prior notice.</li>
                    <li>Payment must be made in full at the time of purchase using one of our secure payment gateways.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Order Confirmation and Cancellations</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    After placing an order, you will receive an order confirmation email. This does not signify our acceptance of your order—we reserve the right to accept or decline any order for any reason.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    A legally binding contract between you and StrapHub is formed once we send you a dispatch confirmation email.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Orders may be cancelled within 12 hours of placement if not yet processed or shipped. Once dispatched, the return policy applies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Shipping and Delivery</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Please refer to our Shipping Policy for detailed information regarding shipping times, carriers, and delivery expectations. We are not responsible for delays caused by courier services, customs, or unforeseen circumstances beyond our control.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Returns and refunds are governed by our Return and Refund Policy. We only accept returns that comply with the conditions outlined in that policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Accuracy of Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive to provide current and accurate information on our website. However, there may be typographical errors, inaccuracies, or omissions related to product descriptions, pricing, promotions, or availability. We reserve the right to correct such errors and to update or cancel orders affected by these errors at any time.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All content on this website—including text, graphics, images, logos, icons, and software—is the property of StrapHub or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, modify, or exploit any part of our content without prior written permission from us.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, StrapHub and its affiliates will not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services, unauthorized access to your data, or any other claim related to your use of our website or products.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Our total liability for any claim shall not exceed the amount paid for the product in question. Nothing in these Terms limits your statutory rights as a consumer or excludes liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to indemnify, defend, and hold harmless StrapHub and its affiliates from any claims, liabilities, damages, or expenses (including legal fees) arising from your violation of these Terms or misuse of our Services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our site may include links to third-party websites not affiliated with StrapHub. We are not responsible for the content, accuracy, or practices of those websites. Accessing third-party links is at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Changes to Terms of Service</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to update, change, or replace any part of these Terms at any time. The latest version will always be available on our website, and continued use of our site after changes are posted constitutes acceptance of the revised Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of England and Wales.
                  </p>
                </section>

                <section className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Company & Contact Information</h3>
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

export default TermsOfService;
