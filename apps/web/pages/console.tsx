import { io } from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";

export default function Console() {
  const [logs, setLogs] = useState([]);
  const socket = io(`ws://localhost:${process.env.API_PORT || 4000}`);
  socket.on("log", (msg) => {
    setLogs([...logs, msg]);
  });
  useEffect(() => {
    fetch("/api/logs", { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        let msg = data.map((el) => el.msg);
        setLogs([...msg]);
      });
  }, []);

  return (
    <div className="w-full min-h-[100vh] bg-black flex flex-col justify-center items-center">
      <div className=" border-2 solid border-white w-full grow m-10">
        {logs.map((log, i) => (
          <h2 className="text-white" key={`msg:${i}`}>
            {log}
          </h2>
        ))}
        <h1>Welocme to osu</h1>
      </div>
    </div>
  );
}
