import config from "../../../model-training/gameConfig.json";

import { Paddle } from "../components";
import { useCallback, useEffect, useRef, useState } from "react";
import { Ball } from "../components/Ball";

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
  maxBalls,
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
const ballSrtartVel = pyAspect * pyBallStartVel;

const calculateY = (ballY: number, paddleY: number): number => {
  let yDif = ballY - (paddleY + Math.round(PADDLE_HEIGHT / 2));
  return Math.round((yDif / PADDLE_HEIGHT) * yDiffFactor) * 2;
};

export function Game() {
  const [frame, setFrame] = useState(0);
  const leftY = useRef(0);
  const rightY = useRef(0);
  const balls = useRef([
    {
      x: Math.round(WIDTH / 3),
      y: 0,
      xVel: ballSrtartVel,
      yVel: 0.1 * pyAspect,
      lastBounce: Date.now(),
    },
  ]);

  const moveRef = useRef<"up" | "down" | null>(null);
  const godMode = useRef(false);

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w") moveRef.current = "up";
    else if (e.key === "ArrowDown" || e.key === "s") moveRef.current = "down";
    else if (e.key === "Backspace") godMode.current = !godMode.current;
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    const clock = setInterval(() => setFrame((p) => p + 1), 16);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      clearInterval(clock);
    };
  }, []);

  useEffect(() => {
    window.paddleMiddle = leftY.current + Math.round(PADDLE_HEIGHT / 2);
    window.nearstBallY = balls.current[0].y;
    window.nearstBallX = balls.current[0].x;
    window.nearstBallYVel = balls.current[0].yVel;

    if (frame % 10) document.getElementById("get-AI")?.click();

    const AIResponse = document.querySelector("#genome-output")?.textContent;

    if (AIResponse === "up") {
      leftY.current -= VEL;
      if (leftY.current < 0) leftY.current = 0;
    } else if (AIResponse === "down") {
      leftY.current += VEL;
      if (leftY.current > HEIGHT - PADDLE_HEIGHT)
        leftY.current = HEIGHT - PADDLE_HEIGHT;
    }

    if (moveRef.current === "up") {
      rightY.current -= VEL;
      if (rightY.current < 0) rightY.current = 0;
      moveRef.current = null;
    } else if (moveRef.current === "down") {
      rightY.current += VEL;
      if (rightY.current > HEIGHT - PADDLE_HEIGHT)
        rightY.current = HEIGHT - PADDLE_HEIGHT;
      moveRef.current = null;
    }

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
        ball.y <= rightY.current + PADDLE_HEIGHT &&
        ball.lastBounce + 1000 < Date.now()
      ) {
        const yDif = calculateY(ball.y, rightY.current);
        newYVel = newYVel + yDif;
        if (newYVel > maxYVelocity) newYVel = maxYVelocity;
        else if (newYVel < -maxYVelocity) newYVel = -maxYVelocity;
        newXVel *= -1;
        newLastBounce = Date.now();
      }

      // handle collisions with the AI paddle
      if (
        ball.x >= PADDLE_MARGIN &&
        ball.x <= PADDLE_MARGIN + PADDLE_WIDTH &&
        ball.y - ballR >= leftY.current &&
        ball.y <= leftY.current + PADDLE_HEIGHT &&
        ball.lastBounce + 1000 < Date.now()
      ) {
        const yDif = calculateY(ball.y, leftY.current);
        newYVel = newYVel + yDif;
        if (newYVel > maxYVelocity) newYVel = maxYVelocity;
        else if (newYVel < -maxYVelocity) newYVel = -maxYVelocity;
        newXVel *= -1;
        newLastBounce = Date.now();
      }

      if (ball.x + ballR >= WIDTH) {
        if (godMode.current) {
          newX = 2 * WIDTH - newX - ballR;
          newXVel *= -1;
          newYVel = Math.round(Math.random() * 10);
        } else {
          // handle loss
        }
      }
      balls.current[i] = {
        x: newX,
        y: newY,
        xVel: newXVel,
        yVel: newYVel,
        lastBounce: newLastBounce,
      };
    });
  }, [frame]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "100vw",
        minHeight: "100vh",
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
          height={PADDLE_HEIGHT}
          left={PADDLE_MARGIN}
        />
        {balls.current.map((ball, i) => (
          <Ball key={i} x={ball.x} y={ball.y} r={ballR} />
        ))}
        <Paddle
          name="right-paddle"
          y={rightY.current}
          width={PADDLE_WIDTH}
          height={PADDLE_HEIGHT}
          left={WIDTH - PADDLE_MARGIN - PADDLE_WIDTH}
        />
      </div>
    </div>
  );
}
