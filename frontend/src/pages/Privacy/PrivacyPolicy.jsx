import { Globe, Lock, Mail, MapPin, Phone, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-900 text-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center">
            <Shield className="mr-3" size={48} />
            Privacy Policy
          </h1>
          <p className="text-xl text-blue-300 max-w-3xl mx-auto">
            Last Updated: July 14, 2025 | Effective Date: July 14, 2025
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          {/* Introduction */}
          <div className="p-8 border-b border-gray-700">
            <p className="text-lg">
              Welcome to{" "}
              <span className="font-bold text-indigo-400">Eagles Boost</span>, a
              product of{" "}
              <span className="font-semibold">Time Innovation LLC</span>
              ("we," "our," or "us"). This Privacy Policy describes how we
              collect, use, and protect your information when you use our mobile
              application.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="divide-y divide-gray-700">
            {/* Section 1 */}
            <div className="p-8">
              <div className="flex items-start mb-4">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Lock className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    1. Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        a. Personal Information
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>Name, email address, phone number</li>
                        <li>Location (if enabled)</li>
                        <li>Contact or user profile details</li>
                      </ul>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        b. Usage Data
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>Device model and OS version</li>
                        <li>IP address</li>
                        <li>App interactions and crash logs</li>
                      </ul>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-300 mb-2">
                        c. Device Permissions
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>Camera or photos (for content upload)</li>
                        <li>Location (for location-based services)</li>
                        <li>Notifications (for alerts)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-8">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Shield className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    2. How We Use Your Information
                  </h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>Deliver core services through the app</li>
                    <li>Improve app performance and user experience</li>
                    <li>Send push notifications and updates (with consent)</li>
                    <li>Provide customer support</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-8 bg-gray-700/20">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Globe className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    3. Data Sharing and Disclosure
                  </h2>
                  <p className="mb-3 text-gray-400">
                    We do not sell your personal data. However, we may share
                    limited data with:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-400">
                    <li>
                      Trusted third-party service providers (analytics, cloud
                      storage)
                    </li>
                    <li>
                      When required by law (e.g., legal requests,
                      investigations)
                    </li>
                    <li>
                      For business transfers (e.g., merger or acquisition)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4-7 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Section 4 */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-gray-700">
                <h2 className="text-xl font-bold text-white mb-3">
                  4. Third-Party Services
                </h2>
                <p className="text-gray-400">
                  Our app may include links to external services. We recommend
                  reviewing their privacy policies separately.
                </p>
              </div>

              {/* Section 5 */}
              <div className="p-8 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white mb-3">
                  5. Data Security
                </h2>
                <p className="text-gray-400 mb-2">
                  We implement encryption protocols, secure server
                  infrastructure, and limited data access.
                </p>
                <p className="text-gray-500 text-sm">
                  Note: No system is 100% secure, and we cannot guarantee
                  absolute protection.
                </p>
              </div>

              {/* Section 6 */}
              <div className="p-8 md:border-r border-gray-700">
                <h2 className="text-xl font-bold text-white mb-3">
                  6. Children's Privacy
                </h2>
                <p className="text-gray-400">
                  Our app is not intended for children under 13. We do not
                  knowingly collect data from minors.
                </p>
              </div>

              {/* Section 7 */}
              <div className="p-8">
                <h2 className="text-xl font-bold text-white mb-3">
                  7. International Data Transfers
                </h2>
                <p className="text-gray-400">
                  Data may be transferred and processed in the U.S. where our
                  servers are located.
                </p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="p-8 bg-gray-700/20">
              <div className="flex items-start">
                <div className="bg-indigo-900/50 p-2 rounded-full mr-4">
                  <Lock className="text-indigo-400" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    8. Your Rights and Choices
                  </h2>
                  <p className="mb-3 text-gray-400">
                    You may request access to or deletion of your data, opt out
                    of notifications, and revoke app permissions through your
                    device settings.
                  </p>
                  <p className="text-indigo-400 font-medium">
                    To make a request, please email: info@eaglesboost.com
                  </p>
                </div>
              </div>
            </div>

            {/* Section 9 */}
            <div className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-3">
                9. Policy Changes
              </h2>
              <p className="text-gray-400">
                We may update this policy. Changes will be posted in the app
                with a revised "Last Updated" date.
              </p>
            </div>

            {/* Section 10 */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                10. Contact Us
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="text-indigo-400 mr-3" size={20} />
                  <span className="text-gray-400">
                    Eagles Boost, 7537 Desoto Av, Canoga Park, California
                    91303, USA.
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="text-indigo-400 mr-3" size={20} />
                  <span className="text-gray-400">info@eaglesboost.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="text-indigo-400 mr-3" size={20} />
                  <span className="text-gray-400">+1 (818) 334-7704</span>
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
