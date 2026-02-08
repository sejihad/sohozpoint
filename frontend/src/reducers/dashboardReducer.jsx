// dashboardReducer.jsx

import {
  CLEAR_ERRORS,
  DASHBOARD_STATS_FAIL,
  DASHBOARD_STATS_REQUEST,
  DASHBOARD_STATS_SUCCESS,
} from "../constants/dashboardContants.jsx";

const initialState = {
  loading: false,
  stats: {
    users: 0,
    products: 0,
    orders: 0,
    productStock: {
      inStock: 0,
      outOfStock: 0,
      unavailable: 0,
    },
    orderStatus: {
      pending: 0,
      confirmed: 0,
      processing: 0,
      delivering: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    },
    totalRevenue: 0,
  },
};

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_STATS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DASHBOARD_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload,
      };

    case DASHBOARD_STATS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
