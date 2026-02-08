import { FileText, Mail, MapPin, Phone } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="bg-white container text-gray-800">
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

          {/* Bengali Translation Section */}
          <div className="p-8 bg-green-50 border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              বাংলায় শর্তাবলী
            </h2>

            {/* Section 1 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ১. শর্তাবলী গ্রহণ
              </h3>
              <p className="text-gray-600">
                আমাদের ওয়েবসাইট অ্যাক্সেস বা ব্যবহার করে এবং অর্ডার প্রদানের
                মাধ্যমে আপনি এই শর্তাবলী দ্বারা আবদ্ধ হতে সম্মত হন। আপনি যদি
                সম্মত না হন, দয়া করে আমাদের পরিষেবাগুলি ব্যবহার করবেন না।
              </p>
            </div>

            {/* Section 2 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ২. অর্ডার প্লেসমেন্ট ও পেমেন্ট
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>সমস্ত মূল্য বাংলাদেশী টাকায় (BDT) দেখানো হয়েছে</li>
                <li>
                  প্রমোশনকালীন সময়েও সমস্ত অর্ডারের জন্য ডেলিভারি চার্জ
                  বাধ্যতামূলক
                </li>
                <li>
                  চেকআউটের সময় ডেলিভারি চার্জ মূল পণ্যের মূল্য থেকে কাটা হবে
                </li>
                <li>
                  অর্ডার প্রসেসিং শুরু হওয়ার আগে পেমেন্ট সম্পন্ন করতে হবে
                </li>
                <li>
                  আমরা ক্যাশ অন ডেলিভারি এবং অনলাইন পেমেন্ট পদ্ধতি গ্রহণ করি
                </li>
              </ul>
            </div>

            {/* Section 3 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৩. ডেলিভারি নীতি
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>স্ট্যান্ডার্ড ডেলিভারি সময় ৩-৫ কার্যদিবস</li>
                <li>
                  অবস্থান এবং পণ্যের প্রাপ্যতার উপর ভিত্তি করে ডেলিভারি সময়
                  পরিবর্তিত হতে পারে
                </li>
                <li>
                  কুরিয়ার সার্ভিস বা প্রাকৃতিক দুর্যোগের কারণে delays এর জন্য
                  আমরা দায়ী নই
                </li>
                <li>
                  গ্রাহকদের অবশ্যই সঠিক শিপিং ঠিকানা এবং যোগাযোগের তথ্য প্রদান
                  করতে হবে
                </li>
              </ul>
            </div>

            {/* Section 4 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৪. রিটার্ন ও রিফান্ড নীতি
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    রিটার্ন শর্তাবলী:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>ভিডিও ছাড়া কোনো ধরনের ক্লেইম গ্রহণযোগ্য হবে না।</li>
                    <li>
                      প্রোডাক্ট হাতে পাওয়ার সময় অবশ্যই Unboxing Video করতে হবে।
                    </li>
                    <li>
                      যদি কোনো সমস্যা থাকে, তাহলে সেই Unboxing Video সহ আমাদের
                    </li>
                    <li>ডেলিভারির ৭ দিনের মধ্যে পণ্য ফেরত দেওয়া যাবে</li>
                    <li>
                      পণ্য অবশ্যই ট্যাগ এবং প্যাকেজিং সহ আসল অবস্থায় থাকতে হবে
                    </li>
                    <li>পণ্যে কোন ক্ষতি বা ব্যবহারের চিহ্ন থাকা যাবে না</li>
                    <li>আসল ইনভয়েস উপস্থাপন করতে হবে</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    রিফান্ড প্রক্রিয়া:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>
                      অর্ডার বাতিল করতে আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন
                    </li>
                    <li>
                      রিফান্ডের জন্য, আপনার ব্যাংক অ্যাকাউন্টের বিবরণ প্রদান
                      করুন (অ্যাকাউন্ট নম্বর, ব্যাংকের নাম, শাখা)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 5 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৫. বাতিলকরণ নীতি
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>শিপমেন্টের আগে অর্ডার বাতিল করা যাবে</li>
                <li>একবার শিপ করা হলে, অর্ডার বাতিল করা যাবে না</li>
                <li>
                  বাতিলকৃত অর্ডারের জন্য, রিফান্ড নীতি অনুযায়ী রিফান্ড প্রসেস
                  করা হবে
                </li>
                <li>
                  ওয়েবসাইটের মাধ্যমে অর্ডার প্লেস করার ১২ ঘন্টার মধ্যে অর্ডার
                  বাতিল করা যাবে
                </li>
                <li>
                  আপনি যদি ১২ ঘন্টার মধ্যে আপনার অর্ডার বাতিল না করেন, তাহলে
                  ডেলিভারি চার্জ ফেরত দেওয়া হবে না
                </li>
                <li>
                  ১২ ঘন্টার পরে, বাতিলকরণের অনুরোধ ইমেল বা ফোনের মাধ্যমে করতে
                  হবে
                </li>
              </ul>
            </div>

            {/* Section 6 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৬. পণ্যের গুণমান ও ওয়ারেন্টি
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>আমরা ওয়েবসাইটে বর্ণিত হিসাবে পণ্যের গুণমান নিশ্চিত করি</li>
                <li>
                  পণ্যের ছবি শুধুমাত্র রেফারেন্সের জন্য; আসল পণ্য সামান্য ভিন্ন
                  হতে পারে
                </li>
                <li>
                  যেখানে প্রযোজ্য সেখানে প্রস্তুতকারকের ওয়ারেন্টি প্রযোজ্য
                </li>
                <li>
                  ডেলিভারির ২৪ ঘন্টার মধ্যে কোন গুণমান সমস্যার জন্য আমাদের সাথে
                  যোগাযোগ করুন
                </li>
              </ul>
            </div>

            {/* Section 7 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৭. ব্যবহারকারী অ্যাকাউন্ট ও নিরাপত্তা
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>আপনার লগইন ক্রেডেনশিয়াল সুরক্ষিত এবং গোপন রাখুন</li>
                <li>
                  আপনার অ্যাকাউন্টের অধীনে সমস্ত কার্যকলাপের জন্য আপনি দায়ী
                </li>
                <li>
                  কোন অননুমোদিত অ্যাকাউন্ট ব্যবহারের কথা আমাদের অবিলম্বে জানান
                </li>
              </ul>
            </div>

            {/* Section 8 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৮. বুদ্ধিবৃত্তিক সম্পত্তি
              </h3>
              <p className="text-gray-600">
                এই ওয়েবসাইটে ব্যবহৃত সমস্ত কন্টেন্ট, লোগো, পণ্যের ছবি এবং
                সফ্টওয়্যার Digital Nexgen বা এর লাইসেন্সকারীদের মালিকানাধীন।
                আমাদের লিখিত অনুমতি ছাড়া আপনি কোন কন্টেন্ট কপি, বিতরণ বা
                ব্যবহার করতে পারবেন না।
              </p>
            </div>

            {/* Section 9 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ৯. দায় সীমাবদ্ধতা
              </h3>
              <p className="text-gray-600 mb-2">
                Sohoz Point কোন পরোক্ষ বা অপ্রত্যাশিত ক্ষতির জন্য দায়ী নয়।
                আমাদের মোট দায়িত্ব আপনি যে পণ্য ক্রয় করেছেন তার মূল্যের মধ্যে
                সীমাবদ্ধ।
              </p>
              <p className="text-gray-500 text-sm">
                আপনার নিজের ঝুঁকিতে আমাদের পরিষেবাগুলি ব্যবহার করুন।
              </p>
            </div>

            {/* Section 10 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ১০. শর্তাবলীতে পরিবর্তন
              </h3>
              <p className="text-gray-600">
                আমরা সময়ে সময়ে এই শর্তাবলী আপডেট করতে পারি। আপডেটের পরে আমাদের
                পরিষেবাগুলি ব্যবহার চালিয়ে যাওয়ার অর্থ আপনি সংশোধিত শর্তাবলী
                গ্রহণ করেছেন।
              </p>
            </div>

            {/* Section 11 Bengali */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                ১১. আইন governing
              </h3>
              <p className="text-gray-600">
                এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের আইন দ্বারা নিয়ন্ত্রিত এবং
                এর অনুসারে ব্যাখ্যা করা হয়।
              </p>
            </div>
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
