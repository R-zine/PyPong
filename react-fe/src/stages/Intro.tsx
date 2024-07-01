import { useEffect, useState } from "react";
import { useStore } from "../store/store";

export const Intro = () => {
  const setStage = useStore((state) => state.setStage);

  const [isPythonLoaded, setIsPythonLoaded] = useState(false);

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      if (
        !isPythonLoaded &&
        document.getElementById("python-ready")?.textContent === "ready"
      )
        setIsPythonLoaded(true);

      return () => clearInterval(loadingInterval);
    }, 500);
  }, [isPythonLoaded]);
  return (
    <>
      <div
        onClick={() => {
          if (isPythonLoaded) setStage("game");
        }}
      >
        {!isPythonLoaded ? "Loading..." : "Ready!"}
      </div>
    </>
  );
};
