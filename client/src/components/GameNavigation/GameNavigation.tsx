import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const GameNavigation: React.FC = () => {
  const { moves, currentMoveIndex, resetGame, undoMove, goToMove, gameOver, result } = useGameStore();

  const getGameStatus = () => {
    if (gameOver) {
      if (result === '1-0') return 'White wins!';
      if (result === '0-1') return 'Black wins!';
      if (result === '1/2-1/2') return 'Draw!';
    }
    return 'In Progress';
  };

  const getCurrentTurn = () => {
    const game = useGameStore.getState().game;
    return game.turn() === 'w' ? '⚪ White' : '⚫ Black';
  };

  return (
    <div className="space-y-6">
      {/* Game Status */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
          Game Info
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-bold">{getGameStatus()}</span>
          </div>
          {!gameOver && (
            <div className="flex justify-between">
              <span className="text-gray-600">Turn:</span>
              <span className="font-bold">{getCurrentTurn()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Moves:</span>
            <span className="font-bold">{moves.length}</span>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
          Controls
        </h3>
        <div className="flex flex-col space-y-3">
          <button
            onClick={resetGame}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            New Game
          </button>
          <button
            onClick={undoMove}
            disabled={moves.length === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Undo Move
          </button>
        </div>
      </div>

      {/* Move History */}
      <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
          Move History
        </h3>
        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-2">
          {moves.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No moves yet.<br />
              Click a piece to start!
            </p>
          ) : (
            <div className="space-y-1">
              {moves.map((move, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                    index === currentMoveIndex 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => goToMove(index)}
                >
                  <span className="text-gray-600 w-8 text-right mr-3 text-sm">
                    {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'}
                  </span>
                  <span className="font-mono font-bold text-sm">
                    {move}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {moves.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">
            Navigate
          </h3>
          <div className="flex justify-between">
            <button
              onClick={() => goToMove(-1)}
              disabled={currentMoveIndex === -1}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
            >
              Start
            </button>
            <button
              onClick={() => goToMove(currentMoveIndex - 1)}
              disabled={currentMoveIndex === -1}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
            >
              ←
            </button>
            <button
              onClick={() => goToMove(currentMoveIndex + 1)}
              disabled={currentMoveIndex === moves.length - 1}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
            >
              →
            </button>
            <button
              onClick={() => goToMove(moves.length - 1)}
              disabled={currentMoveIndex === moves.length - 1}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-1 px-3 rounded text-sm transition-colors duration-200"
            >
              End
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameNavigation;