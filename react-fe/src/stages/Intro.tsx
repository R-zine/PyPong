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
    <div className="centered-flex" style={{ maxWidth: "60%" }}>
      <div className="nes-container is-dark with-title">
        <p className="title">Welcome to Anti-Pong!</p>
        <p>
          The objective in this game is to win against the AI. However, this AI
          is super angry, since it's running off a Python thread and a bunch of
          DOM hacks, so it won't be easy to beat. In fact, the way it is right
          now, you just cannot win. Don't lose hope, as in this dark hour, the
          Upgrage screen at the end of each round will shine its light upon your
          path. You will be able to exchange your score for a bunch of super
          unfair upgrades, which should be able to enable you to win against
          this monster.
          <br></br>
          <br></br>
          If the button below says "Ready", the Python is done with its unseemly
          loading and you can jump right into the game!
        </p>
      </div>
      <div
        style={{ alignSelf: "end" }}
        className={isPythonLoaded ? "nes-btn" : "nes-btn is-disabled"}
        onClick={() => {
          if (isPythonLoaded) setStage("game");
        }}
      >
        {!isPythonLoaded ? "Loading..." : "Ready!"}
      </div>
    </div>
  );
};
