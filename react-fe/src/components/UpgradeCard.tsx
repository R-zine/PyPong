import { useCallback, useMemo, useState } from "react";
import { Upgrades } from "../constants";
import { useStore } from "../store/store";

export const UpgradeCard = ({ type }: { type: string }) => {
  const buyUpgrade = useStore((state) => state.buyUpgrade);
  const currentUpgrade = useStore((state) => state.upgrades[type]);

  const [hoveredIndex, setHoveredIndex] = useState<false | number>(false);

  const determineDisabled = useCallback(
    (i: number) => {
      if (i !== currentUpgrade) return " is-disabled";
      else return "";
    },
    [currentUpgrade]
  );

  const text = useMemo(() => {
    if (!currentUpgrade && hoveredIndex === false) return "Not purchased";

    const upgradeData = Upgrades[type];
    if (hoveredIndex === false && currentUpgrade)
      return upgradeData[currentUpgrade - 1].flavor;
    return upgradeData[hoveredIndex || 0].main;
  }, [currentUpgrade, hoveredIndex]);

  return (
    <div
      style={{ background: "white", color: "black", marginBottom: 8 }}
      className="nes-container with-title"
    >
      <div style={{ textTransform: "capitalize" }} className="title">
        {type}:
      </div>
      <div>
        <div style={{ minHeight: 150, overflowWrap: "break-word", width: 340 }}>
          {text ?? ""}
        </div>
        <div>
          {Upgrades[type].map((step, i) => (
            <div
              onMouseEnter={() => {
                if (determineDisabled(i)) return;

                setHoveredIndex(i);
              }}
              onMouseLeave={() => {
                if (determineDisabled(i)) return;

                setHoveredIndex(false);
              }}
              className={"nes-btn" + determineDisabled(i)}
              key={type + String(step.price)}
              onClick={(e) => {
                e.stopPropagation();
                setHoveredIndex(false);
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
