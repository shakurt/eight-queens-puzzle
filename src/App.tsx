/**
 * Eight Queens Puzzle Visualizer - Main Application Component
 *
 * This is the root component that manages the entire application state.
 * It coordinates the solver algorithm, animation loop, and UI updates.
 *
 * Key responsibilities:
 * - Managing the solver instance (create, reset, step through algorithm)
 * - Controlling the animation loop (start, pause, adjust speed)
 * - Synchronizing solver state with React UI state
 * - Coordinating child components (Chessboard, Controls, Gallery)
 */

import { useEffect, useRef, useState } from "react";

import Chessboard from "@/components/Chessboard";
import Controls from "@/components/Controls";
import Gallery from "@/components/Gallery";
import { TARGET_SOLUTIONS } from "@/utils";

import { SimpleQueensSolver } from "./solver";

export default function App() {
  // ===================================================================
  // REFS - Persistent references that don't trigger re-renders
  // ===================================================================

  /**
   * Reference to the solver instance.
   * Using useRef keeps the same solver instance across re-renders.
   * The solver maintains the algorithm state (current board, found solutions, etc.)
   */
  const solverInstanceReference = useRef<SimpleQueensSolver | null>(null);

  /**
   * Reference to the interval timer for animation.
   * Stores the ID returned by setInterval so we can cancel it later.
   * Using useRef prevents the interval from being recreated on every render.
   */
  const animationIntervalReference = useRef<number | null>(null);

  // ===================================================================
  // STATE - Values that trigger re-renders when changed
  // ===================================================================

  /**
   * The current board configuration.
   * Array of 8 numbers where index = row and value = column of queen.
   * Value of -1 means no queen placed in that row yet.
   * Example: [0, 4, 7, 5, 2, 6, 1, 3] represents a complete solution.
   */
  const [currentBoardState, setCurrentBoardState] = useState<number[]>(
    Array(8).fill(-1)
  );

  /**
   * Array of found solution images (base64 data URLs).
   * Each string is a complete image that can be displayed in an <img> tag.
   */
  const [foundSolutionImages, setFoundSolutionImages] = useState<string[]>([]);

  /**
   * Whether the animation is currently running.
   * True = solver is stepping automatically via interval timer.
   * False = solver is paused, only manual steps allowed.
   */
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);

  /**
   * Animation speed in milliseconds between steps.
   * Lower value = faster animation (more steps per second).
   * Higher value = slower animation (easier to follow visually).
   */
  const [animationSpeedInMilliseconds, setAnimationSpeedInMilliseconds] =
    useState(400);

  // ===================================================================
  // INITIALIZATION - One-time setup when component mounts
  // ===================================================================

  /**
   * Initialize the solver when the component first mounts.
   * Also sets up cleanup to stop animation when component unmounts.
   */
  useEffect(() => {
    // Create a new solver instance with the target number of solutions
    solverInstanceReference.current = new SimpleQueensSolver(TARGET_SOLUTIONS);

    // Cleanup function: runs when component is about to unmount
    return () => {
      // If animation is running, stop it to prevent memory leaks
      if (animationIntervalReference.current !== null) {
        clearInterval(animationIntervalReference.current);
      }
    };
  }, []); // Empty dependency array = run only once on mount

  // ===================================================================
  // UI SYNCHRONIZATION - Update React state from solver state
  // ===================================================================

  /**
   * Updates the UI state (board and solutions) from the solver's internal state.
   * This bridges the gap between the solver algorithm and React's rendering system.
   */
  const synchronizeUIWithSolver = () => {
    // Safety check: ensure solver exists before accessing it
    if (solverInstanceReference.current === null) {
      return;
    }

    // Get the current state from the solver
    const currentSolverState = solverInstanceReference.current.getState();

    // Update React state to match solver state
    // This will trigger a re-render with the new board and solutions
    setCurrentBoardState(currentSolverState.board);
    setFoundSolutionImages(currentSolverState.solutions);
  };

  // ===================================================================
  // ALGORITHM STEPPING - Advance the solver by one step
  // ===================================================================

  /**
   * Executes one step of the backtracking algorithm and updates the UI.
   * If the algorithm is complete (found all solutions or exhausted search),
   * this will automatically stop the animation.
   */
  const executeOneAlgorithmStep = () => {
    // Safety check: ensure solver exists
    if (solverInstanceReference.current === null) {
      return;
    }

    // Ask the solver to perform one step of the algorithm
    // Returns true if more steps are possible, false if done
    const canContinueStepping = solverInstanceReference.current.step();

    // Update the UI to reflect the new state after this step
    synchronizeUIWithSolver();

    // If the algorithm is complete, stop the animation automatically
    if (canContinueStepping === false) {
      stopAnimationLoop();
    }
  };

  // ===================================================================
  // ANIMATION CONTROL - Start and stop the animation loop
  // ===================================================================

  /**
   * Stops the animation loop and updates the UI state.
   * This clears the interval timer and sets isAnimationRunning to false.
   */
  const stopAnimationLoop = () => {
    // Update state to reflect that animation is no longer running
    setIsAnimationRunning(false);

    // If there's an active interval timer, clear it
    if (animationIntervalReference.current !== null) {
      clearInterval(animationIntervalReference.current);
      animationIntervalReference.current = null;
    }
  };

  /**
   * Toggles between running and paused states.
   * If currently running: stops the animation.
   * If currently paused: starts the animation at current speed.
   */
  const handleRunPauseButtonClick = () => {
    if (isAnimationRunning) {
      // Currently running, so stop it
      stopAnimationLoop();
    } else {
      // Currently paused, so start it
      setIsAnimationRunning(true);

      // Set up interval timer to call executeOneAlgorithmStep repeatedly
      animationIntervalReference.current = window.setInterval(
        executeOneAlgorithmStep,
        animationSpeedInMilliseconds
      );
    }
  };

  // ===================================================================
  // SPEED ADJUSTMENT - React to speed changes while running
  // ===================================================================

  /**
   * When speed changes while animation is running, restart the interval
   * with the new speed. This ensures speed changes take effect immediately.
   */
  useEffect(() => {
    // Only need to restart if animation is currently running
    if (isAnimationRunning && animationIntervalReference.current !== null) {
      // Clear the old interval (with old speed)
      clearInterval(animationIntervalReference.current);

      // Start a new interval with the new speed
      animationIntervalReference.current = window.setInterval(
        executeOneAlgorithmStep,
        animationSpeedInMilliseconds
      );
    }
    // Note: We intentionally omit executeOneAlgorithmStep from dependencies
    // because we want to use the current version, not recreate interval
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationSpeedInMilliseconds]); // Run when speed changes

  // ===================================================================
  // RESET FUNCTIONALITY - Start over from the beginning
  // ===================================================================

  /**
   * Resets the entire solver to its initial state.
   * Stops animation, clears the board, and clears found solutions.
   */
  const handleResetButtonClick = () => {
    // First, stop any running animation
    stopAnimationLoop();

    // If solver exists, reset it to initial state
    if (solverInstanceReference.current !== null) {
      solverInstanceReference.current.reset();

      // Update UI to show the reset state (empty board, no solutions)
      synchronizeUIWithSolver();
    }
  };

  // ===================================================================
  // COMPLETION CHECK - Determine if we've found all target solutions
  // ===================================================================

  /**
   * Check if we've found all the solutions we're looking for.
   * Used to disable controls and show completion message.
   */
  const hasFoundAllTargetSolutions =
    foundSolutionImages.length >= TARGET_SOLUTIONS;

  // ===================================================================
  // RENDER - JSX structure of the application UI
  // ===================================================================

  return (
    <div className="min-h-screen bg-[#05060a] p-4 text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* ============================================================= */}
        {/* HEADER - Title and description */}
        {/* ============================================================= */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Eight Queens Puzzle</h1>
          <p className="mt-2 text-sm text-gray-400">
            Simple backtracking algorithm visualization
          </p>
        </header>

        {/* ============================================================= */}
        {/* MAIN CONTENT - Board, controls, and solutions gallery */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left side: Board and controls (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-gray-900 p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Chessboard visualization */}
                <div className="flex justify-center">
                  <Chessboard board={currentBoardState} />
                </div>

                {/* Control panel with buttons and speed slider */}
                <div>
                  <Controls
                    isRunning={isAnimationRunning}
                    isComplete={hasFoundAllTargetSolutions}
                    speed={animationSpeedInMilliseconds}
                    solutionCount={foundSolutionImages.length}
                    maxSolutions={TARGET_SOLUTIONS}
                    onRun={handleRunPauseButtonClick}
                    onStep={executeOneAlgorithmStep}
                    onReset={handleResetButtonClick}
                    onSpeedChange={setAnimationSpeedInMilliseconds}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Solutions gallery (1/3 width on large screens) */}
          <div className="lg:col-span-1">
            <Gallery
              solutions={foundSolutionImages}
              maxSolutions={TARGET_SOLUTIONS}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
