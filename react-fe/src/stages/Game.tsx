import config from "../../../model-training/gameConfig.json";

import { Paddle } from "../components";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ball } from "../components/Ball";
import { useStore } from "../store/store";

declare global {
  interface Window {
    paddleMiddle: number;
    nearstBallY: number;
    nearstBallX: number;
    nearstBallYVel: number;
  }
}

const {
  aspect: pyAspect,
  ballR: pyBallR,
  ballStartVelocity: pyBallStartVel,
  height: pyHeight,
  maxYVelocity,
  paddleHeight: pyPaddleHeight,
  paddleWidth: pyPaddleWidth,
  velocity: pyVelocity,
  width: pyWidth,
  yDiffFactor,
} = config;

const WIDTH = pyAspect * pyWidth;
const HEIGHT = pyAspect * pyHeight;
const ballR = pyBallR * pyAspect;
const PADDLE_WIDTH = pyAspect * pyPaddleWidth;
const PADDLE_HEIGHT = pyAspect * pyPaddleHeight * 3;
const PADDLE_MARGIN = ballR * 2;
const VEL = pyAspect * pyVelocity;
const ballStartVel = pyAspect * pyBallStartVel + 1;

const calculateY = (
  ballY: number,
  paddleY: number,
  paddleHeight: number
): number => {
  let yDif = ballY - (paddleY + Math.round(paddleHeight / 2));
  return Math.round((yDif / paddleHeight) * yDiffFactor) * 2;
};

