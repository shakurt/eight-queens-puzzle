/**
 * Gallery Component
 *
 * Displays a grid of thumbnail images showing all unique solutions found so far.
 *
 * Features:
 * - Shows solution count badge in header
 * - Displays empty state when no solutions found yet
 * - Shows grid of solution images with hover effect
 * - Each solution has a numbered caption
 * - Shows completion message when all target solutions found
 */

/**
 * Props for the Gallery component
 */
interface GalleryProps {
  /**
   * Array of solution images as base64 data URLs.
   * Each string is a complete image that can be used in an <img> src attribute.
   */
  solutions: string[];

  /**
   * Target number of solutions to find.
   * Used to determine completion status and show progress.
   */
  maxSolutions: number;
}

/**
 * Renders a gallery of solution images with progress tracking.
 */
const Gallery: React.FC<GalleryProps> = ({ solutions, maxSolutions }) => {
  /**
   * Determine if we've found all target solutions.
   * Used to show the completion message.
   */
  const hasFoundAllSolutions = solutions.length >= maxSolutions;

  return (
    <div className="rounded-2xl bg-gray-900 p-6">
      {/* ========================================================== */}
      {/* HEADER - Title and solution count badge */}
      {/* ========================================================== */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-100">Solutions</h2>

        {/* Badge showing current count vs target */}
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
          {solutions.length} / {maxSolutions}
        </span>
      </div>

      {/* ========================================================== */}
      {/* CONTENT - Either empty state or solution grid */}
      {/* ========================================================== */}

      {/* Show empty state when no solutions found yet */}
      {solutions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-500">No solutions yet</p>
          <p className="mt-1 text-xs text-gray-600">Press Run or Step Once</p>
        </div>
      ) : (
        /* Show grid of solution images */
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {solutions.map((solutionImageDataURL, solutionIndex) => {
            /**
             * Calculate 1-based solution number for display.
             * Array index is 0-based, but we show "Solution #1" for the first solution.
             */
            const displayNumber = solutionIndex + 1;

            return (
              <figure
                key={solutionIndex}
                className="overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800 transition-transform hover:scale-105"
              >
                {/* Solution image */}
                <img
                  src={solutionImageDataURL}
                  alt={`Solution ${displayNumber}`}
                  className="block h-auto w-full"
                />

                {/* Solution number caption */}
                <figcaption className="bg-gray-900 p-2 text-center">
                  <span className="text-sm font-semibold text-emerald-400">
                    #{displayNumber}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {/* ========================================================== */}
      {/* COMPLETION MESSAGE - Shown when all solutions found */}
      {/* ========================================================== */}
      {hasFoundAllSolutions && (
        <div className="mt-4 rounded-lg bg-emerald-900 p-4 text-emerald-100">
          <p className="font-semibold">Complete!</p>
          <p className="text-sm">
            All {maxSolutions} solutions found. Press Reset to start over.
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
