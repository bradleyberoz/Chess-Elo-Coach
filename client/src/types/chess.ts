import { Chess } from 'chess.js';

export interface ChessMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameState {
  game: Chess;
  fen: string;
  pgn: string;
  moves: string[];
  currentMoveIndex: number;
  gameOver: boolean;
  result: string | null;
}

export interface ChessBoardProps {
  position: string;
  onMove?: (move: ChessMove) => void;
  orientation?: 'white' | 'black';
  showMoveHistory?: boolean;
  disabled?: boolean;
}

export interface AnalysisData {
  move: string;
  evaluation: number;
  bestMove: string;
  explanation: string;
  eloLevel: number;
}