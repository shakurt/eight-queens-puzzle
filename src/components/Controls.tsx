interface ControlsProps {
  isRunning: boolean;
  isComplete: boolean;
  speed: number;
  solutionCount: number;
  maxSolutions: number;

  onRun: () => void;
  onStep: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (newSpeed: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isComplete,
  speed,
  solutionCount,
  maxSolutions,
  onRun,
  onStep,
  onStepBack,
  onReset,
  onSpeedChange,
}) => {
  const progressPercentage = (solutionCount / maxSolutions) * 100; // Calculate progress as a percentage

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="Buttons Container">
        <button
          type="button"
          onClick={onRun}
          disabled={isComplete}
          className="cursor-pointer rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white transition-colors duration-200 hover:bg-emerald-700 disabled:opacity-40"
        >
          {isRunning ? "Pause" : "Run"}
        </button>

        <button
          onClick={onStep}
          type="button"
          disabled={isComplete || isRunning}
          className="cursor-pointer rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white transition-colors duration-200 hover:bg-sky-700 disabled:opacity-40"
        >
          Step Next
        </button>

        <button
          onClick={onStepBack}
          disabled={isRunning}
          className="cursor-pointer rounded-lg bg-purple-600 px-5 py-2 font-semibold text-white transition-colors duration-200 hover:bg-purple-700 disabled:opacity-40"
          type="button"
        >
          Step Back
        </button>

        <button
          onClick={onReset}
          className="cursor-pointer rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-700"
          type="button"
        >
          Reset
        </button>
      </div>

      <div aria-label="Speed Control Container">
        <label htmlFor="speed" className="text-sm font-medium text-gray-300">
          Speed: {speed}ms per step
        </label>
        <input
          type="range"
          name="speed"
          id="speed"
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

      <div
        className="rounded-lg bg-gray-800 p-3"
        aria-label="Solutions Found Counter Container"
      >
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-300">Solutions Found</span>
          <span className="font-semibold text-emerald-400">
            {solutionCount} / {maxSolutions}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div
        className="rounded-lg bg-gray-800 p-3 text-xs text-gray-400"
        aria-label="Algorithm Description Container"
      >
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
