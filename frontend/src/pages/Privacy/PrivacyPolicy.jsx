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
            Last Updated: November 1, 2025
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

            {/* Bengali Translation Section */}
            <div className="p-8 bg-green-50 border-t-4 border-green-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                বাংলায় গোপনীয়তা নীতি
              </h2>

              {/* Section 1 Bengali */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  ১. আমরা কোন তথ্য সংগ্রহ করি
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      ক. ব্যক্তিগত তথ্য
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>নাম, ইমেইল ঠিকানা, ফোন নম্বর</li>
                      <li>শিপিং এবং বিলিং ঠিকানা</li>
                      <li>পেমেন্ট তথ্য (সুরক্ষিতভাবে প্রক্রিয়াকৃত)</li>
                      <li>যোগাযোগ বা ব্যবহারকারী প্রোফাইল বিবরণ</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      খ. ব্যবহারের তথ্য
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>ডিভাইস মডেল এবং ব্রাউজার তথ্য</li>
                      <li>আইপি ঠিকানা এবং অবস্থান ডেটা</li>
                      <li>ওয়েবসাইট ইন্টারঅ্যাকশন এবং ব্রাউজিং ইতিহাস</li>
                      <li>অর্ডার ইতিহাস এবং পছন্দ</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      গ. কুকিজ এবং ট্র্যাকিং
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>লগইন কার্যকারিতার জন্য সেশন কুকিজ</li>
                      <li>ওয়েবসাইট উন্নতির জন্য অ্যানালিটিক্স কুকিজ</li>
                      <li>ভাল ব্যবহারকারী অভিজ্ঞতার জন্য পছন্দ কুকিজ</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2 Bengali */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  ২. আমরা আপনার তথ্য কিভাবে ব্যবহার করি
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>আপনার অর্ডার প্রক্রিয়া এবং সম্পূর্ণ করা</li>
                  <li>গ্রাহক সহায়তা এবং পরিষেবা প্রদান</li>
                  <li>অর্ডার নিশ্চিতকরণ এবং শিপিং আপডেট পাঠানো</li>
                  <li>
                    ওয়েবসাইট পারফরম্যান্স এবং ব্যবহারকারী অভিজ্ঞতা উন্নত করা
                  </li>
                  <li>প্রচারমূলক অফার পাঠানো (আপনার সম্মতিতে)</li>
                  <li>আইনি বাধ্যবাধকতা পালন করা</li>
                </ul>
              </div>

              {/* Section 3 Bengali */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  ৩. তথ্য শেয়ারিং এবং প্রকাশ
                </h3>
                <p className="mb-3 text-gray-600">
                  আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না। তবে, আমরা সীমিত তথ্য
                  শেয়ার করতে পারি:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>লেনদেন সম্পূর্ণ করার জন্য পেমেন্ট প্রসেসরদের সাথে</li>
                  <li>অর্ডার ডেলিভারির জন্য শিপিং পার্টনাদের সাথে</li>
                  <li>
                    বিশ্বস্ত পরিষেবা প্রদানকারীদের সাথে (অ্যানালিটিক্স, হোস্টিং)
                  </li>
                  <li>যখন আইন দ্বারা প্রয়োজন (যেমন, আইনি অনুরোধ)</li>
                </ul>
              </div>

              {/* Section 4-7 Bengali Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Section 4 Bengali */}
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    ৪. পেমেন্ট সুরক্ষা
                  </h3>
                  <p className="text-gray-600">
                    সমস্ত পেমেন্ট তথ্য সুরক্ষিত, এনক্রিপ্টেড পেমেন্ট গেটওয়ের
                    মাধ্যমে প্রক্রিয়াকৃত হয়। আমরা আপনার ক্রেডিট কার্ডের বিবরণ
                    আমাদের সার্ভারে সংরক্ষণ করি না।
                  </p>
                </div>

                {/* Section 5 Bengali */}
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    ৫. তথ্য সুরক্ষা
                  </h3>
                  <p className="text-gray-600 mb-2">
                    আমরা আপনার ডেটা রক্ষা করতে SSL এনক্রিপশন, সুরক্ষিত সার্ভার
                    অবকাঠামো এবং নিয়মিত সুরক্ষা অডিট বাস্তবায়ন করি।
                  </p>
                  <p className="text-gray-500 text-sm">
                    নোট: আমরা ব্যাপক ব্যবস্থা নিলেও, কোন সিস্টেম ১০০% সুরক্ষিত
                    নয়।
                  </p>
                </div>

                {/* Section 6 Bengali */}
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    ৬. শিশুদের গোপনীয়তা
                  </h3>
                  <p className="text-gray-600">
                    আমাদের প্ল্যাটফর্ম ১৩ বছরের কম বয়সী শিশুদের জন্য নয়। আমরা
                    ইচ্ছাকৃতভাবে নাবালকদের কাছ থেকে ডেটা সংগ্রহ করি না।
                  </p>
                </div>

                {/* Section 7 Bengali */}
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    ৭. তথ্য ধারণ
                  </h3>
                  <p className="text-gray-600">
                    আমরা আপনার ব্যক্তিগত ডেটা শুধুমাত্র আমাদের পরিষেবা প্রদানের
                    জন্য এবং আইন দ্বারা প্রয়োজনীয় সময় পর্যন্ত রাখি।
                  </p>
                </div>
              </div>

              {/* Section 8 Bengali */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  ৮. আপনার অধিকার এবং পছন্দ
                </h3>
                <p className="mb-3 text-gray-600">
                  আপনি আপনার ডেটা অ্যাক্সেস, সংশোধন বা মুছে ফেলার জন্য অনুরোধ
                  করতে পারেন, বিপণন যোগাযোগ থেকে অপ্ট আউট করতে পারেন এবং কুকি
                  পছন্দ পরিচালনা করতে পারেন।
                </p>
                <p className="text-green-600 font-medium">
                  অনুরোধ করতে, দয়া করে ইমেল করুন: sohozpoint.com@gmail.com,
                  info@sohozpoint.com
                </p>
              </div>

              {/* Section 9 Bengali */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  ৯. নীতি পরিবর্তন
                </h3>
                <p className="text-gray-600">
                  আমরা এই নীতি আপডেট করতে পারি। পরিবর্তনগুলি আমাদের ওয়েবসাইটে
                  একটি সংশোধিত "সর্বশেষ আপডেট" তারিখ সহ পোস্ট করা হবে।
                </p>
              </div>
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
