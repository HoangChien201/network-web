import { io } from "socket.io-client";
import { url } from "./src/contants/url"

// "undefined" means the URL will be computed from the `window.location` object
const URL =url;

export const socket = io(URL);