import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-16 mb-16">
      <div className="container mx-auto px-4 space-y-12">
        {/* First Section: Description + App/Social */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Description */}
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Sohoz Point
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Sohoz Point is an advanced e-commerce platform that offers a
                vast collection of the latest tech gadgets, essential daily
                necessities, premium apparel, and trending fashion wear. We are
                committed to making everyday shopping easier and more convenient
                by ensuring all necessary products are available at affordable
                prices.
              </p>
            </div>

            {/* Social Links - Moved here */}
            <div className="flex gap-6 pt-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/sohoozpoint"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <div className="bg-gray-100 hover:bg-blue-50 p-3 rounded-full transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.796.143v3.24l-1.92.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z" />
                  </svg>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/sohozpoint"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-pink-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <div className="bg-gray-100 hover:bg-pink-50 p-3 rounded-full transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838A6.162 6.162 0 105.838 12 6.162 6.162 0 0012 5.838zm0 10.162a3.999 3.999 0 113.999-3.999A4.004 4.004 0 0112 16zm6.406-11.845a1.44 1.44 0 11-1.44 1.44 1.44 1.44 0 011.44-1.44z" />
                  </svg>
                </div>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-red-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <div className="bg-gray-100 hover:bg-red-50 p-3 rounded-full transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a2.97 2.97 0 00-2.09-2.103C19.414 3.5 12 3.5 12 3.5s-7.414 0-9.408.583A2.97 2.97 0 00.502 6.186C0 8.182 0 12 0 12s0 3.818.502 5.814a2.97 2.97 0 002.09 2.103C4.586 20.5 12 20.5 12 20.5s7.414 0 9.408-.583a2.97 2.97 0 002.09-2.103C24 15.818 24 12 24 12s0-3.818-.502-5.814zM9.75 15.02v-6.04L15.5 12l-5.75 3.02z" />
                  </svg>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
              >
                <div className="bg-gray-100 hover:bg-blue-50 p-3 rounded-full transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14C2.239 0 0 2.239 0 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.761-2.238-5-5-5zM7.34 20.452H3.893V9.035H7.34v11.417zM5.617 7.64a1.997 1.997 0 110-3.994 1.997 1.997 0 010 3.994zM20.452 20.452h-3.448v-5.879c0-1.402-.028-3.207-1.954-3.207-1.957 0-2.257 1.527-2.257 3.103v5.983h-3.448V9.035h3.312v1.557h.047c.462-.875 1.593-1.797 3.277-1.797 3.504 0 4.15 2.306 4.15 5.304v6.353z" />
                  </svg>
                </div>
              </a>
            </div>
          </div>

          {/* App Download */}
          <div className="lg:w-1/2 flex flex-col items-start lg:items-end space-y-6">
            <div className="space-y-4 text-left lg:text-right">
              <h3 className="text-xl font-semibold text-gray-800">
                Get the App
              </h3>
              <p className="text-gray-600 max-w-md">
                Download our mobile app for faster shopping, exclusive deals,
                and seamless experience on the go.
              </p>
            </div>

            {/* App Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=com.facebook.katana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[180px]"
              >
                <svg
                  className="w-8 h-8 mr-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L12.5 12l5.198-5.197zM5.864 2.658L16.802 8.99 12.5 12 5.864 2.658z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-90">GET IT ON</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>

              <a
                href="https://apps.apple.com/app/sohoj-point/id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-black text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-w-[180px]"
              >
                <svg
                  className="w-8 h-8 mr-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-90">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Second Section: Menu Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="hidden md:flex text-gray-600 hover:text-green-600 transition-all duration-300  items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className="hidden md:flex text-gray-600 hover:text-green-600 transition-all duration-300  items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-gray-600 hover:text-green-600 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Legal
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-green-600 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-green-600 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-600 hover:text-green-600 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              Company
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-green-600 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-green-600 transition-all duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Sohoz Point. All rights reserved.
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              to="/terms"
              className="text-gray-500 hover:text-green-600 text-sm transition-all duration-300 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-green-600 text-sm transition-all duration-300 hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Developed by {""}
            <a
              href="https://digitalnexgen.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium transition-all duration-300 hover:underline"
            >
              Digital NexGen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
