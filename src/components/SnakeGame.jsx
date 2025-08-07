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

// Custom hook for interval
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
      // Check collisions with walls or self
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
      // Eating food case
      if (next.x === food.x && next.y === food.y) {
        setFood(getRandomFood(newSnake));
        setScore(score + 1);
        setSnake(newSnake);
      } else {
        newSnake.pop();
        setSnake(newSnake);
      }
    },
    playing && !gameOver ? SPEEDS[difficulty] : null
  );

  // Keyboard controls
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

  // D-Pad manual moves
  const manualMove = (arrow) => {
    setDir(prev => {
      if (arrow === "left" && prev.x !== 1) return { x: -1, y: 0 };
      if (arrow === "right" && prev.x !== -1) return { x: 1, y: 0 };
      if (arrow === "up" && prev.y !== 1) return { x: 0, y: -1 };
      if (arrow === "down" && prev.y !== -1) return { x: 0, y: 1 };
      return prev;
    });
  };

  // Reset game
  const reset = () => {
    setSnake([...INITIAL_SNAKE]);
    setDir({ ...INITIAL_DIR });
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  };

  return (
    <div style={{
      fontFamily: 'Space Grotesk, Noto Sans, sans-serif',
      minHeight: "100vh",
      background: "#111811",
      color: "#fff",
      padding: 16,
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 32 }}>
        {/* Header with Back Button */}
        <header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 0",
            marginBottom: 12,
            width: "100%",
          }}
        >
          {/* Empty div to balance spacing on the left */}
          <div style={{ width: 68 }} />

          {/* Title centered */}
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: "bold", userSelect: "none" }}>
            🐍 Snake Game
          </h2>

          {/* Back Button on the right */}
          <button
            onClick={() => window.history.back()}
            style={{
              display: "flex",
              alignItems: "center",
              background: "#293829",
              borderRadius: 12,
              height: 40,
              border: "none",
              padding: "0 12px",
              cursor: "pointer",
              color: "#fff",
              fontWeight: "bold",
              marginLeft: 16,
            }}
            title="Back"
            type="button"
          >
            Back
            <svg
              style={{ marginLeft: 6 }}
              width="20px"
              height="20px"
              fill="currentColor"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
            </svg>
          </button>
        </header>

        {/* Player name and score */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "16px 0 12px 0",
        }}>
          <input
            style={{
              background: "#1c261c",
              color: "#fff",
              border: "1px solid #3c533c",
              borderRadius: 12,
              height: 44,
              padding: "0 16px",
              width: 150,
              userSelect: "none",
            }}
            value="Player 1"
            readOnly
            disabled
            ref={inputRef}
          />
          <span style={{ color: "#aeeeee", fontWeight: 700, fontSize: 20, userSelect: "none" }}>
            Score: <span style={{ color: "#0ff" }}>{score}</span>
          </span>
        </div>

        {/* Difficulty selector ALWAYS visible */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <label htmlFor="difficulty" style={{ marginRight: 8, fontWeight: 700 }}>Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            style={{
              padding: 6,
              borderRadius: 8,
              background: "#1c261c",
              color: "#fff",
              border: "1px solid #3c533c",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Game board */}
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
            outline: "2px solid #3c533c",
            userSelect: "none",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
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

        {/* Start button */}
        {!playing && !gameOver && (
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <button
            style={{
              width: "50%",
              borderRadius: 12,
              background: "#293829",
              color: "#fff",
              fontWeight: 700,
              fontSize: 18,
              height: 48,
              marginBottom: 10,
              cursor: "pointer",
              userSelect: "none",
            }}
            type="button"
            onClick={reset}
          >
            Start Game
          </button>
          </div>
        )}

        {/* Game Over overlay */}
        {gameOver && (
          <div style={{ textAlign: "center", marginBottom: 14, userSelect: "none" }}>
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
                cursor: "pointer",
              }}
              type="button"
              onClick={reset}
            >
              Restart
            </button>
          </div>
        )}

        {/* D-Pad controls with spacing */}
       {/* D-Pad controls with more spacing */}
<div style={{ display: "flex", justifyContent: "center", margin: "28px 0" }}>
  <div style={{ width: 196, height: 196, position: "relative" }}>
    {/* Up */}
    <button
      onClick={() => manualMove("up")}
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        transform: "translate(-50%, 0)",
        width: 65,
        height: 65,
        fontSize: 28,
        background: "#293829",
        color: "#fff",
        borderRadius: 12,
        cursor: "pointer",
        userSelect: "none",
      }}
      tabIndex={-1}
      aria-label="Move up"
      type="button"
    >
      ↑
    </button>
    {/* Left */}
    <button
      onClick={() => manualMove("left")}
      style={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translate(0, -50%)",
        width: 65,
        height: 65,
        fontSize: 28,
        background: "#293829",
        color: "#fff",
        borderRadius: 12,
        cursor: "pointer",
        userSelect: "none",
      }}
      tabIndex={-1}
      aria-label="Move left"
      type="button"
    >
      ←
    </button>
    {/* Right */}
    <button
      onClick={() => manualMove("right")}
      style={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translate(0, -50%)",
        width: 65,
        height: 65,
        fontSize: 28,
        background: "#293829",
        color: "#fff",
        borderRadius: 12,
        cursor: "pointer",
        userSelect: "none",
      }}
      tabIndex={-1}
      aria-label="Move right"
      type="button"
    >
      →
    </button>
    {/* Down */}
    <button
      onClick={() => manualMove("down")}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 0,
        transform: "translate(-50%, 0)",
        width: 65,
        height: 65,
        fontSize: 28,
        background: "#293829",
        color: "#fff",
        borderRadius: 12,
        cursor: "pointer",
        userSelect: "none",
      }}
      tabIndex={-1}
      aria-label="Move down"
      type="button"
    >
      ↓
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default SnakeGame;
