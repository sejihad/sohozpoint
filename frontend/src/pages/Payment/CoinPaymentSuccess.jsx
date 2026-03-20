import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { verifyCoinPurchase } from "../../actions/coinPurchaseAction";

const CoinPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const merchantTransactionId = searchParams.get("merchantTransactionId");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, error, coinsAdded, message } = useSelector(
    (state) => state.coinPurchase,
  );
  const hasCalledApi = useRef(false);
  useEffect(() => {
    if (!merchantTransactionId) return;
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;
    dispatch(verifyCoinPurchase(merchantTransactionId));
  }, [merchantTransactionId, dispatch]);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    if (error) {
      toast.error(error);
      hasShownToast.current = true;
    }
  }, [error]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Verifying Coin Payment
          </h2>
          <p className="text-gray-600 max-w-md">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't confirm your coin payment."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/coin-buy")}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-gradient-to-br from-green-50 to-emerald-50 px-4 pt-16">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-5 text-center">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-xl font-semibold mb-1">Payment Successful</h1>
          <p className="text-green-100 text-sm opacity-90">
            Coins added to your wallet
          </p>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Details */}
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-5">
            <h3 className="font-medium text-green-800 mb-2 text-sm">
              Purchase Details
            </h3>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Txn ID:</span>
                <span className="font-mono text-gray-800 break-all text-right">
                  {merchantTransactionId}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Coins:</span>
                <span className="font-semibold text-green-600">
                  {coinsAdded}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => navigate("/wallet")}
              className="w-full bg-green-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition"
            >
              Go to Wallet
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="w-full border border-green-600 text-green-600 py-2.5 rounded-md text-sm font-medium hover:bg-green-50 transition"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-500 text-sm hover:text-gray-700 transition"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPaymentSuccess;
