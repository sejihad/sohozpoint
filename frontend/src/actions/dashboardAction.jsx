import axios from "axios";
import {
  DASHBOARD_STATS_FAIL,
  DASHBOARD_STATS_REQUEST,
  DASHBOARD_STATS_SUCCESS,
} from "../constants/dashboardContants.jsx";
const API_URL = import.meta.env.VITE_API_URL;
export const getDashboardStats = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    dispatch({ type: DASHBOARD_STATS_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/v1/admin/dashboard`,
      config,
    );

    dispatch({
      type: DASHBOARD_STATS_SUCCESS,
      payload: data.stats,
    });
  } catch (error) {
    dispatch({
      type: DASHBOARD_STATS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
