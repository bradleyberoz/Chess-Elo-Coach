import { useState } from 'react';

const SimpleWorkingBoard = () => {
  const [position, setPosition] = useState('start');
  const [moveCount, setMoveCount] = useState(0);

  const makeTestMove = () => {
    console.log('🧪 Making test move e2-e4');
    setPosition('after-e4');
    setMoveCount(1);
    console.log('🧪 Position updated');
  };

  const resetBoard = () => {
    console.log('🔄 Resetting board');
    setPosition('start');
    setMoveCount(0);
    console.log('🔄 Reset complete');
  };

  const makeSecondMove = () => {
    console.log('🧪 Making second move e7-e5');
    setPosition('after-e4-e5');
    setMoveCount(2);
    console.log('🧪 Second move complete');
  };

  // Simple visual representation of chess positions
  const getPositionDisplay = () => {
    if (position === 'start') {
      return (
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 w-96 h-96 mx-auto">
          {/* Row 8 - Black pieces */}
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♜</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♞</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♝</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♛</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♚</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♝</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♞</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♜</div>
          
          {/* Row 7 - Black pawns */}
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          
          {/* Rows 6-3 - Empty squares */}
          {Array.from({ length: 32 }, (_, i) => {
            const row = Math.floor(i / 8) + 3;
            const col = i % 8;
            const isLight = (row + col) % 2 === 0;
            return (
              <div 
                key={i}
                className={`border border-gray-300 flex items-center justify-center text-2xl ${
                  isLight ? 'bg-white' : 'bg-gray-400'
                }`}
              >
                {/* Empty square */}
              </div>
            );
          })}
          
          {/* Row 2 - White pawns */}
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          
          {/* Row 1 - White pieces */}
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♖</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♘</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♗</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♕</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♔</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♗</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♘</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♖</div>
        </div>
      );
    } else if (position === 'after-e4') {
      return (
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 w-96 h-96 mx-auto">
          {/* Row 8 - Black pieces */}
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♜</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♞</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♝</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♛</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♚</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♝</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♞</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♜</div>
          
          {/* Row 7 - Black pawns */}
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♟</div>
          
          {/* Row 6 - Empty */}
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          
          {/* Row 5 - Empty */}
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          
          {/* Row 4 - White pawn on e4 */}
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl bg-yellow-300">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          
          {/* Row 3 - Empty */}
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          
          {/* Row 2 - White pawns (minus e2) */}
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl"></div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♙</div>
          
          {/* Row 1 - White pieces */}
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♖</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♘</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♗</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♕</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♔</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♗</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">♘</div>
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">♖</div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-8 gap-0 border-2 border-gray-800 w-96 h-96 mx-auto">
          <div className="bg-white border border-gray-300 flex items-center justify-center text-2xl">Position: {position}</div>
          <div className="bg-gray-400 border border-gray-300 flex items-center justify-center text-2xl">Moves: {moveCount}</div>
          {/* Add more positions as needed */}
        </div>
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Simple Working Chess Board</h2>
      
      <div className="mb-4">
        <p className="mb-2">Current position: {position}</p>
        <p className="mb-2">Moves played: {moveCount}</p>
      </div>

      <div className="mb-4 space-x-2">
        <button 
          onClick={makeTestMove}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Move 1: e2-e4
        </button>
        <button 
          onClick={makeSecondMove}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Move 2: e7-e5
        </button>
        <button 
          onClick={resetBoard}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="mb-4">
        {getPositionDisplay()}
      </div>
      
      <div className="text-sm text-gray-600">
        <p>This is a simple CSS-based chess board that should definitely update!</p>
        <p>No external libraries - just pure React state and CSS grid.</p>
      </div>
    </div>
  );
};

export default SimpleWorkingBoard;