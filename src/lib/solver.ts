// Backtracking Algorithm

import { BOARD_SIZE, TARGET_SOLUTIONS } from "@/constants";
import type { Board, SolverState } from "@/types";
import { boardToImage, boardToKey, isSafe } from "@/utils";

export class SimpleQueensSolver {
  private board: Board;
  private currentRow: number;
  private foundSolutions: Set<string>; // To avoid duplication
  private capturedImages: string[];
  private maxSolutions: number;

  // History stack for stepping backwards
  private stateHistory: Array<{
    board: Board;
    currentRow: number;
    foundSolutions: Set<string>;
    capturedImages: string[];
  }>;

  constructor(maxSolutions = TARGET_SOLUTIONS) {
    this.board = Array(BOARD_SIZE).fill(-1);
    this.currentRow = 0;
    this.foundSolutions = new Set();
    this.capturedImages = [];
    this.maxSolutions = maxSolutions;
    this.stateHistory = [];
  }

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

  step(): boolean {
    // Save current state to history before making changes
    this.saveStateToHistory();

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

  private saveStateToHistory(): void {
    this.stateHistory.push({
      board: [...this.board],
      currentRow: this.currentRow,
      foundSolutions: new Set(this.foundSolutions),
      capturedImages: [...this.capturedImages],
    });
  }

  stepBack(): boolean {
    // Check if there's any history to go back to
    if (this.stateHistory.length === 0) {
      return false; // No history available
    }

    // Pop the most recent state from history
    const previousState = this.stateHistory.pop();

    if (!previousState) {
      return false;
    }

    // Restore the previous state
    this.board = [...previousState.board];
    this.currentRow = previousState.currentRow;
    this.foundSolutions = new Set(previousState.foundSolutions);
    this.capturedImages = [...previousState.capturedImages];

    return true; // Successfully stepped back
  }

  reset(): void {
    this.board = Array(BOARD_SIZE).fill(-1);
    this.currentRow = 0;
    this.foundSolutions.clear();
    this.capturedImages = [];
    this.stateHistory = [];
  }
}
