import { io } from 'socket.io-client';

// Connects to the backend via the Vite proxy (see vite.config.js), so this
// works the same in dev without hardcoding a host/port.
const socket = io({ autoConnect: true });

export default socket;
