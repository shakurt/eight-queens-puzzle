// Simple backtracking solver for Eight Queens

import type { Board } from "@/utils/index";
import { BOARD_SIZE, boardToImage, boardToKey, isSafe } from "@/utils/index";

export interface SolverState {
  board: Board;
  currentRow: number;
  solutions: string[];
  isComplete: boolean;
}

/**
 * Simple Eight Queens backtracking solver
 * Places queens row by row, checking columns left to right
 */
export class SimpleQueensSolver {
  private board: Board;
  private currentRow: number;
  private foundSolutions: Set<string>;
  private capturedImages: string[];
  private maxSolutions: number;

  constructor(maxSolutions = 12) {
    this.board = Array(BOARD_SIZE).fill(-1);
    this.currentRow = 0;
    this.foundSolutions = new Set();
    this.capturedImages = [];
    this.maxSolutions = maxSolutions;
  }

  /**
   * Get current state
   */
  getState(): SolverState {
    return {
      board: [...this.board],
      currentRow: this.currentRow,
      solutions: [...this.capturedImages],
      isComplete: this.foundSolutions.size >= this.maxSolutions,
    };
  }

  /**
   * Perform one step of the algorithm
   * Returns true if there are more steps to do
   */
  step(): boolean {
    if (this.foundSolutions.size >= this.maxSolutions) {
      return false;
    }

    // Found a complete solution
    if (this.currentRow === BOARD_SIZE) {
      const key = boardToKey(this.board);
      if (!this.foundSolutions.has(key)) {
        this.foundSolutions.add(key);
        this.capturedImages.push(boardToImage(this.board));
      }

      // Backtrack to find more solutions
      this.currentRow--;
      if (this.currentRow < 0) return false;

      const lastCol = this.board[this.currentRow];
      this.board[this.currentRow] = -1;

      // Try next column
      return this.tryNextColumn(this.currentRow, lastCol + 1);
    }

    // Try to place queen in current row
    const startCol =
      this.board[this.currentRow] === -1 ? 0 : this.board[this.currentRow] + 1;
    return this.tryNextColumn(this.currentRow, startCol);
  }

  /**
   * Try to place queen in next valid column
   */
  private tryNextColumn(row: number, startCol: number): boolean {
    // Clear current queen if any
    this.board[row] = -1;

    // Try columns from startCol onwards
    for (let col = startCol; col < BOARD_SIZE; col++) {
      if (isSafe(this.board, row, col)) {
        this.board[row] = col;
        this.currentRow = row + 1;
        return true;
      }
    }

    // No valid column found, backtrack
    if (row === 0) {
      return false; // No more solutions
    }

    this.currentRow = row - 1;
    const prevCol = this.board[this.currentRow];
    return this.tryNextColumn(this.currentRow, prevCol + 1);
  }

  /**
   * Reset solver
   */
  reset(): void {
    this.board = Array(BOARD_SIZE).fill(-1);
    this.currentRow = 0;
    this.foundSolutions.clear();
    this.capturedImages = [];
  }
}
