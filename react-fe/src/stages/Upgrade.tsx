import { useEffect } from "react";
import { UpgradeCard } from "../components/UpgradeCard";
import { Upgrades } from "../constants";
import { useStore } from "../store/store";

export const Upgrade = () => {
  const setStage = useStore((state) => state.setStage);
  const availableScore = useStore((state) => state.score.current);
  const progress = useStore((state) => state.progress);
  const error = useStore((state) => state.error);
  const clearError = useStore((state) => state.clearError);

  useEffect(() => {
    if (error) setTimeout(() => clearError(), 4000);
  }, [error]);

  return (
    <div>
      <div className="nes-container is-dark with-title">
        <span className="title"> Available score: {availableScore}</span>
        {error && (
          <div style={{ marginBottom: 8 }} className="nes-text is-error">
            {error}
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {Object.keys(Upgrades).map((upgrade) => (
            <UpgradeCard type={upgrade} />
          ))}
          <div
            style={{ background: "white", color: "black", marginBottom: 8 }}
            className="nes-container with-title"
          >
            <div className="title">Overall Progess:</div>
            <progress
              className="nes-progress"
              value={progress.spent}
              max={progress.total}
            ></progress>
          </div>
        </div>
      </div>

      <div className="nes-btn" onClick={() => setStage("game")}>
        Try again
      </div>
    </div>
  );
};
