import { useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '../../stores/gameStore';
import type { ChessMove } from '../../types/chess';

interface ChessBoardProps {
  orientation?: 'white' | 'black';
  disabled?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  disabled = false,
}) => {
  const { fen, makeMove } = useGameStore();

  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }: any) => {
    if (disabled) return false;
    
    try {
      const move: ChessMove = {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      };
      
      const success = makeMove(move);
      return success;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  }, [disabled, makeMove]);

  const chessboardOptions = {
    position: fen,
    onPieceDrop,
    allowDragging: !disabled,
    showNotation: true,
    animationDurationInMs: 200,
    boardStyle: {
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    }
  };

  return (
    <div className="flex justify-center">
      <div style={{ width: '500px' }}>
        <Chessboard options={chessboardOptions} />
      </div>
    </div>
  );
};

export default ChessBoard;