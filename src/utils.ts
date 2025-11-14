// Simple utilities for the Eight Queens solver

export type Board = number[]; // board[row] = column (or -1 if empty)

export const BOARD_SIZE = 8;
export const TARGET_SOLUTIONS = 12;

/**
 * Check if placing a queen at (row, col) is safe
 */
export function isSafe(board: Board, row: number, col: number): boolean {
  // Check column
  for (let r = 0; r < row; r++) {
    if (board[r] === col) return false;
  }

  // Check diagonals
  for (let r = 0; r < row; r++) {
    const diff = Math.abs(board[r] - col);
    if (diff === row - r) return false;
  }

  return true;
}

/**
 * Convert board to unique string
 */
export function boardToKey(board: Board): string {
  return board.join(",");
}

/**
 * Create canvas image of board
 */
export function boardToImage(board: Board, size = 360): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const cellSize = size / BOARD_SIZE;

  // Draw squares
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const isDark = (row + col) % 2 === 1;
      ctx.fillStyle = isDark ? "#000000" : "#ffffff";
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }

  // Draw queens
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = Math.max(2, cellSize * 0.08);

  for (let row = 0; row < BOARD_SIZE; row++) {
    const col = board[row];
    if (col === -1) continue;

    const x = col * cellSize;
    const y = row * cellSize;
    const pad = cellSize * 0.15;

    // Simple crown shape
    ctx.beginPath();
    ctx.moveTo(x + pad, y + cellSize - pad);
    ctx.lineTo(x + pad, y + pad);
    ctx.lineTo(x + cellSize * 0.4, y + cellSize * 0.4);
    ctx.lineTo(x + cellSize * 0.5, y + pad);
    ctx.lineTo(x + cellSize * 0.6, y + cellSize * 0.4);
    ctx.lineTo(x + cellSize - pad, y + pad);
    ctx.lineTo(x + cellSize - pad, y + cellSize - pad);
    ctx.closePath();
    ctx.stroke();
  }

  return canvas.toDataURL("image/png");
}
