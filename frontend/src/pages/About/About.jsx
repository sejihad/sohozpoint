// src/component/About.jsx
import { FaHeadset, FaShieldAlt, FaShippingFast, FaTag } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen container bg-gray-50 py-12">
      {/* Header Section */}
      <div className=" mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            Sohoz <span className="text-emerald-600">Point</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto mb-8"></div>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Sohoz Point is an advanced e-commerce platform that offers a vast
            collection of the latest tech gadgets, essential daily necessities,
            premium apparel, and trending fashion wear. We are committed to
            making everyday shopping easier and more convenient by ensuring all
            necessary products are available at affordable prices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShippingFast className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Quick and reliable shipping across the country
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Secure Shopping
            </h3>
            <p className="text-gray-600">
              100% secure payment and data protection
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeadset className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              24/7 Support
            </h3>
            <p className="text-gray-600">
              Round-the-clock customer service support
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-green-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTag className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Best Prices
            </h3>
            <p className="text-gray-600">
              Competitive pricing with regular discounts
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              To revolutionize online shopping by providing a seamless,
              affordable, and comprehensive platform where customers can find
              everything they need for their daily lives and technological
              aspirations.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
            <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
              Our Vision
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              To become Bangladesh's most trusted and preferred e-commerce
              destination, known for quality products, exceptional service, and
              unbeatable value.
            </p>
          </div>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
          <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 hover:bg-green-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">💻</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Tech Gadgets</h3>
              <p className="text-sm text-gray-600">
                Latest electronics & gadgets
              </p>
            </div>

            <div className="text-center p-4 hover:bg-green-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🛒</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Daily Necessities
              </h3>
              <p className="text-sm text-gray-600">Essential everyday items</p>
            </div>

            <div className="text-center p-4 hover:bg-green-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">👕</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Premium Apparel
              </h3>
              <p className="text-sm text-gray-600">
                Quality clothing & fashion
              </p>
            </div>

            <div className="text-center p-4 hover:bg-green-50 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🌟</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Trending Fashion
              </h3>
              <p className="text-sm text-gray-600">Latest fashion trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
