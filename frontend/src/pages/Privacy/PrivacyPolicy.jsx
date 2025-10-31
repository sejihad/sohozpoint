import { Globe, Lock, Mail, MapPin, Phone, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center text-white">
            <Shield className="mr-3" size={48} />
            Privacy Policy
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Last Updated: November 1, 2025 | Effective Date: December 1, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
          {/* Introduction */}
          <div className="p-8 border-b border-green-100">
            <p className="text-lg text-gray-700">
              Welcome to{" "}
              <span className="font-bold text-green-600">Sohoz Point</span>, a
              product of <span className="font-semibold">Digital Nexgen</span>
              ("we," "our," or "us"). This Privacy Policy describes how we
              collect, use, and protect your information when you use our
              e-commerce platform.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="divide-y divide-green-100">
            {/* Section 1 */}
            <div className="p-8">
              <div className="flex items-start mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Lock className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    1. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        a. Personal Information
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Name, email address, phone number</li>
                        <li>Shipping and billing address</li>
                        <li>Payment information (processed securely)</li>
                        <li>Contact or user profile details</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        b. Usage Data
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Device model and browser information</li>
                        <li>IP address and location data</li>
                        <li>Website interactions and browsing history</li>
                        <li>Order history and preferences</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-2">
                        c. Cookies and Tracking
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        <li>Session cookies for login functionality</li>
                        <li>Analytics cookies for website improvement</li>
                        <li>Preferences cookies for better user experience</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-8">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Shield className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    2. How We Use Your Information
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support and service</li>
                    <li>Send order confirmations and shipping updates</li>
                    <li>Improve website performance and user experience</li>
                    <li>Send promotional offers (with your consent)</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-8 bg-green-50">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Globe className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    3. Data Sharing and Disclosure
                  </h2>
                  <p className="mb-3 text-gray-600">
                    We do not sell your personal data. However, we may share
                    limited data with:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Payment processors for transaction completion</li>
                    <li>Shipping partners for order delivery</li>
                    <li>Trusted service providers (analytics, hosting)</li>
                    <li>When required by law (e.g., legal requests)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4-7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Section 4 */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  4. Payment Security
                </h2>
                <p className="text-gray-600">
                  All payment information is processed through secure, encrypted
                  payment gateways. We do not store your credit card details on
                  our servers.
                </p>
              </div>

              {/* Section 5 */}
              <div className="p-8 border-b border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  5. Data Security
                </h2>
                <p className="text-gray-600 mb-2">
                  We implement SSL encryption, secure server infrastructure, and
                  regular security audits to protect your data.
                </p>
                <p className="text-gray-500 text-sm">
                  Note: While we take comprehensive measures, no system is 100%
                  secure.
                </p>
              </div>

              {/* Section 6 */}
              <div className="p-8 md:border-r border-green-100">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  6. Children's Privacy
                </h2>
                <p className="text-gray-600">
                  Our platform is not intended for children under 13. We do not
                  knowingly collect data from minors.
                </p>
              </div>

              {/* Section 7 */}
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  7. Data Retention
                </h2>
                <p className="text-gray-600">
                  We retain your personal data only as long as necessary to
                  provide our services and as required by law.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="p-8 bg-green-50">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <Lock className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    8. Your Rights and Choices
                  </h2>
                  <p className="mb-3 text-gray-600">
                    You may request access to, correction, or deletion of your
                    data, opt out of marketing communications, and manage cookie
                    preferences.
                  </p>
                  <p className="text-green-600 font-medium">
                    To make a request, please email: sohozpoint.com@gmail.com ,
                    info@sohozpoint.com
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="p-8 border-b border-green-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                9. Policy Changes
              </h2>
              <p className="text-gray-600">
                We may update this policy. Changes will be posted on our website
                with a revised "Last Updated" date.
              </p>
            </div>

            {/* Section 10 */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                10. Contact Us
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
                  <span className="text-gray-600">
                    sohozpoint.com@gmail.com
                  </span>
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
    </div>
  );
};

export default PrivacyPolicy;
