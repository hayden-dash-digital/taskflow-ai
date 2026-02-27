/* DailyCheckin.jsx — main wrapper for the daily check-in flow */
import React from "react";
import usePulseStore from "../../stores/pulseStore";
import CheckinProgress from "./CheckinProgress";
import EnergyPicker from "./EnergyPicker";
import WorkloadPicker from "./WorkloadPicker";
import BlockerPicker from "./BlockerPicker";
import FocusInput from "./FocusInput";
import CheckinSummary from "./CheckinSummary";

export default function DailyCheckin({ t }) {
  const { checkStep, pulseLogged } = usePulseStore();

  if (pulseLogged) {
    return <CheckinSummary t={t} />;
  }

  return (
    <div
      style={{
        background: t.card,
        borderRadius: 20,
        padding: "28px 34px",
        marginBottom: 24,
        border: `1px solid ${t.cb}`,
        position: "relative",
        overflow: "hidden",
        animation: "fadeUp 0.5s ease both",
      }}
    >
      {/* Gradient top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${t.acc}, #818CF8, #EC4899)`,
        }}
      />

      <CheckinProgress t={t} checkStep={checkStep} />

      {checkStep === 0 && <EnergyPicker t={t} />}
      {checkStep === 1 && <WorkloadPicker t={t} />}
      {checkStep === 2 && <BlockerPicker t={t} />}
      {checkStep === 3 && <FocusInput t={t} />}
    </div>
  );
}
