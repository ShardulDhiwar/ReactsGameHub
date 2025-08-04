import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

// 8 unique emojis, 16 cards total (2 of each)
const CARD_VALUES = [
  "🐍", "☂️", "🍕", "🌴", "🚗", "🥑", "🎩", "🐺"
]

function shuffle(arr) {
  let a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const MemoryGame = () => {
  const [deck, setDeck] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [busy, setBusy] = useState(false)

  // Initialize new game
  useEffect(() => {
    const cards = shuffle(
      CARD_VALUES.concat(CARD_VALUES)
        .map((value, i) => ({ id: i, value }))
    )
    setDeck(cards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setBusy(false)
  }, [])

  // Restart game
  const restart = () => {
    const cards = shuffle(
      CARD_VALUES.concat(CARD_VALUES)
        .map((value, i) => ({ id: i, value }))
    )
    setDeck(cards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setBusy(false)
  }

  // Handle card click
  const handleClick = idx => {
    if (busy || flipped.includes(idx) || matched.includes(deck[idx].value)) return
    if (flipped.length === 0) {
      setFlipped([idx])
    } else if (flipped.length === 1) {
      setFlipped([flipped[0], idx])
      setMoves(m => m + 1)
      if (deck[flipped[0]].value === deck[idx].value) {
        setMatched(m => [...m, deck[idx].value])
        setFlipped([])
      } else {
        setBusy(true)
        setTimeout(() => {
          setFlipped([])
          setBusy(false)
        }, 850)
      }
    }
  }

  // Game won?
  const isWon = matched.length === CARD_VALUES.length

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#111811] text-white font-sans overflow-x-hidden"
      style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#293829] px-4 sm:px-10 py-3">
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Memory Match</h2>
          <Link to="/">
            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 bg-[#293829] text-white px-4 text-sm font-bold tracking-[0.015em] hover:bg-[#3c533c] transition">
              &#8592; Back
            </button>
          </Link>
        </header>

        <main className="px-2 sm:px-10 flex flex-col flex-1 items-center justify-center gap-6 py-6 max-w-md mx-auto w-full">
          <div className="text-lg font-semibold mb-0">
            {isWon ? "🎉 You Won!" : `Moves: ${moves}`} <span className="ml-2">Matched: {matched.length}/{CARD_VALUES.length}</span>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-xs">
            {deck.map((card, idx) => {
              const isFlipped = flipped.includes(idx) || matched.includes(card.value)
              return (
                <button
                  key={card.id}
                  className={`relative aspect-square rounded-xl border border-[#3c533c] flex items-center justify-center
                    text-3xl font-bold text-white bg-[#1c261c] focus:outline-none
                    ${isFlipped ? "bg-blue-600" : "hover:bg-[#293829]"}
                    transition-all`}
                  style={{
                    filter: isFlipped ? "none" : "brightness(0.90)",
                    cursor: isFlipped ? "default" : "pointer"
                  }}
                  onClick={() => handleClick(idx)}
                  disabled={isFlipped || busy}
                  aria-label={isFlipped ? card.value : 'Hidden Card'}
                >
                  <span className="select-none">{isFlipped ? card.value : "?"}</span>
                </button>
              )
            })}
          </div>
          <button
            className="mt-6 w-full max-w-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold py-3"
            onClick={restart}
          >
            Restart
          </button>
        </main>
      </div>
    </div>
  )
}

export default MemoryGame
