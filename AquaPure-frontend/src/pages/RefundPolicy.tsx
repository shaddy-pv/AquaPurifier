import SEO from "@/components/SEO";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen py-12">
      <SEO
        title="Refund & Return Policy"
        description="Learn about AquaPure's refund and return policy for water purifiers and services."
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Refund & Return Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Return Eligibility</h2>
            <p>Products can be returned within 7 days of delivery if:</p>
            <ul>
              <li>Product is unused and in original condition</li>
              <li>Original packaging and accessories are intact</li>
              <li>Product has not been installed or tampered with</li>
              <li>Invoice and warranty card are included</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Non-Returnable Items</h2>
            <ul>
              <li>Products with broken seals or used filters</li>
              <li>Installed products (unless defective)</li>
              <li>Products damaged due to misuse</li>
              <li>Promotional or clearance items (unless defective)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Return Process</h2>
            <ol>
              <li>Contact customer support within 7 days of delivery</li>
              <li>Provide order number and reason for return</li>
              <li>Our team will arrange pickup (free for defective products)</li>
              <li>Product will be inspected upon receipt</li>
              <li>Refund will be processed if conditions are met</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Refund Timeline</h2>
            <ul>
              <li>Refund initiated within 2-3 business days of product receipt</li>
              <li>Amount credited to original payment method within 7-10 business days</li>
              <li>For COD orders, refund via bank transfer (provide bank details)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Exchange Policy</h2>
            <p>
              Products can be exchanged within 15 days for size/model changes. Exchange is subject to
              availability and price difference (if any) must be paid.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Defective Products</h2>
            <p>
              If you receive a defective product, contact us immediately. We will arrange free pickup
              and provide replacement or full refund including shipping charges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cancellation Policy</h2>
            <ul>
              <li>Orders can be cancelled before dispatch at no charge</li>
              <li>After dispatch, return policy applies</li>
              <li>Refund for cancelled orders processed within 5-7 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>
              For returns and refunds, contact:
              <br />
              Email: returns@aquapure.com
              <br />
              Phone: 1800-123-AQUA
              <br />
              Hours: Mon-Sat, 9 AM - 7 PM
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
