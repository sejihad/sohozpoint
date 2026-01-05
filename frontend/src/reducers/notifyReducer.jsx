import {
  CLEAR_ERRORS,
  DELETE_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_BY_ID_FAIL,
  GET_NOTIFICATION_BY_ID_REQUEST,
  GET_NOTIFICATION_BY_ID_SUCCESS,
  GET_NOTIFIES_FAIL,
  GET_NOTIFIES_REQUEST,
  GET_NOTIFIES_SUCCESS,
  MARK_NOTIFICATION_READ_SUCCESS,
  NEW_NOTIFICATION_RECEIVED,
  SEND_NOTIFICATION_FAIL,
  SEND_NOTIFICATION_REQUEST,
  SEND_NOTIFICATION_SUCCESS,
} from "../constants/notifyContants";

const initialState = {
  notifications: [],
  loading: false,
  notification: null,
  error: null,
  page: 1,
  limit: 12,
  hasMore: true,
};

export const notifyReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATION_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_NOTIFICATION_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        notification: action.payload,
      };

    case GET_NOTIFICATION_BY_ID_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        notification: null,
      };

    case GET_NOTIFIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_NOTIFIES_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications:
          action.payload.page === 1
            ? action.payload.notifications
            : [...state.notifications, ...action.payload.notifications],
        page: action.payload.page,
        limit: action.payload.limit,
        hasMore: action.payload.hasMore,
      };

    case GET_NOTIFIES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification._id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
      };

    case DELETE_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification._id !== action.payload
        ),
      };
    case NEW_NOTIFICATION_RECEIVED:
      // Merge new notification + existing notifications
      const merged = [action.payload, ...state.notifications];

      // Deduplicate by top-level _id
      const uniqueNotifications = Array.from(
        new Map(merged.map((n) => [n._id, n])).values()
      );

      return {
        ...state,
        notifications: uniqueNotifications,
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

export const sendNotificationReducer = (state = {}, action) => {
  switch (action.type) {
    case SEND_NOTIFICATION_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case SEND_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        notification: action.payload,
      };
    case SEND_NOTIFICATION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        success: false,
      };
    default:
      return state;
  }
};
