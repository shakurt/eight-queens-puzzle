import { useEffect, useRef, useState } from "react";

import Card from "@/components/Card";
import Chessboard from "@/components/Chessboard";
import Controls from "@/components/Controls";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Header from "@/components/Header";
import { TARGET_SOLUTIONS } from "@/constants";
import { SimpleQueensSolver } from "@/lib/solver";
import type { Board } from "@/types";

export default function App() {
  const solverInstanceReference = useRef<SimpleQueensSolver | null>(null);
  const animationIntervalReference = useRef<number | null>(null);

  const [currentBoardState, setCurrentBoardState] = useState<Board>(
    Array(8).fill(-1)
  ); // -1 means no queen placed in that row yet
  const [foundSolutionImages, setFoundSolutionImages] = useState<string[]>([]); //(base64 data URLs)

  // True = solver is stepping automatically via interval timer.
  // False = solver is paused, only manual steps allowed.
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [animationSpeedInMilliseconds, setAnimationSpeedInMilliseconds] =
    useState(400);

  useEffect(() => {
    solverInstanceReference.current = new SimpleQueensSolver(TARGET_SOLUTIONS);

    // Cleanup function
    return () => {
      // Prevent Memory Leaks
      if (animationIntervalReference.current !== null) {
        clearInterval(animationIntervalReference.current);
      }
    };
  }, []);

  // This bridges the gap between the solver algorithm and React's rendering system.
  const synchronizeUIWithSolver = () => {
    if (solverInstanceReference.current === null) {
      return;
    }
    const currentSolverState = solverInstanceReference.current.getState();
    setCurrentBoardState(currentSolverState.board);
    setFoundSolutionImages(currentSolverState.solutions);
  };

  const executeOneAlgorithmStep = () => {
    if (solverInstanceReference.current === null) {
      return;
    }

    const canContinueStepping = solverInstanceReference.current.step();
    synchronizeUIWithSolver();

    // If the algorithm is complete, stop the animation automatically
    if (canContinueStepping === false) {
      stopAnimationLoop();
    }
  };

  const executeOneStepBack = () => {
    if (solverInstanceReference.current === null) {
      return;
    }

    // Returns true if step back was successful, false if no history available
    const wasSuccessful = solverInstanceReference.current.stepBack();

    // Only update UI if step back was successful
    if (wasSuccessful) {
      synchronizeUIWithSolver();
    }
  };

  const stopAnimationLoop = () => {
    // Update state to reflect that animation is no longer running
    setIsAnimationRunning(false);

    // If there's an active interval timer, clear it
    if (animationIntervalReference.current !== null) {
      clearInterval(animationIntervalReference.current);
      animationIntervalReference.current = null;
    }
  };

  // Toggles between running and paused states
  const handleRunPauseButtonClick = () => {
    if (isAnimationRunning) {
      stopAnimationLoop();
    } else {
      setIsAnimationRunning(true);
      // Set up interval timer to call executeOneAlgorithmStep repeatedly
      animationIntervalReference.current = window.setInterval(
        executeOneAlgorithmStep,
        animationSpeedInMilliseconds
      );
    }
  };

  useEffect(() => {
    if (isAnimationRunning && animationIntervalReference.current !== null) {
      // Clear the old interval (with old speed)
      clearInterval(animationIntervalReference.current);

      // Start a new interval with the new speed
      animationIntervalReference.current = window.setInterval(
        executeOneAlgorithmStep,
        animationSpeedInMilliseconds
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationSpeedInMilliseconds]); // Run when speed changes

  const handleResetButtonClick = () => {
    stopAnimationLoop();

    if (solverInstanceReference.current !== null) {
      solverInstanceReference.current.reset();

      synchronizeUIWithSolver();
    }
  };

  const hasFoundAllTargetSolutions =
    foundSolutionImages.length >= TARGET_SOLUTIONS;

  return (
    <div className="bg-bg flex min-h-screen flex-col text-gray-100">
      <Header />
      <div className="container mx-auto max-w-7xl flex-1">
        <main className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section
            className="lg:col-span-2"
            aria-label="Left side that contains Board and Controls"
          >
            <Card>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex justify-center">
                  {/* Chessboard visualization */}
                  <Chessboard board={currentBoardState} />
                </div>

                <Controls
                  isRunning={isAnimationRunning}
                  isComplete={hasFoundAllTargetSolutions}
                  speed={animationSpeedInMilliseconds}
                  solutionCount={foundSolutionImages.length}
                  maxSolutions={TARGET_SOLUTIONS}
                  onRun={handleRunPauseButtonClick}
                  onStep={executeOneAlgorithmStep}
                  onStepBack={executeOneStepBack}
                  onReset={handleResetButtonClick}
                  onSpeedChange={setAnimationSpeedInMilliseconds}
                />
              </div>
            </Card>
          </section>

          <section
            className="lg:col-span-1"
            aria-label="Right side that contains Solutions Gallery"
          >
            <Gallery
              solutions={foundSolutionImages}
              maxSolutions={TARGET_SOLUTIONS}
            />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
