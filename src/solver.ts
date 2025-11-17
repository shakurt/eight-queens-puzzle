// Eight Queens Backtracking Solver
// This implements the classic backtracking algorithm to solve the Eight Queens puzzle

import { BOARD_SIZE, boardToImage, boardToKey, isSafe } from "@/utils/index";
import type { Board } from "@/utils/index";

// The state of the solver that can be accessed from outside
export interface SolverState {
  board: Board; // Current board configuration
  currentRow: number; // Which row we're currently trying to fill
  solutions: string[]; // Array of solution images we've captured
  isComplete: boolean; // Whether we've found all solutions
}

/**
 * Eight Queens Backtracking Solver
 *
 * This solver works by:
 * 1. Placing queens row by row from top to bottom
 * 2. For each row, trying columns from left to right
 * 3. When a row has no valid placements, backtracking to the previous row
 * 4. Continuing until all solutions are found
 */
export class SimpleQueensSolver {
  // The current board state
  // Each index represents a row, value represents the column where queen is placed
  // -1 means no queen placed in that row yet
  private board: Board;

  // Which row we're currently trying to place a queen in
  private currentRow: number;

  // A set of unique solution keys we've found (to avoid duplicates)
  private foundSolutions: Set<string>;

  // Array of solution images (as data URLs)
  private capturedImages: string[];

  // Maximum number of solutions to find
  private maxSolutions: number;

  /**
   * Creates a new solver
   * @param maxSolutions - How many unique solutions to find before stopping
   */
  constructor(maxSolutions = 12) {
    // Initialize empty board (all -1 means no queens placed)
    this.board = Array(BOARD_SIZE).fill(-1);

    // Start at row 0 (top of the board)
    this.currentRow = 0;

    // No solutions found yet
    this.foundSolutions = new Set();
    this.capturedImages = [];

    // Remember how many solutions we want
    this.maxSolutions = maxSolutions;
  }

  /**
   * Gets the current state of the solver
   * Returns a copy of internal state for external use
   */
  getState(): SolverState {
    const numberOfSolutionsFound = this.foundSolutions.size;
    const hasFoundAllSolutions = numberOfSolutionsFound >= this.maxSolutions;

    return {
      board: [...this.board], // Copy the board array
      currentRow: this.currentRow,
      solutions: [...this.capturedImages], // Copy the solutions array
      isComplete: hasFoundAllSolutions,
    };
  }

  /**
   * Performs one step of the backtracking algorithm
   * This is called repeatedly to animate the solving process
   *
   * @returns true if there are more steps to perform, false if we're done
   */
  step(): boolean {
    // Check if we've already found all solutions we need
    const hasFoundAllSolutions = this.foundSolutions.size >= this.maxSolutions;

    if (hasFoundAllSolutions) {
      return false; // No more work to do
    }

    // Check if we've successfully placed queens in all rows
    const hasFilledAllRows = this.currentRow === BOARD_SIZE;

    if (hasFilledAllRows) {
      // We found a complete solution!
      this.handleFoundSolution();

      // Now backtrack to find more solutions
      const canContinue = this.backtrackFromCompleteSolution();
      return canContinue;
    }

    // We haven't filled all rows yet, so try to place a queen in the current row
    const canContinue = this.tryPlaceQueenInCurrentRow();
    return canContinue;
  }

  /**
   * Handles when we find a complete solution
   * Saves the solution if it's unique
   */
  private handleFoundSolution(): void {
    // Convert board to a string key for duplicate detection
    const solutionKey = boardToKey(this.board);

    // Check if we've already found this solution
    const isNewSolution = !this.foundSolutions.has(solutionKey);

    if (isNewSolution) {
      // Save this new solution
      this.foundSolutions.add(solutionKey);

      // Create an image of the solution
      const solutionImage = boardToImage(this.board);
      this.capturedImages.push(solutionImage);
    }
  }

  /**
   * Backtracks from a complete solution to find more solutions
   * @returns true if we can continue searching, false if we're done
   */
  private backtrackFromCompleteSolution(): boolean {
    // Move back to the last row
    this.currentRow--;

    // If we've backtracked past the first row, we're completely done
    if (this.currentRow < 0) {
      return false;
    }

    // Get the column where we placed the queen in this row
    const previousColumn = this.board[this.currentRow];

    // Remove the queen from this row
    this.board[this.currentRow] = -1;

    // Try the next column in this row
    const nextColumnToTry = previousColumn + 1;
    const canContinue = this.tryNextColumn(this.currentRow, nextColumnToTry);

    return canContinue;
  }

  /**
   * Tries to place a queen in the current row
   * @returns true if successful or can continue, false if we're done
   */
  private tryPlaceQueenInCurrentRow(): boolean {
    // Determine which column to start checking from
    const hasQueenInCurrentRow = this.board[this.currentRow] !== -1;

    let startColumn: number;
    if (hasQueenInCurrentRow) {
      // If there's already a queen, try the next column
      startColumn = this.board[this.currentRow] + 1;
    } else {
      // If no queen yet, start from the first column
      startColumn = 0;
    }

    const canContinue = this.tryNextColumn(this.currentRow, startColumn);
    return canContinue;
  }

  /**
   * Tries to find a valid column for a queen in the specified row
   *
   * @param row - The row to place a queen in
   * @param startColumn - Which column to start checking from
   * @returns true if we can continue, false if we're done
   */
  private tryNextColumn(row: number, startColumn: number): boolean {
    // Clear any existing queen in this row
    this.board[row] = -1;

    // Try each column starting from startColumn
    for (let column = startColumn; column < BOARD_SIZE; column++) {
      // Check if this position is safe (no conflicts with other queens)
      const isSafePosition = isSafe(this.board, row, column);

      if (isSafePosition) {
        // We found a safe position! Place the queen here
        this.board[row] = column;

        // Move to the next row
        this.currentRow = row + 1;

        return true; // Successfully placed a queen
      }
    }

    // No valid column found in this row - we need to backtrack
    const isFirstRow = row === 0;

    if (isFirstRow) {
      // If we're on the first row and found no valid column,
      // we've exhausted all possibilities
      return false;
    }

    // Backtrack to the previous row
    this.currentRow = row - 1;

    // Get the column where the queen is in the previous row
    const previousRowQueenColumn = this.board[this.currentRow];

    // Try the next column in the previous row
    const nextColumnToTry = previousRowQueenColumn + 1;
    const canContinue = this.tryNextColumn(this.currentRow, nextColumnToTry);

    return canContinue;
  }

  /**
   * Resets the solver to its initial state
   * Clears the board and all found solutions
   */
  reset(): void {
    // Clear the board
    this.board = Array(BOARD_SIZE).fill(-1);

    // Start from the first row
    this.currentRow = 0;

    // Clear all found solutions
    this.foundSolutions.clear();
    this.capturedImages = [];
  }
}
