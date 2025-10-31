import { Clock, Shield, Truck } from "lucide-react";

const ShippingPolicy = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center text-white">
            <Truck className="mr-3" size={48} />
            Shipping Policy
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Fast & Reliable Delivery Across Bangladesh
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
          {/* Delivery Timeline */}
          <div className="p-8 border-b border-green-100">
            <div className="flex items-start mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Clock className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Delivery Timeline
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 font-medium">
                      3-5 Working Days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Processing */}
          <div className="p-8 border-b border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Order Processing
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                  1
                </div>
                <span className="text-gray-600">
                  Order placed and payment confirmed
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                  2
                </div>
                <span className="text-gray-600">
                  Order processed within 24 hours
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                  3
                </div>
                <span className="text-gray-600">
                  Handed over to delivery partner
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                  4
                </div>
                <span className="text-gray-600">Out for delivery</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                  5
                </div>
                <span className="text-gray-600">
                  Delivered to your doorstep
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Areas */}
          <div className="p-8 border-b border-green-100 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Delivery Areas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  We Deliver To:
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>All Areas </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tracking & Support */}
          <div className="p-8 border-b border-green-100">
            <div className="flex items-start">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Shield className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Order Tracking & Support
                </h2>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Real-time Tracking
                    </h3>
                    <p className="text-gray-600">
                      Track your order in real-time through our website or
                      mobile app. Get Email updates at every stage of delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="p-8 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Important Notes
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Delivery times may vary during holidays and festivals</li>
              <li>
                We are not responsible for delays caused by courier services or
                natural disasters
              </li>
              <li>Please provide accurate address and contact information</li>
              <li>
                Someone must be available at the delivery address to receive the
                package
              </li>
              <li>
                You can return the product within 7 days if it is undamaged
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
