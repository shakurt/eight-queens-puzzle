interface ControlsProps {
  isRunning: boolean;
  isComplete: boolean;
  speed: number;
  solutionCount: number;
  maxSolutions: number;
  onRun: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

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
  return (
    <div className="space-y-4">
      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRun}
          disabled={isComplete}
          className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
        >
          {isRunning ? "Pause" : "Run"}
        </button>

        <button
          onClick={onStep}
          disabled={isComplete || isRunning}
          className="rounded-lg bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700 disabled:opacity-40"
        >
          Step Once
        </button>

        <button
          onClick={onReset}
          className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
        >
          Reset
        </button>
      </div>

      {/* Speed slider */}
      <div>
        <label className="text-sm font-medium text-gray-300">
          Speed: {speed}ms per step
        </label>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="mt-2 w-full accent-emerald-600"
        />
      </div>

      {/* Progress */}
      <div className="rounded-lg bg-gray-800 p-3">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-300">Solutions Found</span>
          <span className="font-semibold text-emerald-400">
            {solutionCount} / {maxSolutions}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${(solutionCount / maxSolutions) * 100}%` }}
          />
        </div>
      </div>

      {/* Info */}
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
