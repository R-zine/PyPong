import "./App.css";
import "nes.css/css/nes.min.css";
import { Game, Intro, Upgrade } from "./stages";
import { useStore } from "./store/store";
import { useRef } from "react";

function App() {
  const stage = useStore((state) => state.stage);

  const dialogRef = useRef<null | HTMLDialogElement>(null);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          minWidth: "100vw",
          borderBottom: "4px solid #d3d3d3",
          display: "flex",
          justifyContent: "space-between",
          zIndex: 1000,
          padding: "4px 16px",
        }}
      >
        <div style={{ margin: 16 }} className="nes-text title-text">
          Anti-Pong <span style={{ fontSize: 10 }}>by Ivan Radev</span>
        </div>
        <div
          className="centered-flex"
          style={{ flexDirection: "row", gap: 32 }}
        >
          <div
            className="nes-btn tools-button"
            onClick={() => {
              if (dialogRef.current) dialogRef.current.showModal();
            }}
          >
            Tools
          </div>
          <a href="https://github.com/R-zine" target="_blank">
            <i
              style={{ filter: "grayscale(100%) invert(100%) brightness(70%)" }}
              className="nes-icon github is-medium header-icon"
            ></i>
          </a>
          <a href="https://www.linkedin.com/in/ivan-radev/" target="_blank">
            <i
              style={{ filter: "grayscale(100%) invert(100%)" }}
              className="nes-icon linkedin is-medium header-icon"
            ></i>
          </a>
          <dialog
            ref={dialogRef}
            className="nes-dialog "
            style={{ overflow: "hidden" }}
          >
            <form method="dialog">
              <p className="title">Tools:</p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <a
                  href="https://nostalgic-css.github.io/NES.css/"
                  target="_blank"
                  className="nes-badge"
                >
                  <span className="is-dark">NES.css</span>
                </a>
                <a
                  href="https://neat-python.readthedocs.io/en/latest/"
                  target="_blank"
                  className="nes-badge"
                >
                  <span className="is-dark">NEAT-Python</span>
                </a>
                <a
                  href="https://pyscript.net/"
                  target="_blank"
                  className="nes-badge"
                >
                  <span className="is-dark">Pyscript</span>
                </a>
                <a
                  href="https://www.pygame.org/news"
                  target="_blank"
                  className="nes-badge"
                >
                  <span className="is-dark">Pygame</span>
                </a>
                <a
                  href="https://react.dev/"
                  target="_blank"
                  className="nes-badge"
                >
                  <span className="is-dark">React</span>
                </a>
              </div>
              <menu className="dialog-menu">
                <button className="nes-btn">Close</button>
              </menu>
            </form>
          </dialog>
        </div>
      </div>
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
    </>
  );
}

export default App;
