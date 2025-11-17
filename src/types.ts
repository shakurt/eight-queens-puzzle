export type Board = number[];

export interface SolverState {
  board: Board; // Current board configuration
  currentRow: number; // Which row we're currently trying to fill
  solutions: string[]; // Array of solution images we've captured
  isComplete: boolean; // Whether we've found all solutions
}
