import "./App.css";
import { Game, Intro, Upgrade } from "./stages";
import { useStore } from "./store/store";

function App() {
  const stage = useStore((state) => state.stage);
  const setStage = useStore((state) => state.setStage);

  return (
    <>
      {stage === "intro" && <Intro />}
      {stage === "game" && <Game />}
      {stage === "upgrade" && <Upgrade />}
    </>
  );
}

export default App;
