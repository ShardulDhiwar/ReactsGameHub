import React, { useEffect, useRef, useState, useCallback } from "react"

const BOARD_SIZE = 20      // 20x20 grid
const INITIAL_SNAKE = [{ x: 8, y: 10 }]
const INITIAL_DIR = { x: 1, y: 0 }

const getRandomFood = (snake) => {
  while (true) {
    const x = Math.floor(Math.random() * BOARD_SIZE)
    const y = Math.floor(Math.random() * BOARD_SIZE)
    if (!snake.some(seg => seg.x === x && seg.y === y)) {
      return { x, y }
    }
  }
}

const useInterval = (callback, delay) => {
  const cbRef = useRef()
  useEffect(() => { cbRef.current = callback }, [callback])
  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => cbRef.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

const SnakeGame = () => {
  // State
  const [snake, setSnake] = useState([...INITIAL_SNAKE])
  const [dir, setDir] = useState({ ...INITIAL_DIR })
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE))
  const [playing, setPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const inputRef = useRef(null)

  const reset = () => {
    setSnake([...INITIAL_SNAKE])
    setDir({ ...INITIAL_DIR })
    setFood(getRandomFood(INITIAL_SNAKE))
    setScore(0)
    setGameOver(false)
    setPlaying(true)
  }

  // Movement
  useInterval(
    () => {
      if (!playing || gameOver) return

      const next = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }
      // Wall/collision check
      if (
        next.x < 0 ||
        next.x >= BOARD_SIZE ||
        next.y < 0 ||
        next.y >= BOARD_SIZE ||
        snake.some(seg => seg.x === next.x && seg.y === next.y)
      ) {
        setPlaying(false)
        setGameOver(true)
        return
      }

      const newSnake = [next, ...snake]
      if (next.x === food.x && next.y === food.y) {
        setFood(getRandomFood(newSnake))
        setScore(score + 1)
        setSnake(newSnake) // Grow snake
      } else {
        newSnake.pop()
        setSnake(newSnake)
      }
    },
    playing && !gameOver ? 100 : null
  )

  // Keyboard controls
  const handleKeyDown = useCallback((e) => {
    if (!playing) return
    if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(e.key)) {
      setDir(prev => {
        if (e.key === "ArrowLeft" && prev.x !== 1) return { x: -1, y: 0 }
        if (e.key === "ArrowRight" && prev.x !== -1) return { x: 1, y: 0 }
        if (e.key === "ArrowUp" && prev.y !== 1) return { x: 0, y: -1 }
        if (e.key === "ArrowDown" && prev.y !== -1) return { x: 0, y: 1 }
        return prev
      })
    }
  }, [playing])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Button controls
  const manualMove = (arrow) => {
    setDir(prev => {
      if (arrow === "left" && prev.x !== 1) return { x: -1, y: 0 }
      if (arrow === "right" && prev.x !== -1) return { x: 1, y: 0 }
      if (arrow === "up" && prev.y !== 1) return { x: 0, y: -1 }
      if (arrow === "down" && prev.y !== -1) return { x: 0, y: 1 }
      return prev
    })
  }

  // Render the board as a grid
  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#111811] dark group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#293829] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none">
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Snake Game
            </h2>
          </div>
          <button
            type="button"
            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 bg-[#293829] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            onClick={() => window.history.back()}
            title="Back"
          >
            <div>
              <svg width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"
                />
              </svg>
            </div>
          </button>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              🐍 Snake Game
            </h2>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3c533c] bg-[#1c261c] focus:border-[#3c533c] h-14 placeholder:text-[#9db89d] p-[15px] text-base font-normal leading-normal"
                  placeholder="Player Name"
                  ref={inputRef}
                  disabled
                  value="Player 1"
                  readOnly
                />
              </label>
              <div className="text-gray-400 font-bold px-4">Score: <span className="text-cyan-400">{score}</span></div>
            </div>

            {/* Board */}
            <div className="flex flex-col p-4">
              <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#3c533c] px-2 py-3">
                <div className="relative"
                  style={{
                    width: 320,
                    height: 320,
                    background: "#111811",
                    outline: "2px solid #3c533c",
                    margin: "0.5rem 0",
                  }}
                >
                  {/* Grid 🟩 */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                      gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    }}
                  >
                    {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, idx) => {
                      const x = idx % BOARD_SIZE
                      const y = Math.floor(idx / BOARD_SIZE)
                      const isHead = snake[0].x === x && snake[0].y === y
                      const isBody = snake.some((s, i) => s.x === x && s.y === y && i !== 0)
                      const isFood = food.x === x && food.y === y
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
                            borderRadius: isHead || isFood ? "4px" : "0",
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
                {!playing && !gameOver && (
                  <button
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293829] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    type="button"
                    onClick={reset}
                  >
                    <span className="truncate">Start Game</span>
                  </button>
                )}
                {gameOver && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-red-400 text-lg font-bold leading-tight">Game Over!</p>
                    <button
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293829] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                      type="button"
                      onClick={reset}
                    >
                      <span className="truncate">Restart</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Button controls */}
            <div className="flex justify-center">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293829] text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
                  type="button"
                  tabIndex={-1}
                  onClick={() => manualMove("left")}
                >
                  <span className="truncate">←</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293829] text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
                  type="button"
                  tabIndex={-1}
                  onClick={() => manualMove("right")}
                >
                  <span className="truncate">→</span>
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293829] text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
                  type="button"
                  tabIndex={-1}
                  onClick={() => manualMove("up")}
                >
                  <span className="truncate">↑</span>
                </button>
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#293829] text-white text-sm font-bold leading-normal tracking-[0.015em] grow"
                  type="button"
                  tabIndex={-1}
                  onClick={() => manualMove("down")}
                >
                  <span className="truncate">↓</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame
