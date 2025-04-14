// utils/socket.js
import { io } from "socket.io-client";

const baseURL = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");
const socket = io(baseURL, {
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
