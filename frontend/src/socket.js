import { io } from "socket.io-client";

const socket = io(
  "https://pawresq-api.onrender.com"
);

export default socket;