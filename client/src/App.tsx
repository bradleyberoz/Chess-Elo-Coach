import { useEffect } from 'react';
import ChessBoard from './components/ChessBoard';
import { useGameStore } from './stores/gameStore';
import './App.css';

function App() {
  const { initializeGame, fen, moves, gameOver, result } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ELO-Tailored Chess Coaching
          </h1>
          <p className="text-gray-600">
            Personalized chess analysis and coaching insights
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chess Board */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-center">
                <ChessBoard orientation="white" />
              </div>
              
              {/* Game Status */}
              <div className="mt-4 text-center">
                {gameOver && (
                  <div className="text-lg font-semibold text-red-600">
                    Game Over: {result}
                  </div>
                )}
                <div className="text-sm text-gray-600 mt-2">
                  Moves played: {moves.length}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Game Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Game Controls</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => useGameStore.getState().resetGame()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  New Game
                </button>
                <button 
                  onClick={() => useGameStore.getState().undoMove()}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                  disabled={moves.length === 0}
                >
                  Undo Move
                </button>
              </div>
            </div>

            {/* Move History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Move History</h3>
              <div className="max-h-60 overflow-y-auto">
                {moves.length === 0 ? (
                  <p className="text-gray-500 text-sm">No moves yet</p>
                ) : (
                  <div className="space-y-1">
                    {moves.map((move, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm py-1 px-2 rounded hover:bg-gray-100 cursor-pointer"
                        onClick={() => useGameStore.getState().goToMove(index)}
                      >
                        <span className="text-gray-500 w-8">
                          {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'}
                        </span>
                        <span className="font-mono">{move}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Current Position */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Position</h3>
              <div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                {fen}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;