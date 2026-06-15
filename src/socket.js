import { io } from "socket.io-client";

const socket = io(process.env.VITE_SOCKET_URL, {
  autoConnect: true
})

export default socket;