/* TimerDisplay.jsx — useTimer hook + HH:MM:SS display */
import { useState, useEffect } from "react";

export function useTimer(s) {
  const [e, setE] = useState(0);
  useEffect(() => {
    const st = new Date(s).getTime();
    const tick = () => setE(Math.max(0, Math.floor((Date.now() - st) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [s]);
  return `${String(Math.floor(e / 3600)).padStart(2, "0")}:${String(Math.floor((e % 3600) / 60)).padStart(2, "0")}:${String(e % 60).padStart(2, "0")}`;
}

export default function TimerDisplay({ start, color }) {
  const timer = useTimer(start);
  return (
    <div style={{
      fontFamily: "'Space Mono',monospace", fontSize: 32, fontWeight: 700,
      color, letterSpacing: "0.04em",
    }}>
      {timer}
    </div>
  );
}
