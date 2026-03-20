import { io } from "socket.io-client";

let socket = null;
let currentUser = null;

export const connectSocket = (userId, dispatch) => {
  if (socket && socket.connected && currentUser === userId) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }
  const token = localStorage.getItem("token");
  socket = io(import.meta.env.VITE_API_URL, {
    transports: ["websocket"],
    auth: {
      token: token,
    },
    reconnection: true,
  });

  currentUser = userId;

  socket.on("connect", () => {
    socket.emit("register", userId);
  });

  socket.on("reconnect", () => {
    socket.emit("register", userId);
  });

  socket.on("newNotification", (notification) => {
    dispatch({
      type: "NEW_NOTIFICATION_RECEIVED",
      payload: notification,
    });
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentUser = null;
  }
};
