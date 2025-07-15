import { useCallback, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameStore } from '../../stores/gameStore';
import type { ChessMove } from '../../types/chess';

interface ChessBoardProps {
  orientation?: 'white' | 'black';
  disabled?: boolean;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  orientation = 'white',
  disabled = false,
}) => {
  const { game, fen, makeMove } = useGameStore();
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [pendingMove, setPendingMove] = useState<ChessMove | null>(null);

  // Handle piece drop (drag and drop)
  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    if (disabled) return false;

    const move: ChessMove = {
      from: sourceSquare,
      to: targetSquare,
    };

    // Check if this move requires promotion
    const piece = game.get(sourceSquare as any);
    if (piece?.type === 'p' && (targetSquare[1] === '8' || targetSquare[1] === '1')) {
      setPendingMove(move);
      setShowPromotionDialog(true);
      return false;
    }

    const moveResult = makeMove(move);
    return moveResult;
  }, [disabled, makeMove, game]);

  // Handle promotion piece selection
  const handlePromotion = useCallback((piece: string) => {
    if (pendingMove) {
      const promotionMove: ChessMove = {
        ...pendingMove,
        promotion: piece,
      };
      makeMove(promotionMove);
      setPendingMove(null);
      setShowPromotionDialog(false);
    }
  }, [pendingMove, makeMove]);

  return (
    <div className="chess-board-container">
      <div className="chess-board relative">
        <Chessboard
          {...{ position: fen } as any}
          onPieceDrop={onDrop}
          boardOrientation={orientation}
          arePiecesDraggable={!disabled}
        />
        
        {/* Promotion Dialog */}
        {showPromotionDialog && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose promotion piece:</h3>
              <div className="flex gap-4">
                {['q', 'r', 'b', 'n'].map((piece) => (
                  <button
                    key={piece}
                    onClick={() => handlePromotion(piece)}
                    className="p-2 border rounded hover:bg-gray-100 text-2xl"
                  >
                    {piece === 'q' && '♕'}
                    {piece === 'r' && '♖'}
                    {piece === 'b' && '♗'}
                    {piece === 'n' && '♘'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;