/**
 * Chessboard Component
 *
 * Displays an 8x8 chessboard with queens placed according to the current board state.
 *
 * Visual representation:
 * - Light squares are white
 * - Dark squares are gray
 * - Queens on light squares are black (for contrast)
 * - Queens on dark squares are white (for contrast)
 *
 * Board state representation:
 * - The board prop is an array of 8 numbers
 * - Index represents the row (0-7 from top to bottom)
 * - Value represents the column (0-7 from left to right)
 * - Value of -1 means no queen in that row yet
 */

import { BlackQueenIcon, WhiteQueenIcon } from "@/components/icons/QueenIcon";
import { BOARD_SIZE } from "@/utils";
import type { Board } from "@/utils";

/**
 * Props for the Chessboard component
 */
interface ChessboardProps {
  /**
   * Current board configuration.
   * Array of 8 numbers where board[row] = column of queen in that row.
   * -1 means no queen placed in that row.
   */
  board: Board;
}

/**
 * Renders an 8x8 chessboard with queens placed according to the board state.
 */
const Chessboard: React.FC<ChessboardProps> = ({ board }) => {
  /**
   * Count how many queens are currently placed on the board.
   * Queens are placed when the column value is not -1.
   */
  const numberOfQueensPlaced = board.filter(
    (columnValue) => columnValue !== -1
  ).length;

  return (
    <section className="w-full max-w-[480px]">
      {/* ========================================================== */}
      {/* CHESSBOARD GRID - 8x8 grid of squares */}
      {/* ========================================================== */}
      <div className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-gray-800">
        {/* 
          Create 8 rows, each with 8 squares.
          We use nested Array.from to create a 2D grid.
          Outer loop = rows (0 to 7, top to bottom)
          Inner loop = columns (0 to 7, left to right)
        */}
        {Array.from({ length: BOARD_SIZE }).map((_, rowIndex) =>
          Array.from({ length: BOARD_SIZE }).map((__, columnIndex) => {
            // ================================================
            // Calculate square properties
            // ================================================

            /**
             * Determine if this square should be dark or light.
             * Chessboard pattern: alternating colors.
             * If (row + column) is odd, the square is dark.
             * If (row + column) is even, the square is light.
             */
            const isSquareDark = (rowIndex + columnIndex) % 2 === 1;

            /**
             * Check if a queen should be displayed on this square.
             * A queen is on this square if board[rowIndex] equals columnIndex.
             * Example: if board[3] = 5, there's a queen at row 3, column 5.
             */
            const hasQueenOnThisSquare = board[rowIndex] === columnIndex;

            // ================================================
            // Render the square
            // ================================================

            return (
              <div
                key={`square-row${rowIndex}-col${columnIndex}`}
                className={`flex aspect-square items-center justify-center ${
                  isSquareDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Only render a queen icon if there's a queen on this square */}
                {hasQueenOnThisSquare && (
                  <div className="h-3/4 w-3/4">
                    {/* 
                      Use contrasting colors for visibility:
                      - White queen on dark squares
                      - Black queen on light squares
                    */}
                    {isSquareDark ? <WhiteQueenIcon /> : <BlackQueenIcon />}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================== */}
      {/* QUEEN COUNT - Shows progress of current solution attempt */}
      {/* ========================================================== */}
      <p className="mt-3 text-sm text-gray-400">
        Queens placed: {numberOfQueensPlaced} / {BOARD_SIZE}
      </p>
    </section>
  );
};

export default Chessboard;
