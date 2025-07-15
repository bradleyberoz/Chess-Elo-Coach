import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

const PrettyChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState('In Progress');

  const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    const gameCopy = new Chess(game.fen());
    
    try {
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy);
        setMoveHistory(gameCopy.history());
        setSelectedSquare(null);
        
        if (gameCopy.isGameOver()) {
          if (gameCopy.isCheckmate()) {
            setGameStatus(gameCopy.turn() === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!');
          } else if (gameCopy.isDraw()) {
            setGameStatus('Draw!');
          }
        } else {
          setGameStatus('In Progress');
        }
        
        console.log('Move made:', result.san);
        return true;
      }
    } catch (error) {
      console.log('Invalid move:', error);
    }
    return false;
  }, [game]);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setSelectedSquare(null);
    setGameStatus('In Progress');
  }, []);

  const undoMove = useCallback(() => {
    if (moveHistory.length > 0) {
      const gameCopy = new Chess(game.fen());
      gameCopy.undo();
      setGame(gameCopy);
      setMoveHistory(gameCopy.history());
      setSelectedSquare(null);
      setGameStatus('In Progress');
    }
  }, [game, moveHistory]);

  const handleSquareClick = useCallback((square: string) => {
    if (selectedSquare === null) {
      // Select piece if there's a piece on this square
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      }
    } else if (selectedSquare === square) {
      // Deselect if clicking the same square
      setSelectedSquare(null);
    } else {
      // Try to make a move
      const move = { from: selectedSquare, to: square };
      makeMove(move);
    }
  }, [selectedSquare, game, makeMove]);

  const getPieceSymbol = (piece: any) => {
    if (!piece) return '';
    
    const symbols = {
      'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };
    
    return symbols[`${piece.color}${piece.type}` as keyof typeof symbols] || '';
  };

  const isSquareLight = (file: number, rank: number) => {
    return (file + rank) % 2 === 0;
  };

  const getSquareName = (file: number, rank: number) => {
    return `${String.fromCharCode(97 + file)}${8 - rank}`;
  };

  const renderBoard = () => {
    const squares = [];
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const squareName = getSquareName(file, rank);
        const piece = game.get(squareName as any);
        const isLight = isSquareLight(file, rank);
        const isSelected = selectedSquare === squareName;
        const isLastMove = moveHistory.length > 0 && game.history({ verbose: true }).slice(-1)[0] && 
                          (game.history({ verbose: true }).slice(-1)[0].from === squareName || 
                           game.history({ verbose: true }).slice(-1)[0].to === squareName);
        
        squares.push(
          <div
            key={squareName}
            className={`
              w-12 h-12 flex items-center justify-center text-2xl font-bold cursor-pointer
              border border-gray-300 relative
              ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
              ${isSelected ? 'ring-4 ring-blue-500' : ''}
              ${isLastMove ? 'ring-2 ring-green-500' : ''}
              hover:brightness-110 transition-all
            `}
            onClick={() => handleSquareClick(squareName)}
          >
            {getPieceSymbol(piece)}
            
            {/* Square coordinates */}
            {file === 0 && (
              <div className="absolute top-0 left-0 text-xs text-gray-600 font-normal">
                {8 - rank}
              </div>
            )}
            {rank === 7 && (
              <div className="absolute bottom-0 right-0 text-xs text-gray-600 font-normal">
                {String.fromCharCode(97 + file)}
              </div>
            )}
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">ELO-Tailored Chess Board</h2>
      
      {/* Game Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold">{gameStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Turn</p>
            <p className="font-semibold">{game.turn() === 'w' ? 'White' : 'Black'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Moves</p>
            <p className="font-semibold">{moveHistory.length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex justify-center space-x-4">
        <button 
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          New Game
        </button>
        <button 
          onClick={undoMove}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          disabled={moveHistory.length === 0}
        >
          Undo Move
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center">
          {/* Board */}
          <div className="grid grid-cols-8 gap-0 border-4 border-amber-900 shadow-2xl">
            {renderBoard()}
          </div>
          
          {/* Board coordinates */}
          <div className="flex mt-2 ml-8">
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
              <div key={file} className="w-12 text-center text-sm font-semibold text-gray-600">
                {file}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Move History */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-bold mb-3">Move History</h3>
        {moveHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No moves yet. Click on a piece to start!</p>
        ) : (
          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-8 gap-2 text-sm">
              {moveHistory.map((move, index) => (
                <span key={index} className="text-center py-1 px-2 bg-white rounded">
                  {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Click on a piece to select it, then click on a destination square to move.</p>
        <p>Selected pieces are highlighted in blue. Last move is highlighted in green.</p>
      </div>
    </div>
  );
};

export default PrettyChessBoard;