import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { GameState, ChessMove } from '../types/chess';

interface GameStore extends GameState {
  initializeGame: () => void;
  makeMove: (move: ChessMove) => boolean;
  loadGame: (pgn: string) => boolean;
  resetGame: () => void;
  undoMove: () => void;
  goToMove: (moveIndex: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: new Chess(),
  fen: new Chess().fen(),
  pgn: '',
  moves: [],
  currentMoveIndex: -1,
  gameOver: false,
  result: null,

  initializeGame: () => {
    const game = new Chess();
    set({
      game,
      fen: game.fen(),
      pgn: '',
      moves: [],
      currentMoveIndex: -1,
      gameOver: false,
      result: null,
    });
  },

  makeMove: (move: ChessMove) => {
    const { game } = get();
    const gameCopy = new Chess(game.fen());
    
    try {
      const result = gameCopy.move(move);
      if (result) {
        const moves = gameCopy.history();
        set({
          game: gameCopy,
          fen: gameCopy.fen(),
          pgn: gameCopy.pgn(),
          moves,
          currentMoveIndex: moves.length - 1,
          gameOver: gameCopy.isGameOver(),
          result: gameCopy.isGameOver() ? getGameResult(gameCopy) : null,
        });
        return true;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return false;
  },

  loadGame: (pgn: string) => {
    try {
      const game = new Chess();
      game.loadPgn(pgn);
      const moves = game.history();
      set({
        game,
        fen: game.fen(),
        pgn: game.pgn(),
        moves,
        currentMoveIndex: moves.length - 1,
        gameOver: game.isGameOver(),
        result: game.isGameOver() ? getGameResult(game) : null,
      });
      return true;
    } catch (error) {
      console.error('Invalid PGN:', error);
      return false;
    }
  },

  resetGame: () => {
    get().initializeGame();
  },

  undoMove: () => {
    const { game } = get();
    if (game.history().length > 0) {
      const gameCopy = new Chess(game.fen());
      gameCopy.undo();
      const moves = gameCopy.history();
      set({
        game: gameCopy,
        fen: gameCopy.fen(),
        pgn: gameCopy.pgn(),
        moves,
        currentMoveIndex: moves.length - 1,
        gameOver: gameCopy.isGameOver(),
        result: gameCopy.isGameOver() ? getGameResult(gameCopy) : null,
      });
    }
  },

  goToMove: (moveIndex: number) => {
    const { moves } = get();
    if (moveIndex >= -1 && moveIndex < moves.length) {
      const game = new Chess();
      
      // Replay moves up to the specified index
      for (let i = 0; i <= moveIndex; i++) {
        game.move(moves[i]);
      }
      
      set({
        game,
        fen: game.fen(),
        currentMoveIndex: moveIndex,
        gameOver: game.isGameOver(),
        result: game.isGameOver() ? getGameResult(game) : null,
      });
    }
  },
}));

function getGameResult(game: Chess): string {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? '0-1' : '1-0';
  } else if (game.isDraw()) {
    return '1/2-1/2';
  } else if (game.isStalemate()) {
    return '1/2-1/2';
  } else if (game.isThreefoldRepetition()) {
    return '1/2-1/2';
  } else if (game.isInsufficientMaterial()) {
    return '1/2-1/2';
  }
  return '*';
}