import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12">
      <SEO
        title="Privacy Policy"
        description="Learn how PRAYAG RO collects, uses, and protects your personal information."
      />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name, email address, phone number, and shipping address</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences and feedback</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about products, services, and promotions</li>
              <li>Improve our website and customer service</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Payment processors for transaction processing</li>
              <li>Shipping partners for order delivery</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze site usage,
              and assist in our marketing efforts. See our Cookie Policy for more details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@prayagro.com
              <br />
              Phone: +91 9140967681
            </p>
          </section>

          <section className="mb-8 p-6 bg-sky-50/60 rounded-2xl border border-sky-100">
            <h2 className="text-2xl font-semibold mb-3 text-slate-900">8. Grievance Redressal Officer (Statutory Compliance)</h2>
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              In accordance with the Information Technology Act, 2000, and Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020, the contact details of the designated Grievance Officer are:
            </p>
            <div className="text-sm text-slate-800 space-y-1 font-medium">
              <p><strong>Name / Officer:</strong> Grievance Redressal Officer</p>
              <p><strong>Entity:</strong> PRAYAG RO</p>
              <p><strong>Store & Office Address:</strong> PRAYAG RO, 31/3B Rajrooppur, Prayagraj, UP - 211011, India</p>
              <p><strong>Direct Email:</strong> grievance@prayagro.com</p>
              <p><strong>Helpline:</strong> +91 9140967681 (Mon - Sat, 10:00 AM - 6:00 PM IST)</p>
              <p className="text-xs text-slate-500 pt-2">
                * All consumer complaints and data grievances are officially acknowledged within 48 hours and redressed within 30 calendar days.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
