/* BreakTimer.jsx — break m:ss timer */
import { useState, useEffect } from "react";

export default function BreakTimer({ start }) {
  const [e, setE] = useState(0);
  useEffect(() => {
    if (!start) return;
    const tick = () => setE(Math.max(0, Math.floor((Date.now() - start) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [start]);
  if (!start) return null;
  const m = Math.floor(e / 60);
  const s = e % 60;
  return (
    <span style={{
      fontSize: 10, fontFamily: "'Space Mono',monospace",
      color: "#F97316", background: "#F9731610",
      padding: "2px 8px", borderRadius: 5,
    }}>
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}
