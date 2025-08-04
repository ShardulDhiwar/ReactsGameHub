import React, { useState } from "react"
import { Link } from "react-router-dom"

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // columns
  [0, 4, 8],
  [2, 4, 6], // diagonals
]

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [isDraw, setIsDraw] = useState(false)

  const calculateWinner = (squares) => {
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (index) => {
    if (winner || board[index]) return
    const newBoard = board.slice()
    newBoard[index] = xIsNext ? "X" : "O"
    setBoard(newBoard)
    const win = calculateWinner(newBoard)
    if (win) {
      setWinner(win)
    } else if (newBoard.every(Boolean)) {
      setIsDraw(true)
    }
    setXIsNext(!xIsNext)
  }

  const restart = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
    setWinner(null)
    setIsDraw(false)
  }

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#111811] text-white font-sans overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#293829] px-4 sm:px-10 py-3">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Tic Tac Toe</h2>
          <Link to="/">
            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 bg-[#293829] text-white px-4 text-sm font-bold tracking-[0.015em] hover:bg-[#3c533c] transition">
              &#8592; Back
            </button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="px-4 sm:px-10 flex flex-col flex-1 items-center justify-center gap-6 py-6 max-w-md mx-auto w-full">
          {/* Status */}
          <div className="text-white text-lg font-semibold">
            {winner
              ? `Winner: ${winner}`
              : isDraw
              ? "Draw!"
              : `Next Player: ${xIsNext ? "X" : "O"}`}
          </div>

          {/* Board */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
            {board.map((cell, idx) => (
              <button
                key={idx}
                className="aspect-square w-full rounded-xl border border-[#3c533c] bg-[#1c261c] text-white text-3xl font-bold select-none focus:outline-none hover:bg-[#293829] transition-colors"
                onClick={() => handleClick(idx)}
                aria-label={`Cell ${idx + 1}`}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Restart Button */}
          {(winner || isDraw) && (
            <button
              className="mt-6 w-full max-w-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-3"
              onClick={restart}
            >
              Restart Game
            </button>
          )}
        </main>
      </div>
    </div>
  )
}

export default TicTacToe
