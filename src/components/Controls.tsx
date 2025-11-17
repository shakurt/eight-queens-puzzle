/**
 * Controls Component
 *
 * Provides user interface controls for the Eight Queens solver:
 * - Run/Pause button: Start or stop automatic stepping
 * - Step Once button: Manually advance one step at a time
 * - Reset button: Start over from the beginning
 * - Speed slider: Adjust animation speed (milliseconds per step)
 * - Progress bar: Visual indicator of how many solutions found
 * - Info panel: Brief explanation of how the algorithm works
 */

/**
 * Props for the Controls component
 */
interface ControlsProps {
  /** Whether the solver is currently running automatically */
  isRunning: boolean;

  /** Whether all target solutions have been found */
  isComplete: boolean;

  /** Current animation speed in milliseconds per step */
  speed: number;

  /** Number of unique solutions found so far */
  solutionCount: number;

  /** Target number of solutions to find */
  maxSolutions: number;

  /** Callback when Run/Pause button is clicked */
  onRun: () => void;

  /** Callback when Step Once button is clicked */
  onStep: () => void;

  /** Callback when Reset button is clicked */
  onReset: () => void;

  /** Callback when speed slider value changes */
  onSpeedChange: (newSpeed: number) => void;
}

/**
 * Renders the control panel for the Eight Queens solver.
 */
const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isComplete,
  speed,
  solutionCount,
  maxSolutions,
  onRun,
  onStep,
  onReset,
  onSpeedChange,
}) => {
  /**
   * Calculate progress percentage for the progress bar.
   * This shows visually how close we are to finding all target solutions.
   */
  const progressPercentage = (solutionCount / maxSolutions) * 100;

  return (
    <div className="space-y-4">
      {/* ========================================================== */}
      {/* ACTION BUTTONS - Run/Pause, Step Once, Reset */}
      {/* ========================================================== */}
      <div className="flex flex-wrap gap-2">
        {/* 
          RUN/PAUSE BUTTON
          - Shows "Run" when paused, "Pause" when running
          - Disabled when all solutions found
          - Green color indicates primary action
        */}
        <button
          onClick={onRun}
          disabled={isComplete}
          className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
        >
          {isRunning ? "Pause" : "Run"}
        </button>

        {/* 
          STEP ONCE BUTTON
          - Advances algorithm by exactly one step
          - Disabled when running (to prevent conflicts) or when complete
          - Blue color indicates secondary action
        */}
        <button
          onClick={onStep}
          disabled={isComplete || isRunning}
          className="rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700 disabled:opacity-40"
        >
          Step Once
        </button>

        {/* 
          RESET BUTTON
          - Clears board and solutions, starts over from beginning
          - Always enabled (can reset at any time)
          - Red color indicates destructive action
        */}
        <button
          onClick={onReset}
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
        >
          Reset
        </button>
      </div>

      {/* ========================================================== */}
      {/* SPEED CONTROL - Slider to adjust animation speed */}
      {/* ========================================================== */}
      <div>
        <label className="text-sm font-medium text-gray-300">
          Speed: {speed}ms per step
        </label>
        {/* 
          Range slider for animation speed
          - Min: 50ms (fastest, 20 steps per second)
          - Max: 1000ms (slowest, 1 step per second)
          - Step: 50ms increments
          Lower values = faster animation
        */}
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={speed}
          onChange={(changeEvent) => {
            const newSpeedValue = Number(changeEvent.target.value);
            onSpeedChange(newSpeedValue);
          }}
          className="mt-2 w-full accent-emerald-600"
        />
      </div>

      {/* ========================================================== */}
      {/* PROGRESS INDICATOR - Shows how many solutions found */}
      {/* ========================================================== */}
      <div className="rounded-lg bg-gray-800 p-3">
        {/* Text display: "X / Y" format */}
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-300">Solutions Found</span>
          <span className="font-semibold text-emerald-400">
            {solutionCount} / {maxSolutions}
          </span>
        </div>

        {/* Visual progress bar */}
        <div className="h-2 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* INFORMATION PANEL - Explains how the algorithm works */}
      {/* ========================================================== */}
      <div className="rounded-lg bg-gray-800 p-3 text-xs text-gray-400">
        <p className="mb-2 font-semibold text-gray-300">How it works:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Places queens row by row (top to bottom)</li>
          <li>Tries columns left to right</li>
          <li>Backtracks when stuck</li>
          <li>Finds all unique solutions</li>
        </ul>
      </div>
    </div>
  );
};

export default Controls;
