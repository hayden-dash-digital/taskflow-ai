/* EnergyDashboard.jsx — main layout composing all pulse dashboard sections */
import React, { useEffect } from "react";
import usePulseStore from "../../stores/pulseStore";
import DailyCheckin from "./DailyCheckin";
import TeamPulse from "./TeamPulse";
import EnergyInsight from "./EnergyInsight";
import EnergyVelocityChart from "./EnergyVelocityChart";
import IndividualTrends from "./IndividualTrends";

export default function EnergyDashboard({ t, dark }) {
  const { animate, setAnimate } = usePulseStore();

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, [setAnimate]);

  const fadeUp = (delay) =>
    animate
      ? `fadeUp 0.5s ease ${delay}s both`
      : "none";

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "24px 20px 60px",
      }}
    >
      {/* Section 1: Daily Check-in */}
      <div style={{ marginBottom: 16 }}>
        <DailyCheckin t={t} />
      </div>

      {/* Section 2: Team Pulse + Energy Insight (2-column grid) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
          animation: fadeUp(0.1),
        }}
      >
        <TeamPulse t={t} />
        <EnergyInsight t={t} />
      </div>

      {/* Section 3: Energy × Velocity Chart */}
      <div
        style={{
          marginBottom: 16,
          animation: fadeUp(0.2),
        }}
      >
        <EnergyVelocityChart t={t} />
      </div>

      {/* Section 4: Individual Trends */}
      <div
        style={{
          animation: fadeUp(0.3),
        }}
      >
        <IndividualTrends t={t} />
      </div>
    </div>
  );
}
