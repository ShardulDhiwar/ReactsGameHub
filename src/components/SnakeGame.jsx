import React, { useEffect, useRef, useState, useCallback } from "react";

// Constants
const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 10 }];
const INITIAL_DIR = { x: 1, y: 0 };
const SPEEDS = {
  easy: 200,
  medium: 100,
  hard: 60,
};

// Helpers
const getRandomFood = (snake) => {
  while (true) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!snake.some(seg => seg.x === x && seg.y === y)) {
      return { x, y };
    }
  }
};

const useInterval = (callback, delay) => {
  const cbRef = useRef();
  useEffect(() => { cbRef.current = callback }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => cbRef.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([...INITIAL_SNAKE]);
  const [dir, setDir] = useState({ ...INITIAL_DIR });
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("medium");
  const inputRef = useRef(null);

  // Game loop
  useInterval(
    () => {
      if (!playing || gameOver) return;
      const next = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      // Collision
      if (
        next.x < 0 || next.x >= BOARD_SIZE ||
        next.y < 0 || next.y >= BOARD_SIZE ||
        snake.some(seg => seg.x === next.x && seg.y === next.y)
      ) {
        setPlaying(false);
        setGameOver(true);
        return;
      }
      const newSnake = [next, ...snake];
      if (next.x === food.x && next.y === food.y) {
        setFood(getRandomFood(newSnake));
        setScore(score + 1);
        setSnake(newSnake); // grow
      } else {
        newSnake.pop();
        setSnake(newSnake);
      }
    },
    playing && !gameOver ? SPEEDS[difficulty] : null
  );

  // Keyboard events
  const handleKeyDown = useCallback((e) => {
    if (!playing) return;
    setDir(prev => {
      if (e.key === "ArrowLeft" && prev.x !== 1) return { x: -1, y: 0 };
      if (e.key === "ArrowRight" && prev.x !== -1) return { x: 1, y: 0 };
      if (e.key === "ArrowUp" && prev.y !== 1) return { x: 0, y: -1 };
      if (e.key === "ArrowDown" && prev.y !== -1) return { x: 0, y: 1 };
      return prev;
    });
  }, [playing]);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // D-Pad
  const manualMove = (arrow) => {
    setDir(prev => {
      if (arrow === "left" && prev.x !== 1) return { x: -1, y: 0 };
      if (arrow === "right" && prev.x !== -1) return { x: 1, y: 0 };
      if (arrow === "up" && prev.y !== 1) return { x: 0, y: -1 };
      if (arrow === "down" && prev.y !== -1) return { x: 0, y: 1 };
      return prev;
    });
  };

  // Reset
  const reset = () => {
    setSnake([...INITIAL_SNAKE]);
    setDir({ ...INITIAL_DIR });
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  };

  // --- UI ---
  return (
    <div style={{
      fontFamily: 'Space Grotesk, Noto Sans, sans-serif',
      minHeight: "100vh",
      background: "#111811",
      color: "#fff",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 32 }}>
        <h2 style={{ textAlign: "center", fontSize: 32, padding: 24, marginBottom: 0 }}>
          🐍 Snake Game
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 12px 0" }}>
          <input
            style={{
              background: "#1c261c",
              color: "#fff",
              border: "1px solid #3c533c",
              borderRadius: 12,
              height: 44,
              padding: "0 16px",
              width: 150
            }}
            value="Player 1"
            readOnly
            disabled
            ref={inputRef}
          />
          <span style={{ color: "#aeeeee", fontWeight: 700, fontSize: 20 }}>
            Score: <span style={{ color: "#0ff" }}>{score}</span>
          </span>
        </div>

        {/* Difficulty before start */}
        {!playing && !gameOver && (
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span>Difficulty: </span>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              style={{
                padding: 6,
                borderRadius: 8,
                background: "#1c261c",
                color: "#fff",
                border: "1px solid #3c533c",
                fontWeight: 700,
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        {/* Board */}
        <div
          style={{
            width: 320,
            height: 320,
            margin: "0 auto",
            marginBottom: 16,
            position: "relative",
            border: "2px dashed #3c533c",
            borderRadius: 16,
            background: "#111811",
            outline: "2px solid #3c533c"
          }}
        >
          {/* Board grid */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${BOARD_SIZE},1fr)`,
              gridTemplateColumns: `repeat(${BOARD_SIZE},1fr)`,
              width: "100%",
              height: "100%",
            }}
          >
            {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, idx) => {
              const x = idx % BOARD_SIZE;
              const y = Math.floor(idx / BOARD_SIZE);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isBody = snake.some((s, i) => s.x === x && s.y === y && i !== 0);
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={idx}
                  style={{
                    width: "100%",
                    height: "100%",
                    background: isHead
                      ? "#06b6d4"
                      : isBody
                        ? "#2dd4bf"
                        : isFood
                          ? "#eab308"
                          : "transparent",
                    borderRadius: isHead || isFood ? 4 : 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Game state overlays */}
        {!playing && !gameOver && (
          <button
            style={{
              width: "100%",
              borderRadius: 12,
              background: "#293829",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              height: 48,
              marginBottom: 10,
            }}
            type="button"
            onClick={reset}
          >
            Start Game
          </button>
        )}
        {gameOver && (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 22, color: "#fb5757", fontWeight: 700 }}>Game Over!</div>
            <button
              style={{
                borderRadius: 12,
                background: "#293829",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
                marginTop: 5,
                height: 48,
                width: 140,
              }}
              type="button"
              onClick={reset}
            >
              Restart
            </button>
          </div>
        )}

        {/* D-Pad Controls */}
        <div style={{ display: "flex", justifyContent: "center", margin: "28px 0" }}>
          <div style={{ width: 112, height: 112, position: "relative" }}>
            {/* Up */}
            <button
              onClick={() => manualMove("up")}
              style={{
                position: "absolute", left: "50%", top: 0, transform: "translate(-50%,0)",
                width: 38, height: 38, fontSize: 24, background: "#293829", color: "#fff", borderRadius: 12
              }}
              tabIndex={-1}
            >↑</button>
            {/* Left */}
            <button
              onClick={() => manualMove("left")}
              style={{
                position: "absolute", left: 0, top: "50%", transform: "translate(0,-50%)",
                width: 38, height: 38, fontSize: 24, background: "#293829", color: "#fff", borderRadius: 12
              }}
              tabIndex={-1}
            >←</button>
            {/* Right */}
            <button
              onClick={() => manualMove("right")}
              style={{
                position: "absolute", right: 0, top: "50%", transform: "translate(0,-50%)",
                width: 38, height: 38, fontSize: 24, background: "#293829", color: "#fff", borderRadius: 12
              }}
              tabIndex={-1}
            >→</button>
            {/* Down */}
            <button
              onClick={() => manualMove("down")}
              style={{
                position: "absolute", left: "50%", bottom: 0, transform: "translate(-50%,0)",
                width: 38, height: 38, fontSize: 24, background: "#293829", color: "#fff", borderRadius: 12
              }}
              tabIndex={-1}
            >↓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
