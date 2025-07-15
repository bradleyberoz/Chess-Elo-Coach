import { useState } from 'react';
import Chessboard from 'chessboardjsx';

const AlternativeChessBoard = () => {
  const [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  const makeTestMove = () => {
    console.log('🧪 Making test move e2-e4');
    // Move white pawn from e2 to e4
    setPosition('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
    console.log('🧪 Position updated to:', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
  };

  const resetBoard = () => {
    console.log('🔄 Resetting board');
    setPosition('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    console.log('🔄 Reset complete');
  };

  const makeSecondMove = () => {
    console.log('🧪 Making second move e7-e5');
    // Move black pawn from e7 to e5
    setPosition('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2');
    console.log('🧪 Second move complete');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Alternative Chess Board Test</h2>
      
      <div className="mb-4">
        <p className="mb-2">Current position:</p>
        <code className="text-xs bg-gray-100 p-2 rounded block">{position}</code>
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

      <div className="mb-4 flex justify-center">
        <Chessboard
          position={position}
          width={400}
          draggable={false}
        />
      </div>
      
      <div className="text-sm text-gray-600">
        <p>Testing with chessboardjsx library instead of react-chessboard</p>
        <p>This should update when you click the buttons!</p>
      </div>
    </div>
  );
};

export default AlternativeChessBoard;