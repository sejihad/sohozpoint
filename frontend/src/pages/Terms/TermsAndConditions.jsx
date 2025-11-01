import { FileText, Mail, MapPin, Phone } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center text-white">
            <FileText className="mr-3" size={48} />
            Terms & Conditions
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Effective Date: November 1, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden divide-y divide-green-100 border border-green-100">
          {/* Intro */}
          <div className="p-8">
            <p className="text-lg text-gray-700">
              Welcome to{" "}
              <span className="font-bold text-green-600">Sohoz Point</span>{" "}
              e-commerce platform ("Website"), operated by{" "}
              <span className="font-semibold">Digital Nexgen</span> ("we,"
              "our," or "us"). These Terms & Conditions ("Terms") govern your
              use of our website and services.
            </p>
          </div>

          {/* Section 1 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600">
              By accessing or using our website and placing orders, you agree to
              be bound by these Terms. If you do not agree, please do not use
              our services.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. Order Placement & Payment
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>All prices are shown in Bangladeshi Taka (BDT)</li>
              <li>
                Delivery charges are mandatory for all orders, even during
                promotional periods
              </li>
              <li>
                Delivery charges will be deducted from the main product price
                during checkout
              </li>
              <li>Payment must be completed before order processing begins</li>
              <li>We accept cash on delivery and online payment methods</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Delivery Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Standard delivery time is 3-5 working days</li>
              <li>
                Delivery times may vary based on location and product
                availability
              </li>
              <li>
                We are not responsible for delays caused by courier services or
                natural disasters
              </li>
              <li>
                Customers must provide accurate shipping address and contact
                information
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Return & Refund Policy
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Return Conditions:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>Products can be returned within 7 days of delivery</li>
                  <li>
                    Products must be in original condition with tags and
                    packaging
                  </li>
                  <li>No damage or signs of use on the product</li>
                  <li>Original invoice must be presented</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Refund Process:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>To cancel an order, contact our customer service</li>
                  <li>
                    For refunds, provide your bank account details (account
                    number, bank name, branch)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Cancellation Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Orders can be cancelled before shipment</li>
              <li>Once shipped, orders cannot be cancelled</li>
              <li>
                For cancelled orders, refund will be processed as per refund
                policy
              </li>
              <li>
                Orders can be cancelled within 12 hours of placement through the
                website
              </li>
              <li>
                If you do not cancel your order within 12 hours, the delivery
                charge will not be refunded.
              </li>
              <li>
                After 12 hours, cancellation requests must be made via email or
                phone
              </li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Product Quality & Warranty
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>We ensure product quality as described on the website</li>
              <li>
                Product images are for reference; actual product may vary
                slightly
              </li>
              <li>Manufacturer's warranty applies where applicable</li>
              <li>
                Contact us for any quality issues within 24 hours of delivery
              </li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. User Accounts & Security
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Keep your login credentials secure and confidential</li>
              <li>You are responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized account use</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-gray-600">
              All content, logos, product images, and software used on this
              website are owned by Digital Nexgen or its licensors. You may not
              copy, distribute, or use any content without our written
              permission.
            </p>
          </div>

          {/* Section 9 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-2">
              Sohoz Point is not responsible for any indirect or unexpected
              losses. Our total liability is limited to the value of the
              products you purchased.
            </p>
            <p className="text-gray-500 text-sm">
              Use our services at your own risk.
            </p>
          </div>

          {/* Section 10 */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-600">
              We may update these Terms from time to time. Continued use of our
              services after updates means you accept the revised Terms.
            </p>
          </div>

          {/* Section 11 */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-600">
              These Terms are governed by and construed in accordance with the
              laws of the People's Republic of Bangladesh.
            </p>
          </div>

          {/* Section 12 */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Contact Us
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="text-green-600 mr-3" size={20} />
                <span className="text-gray-600">
                  73, NilerPara, Joydebpur; Gazipur Sadar, Bangladesh
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="text-green-600 mr-3" size={20} />
                <span className="text-gray-600">sohozpoint.com@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-green-600 mr-3" size={20} />
                <span className="text-gray-600">01627283382</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-green-600 mr-3" size={20} />
                <span className="text-gray-600">
                  +880 1577-344846 (WhatsApp)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
