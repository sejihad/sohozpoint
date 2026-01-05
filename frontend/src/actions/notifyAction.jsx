import axios from "axios";
import {
  CLEAR_ERRORS,
  DELETE_NOTIFICATION_FAIL,
  DELETE_NOTIFICATION_REQUEST,
  DELETE_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_BY_ID_FAIL,
  GET_NOTIFICATION_BY_ID_REQUEST,
  GET_NOTIFICATION_BY_ID_SUCCESS,
  GET_NOTIFIES_FAIL,
  GET_NOTIFIES_REQUEST,
  GET_NOTIFIES_SUCCESS,
  MARK_NOTIFICATION_READ_FAIL,
  MARK_NOTIFICATION_READ_REQUEST,
  MARK_NOTIFICATION_READ_SUCCESS,
  NEW_NOTIFICATION_RECEIVED,
  SEND_NOTIFICATION_FAIL,
  SEND_NOTIFICATION_REQUEST,
  SEND_NOTIFICATION_SUCCESS,
} from "../constants/notifyContants";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Fetch notifications (paginated)
export const getNotifies =
  (page = 1, limit = 12) =>
  async (dispatch) => {
    try {
      dispatch({ type: GET_NOTIFIES_REQUEST });

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit },
      };

      const { data } = await axios.get(`${API_URL}/api/v1/notifies`, config);

      dispatch({
        type: GET_NOTIFIES_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_NOTIFIES_FAIL,
        payload:
          error.response?.data?.message || "Failed to load notifications",
      });
    }
  };

// ✅ Socket.io: new notification received
export const newNotificationReceived = (notification) => (dispatch) => {
  dispatch({
    type: NEW_NOTIFICATION_RECEIVED,
    payload: notification,
  });
};

// Send notification only
export const adminSendNotification = (formData) => async (dispatch) => {
  try {
    dispatch({ type: SEND_NOTIFICATION_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/v1/notifies/send`,
      formData,
      config
    );

    dispatch({
      type: SEND_NOTIFICATION_SUCCESS,
      payload: data,
    });

    // Auto clear success after 3 seconds
    setTimeout(() => {
      dispatch({ type: CLEAR_ERRORS });
    }, 3000);
  } catch (error) {
    dispatch({
      type: SEND_NOTIFICATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    dispatch({ type: MARK_NOTIFICATION_READ_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.put(
      `${API_URL}/api/v1/notifies/${notificationId}/read`,
      {},
      config
    );

    dispatch({
      type: MARK_NOTIFICATION_READ_SUCCESS,
      payload: data.notificationId,
    });

    // Refresh notifications list
    dispatch(getNotifies(1, 12));
  } catch (error) {
    dispatch({
      type: MARK_NOTIFICATION_READ_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete notification
export const deleteNotification = (notificationId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_NOTIFICATION_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.delete(
      `${API_URL}/api/v1/notifies/${notificationId}`,
      config
    );

    dispatch({
      type: DELETE_NOTIFICATION_SUCCESS,
      payload: data.notificationId,
    });

    // Refresh notifications list
    dispatch(getNotifies(1, 12));
  } catch (error) {
    dispatch({
      type: DELETE_NOTIFICATION_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
// Get single notification by ID
export const getNotificationById = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_NOTIFICATION_BY_ID_REQUEST });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${API_URL}/api/v1/notifies/${id}`,
      config
    );

    dispatch({
      type: GET_NOTIFICATION_BY_ID_SUCCESS,
      payload: data.notification,
    });
  } catch (error) {
    dispatch({
      type: GET_NOTIFICATION_BY_ID_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Clear Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
