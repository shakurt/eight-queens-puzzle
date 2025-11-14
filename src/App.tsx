// Eight Queens Puzzle Visualizer - Simple & Clean

import { useEffect, useRef, useState } from "react";

import { Chessboard } from "./Chessboard";
import { Controls } from "./Controls";
import { Gallery } from "./Gallery";
import { SimpleQueensSolver } from "./solver";
import { TARGET_SOLUTIONS } from "./utils";

export default function App() {
  // Solver instance
  const solverRef = useRef<SimpleQueensSolver | null>(null);
  const intervalRef = useRef<number | null>(null);

  // UI state
  const [board, setBoard] = useState<number[]>(Array(8).fill(-1));
  const [solutions, setSolutions] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(400);

  // Initialize solver
  useEffect(() => {
    solverRef.current = new SimpleQueensSolver(TARGET_SOLUTIONS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update UI from solver state
  const updateUI = () => {
    if (!solverRef.current) return;
    const state = solverRef.current.getState();
    setBoard(state.board);
    setSolutions(state.solutions);
  };

  // Step function
  const step = () => {
    if (!solverRef.current) return;

    const canContinue = solverRef.current.step();
    updateUI();

    if (!canContinue) {
      stopRunning();
    }
  };

  // Start/stop running
  const stopRunning = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleRun = () => {
    if (isRunning) {
      stopRunning();
    } else {
      setIsRunning(true);
      intervalRef.current = window.setInterval(step, speed);
    }
  };

  // Handle speed change
  useEffect(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = window.setInterval(step, speed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // Reset
  const handleReset = () => {
    stopRunning();
    if (solverRef.current) {
      solverRef.current.reset();
      updateUI();
    }
  };

  const isComplete = solutions.length >= TARGET_SOLUTIONS;

  return (
    <div className="min-h-screen bg-[#05060a] p-4 text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Eight Queens Puzzle</h1>
          <p className="mt-2 text-sm text-gray-400">
            Simple backtracking algorithm visualization
          </p>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Board and controls */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-gray-900 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Board */}
                <div className="flex justify-center">
                  <Chessboard board={board} />
                </div>

                {/* Controls */}
                <div>
                  <Controls
                    isRunning={isRunning}
                    isComplete={isComplete}
                    speed={speed}
                    solutionCount={solutions.length}
                    maxSolutions={TARGET_SOLUTIONS}
                    onRun={handleRun}
                    onStep={step}
                    onReset={handleReset}
                    onSpeedChange={setSpeed}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="lg:col-span-1">
            <Gallery solutions={solutions} maxSolutions={TARGET_SOLUTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
}
