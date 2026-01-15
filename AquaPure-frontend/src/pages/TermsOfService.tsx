import SEO from "@/components/SEO";

const TermsOfService = () => {
  return (
    <div className="min-h-screen py-12">
      <SEO
        title="Terms of Service"
        description="Read the terms and conditions for using AquaPure services and purchasing products."
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AquaPure's website and services, you accept and agree to be bound
              by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Products and Services</h2>
            <p>
              We strive to provide accurate product descriptions and pricing. However, we reserve the
              right to correct errors, update information, or cancel orders if necessary.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Orders and Payment</h2>
            <ul>
              <li>All orders are subject to acceptance and availability</li>
              <li>Prices are in Indian Rupees (INR) and include applicable taxes</li>
              <li>Payment must be received before order processing</li>
              <li>We accept credit/debit cards, UPI, net banking, and cash on delivery</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Shipping and Delivery</h2>
            <p>
              Delivery times are estimates and may vary. We are not liable for delays caused by
              circumstances beyond our control. See our Shipping Policy for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Returns and Refunds</h2>
            <p>
              Products may be returned within 7 days of delivery in unused condition. Refunds will be
              processed within 7-10 business days. See our Refund Policy for complete details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Warranty</h2>
            <p>
              All products come with manufacturer's warranty. Warranty terms vary by product. Please
              refer to product documentation for specific warranty information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and
              for all activities under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              AquaPure shall not be liable for any indirect, incidental, or consequential damages
              arising from the use of our products or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
              <br />
              Email: legal@aquapure.com
              <br />
              Phone: 1800-123-AQUA
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
