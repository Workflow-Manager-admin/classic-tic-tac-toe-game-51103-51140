import React, { useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * Root app for Tic Tac Toe game.
 * - Provides full game logic, display, and controls.
 * - Responsive, modern and themed according to requirements.
 */
function App() {
  // State: board, current player, outcome, turn
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null); // 'X', 'O', 'draw'
  const [moveCount, setMoveCount] = useState(0);

  /**
   * PUBLIC_INTERFACE
   * Handle user clicking a cell in the grid.
   * @param {number} idx - Index of the grid cell (0..8)
   */
  const handleCellClick = (idx) => {
    if (board[idx] || winner) return; // Prevent overwrite or move after end
    const nextBoard = board.slice();
    nextBoard[idx] = isXNext ? 'X' : 'O';
    const nextMoveCount = moveCount + 1;
    setBoard(nextBoard);
    setMoveCount(nextMoveCount);

    // Check for winner or draw
    const result = calculateWinner(nextBoard);
    if (result) {
      setWinner(result);
    } else if (nextMoveCount === 9) {
      setWinner('draw');
    } else {
      setIsXNext(!isXNext);
    }
  };

  /**
   * PUBLIC_INTERFACE
   * Restart the game; clears state.
   */
  const handleRestart = () => {
    setBoard(emptyBoard);
    setIsXNext(true);
    setWinner(null);
    setMoveCount(0);
  };

  /**
   * PUBLIC_INTERFACE
   * Calculate and return winner ('X' or 'O'), or null, from a board state.
   * @param {Array} squares 
   */
  function calculateWinner(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let i=0; i<lines.length; ++i) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  // Status display
  let statusText = '';
  if (winner === 'draw') {
    statusText = "It's a draw! 🤝";
  } else if (winner) {
    statusText = `Winner: ${winner === 'X' ? "❌" : "⭕"} Player`;
  } else {
    statusText = `Turn: ${isXNext ? "❌ X" : "⭕ O"}`
  }

  return (
    <div className="App">
      <main className="ttt-main-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-board-wrapper">
          <BoardGrid
            squares={board}
            onCellClick={handleCellClick}
            winner={winner}
          />
        </div>
        <div className="ttt-status">{statusText}</div>
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart Game"
        >
          Restart
        </button>
      </main>
      <footer className="ttt-footer">
        <span>Modern React Tic Tac Toe &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Grid component for 3x3 tic tac toe board.
 * @param {{squares: Array, onCellClick: Function, winner: string|null}} props 
 */
function BoardGrid({ squares, onCellClick, winner }) {
  // Highlight winning squares (optional: not done, can be enhanced)
  return (
    <div className="ttt-board">
      {squares.map((val, idx) => (
        <BoardCell
          key={idx}
          value={val}
          onClick={() => onCellClick(idx)}
          disabled={Boolean(val) || Boolean(winner)}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Single cell within tic tac toe grid.
 * @param {{value: string|null, onClick: Function, disabled: boolean}} props 
 */
function BoardCell({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-cell"
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Cell: ${value}` : 'Empty Cell'}
      tabIndex={0}
    >
      {value === 'X' ? <span className="ttt-x">X</span>
       : value === 'O' ? <span className="ttt-o">O</span>
       : ''}
    </button>
  );
}

export default App;
