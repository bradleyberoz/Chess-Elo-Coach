import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

const InlineStyledBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState('In Progress');
  const [draggedPiece, setDraggedPiece] = useState<{ square: string; piece: any } | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<string | null>(null);

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

  const getPieceSymbol = (piece: any) => {
    if (!piece) return '';
    
    // Using filled Unicode chess pieces for better visual clarity
    const symbols = {
      'wp': '♙', 'wr': '♖', 'wn': '♘', 'wb': '♗', 'wq': '♕', 'wk': '♔',
      'bp': '♟', 'br': '♜', 'bn': '♞', 'bb': '♝', 'bq': '♛', 'bk': '♚'
    };
    
    return symbols[`${piece.color}${piece.type}` as keyof typeof symbols] || '';
  };

  const getPieceStyle = (piece: any) => {
    if (!piece) return {};
    
    const isWhite = piece.color === 'w';
    return {
      color: isWhite ? '#ffffff' : '#2c2c2c',
      textShadow: isWhite 
        ? '1px 1px 2px rgba(0,0,0,0.8), 0 0 1px rgba(0,0,0,0.9)' 
        : '1px 1px 2px rgba(255,255,255,0.3), 0 0 1px rgba(255,255,255,0.4)',
      fontSize: '38px',
      fontWeight: 'normal' as const,
      cursor: piece.color === game.turn() ? 'grab' : 'default',
      transition: 'all 0.2s ease',
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      MozUserSelect: 'none' as const,
      msUserSelect: 'none' as const,
      filter: 'none'
    };
  };

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

  const handleDragStart = useCallback((e: React.DragEvent, square: string) => {
    const piece = game.get(square as any);
    if (piece && piece.color === game.turn()) {
      setDraggedPiece({ square, piece });
      setSelectedSquare(null); // Clear any existing selection
      
      // Create drag image
      const dragImage = document.createElement('div');
      dragImage.innerHTML = getPieceSymbol(piece);
      dragImage.style.fontSize = '36px';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      dragImage.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 18, 18);
      e.dataTransfer.effectAllowed = 'move';
      
      // Clean up drag image after drag starts
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    } else {
      e.preventDefault();
    }
  }, [game]);

  const handleDragOver = useCallback((e: React.DragEvent, square: string) => {
    e.preventDefault();
    if (draggedPiece) {
      setDragOverSquare(square);
      
      // Check if it's a valid move to show appropriate cursor
      const move = { from: draggedPiece.square, to: square };
      const gameCopy = new Chess(game.fen());
      try {
        const result = gameCopy.move(move);
        e.dataTransfer.dropEffect = result ? 'move' : 'none';
      } catch {
        e.dataTransfer.dropEffect = 'none';
      }
    }
  }, [draggedPiece, game]);

  const handleDragLeave = useCallback(() => {
    setDragOverSquare(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, square: string) => {
    e.preventDefault();
    setDragOverSquare(null);
    
    if (draggedPiece) {
      const move = { from: draggedPiece.square, to: square };
      makeMove(move);
      setDraggedPiece(null);
    }
  }, [draggedPiece, makeMove]);

  const handleDragEnd = useCallback(() => {
    setDraggedPiece(null);
    setDragOverSquare(null);
  }, []);

  const isValidMoveTarget = useCallback((square: string) => {
    if (!draggedPiece) return false;
    const move = { from: draggedPiece.square, to: square };
    const gameCopy = new Chess(game.fen());
    try {
      return gameCopy.move(move) !== null;
    } catch {
      return false;
    }
  }, [draggedPiece, game]);

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
    const isDragSource = draggedPiece?.square === squareName;
    const isDragOver = dragOverSquare === squareName;
    const isValidTarget = isDragOver && isValidMoveTarget(squareName);
    
    let backgroundColor = '';
    let boxShadow = '';
    
    if (isDragSource) {
      backgroundColor = isLight ? '#d4d4d8' : '#71717a'; // Gray for drag source
      boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
    } else if (isValidTarget) {
      backgroundColor = isLight ? '#bbf7d0' : '#16a34a'; // Green for valid drop target
      boxShadow = '0 0 8px rgba(34, 197, 94, 0.4)';
    } else if (isDragOver) {
      backgroundColor = isLight ? '#fecaca' : '#dc2626'; // Red for invalid drop target
      boxShadow = '0 0 8px rgba(220, 38, 38, 0.4)';
    } else if (isLastMove) {
      backgroundColor = isLight ? '#fef3c7' : '#ca8a04'; // Yellow for last move
      boxShadow = '0 0 6px rgba(202, 138, 4, 0.3)';
    } else if (isLight) {
      backgroundColor = '#f5f5f4'; // Classic light beige
    } else {
      backgroundColor = '#8b5a3c'; // Classic dark brown
    }
    
    let borderColor = 'rgba(0, 0, 0, 0.1)';
    let borderWidth = '1px';
    
    if (isSelected) {
      borderColor = '#1d4ed8';
      borderWidth = '3px';
      boxShadow = '0 0 12px rgba(29, 78, 216, 0.5)';
    } else if (isValidTarget) {
      borderColor = '#16a34a';
      borderWidth = '2px';
    } else if (isDragOver) {
      borderColor = '#dc2626';
      borderWidth = '2px';
    }
    
    return {
      width: '64px',
      height: '64px',
      backgroundColor,
      border: `${borderWidth} solid ${borderColor}`,
      boxShadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      position: 'relative' as const,
      transition: 'all 0.2s ease',
      boxSizing: 'border-box' as const,
      userSelect: 'none' as const,
      opacity: isDragSource ? 0.7 : 1,
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
            onDragOver={(e) => handleDragOver(e, squareName)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, squareName)}
            onMouseEnter={(e) => {
              if (!draggedPiece) {
                (e.target as HTMLElement).style.filter = 'brightness(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!draggedPiece) {
                (e.target as HTMLElement).style.filter = 'brightness(1)';
              }
            }}
          >
            <span 
              style={getPieceStyle(piece)}
              draggable={piece && piece.color === game.turn()}
              onDragStart={(e) => handleDragStart(e, squareName)}
              onDragEnd={handleDragEnd}
            >
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
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f9fafb',
      minHeight: '100vh'
    }}>
      <h1 style={{
        fontSize: '2.75rem',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: '40px',
        color: '#1f2937',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        letterSpacing: '-0.025em',
        fontFamily: 'Georgia, serif'
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
            border: '3px solid #44403c',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
            marginBottom: '32px',
            background: '#292524',
            padding: '6px',
            gap: '1px'
          }}>
            {renderBoard()}
          </div>
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={resetGame}
              style={{
                backgroundColor: '#1d4ed8',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                border: '1px solid #1e40af',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease',
                transform: 'translateY(0)',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1e40af';
                (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                (e.target as HTMLElement).style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              New Game
            </button>
            <button 
              onClick={undoMove}
              disabled={moveHistory.length === 0}
              style={{
                backgroundColor: moveHistory.length === 0 ? '#9ca3af' : '#6b7280',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                border: moveHistory.length === 0 ? '1px solid #9ca3af' : '1px solid #6b7280',
                fontWeight: '500',
                cursor: moveHistory.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                boxShadow: moveHistory.length === 0 
                  ? '0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease',
                transform: 'translateY(0)',
                opacity: moveHistory.length === 0 ? 0.6 : 1,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (moveHistory.length > 0) {
                  (e.target as HTMLElement).style.backgroundColor = '#4b5563';
                  (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLElement).style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (moveHistory.length > 0) {
                  (e.target as HTMLElement).style.backgroundColor = '#6b7280';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
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
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px'
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
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px'
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
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#1f2937',
              borderBottom: '2px solid #e2e8f0',
              paddingBottom: '8px'
            }}>
              How to Play
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '14px',
              color: '#4b5563'
            }}>
              <p>• Click on a piece to select it</p>
              <p>• Click on a destination to move</p>
              <p>• Or drag and drop pieces to move</p>
              <p>• Green = valid drop target</p>
              <p>• Red = invalid drop target</p>
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