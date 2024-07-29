import { useEffect } from "react";
import { socket } from "../socket";
import "./App.css";

import LayOut from "./layOut/LayOut";

function App() {
  useEffect(() => {
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

}, [])
  return (
    <>
      <LayOut />
    </>
  );
}

export default App;
