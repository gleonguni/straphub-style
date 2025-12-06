import { Helmet } from "react-helmet-async";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useState } from "react";

const PrivacyPolicy = () => {
  useScrollToTop();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <>
      <Helmet>
        <title>Privacy Policy | StrapHub UK</title>
        <meta name="description" content="Learn how StrapHub collects, uses, and protects your personal information." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header cartCount={totalItems} onCartClick={() => setIsCartOpen(true)} />

        <main className="flex-1">
          <div className="container py-12 md:py-16">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground mb-8">Last updated: December 6, 2025</p>
              
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <p className="text-muted-foreground leading-relaxed">
                    StrapHub operates this store and website, including all related information, content, features, tools, products and services, in order to provide you, the customer, with a curated shopping experience (the "Services"). StrapHub is powered by Shopify, which enables us to provide the Services to you. This Privacy Policy describes how we collect, use, and disclose your personal information when you visit, use, or make a purchase or other transaction using the Services or otherwise communicate with us.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Please read this Privacy Policy carefully. By using and accessing any of the Services, you acknowledge that you have read this Privacy Policy and understand the collection, use, and disclosure of your information as described in this Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Personal Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may collect or process the following categories of personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Contact details</strong> including your name, address, billing address, shipping address, phone number, and email address.</li>
                    <li><strong>Financial information</strong> including credit card, debit card, and financial account numbers, payment card information, transaction details.</li>
                    <li><strong>Account information</strong> including your username, password, security questions, preferences and settings.</li>
                    <li><strong>Transaction information</strong> including the items you view, put in your cart, add to your wishlist, or purchase.</li>
                    <li><strong>Communications with us</strong> including the information you include in communications with us.</li>
                    <li><strong>Device information</strong> including information about your device, browser, or network connection, your IP address.</li>
                    <li><strong>Usage information</strong> including information regarding your interaction with the Services.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Personal Information Sources</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may collect personal information from the following sources:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Directly from you when you create an account, visit or use the Services, or communicate with us</li>
                    <li>Automatically through the Services including through cookies and similar technologies</li>
                    <li>From our service providers when they collect or process your personal information on our behalf</li>
                    <li>From our partners or other third parties</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">How We Use Your Personal Information</h2>
                  <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                    <li><strong>Provide, Tailor, and Improve the Services:</strong> We use your personal information to provide you with the Services, process payments, fulfill orders, and create a customized shopping experience.</li>
                    <li><strong>Marketing and Advertising:</strong> We use your personal information for marketing and promotional purposes, such as sending marketing communications and showing you online advertisements.</li>
                    <li><strong>Security and Fraud Prevention:</strong> We use your personal information to authenticate your account, provide a secure payment experience, and detect possible fraudulent activity.</li>
                    <li><strong>Communicating with You:</strong> We use your personal information to provide customer support and maintain our business relationship.</li>
                    <li><strong>Legal Reasons:</strong> We use your personal information to comply with applicable law or respond to valid legal process.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">How We Disclose Personal Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may disclose your personal information to third parties for legitimate purposes:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>With Shopify, vendors and other third parties who perform services on our behalf</li>
                    <li>With business and marketing partners to provide marketing services</li>
                    <li>When you direct, request or consent to our disclosure</li>
                    <li>With our affiliates or within our corporate group</li>
                    <li>In connection with a business transaction or to comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Third Party Websites and Links</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Services may provide links to websites or online platforms operated by third parties. If you follow links to sites not affiliated with us, you should review their privacy and security policies. We are not responsible for the privacy or security of such sites.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Children's Data</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The Services are not intended to be used by children, and we do not knowingly collect any personal information about children under the age of majority.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Security and Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    No security measures are perfect or impenetrable. We recommend that you do not use unsecure channels to communicate sensitive information to us. How long we retain your personal information depends on factors such as whether we need the information to maintain your account or comply with legal obligations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Depending on where you live, you may have some or all of the following rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Right to Access:</strong> Request access to personal information we hold about you</li>
                    <li><strong>Right to Delete:</strong> Request that we delete personal information we maintain about you</li>
                    <li><strong>Right to Correct:</strong> Request that we correct inaccurate personal information</li>
                    <li><strong>Right of Portability:</strong> Receive a copy of the personal information we hold about you</li>
                    <li><strong>Managing Communication Preferences:</strong> Opt out of promotional emails using the unsubscribe option</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will post the revised Privacy Policy on this website and update the "Last updated" date.
                  </p>
                </section>

                <section className="bg-muted p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Contact Us</h3>
                  <p className="text-muted-foreground">
                    Should you have any questions about our privacy practices or this Privacy Policy, please contact us:
                  </p>
                  <ul className="mt-4 space-y-2 text-muted-foreground">
                    <li><strong>Email:</strong> <a href="mailto:info@smartstrapseurope.co.uk" className="text-primary hover:underline">info@smartstrapseurope.co.uk</a></li>
                    <li><strong>Address:</strong> 2 Langs Road, Armagh, County Armagh, BT60 1ET, United Kingdom</li>
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

export default PrivacyPolicy;
