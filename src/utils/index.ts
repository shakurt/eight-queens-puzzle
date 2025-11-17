import { BOARD_SIZE } from "@/constants";
import type { Board } from "@/types";

//  Checks if it's safe to place a queen at the specified position
// A queen can attack any piece in the same column, row, or diagonal
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

  return true; // Safe Position
}

// This is used to detect duplicate solutions
export function boardToKey(board: Board): string {
  return board.join(",");
}

export function boardToImage(board: Board, imageSize = 360): string {
  const canvas = document.createElement("canvas");
  canvas.width = imageSize;
  canvas.height = imageSize;

  const context = canvas.getContext("2d");
  if (!context) {
    return "";
  }

  // Calculate the size of each square on the board
  const squareSize = imageSize / BOARD_SIZE;

  // Draw the chessboard squares (alternating black and white)
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let column = 0; column < BOARD_SIZE; column++) {
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

    context.beginPath();
    context.moveTo(queenX + padding, queenY + squareSize - padding);
    context.lineTo(queenX + padding, queenY + padding);
    context.lineTo(queenX + squareSize * 0.4, queenY + squareSize * 0.4);
    context.lineTo(queenX + squareSize * 0.5, queenY + padding);
    context.lineTo(queenX + squareSize * 0.6, queenY + squareSize * 0.4);
    context.lineTo(queenX + squareSize - padding, queenY + padding);
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
