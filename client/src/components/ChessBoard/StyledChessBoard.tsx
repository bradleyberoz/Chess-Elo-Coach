import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

const StyledChessBoard = () => {
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

  const getSquareStyle = (squareName: string, isLight: boolean) => {
    const isSelected = selectedSquare === squareName;
    const isLastMove = moveHistory.length > 0 && game.history({ verbose: true }).slice(-1)[0] && 
                      (game.history({ verbose: true }).slice(-1)[0].from === squareName || 
                       game.history({ verbose: true }).slice(-1)[0].to === squareName);
    
    let baseStyle = 'w-16 h-16 flex items-center justify-center text-4xl font-bold cursor-pointer relative transition-all duration-200 select-none ';
    
    // Base colors (Chess.com style)
    if (isLight) {
      baseStyle += 'bg-amber-100 ';
    } else {
      baseStyle += 'bg-amber-600 ';
    }
    
    // Selection highlight
    if (isSelected) {
      baseStyle += 'ring-4 ring-blue-400 ring-inset ';
    }
    
    // Last move highlight
    if (isLastMove) {
      if (isLight) {
        baseStyle += 'bg-yellow-200 ';
      } else {
        baseStyle += 'bg-yellow-500 ';
      }
    }
    
    // Hover effect
    baseStyle += 'hover:brightness-110 ';
    
    return baseStyle;
  };

  const renderBoard = () => {
    const squares = [];
    
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const squareName = getSquareName(file, rank);
        const piece = game.get(squareName as any);
        const isLight = isSquareLight(file, rank);
        
        squares.push(
          <div
            key={squareName}
            className={getSquareStyle(squareName, isLight)}
            onClick={() => handleSquareClick(squareName)}
          >
            <span className="drop-shadow-sm">{getPieceSymbol(piece)}</span>
            
            {/* File labels (a-h) at bottom */}
            {rank === 7 && (
              <div className="absolute bottom-0 right-1 text-xs font-bold text-gray-700">
                {String.fromCharCode(97 + file)}
              </div>
            )}
            
            {/* Rank labels (1-8) at left */}
            {file === 0 && (
              <div className="absolute top-0 left-1 text-xs font-bold text-gray-700">
                {8 - rank}
              </div>
            )}
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        ELO-Tailored Chess Coach
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chess Board */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="mb-6">
            <div 
              className="grid grid-cols-8 border-4 border-gray-800 shadow-2xl rounded-lg overflow-hidden"
              style={{ width: '512px', height: '512px' }}
            >
              {renderBoard()}
            </div>
          </div>
          
          {/* Game Controls */}
          <div className="flex space-x-4">
            <button 
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              New Game
            </button>
            <button 
              onClick={undoMove}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={moveHistory.length === 0}
            >
              Undo Move
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Game Status */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Game Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-semibold">{gameStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Turn:</span>
                <span className="font-semibold">
                  {game.turn() === 'w' ? '⚪ White' : '⚫ Black'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Moves:</span>
                <span className="font-semibold">{moveHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Move History */}
          <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Move History</h3>
            <div className="max-h-64 overflow-y-auto">
              {moveHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No moves yet.<br/>
                  Click a piece to start!
                </p>
              ) : (
                <div className="space-y-1">
                  {moveHistory.map((move, index) => (
                    <div key={index} className="flex items-center py-1 px-2 bg-white rounded text-sm">
                      <span className="text-gray-500 w-8 text-right mr-3">
                        {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'}
                      </span>
                      <span className="font-mono font-semibold">{move}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-800">How to Play</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Click on a piece to select it</p>
              <p>• Click on a destination to move</p>
              <p>• Selected piece has blue border</p>
              <p>• Last move is highlighted in yellow</p>
              <p>• Only legal moves are allowed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyledChessBoard;