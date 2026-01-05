// src/utils/socket.js - MINIMAL BUT CORRECT
import { io } from "socket.io-client";

let socket = null;
let currentUser = null;

export const connectSocket = (userId, dispatch) => {
  // ১. একই ইউজার হলে পুরানো সকেট রিটার্ন
  if (socket && socket.connected && currentUser === userId) {
    return socket;
  }

  // ২. পুরানো সকেট ক্লিনআপ
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  const token = localStorage.getItem("token"); // অথবা যেখান থেকে টোকেন আসে
  // ৩. নতুন সকেট তৈরি
  socket = io(import.meta.env.VITE_API_URL, {
    transports: ["websocket"],
    auth: {
      token: token,
    },
    reconnection: true,
  });

  currentUser = userId;

  // ৪. কানেক্ট হলে রেজিস্টার
  socket.on("connect", () => {
    socket.emit("register", userId);
  });

  // ৫. রিকানেক্ট হলে আবার রেজিস্টার
  socket.on("reconnect", () => {
    socket.emit("register", userId);
  });

  // ৬. নোটিফিকেশন লিসেনার (একবারই)
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
