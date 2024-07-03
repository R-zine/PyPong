import "./App.css";
import "nes.css/css/nes.min.css";
import { Game, Intro, Upgrade } from "./stages";
import { useStore } from "./store/store";

function App() {
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {stage === "intro" && <Intro />}
      {stage === "game" && <Game />}
      {stage === "upgrade" && <Upgrade />}
    </div>
  );
}

export default App;
