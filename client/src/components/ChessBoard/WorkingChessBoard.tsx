import { useState, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const WorkingChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    const gameCopy = new Chess(game.fen());
    let result = null;

    try {
      result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        setGamePosition(gameCopy.fen());
        setMoveHistory(gameCopy.history());
        setMoveCount(prev => prev + 1);
        console.log('Move made:', result.san);
        return true;
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
    return false;
  }, [game]);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    console.log('🚀 onDrop called:', sourceSquare, 'to', targetSquare);
    
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // Always promote to queen for simplicity
    };

    const moveResult = makeMove(move);
    console.log('✅ Move result:', moveResult);
    return moveResult;
  }, [makeMove]);

  const resetGame = useCallback(() => {
    console.log('🔄 Reset game called');
    const newGame = new Chess();
    setGame(newGame);
    setGamePosition(newGame.fen());
    setMoveHistory([]);
    setMoveCount(0);
    console.log('🔄 Game reset complete');
  }, []);

  const undoMove = useCallback(() => {
    console.log('↩️ Undo move called');
    if (moveHistory.length > 0) {
      const gameCopy = new Chess(game.fen());
      gameCopy.undo();
      setGame(gameCopy);
      setGamePosition(gameCopy.fen());
      setMoveHistory(gameCopy.history());
      setMoveCount(prev => prev - 1);
      console.log('↩️ Move undone');
    } else {
      console.log('↩️ No moves to undo');
    }
  }, [game, moveHistory.length]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Working Chess Board</h2>
      
      {/* Game Info */}
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <p className="mb-2">Moves played: {moveCount}</p>
        <p className="mb-2">Current turn: {game.turn() === 'w' ? 'White' : 'Black'}</p>
        <p className="mb-2">Game status: {game.isGameOver() ? 'Game Over' : 'In Progress'}</p>
      </div>

      {/* Controls */}
      <div className="mb-4 space-x-2">
        <button 
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Game
        </button>
        <button 
          onClick={undoMove}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          disabled={moveHistory.length === 0}
        >
          Undo Move
        </button>
        <button 
          onClick={() => {
            console.log('🧪 Test button clicked');
            makeMove({ from: 'e2', to: 'e4' });
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Move (e2-e4)
        </button>
        <button 
          onClick={() => {
            console.log('🧪 Multi-move test');
            makeMove({ from: 'e2', to: 'e4' });
            setTimeout(() => makeMove({ from: 'e7', to: 'e5' }), 100);
          }}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
        >
          Test 2 Moves
        </button>
      </div>

      {/* Chess Board */}
      <div className="mb-4">
        <Chessboard
          key={gamePosition} // Force re-render when position changes
          {...{ position: gamePosition } as any}
          onPieceDrop={onDrop}
          boardWidth={400}
          arePiecesDraggable={!game.isGameOver()}
        />
      </div>

      {/* Move History */}
      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-bold mb-2">Move History:</h3>
        {moveHistory.length === 0 ? (
          <p className="text-gray-500">No moves yet</p>
        ) : (
          <div className="max-h-32 overflow-y-auto">
            {moveHistory.map((move, index) => (
              <span key={index} className="inline-block mr-2 mb-1">
                {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Current Position */}
      <div className="mt-4 p-4 bg-gray-50 rounded">
        <h3 className="font-bold mb-2">Current Position (FEN):</h3>
        <code className="text-xs break-all">{gamePosition}</code>
      </div>
    </div>
  );
};

export default WorkingChessBoard;