import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";

export default function Console() {
  const [logs, setLogs] = useState([]);
  const socket = io(`ws://localhost:${process.env.API_PORT || 4000}`);
  socket.on("log", (msg) => {
    setLogs([...logs.reverse().slice(0, 15).reverse(), msg]);
  });
  useEffect(() => {
    fetch("/api/logs", { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        let msg = data.map((el) => el.msg);
        setLogs([...msg.reverse().slice(0, 15).reverse()]);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="w-full grow flex flex-col justify-center items-center">
        <div className=" border-2 solid bg-black border-white w-[80vw] h-[60vh] text-white font-bold text-lg flex flex-col-reverse p-1 shadow-2xl overflow-hidden">
          {logs.map((log, i) => (
            <h2 className="mx-3 mb-3" key={`msg:${i}`}>
              {"> " + log}
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
}
