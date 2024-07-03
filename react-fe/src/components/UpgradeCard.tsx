import { useCallback } from "react";
import { Upgrades } from "../constants";
import { useStore } from "../store/store";

export const UpgradeCard = ({ type }: { type: string }) => {
  const buyUpgrade = useStore((state) => state.buyUpgrade);
  const currentUpgrade = useStore((state) => state.upgrades[type]);

  const determineDisabled = useCallback(
    (i: number) => {
      if (i !== currentUpgrade) return " is-disabled";
      else return "";
    },
    [currentUpgrade]
  );

  return (
    <div
      style={{ background: "white", color: "black", marginBottom: 8 }}
      className="nes-container with-title"
    >
      <div className="title">{type}:</div>
      <div>
        <div>Not purchased</div>
        <div>
          {Upgrades[type].map((step, i) => (
            <div
              className={"nes-btn" + determineDisabled(i)}
              key={type + String(step.price)}
              onClick={(e) => {
                e.stopPropagation();
                buyUpgrade(type);
              }}
            >
              {step.price}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
