import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { initializeCoinPurchase } from "../../actions/coinPurchaseAction";
import eps_image from "/eps-image.jpg";
const CoinBuy = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.coinPurchase);

  const [coins, setCoins] = useState(20);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const quickOptions = useMemo(() => [20, 50, 100, 250, 500, 1000], []);

  const handleBuy = () => {
    const n = Number(coins);

    if (!Number.isInteger(n) || n < 20 || n > 5000) {
      toast.error("Coins must be an integer between 20 and 5000");
      return;
    }

    dispatch(initializeCoinPurchase(n));
  };

  const nCoins = Number(coins);
  const isValid = Number.isInteger(nCoins) && nCoins >= 20 && nCoins <= 5000;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <div className="h-1 w-1 rounded-full bg-emerald-500" />
            <span>Secure Payment</span>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Purchase Coins
          </h1>
          <p className="text-slate-600 text-lg">
            Select the amount you'd like to add to your wallet
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter amount
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    ৳
                  </div>

                  <input
                    type="number"
                    min={20}
                    max={5000}
                    step={1}
                    value={coins}
                    onChange={(e) =>
                      setCoins(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className={`
                      w-full pl-12 pr-4 py-4 text-lg rounded-xl border
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                      transition-all duration-200
                      ${
                        !isValid && coins !== ""
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 hover:border-slate-300"
                      }
                    `}
                    placeholder="0"
                  />
                </div>

                {/* Validation Message */}
                {!isValid && coins !== "" && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Please enter a valid amount between 20 and 5000
                  </p>
                )}
              </div>

              {/* Quick Select */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-6">
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Quick select
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickOptions.map((v) => (
                    <button
                      key={v}
                      onClick={() => setCoins(v)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          Number(coins) === v
                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                            : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                        }
                      `}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Payment Method
              </h3>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className=" bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                  <img src={eps_image} alt="" />
                  {/* <svg
                    className="w-6 h-6 text-slate-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg> */}
                </div>
                <div>
                  {/* <p className="text-sm text-slate-600">Instant payment</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-6">
              <div className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Coins</span>
                    <span className="font-medium text-slate-900">
                      {isValid ? nCoins : 0}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Price per coin</span>
                    <span className="font-medium text-slate-900">৳1</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-emerald-600">
                        ৳{isValid ? nCoins.toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBuy}
                  disabled={loading || !isValid}
                  className="
                    w-full py-4 rounded-xl font-semibold text-white
                    bg-gradient-to-r from-emerald-600 to-teal-600
                    hover:from-emerald-700 hover:to-teal-700
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    shadow-lg shadow-emerald-600/25
                  "
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Complete Purchase"
                  )}
                </button>

                {/* Security Badges */}
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Instant
                  </span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 text-center">
                <p className="text-xs text-slate-500">
                  By completing this purchase, you agree to our{" "}
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms
                  </button>{" "}
                  and{" "}
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { icon: "🛡️", text: "256-bit SSL Security" },
            { icon: "⚡", text: "Instant Delivery" },
            { icon: "💳", text: "Secure Payment" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <span className="text-xl mb-1 block">{item.icon}</span>
              <span className="text-xs text-slate-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoinBuy;
