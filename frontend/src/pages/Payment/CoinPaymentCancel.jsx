import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { markCoinPurchaseCancel } from "../../actions/coinPurchaseAction";

const CoinPaymentCancel = () => {
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
    dispatch(markCoinPurchaseCancel(merchantTransactionId));
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Processing Cancellation
          </h2>
          <p className="text-gray-500">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-gradient-to-br from-yellow-50 to-orange-50 px-4 pt-16">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md border border-yellow-100 p-6 text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-yellow-600 mb-2">
          Payment Cancelled
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-sm mb-4">
          You cancelled the payment. No coins were added.
        </p>

        {/* Transaction */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-5">
          <p className="text-xs text-yellow-700 break-all">
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
            Back to Coin Buy
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

export default CoinPaymentCancel;
