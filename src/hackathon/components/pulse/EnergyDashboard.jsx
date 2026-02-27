/* EnergyDashboard.jsx — main layout composing all pulse dashboard sections */
import React, { useEffect, useState } from "react";
import "../../animations.css";

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) return <div style={{ padding: 40, color: "red" }}><h3>Pulse Error</h3><pre>{error.message}</pre></div>;
  return <ErrorCatcher onError={setError}>{children}</ErrorCatcher>;
}

class ErrorCatcher extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error) { this.props.onError(error); }
  render() { return this.state.hasError ? null : this.props.children; }
}

// Lazy imports so we can catch which one fails
const DailyCheckin = React.lazy(() => import("./DailyCheckin"));
const TeamPulse = React.lazy(() => import("./TeamPulse"));
const EnergyInsight = React.lazy(() => import("./EnergyInsight"));
const EnergyVelocityChart = React.lazy(() => import("./EnergyVelocityChart"));
const IndividualTrends = React.lazy(() => import("./IndividualTrends"));

export default function EnergyDashboard({ t, dark }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fadeUp = (delay) =>
    animate ? `fadeUp 0.5s ease ${delay}s both` : "none";

  return (
    <div
      className="hackathon-room"
      style={{
        flex: 1,
        overflow: "auto",
        background: t.bg,
        color: t.text,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 60px" }}>
        <ErrorBoundary>
          <React.Suspense fallback={<div style={{ padding: 20, color: t.tm }}>Loading...</div>}>
            <DailyCheckin t={t} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20, animation: fadeUp(0.1) }}>
              <TeamPulse t={t} />
              <EnergyInsight t={t} />
            </div>

            <div style={{ marginBottom: 20, animation: fadeUp(0.2) }}>
              <EnergyVelocityChart t={t} />
            </div>

            <div style={{ animation: fadeUp(0.3) }}>
              <IndividualTrends t={t} />
            </div>
          </React.Suspense>
        </ErrorBoundary>
      </div>

      <style>{`
        .hackathon-room ::-webkit-scrollbar{width:5px}
        .hackathon-room ::-webkit-scrollbar-track{background:transparent}
        .hackathon-room ::-webkit-scrollbar-thumb{background:${t.scr || '#ddd'};border-radius:3px}
      `}</style>
    </div>
  );
}
