import { useEffect } from 'react';
import ChessBoard from './components/ChessBoard/ChessBoard';
import GameNavigation from './components/GameNavigation';
import AnalysisPanel from './components/AnalysisPanel';
import { useGameStore } from './stores/gameStore';
import './App.css';

function App() {
  const { initializeGame } = useGameStore();

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          ELO-Tailored Chess Coach
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chess Board */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
              <ChessBoard />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <GameNavigation />
            <AnalysisPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;