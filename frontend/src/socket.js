import { io } from "socket.io-client";
import { ENDPOINTS } from "./config";

const socket = io(
  ENDPOINTS.SOCKET_SERVER
);

export default socket;