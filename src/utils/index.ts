// Utilities for the Eight Queens puzzle solver
// This file contains helper functions for board validation and image generation

// A Board is an array where each index represents a row
// and the value at that index represents the column where a queen is placed
// A value of -1 means no queen has been placed in that row yet
export type Board = number[];

// Constants for the puzzle
export const BOARD_SIZE = 8;
export const TARGET_SOLUTIONS = 12;

/**
 * Checks if it's safe to place a queen at the specified position
 * A queen can attack any piece in the same column, row, or diagonal
 *
 * @param board - The current board state
 * @param targetRow - The row where we want to place a queen
 * @param targetColumn - The column where we want to place a queen
 * @returns true if the position is safe, false otherwise
 */
export function isSafe(
  board: Board,
  targetRow: number,
  targetColumn: number
): boolean {
  // Check all rows above the target row (rows below haven't been filled yet)
  for (let checkRow = 0; checkRow < targetRow; checkRow++) {
    const queenColumn = board[checkRow];

    // Check if there's a queen in the same column
    const isSameColumn = queenColumn === targetColumn;
    if (isSameColumn) {
      return false;
    }

    // Check if there's a queen on the same diagonal
    // Two pieces are on the same diagonal if the absolute difference
    // between their columns equals the absolute difference between their rows
    const columnDistance = Math.abs(queenColumn - targetColumn);
    const rowDistance = Math.abs(checkRow - targetRow);
    const isOnDiagonal = columnDistance === rowDistance;

    if (isOnDiagonal) {
      return false;
    }
  }

  // No conflicts found - this position is safe
  return true;
}

/**
 * Converts a board configuration to a unique string key.
 * This is used to detect duplicate solutions
 *
 * @param board - The board to convert
 * @returns A string representation of the board
 */
export function boardToKey(board: Board): string {
  return board.join(",");
}

/**
 * Creates an image of the current board state
 * This generates a PNG image showing the chessboard with queens placed
 *
 * @param board - The board state to render
 * @param imageSize - The size of the square image in pixels (default 360)
 * @returns A data URL containing the PNG image
 */
export function boardToImage(board: Board, imageSize = 360): string {
  // Create a canvas element for drawing
  const canvas = document.createElement("canvas");
  canvas.width = imageSize;
  canvas.height = imageSize;

  const context = canvas.getContext("2d");
  if (!context) {
    return ""; // Return empty string if canvas context is not available
  }

  // Calculate the size of each square on the board
  const squareSize = imageSize / BOARD_SIZE;

  // Draw the chessboard squares (alternating black and white)
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let column = 0; column < BOARD_SIZE; column++) {
      // A square is dark if row + column is odd
      const isDarkSquare = (row + column) % 2 === 1;
      context.fillStyle = isDarkSquare ? "#000000" : "#ffffff";

      // Draw the square
      const xPosition = column * squareSize;
      const yPosition = row * squareSize;
      context.fillRect(xPosition, yPosition, squareSize, squareSize);
    }
  }

  // Draw queens on the board
  context.strokeStyle = "#ef4444"; // Red color for queens
  const queenLineWidth = Math.max(2, squareSize * 0.08);
  context.lineWidth = queenLineWidth;

  for (let row = 0; row < BOARD_SIZE; row++) {
    const column = board[row];

    // Skip this row if no queen has been placed yet
    if (column === -1) {
      continue;
    }

    // Calculate queen position
    const queenX = column * squareSize;
    const queenY = row * squareSize;
    const padding = squareSize * 0.15;

    // Draw a simple crown shape to represent the queen
    context.beginPath();

    // Bottom left of crown
    context.moveTo(queenX + padding, queenY + squareSize - padding);

    // Left edge going up
    context.lineTo(queenX + padding, queenY + padding);

    // First peak
    context.lineTo(queenX + squareSize * 0.4, queenY + squareSize * 0.4);

    // Middle peak
    context.lineTo(queenX + squareSize * 0.5, queenY + padding);

    // Second peak
    context.lineTo(queenX + squareSize * 0.6, queenY + squareSize * 0.4);

    // Right edge going up
    context.lineTo(queenX + squareSize - padding, queenY + padding);

    // Right edge going down
    context.lineTo(
      queenX + squareSize - padding,
      queenY + squareSize - padding
    );

    context.closePath();
    context.stroke();
  }

  // Convert the canvas to a PNG image data URL
  return canvas.toDataURL("image/png");
}
