import { BlackQueenIcon, WhiteQueenIcon } from "@/components/icons/QueenIcon";
import { BOARD_SIZE } from "@/utils";
import type { Board } from "@/utils";

interface ChessboardProps {
  board: Board;
}

const Chessboard: React.FC<ChessboardProps> = ({ board }) => {
  return (
    <section className="w-full max-w-[480px]">
      <div className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-gray-800">
        {Array.from({ length: BOARD_SIZE }).map((_, row) =>
          Array.from({ length: BOARD_SIZE }).map((__, col) => {
            const isDark = (row + col) % 2 === 1;
            const hasQueen = board[row] === col;

            return (
              <div
                key={`${row}-${col}`}
                className={`flex aspect-square items-center justify-center ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {hasQueen && (
                  <div className="h-3/4 w-3/4">
                    {isDark ? <WhiteQueenIcon /> : <BlackQueenIcon />}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <p className="mt-3 text-sm text-gray-400">
        Queens placed: {board.filter((c) => c !== -1).length} / {BOARD_SIZE}
      </p>
    </section>
  );
};

export default Chessboard;
