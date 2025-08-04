import React from 'react'
import { Routes, Route } from 'react-router-dom'
import GameSelection from './components/GameSelection.jsx'
import MemoryGame from './components/MemoryGame.jsx'
import SnakeGame from './components/SnakeGame.jsx'
import TicTacToe from './components/TicTacToe.jsx'


function App() {
  

  return (
    <Routes>
      <Route path='/' element={<GameSelection />} />
      <Route path='/snake' element={<SnakeGame />} />
      <Route path='/tic-tac-toe' element={<TicTacToe />} />
      <Route path='/memory' element={<MemoryGame />} />
    </Routes>
  )
}

export default App