export function Game() {
  const setStage = useStore((state) => state.setStage);
  const score = useStore((state) => state.score);
  const incrementScore = useStore((state) => state.incrementScore);
  const upgrades = useStore((state) => state.upgrades);

  const [frame, setFrame] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const dialogRef = useRef<null | HTMLDialogElement>(null);

  const leftY = useRef(0);
  const rightY = useRef(0);

  const paddleHeightAI = useRef(
    Math.round(
      PADDLE_HEIGHT /
        (upgrades["Enemy Paddle"] === 0
          ? 1
          : upgrades["Enemy Paddle"] === 1
          ? 1.5
          : upgrades["Enemy Paddle"] === 2
          ? 2
          : 3)
    )
  );

  const paddleHeightPlayer = useRef(
    Math.round(
      PADDLE_HEIGHT *
        (upgrades["Your Paddle"] === 0
          ? 1
          : upgrades["Your Paddle"] === 1
          ? 1.25
          : upgrades["Your Paddle"] === 2
          ? 1.75
          : 2.2)
    )
  );

  const lives = useRef(upgrades["Balls And Lives"] + 1);

  const balls = useRef([
    {
      x: Math.round(WIDTH / 3),
      y: 0,
      xVel: ballStartVel,
      yVel: 0.1 * pyAspect,
      lastBounce: Date.now(),
      isDead: false,
    },
  ]);

  const moveRef = useRef<"up" | "down" | null>(null);
  const godMode = useRef(false);
  const cripple = useRef(false);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w") moveRef.current = "up";
    else if (e.key === "ArrowDown" || e.key === "s") moveRef.current = "down";
    // else if (e.key === "Backspace") godMode.current = !godMode.current;
    // else if (e.key === "=") cripple.current = !cripple.current;
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    const clock = setInterval(() => {
      if (!isPaused) setFrame((p) => p + 1);
    }, 16);

    if (isPaused) {
      setTimeout(() => {
        const element = document.querySelector(".title-text");
        if (element) element.textContent = "gaG5S-PiSx by iJtj vFJjxw";
      }, 1300);

      setTimeout(() => {
        const element = document.querySelector(".tools-button");
        if (element) element.textContent = "7$$L%";
      }, 2700);

      setTimeout(() => {
        const element = document.querySelector(".score-text");
        if (element) element.textContent = "PwDiWPAJu8$$L%";
      }, 4000);

      setTimeout(() => {
        const element = document.querySelector(".score-text2");
        if (element) element.textContent = "7nzAsN55rO*^)()";
      }, 4700);

      setTimeout(() => {
        const element = document.querySelector(".lives-bar");
        if (element)
          element.innerHTML =
            "<div>??? ????? ?? ??? <br /> ???? ??? <br /> ??? ? <br /> ??</div>";
      }, 6700);

      setTimeout(() => dialogRef.current?.showModal(), 9000);

      setTimeout(() => {
        const element = document.querySelector(".sorry");
        if (element) element.textContent = "GPT made me do this";
      }, 11700);

      setTimeout(() => {
        dialogRef.current?.close();
        balls.current = [
          ...balls.current,
          ...Array.from({ length: 100 }, (_x) => ({
            x: PADDLE_MARGIN + PADDLE_WIDTH + 10,
            y: leftY.current + paddleHeightAI.current / 2,
            xVel: ballStartVel * Math.random() - 0.01,
            yVel: 0.1 * pyAspect * (Math.random() - 0.49),
            lastBounce: Date.now(),
            isDead: false,
          })),
        ];

        paddleHeightPlayer.current = Math.round(PADDLE_HEIGHT / 3);
        paddleHeightAI.current = PADDLE_HEIGHT * 2;

        setIsPaused(false);
      }, 15000);

      setTimeout(() => setStage("upgrade"), 25000);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      clearInterval(clock);
    };
  }, [isPaused]);

  useEffect(() => {
    window.paddleMiddle =
      leftY.current + Math.round(paddleHeightAI.current / 2);

    let nearestBall = balls.current.reduce((best, ball, i) => {
      if (!i) return ball;
      if (ball.xVel < 0) {
        if (best.xVel > 0 || best.x > ball.x) return ball;
      }
      return best;
    }, balls.current[0]);

    if (nearestBall.xVel > 0) {
      nearestBall = {
        x: WIDTH,
        y: HEIGHT / 2,
        xVel: ballStartVel,
        yVel: 0.1 * pyAspect,
        lastBounce: Date.now(),
        isDead: false,
      };
    }

    window.nearstBallY = nearestBall.y;
    window.nearstBallX = nearestBall.x;
    window.nearstBallYVel = nearestBall.yVel;

    if (frame % 10) document.getElementById("get-AI")?.click();

    const AIResponse = document.querySelector("#genome-output")?.textContent;

    if (AIResponse === "up") {
      leftY.current -= VEL;
      if (leftY.current < 0) leftY.current = 0;
    } else if (AIResponse === "down") {
      leftY.current += VEL;
      if (leftY.current > HEIGHT - paddleHeightAI.current)
        leftY.current = HEIGHT - paddleHeightAI.current;
    }

    if (moveRef.current === "up") {
      rightY.current -= VEL;
      if (rightY.current < 0) rightY.current = 0;
      moveRef.current = null;
    } else if (moveRef.current === "down") {
      rightY.current += VEL;
      if (rightY.current > HEIGHT - paddleHeightPlayer.current)
        rightY.current = HEIGHT - paddleHeightPlayer.current;
      moveRef.current = null;
    }

    const totalBallsToAdd = upgrades["Balls And Lives"];

    if (
      totalBallsToAdd &&
      !(frame % 120) &&
      !!frame &&
      frame / 120 <= totalBallsToAdd
    )
      balls.current.push({
        x: Math.round(WIDTH / 3),
        y: 0,
        xVel: ballStartVel,
        yVel: 0.1 * pyAspect,
        lastBounce: Date.now(),
        isDead: false,
      });

    balls.current.forEach((ball, i) => {
      let newX = ball.x + ball.xVel;
      let newY = ball.y + ball.yVel;
      let newXVel = ball.xVel;
      let newYVel = ball.yVel;
      let newLastBounce = ball.lastBounce;

      if (newY < ballR) {
        newYVel *= -1;
        newY = newY * -1 + ballR;
      } else if (newY > HEIGHT - ballR) {
        newYVel *= -1;
        newY = 2 * HEIGHT - newY - ballR;
      }

      // handle collisions with the player paddle
      if (
        ball.x + ballR >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ball.x <= WIDTH - PADDLE_MARGIN &&
        ball.y - ballR >= rightY.current &&
        ball.y <= rightY.current + paddleHeightPlayer.current &&
        ball.lastBounce + 1000 < Date.now()
      ) {
        const yDif = calculateY(
          ball.y,
          rightY.current,
          paddleHeightPlayer.current
        );
        newYVel = newYVel + yDif;
        if (newYVel > maxYVelocity) newYVel = maxYVelocity;
        else if (newYVel < -maxYVelocity) newYVel = -maxYVelocity;
        newXVel *= -1;
        newLastBounce = Date.now();
        incrementScore();

        if (upgrades.ballcalypse) {
          const isBallcalypse =
            Math.round(
              Math.random() * (100000 / 10 ** upgrades.ballcalypse)
            ) === 42;

          if (isBallcalypse)
            balls.current = [
              ...balls.current,
              ...Array.from({ length: 10 ** upgrades.ballcalypse }, (_x) => ({
                x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - 10,
                y: rightY.current + paddleHeightPlayer.current / 2,
                xVel: -ballStartVel * Math.random() - 0.01,
                yVel: 0.1 * pyAspect * (Math.random() - 0.49),
                lastBounce: Date.now(),
                isDead: false,
              })),
            ];
        }
      }

      // handle collisions with the AI paddle
      if (
        !cripple.current &&
        ball.x >= PADDLE_MARGIN &&
        ball.x <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ball.y + ballR >= leftY.current &&
        ball.y <= leftY.current + paddleHeightAI.current &&
        ball.lastBounce + 1000 < Date.now()
      ) {
        const yDif = calculateY(ball.y, leftY.current, paddleHeightAI.current);
        newYVel = newYVel + yDif;
        if (newYVel > maxYVelocity) newYVel = maxYVelocity;
        else if (newYVel < -maxYVelocity) newYVel = -maxYVelocity;
        newXVel *= -1;
        newLastBounce = Date.now();
      }

      // handle player losing
      if (ball.x + ballR >= WIDTH) {
        if (godMode.current) {
          newX = 2 * WIDTH - newX - ballR;
          newXVel *= -1;
          newYVel = Math.round(Math.random() * 10);
        } else {
          if (lives.current > 0) {
            balls.current[i] = { ...balls.current[i], isDead: true };
          } else setStage("upgrade");
        }
      }

      // handle player winning
      if (ball.x <= 0 && !ball.isDead) {
        balls.current[i] = { ...balls.current[i], isDead: true };
        setIsPaused(true);
      }

      balls.current[i] = {
        x: newX,
        y: newY,
        xVel: newXVel,
        yVel: newYVel,
        lastBounce: newLastBounce,
        isDead: balls.current[i].isDead,
      };
    });

    lives.current = balls.current.reduce(
      (livingBalls, ball) => (!ball.isDead ? livingBalls + 1 : livingBalls),
      0
    );
  }, [frame]);

  return (
    <div className="centered-flex">
      <dialog
        ref={dialogRef}
        className="nes-dialog "
        style={{ overflow: "hidden" }}
      >
        <form method="dialog">
          <p className="title">Error ??</p>
          <p className="sorry">Sorry...</p>
        </form>
      </dialog>
      <div className="nes-table-responsive">
        <table className="nes-table is-bordered is-dark">
          <thead>
            <tr>
              <th className="score-text">Total score: {score.total}</th>
              <th className="score-text2">Current score: {score.current}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "100vw",
          background: "black",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            border: "2px solid white",
            width: `${WIDTH}px`,
            height: `${HEIGHT}px`,
          }}
        >
          <Paddle
            name="left-paddle"
            y={leftY.current}
            width={PADDLE_WIDTH}
            height={paddleHeightAI.current}
            left={PADDLE_MARGIN}
          />
          {balls.current.map((ball, i) =>
            ball.isDead ? null : (
              <Ball key={i} x={ball.x} y={ball.y} r={ballR} />
            )
          )}
          <Paddle
            name="right-paddle"
            y={rightY.current}
            width={PADDLE_WIDTH}
            height={paddleHeightPlayer.current}
            left={WIDTH - PADDLE_MARGIN - PADDLE_WIDTH}
          />
        </div>
      </div>
      <div
        style={{ minHeight: 48, flexDirection: "row", marginTop: 16 }}
        className="centered-flex lives-bar"
      >
        Lives:{" "}
        {Array.from("H".repeat(upgrades["Balls And Lives"] + 1)).map(
          (_life, i) => (
            <i
              key={i}
              style={{
                filter: "grayscale(100%) brightness(350%)",
                transform: "scale(2) translateY(-8px)",
                marginLeft: 16,
              }}
              className={`nes-icon is-small heart ${
                i < lives.current ? "" : "is-empty"
              }`}
            ></i>
          )
        )}
      </div>
    </div>
  );
}
