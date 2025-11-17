import { BlackQueenIcon, WhiteQueenIcon } from "@/components/icons/QueenIcon";
import { BOARD_SIZE } from "@/constants";
import type { Board } from "@/types";

interface ChessboardProps {
  // Array of 8 numbers where board[row]=column of queen in that row and
  // -1 means no queen placed in that row.
  board: Board; // Example: [0, 4, -1, 2, -1, -1, 7, 5]
}

const Chessboard: React.FC<ChessboardProps> = ({ board }) => {
  const numberOfQueensPlaced = board.filter(
    (columnValue) => columnValue !== -1
  ).length;

  return (
    <section className="w-full max-w-[480px]">
      <div className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-gray-800">
        {Array.from({ length: BOARD_SIZE }).map((_, rowIndex) =>
          Array.from({ length: BOARD_SIZE }).map((__, columnIndex) => {
            const isSquareDark = (rowIndex + columnIndex) % 2 === 1; // Else the square would be light

            const hasQueenOnThisSquare = board[rowIndex] === columnIndex;

            return (
              <div
                key={`square-row${rowIndex}-col${columnIndex}`}
                className={`flex aspect-square items-center justify-center ${
                  isSquareDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Render Queen Icon With Condition */}
                {hasQueenOnThisSquare && (
                  <div className="h-3/4 w-3/4">
                    {isSquareDark ? <WhiteQueenIcon /> : <BlackQueenIcon />}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Queen Count */}
      <p className="mt-3 text-sm text-gray-400">
        Queens placed: {numberOfQueensPlaced} / {BOARD_SIZE}
      </p>
    </section>
  );
};

export default Chessboard;
