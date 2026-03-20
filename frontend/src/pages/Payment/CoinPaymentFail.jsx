import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { markCoinPurchaseFail } from "../../actions/coinPurchaseAction";

const CoinPaymentFail = () => {
  const [searchParams] = useSearchParams();
  const merchantTransactionId = searchParams.get("merchantTransactionId");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, success, error, message } = useSelector(
    (state) => state.coinPurchase,
  );
  const hasCalledApi = useRef(false);
  useEffect(() => {
    if (!merchantTransactionId) return;
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;
    dispatch(markCoinPurchaseFail(merchantTransactionId));
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Processing Payment Failure
          </h2>
          <p className="text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-gradient-to-br from-red-50 to-pink-50 px-4 pt-16">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md border border-red-100 p-6 text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 0 11-18 0 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-red-600 mb-2">
          Coin Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-4">
          Your coin payment was not successful. No coins were added.
        </p>

        {/* Transaction */}
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-5">
          <p className="text-xs text-red-700 break-all">
            <span className="font-medium">Txn ID:</span>{" "}
            {merchantTransactionId || "N/A"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => navigate("/coin-buy")}
            className="w-full bg-green-600 text-white py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition"
          >
            Try Again
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
  );
};

export default CoinPaymentFail;
