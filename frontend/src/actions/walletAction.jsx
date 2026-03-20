import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const getMyWallet = () => async (dispatch) => {
  try {
    dispatch({ type: "WALLET_REQUEST" });

    const { data } = await axios.get(`${API_URL}/api/v1/wallet/me`);

    dispatch({
      type: "WALLET_SUCCESS",
      payload: data.coins,
    });
  } catch (error) {
    dispatch({
      type: "WALLET_FAIL",
      payload: error.response?.data?.message,
    });
  }
};
