import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

const InlineStyledBoard = () => {
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
      const piece = game.get(square as any);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
      }
    } else if (selectedSquare === square) {
      setSelectedSquare(null);
    } else {
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
    
    let backgroundColor = '';
    
    if (isLastMove) {
      backgroundColor = isLight ? '#fef08a' : '#eab308'; // Yellow for last move
    } else if (isLight) {
      backgroundColor = '#fef3c7'; // Light amber
    } else {
      backgroundColor = '#d97706'; // Dark amber
    }
    
    return {
      width: '64px',
      height: '64px',
      backgroundColor,
      border: isSelected ? '4px solid #3b82f6' : '1px solid #92400e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '36px',
      fontWeight: 'bold',
      position: 'relative' as const,
      transition: 'all 0.2s ease',
      boxSizing: 'border-box' as const,
      userSelect: 'none' as const,
    };
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
            style={getSquareStyle(squareName, isLight)}
            onClick={() => handleSquareClick(squareName)}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.filter = 'brightness(1)';
            }}
          >
            <span style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}>
              {getPieceSymbol(piece)}
            </span>
            
            {/* File labels */}
            {rank === 7 && (
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#374151'
              }}>
                {String.fromCharCode(97 + file)}
              </div>
            )}
            
            {/* Rank labels */}
            {file === 0 && (
              <div style={{
                position: 'absolute',
                top: '2px',
                left: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#374151'
              }}>
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
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '32px',
        color: '#1f2937'
      }}>
        ELO-Tailored Chess Coach
      </h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Chess Board */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 64px)',
            border: '4px solid #1f2937',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            marginBottom: '24px'
          }}>
            {renderBoard()}
          </div>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={resetGame}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#2563eb';
              }}
            >
              New Game
            </button>
            <button 
              onClick={undoMove}
              disabled={moveHistory.length === 0}
              style={{
                backgroundColor: moveHistory.length === 0 ? '#9ca3af' : '#4b5563',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: moveHistory.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (moveHistory.length > 0) {
                  (e.target as HTMLElement).style.backgroundColor = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (moveHistory.length > 0) {
                  (e.target as HTMLElement).style.backgroundColor = '#4b5563';
                }
              }}
            >
              Undo Move
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Game Status */}
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Game Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Status:</span>
                <span style={{ fontWeight: 'bold' }}>{gameStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Turn:</span>
                <span style={{ fontWeight: 'bold' }}>
                  {game.turn() === 'w' ? '⚪ White' : '⚫ Black'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Moves:</span>
                <span style={{ fontWeight: 'bold' }}>{moveHistory.length}</span>
              </div>
            </div>
          </div>

          {/* Move History */}
          <div style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#1f2937'
            }}>
              Move History
            </h3>
            <div style={{
              maxHeight: '256px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              padding: '8px'
            }}>
              {moveHistory.length === 0 ? (
                <p style={{
                  color: '#6b7280',
                  textAlign: 'center',
                  padding: '16px'
                }}>
                  No moves yet.<br/>
                  Click a piece to start!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {moveHistory.map((move, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px 8px',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      <span style={{
                        color: '#6b7280',
                        width: '32px',
                        textAlign: 'right',
                        marginRight: '12px'
                      }}>
                        {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'}
                      </span>
                      <span style={{
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                      }}>
                        {move}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div style={{
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#1e40af'
            }}>
              How to Play
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '14px',
              color: '#1e40af'
            }}>
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

export default InlineStyledBoard;