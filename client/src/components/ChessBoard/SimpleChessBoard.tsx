import { useState } from 'react';
import { Chessboard } from 'react-chessboard';

const SimpleChessBoard = () => {
  const [position] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [moveCount, setMoveCount] = useState(0);

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    console.log('Move attempted:', sourceSquare, 'to', targetSquare);
    setMoveCount(prev => prev + 1);
    return true; // Allow all moves for testing
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Simple Chess Board Test</h2>
      <p className="mb-4">Move count: {moveCount}</p>
      <div className="mb-4">
        <button 
          onClick={() => {
            setMoveCount(0);
            console.log('Reset clicked');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reset Counter
        </button>
      </div>
      <Chessboard
        {...{ position } as any}
        onPieceDrop={onDrop}
        boardWidth={400}
      />
    </div>
  );
};

export default SimpleChessBoard;