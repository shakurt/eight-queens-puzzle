import Card from "./Card";

interface GalleryProps {
  solutions: string[]; // Array of solution images as base64 data URLs
  maxSolutions: number;
}

const Gallery: React.FC<GalleryProps> = ({ solutions, maxSolutions }) => {
  const hasFoundAllSolutions = solutions.length >= maxSolutions;

  return (
    <Card>
      <div
        aria-label="gallery card header"
        className="mb-4 flex items-center justify-between"
      >
        <h2 className="text-xl font-bold text-gray-100">Solutions</h2>

        <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
          {solutions.length} / {maxSolutions}
        </span>
      </div>

      {/* No Solutions Yet */}
      {solutions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-500">No solutions yet</p>
          <p className="mt-1 text-xs text-gray-600">Press Run or Step Next</p>
        </div>
      ) : (
        /* With Solutions */
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {solutions.map((solutionImageDataURL, solutionIndex) => (
            <figure
              key={solutionIndex}
              className="overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800 transition-transform hover:scale-105"
            >
              <img
                src={solutionImageDataURL}
                alt={`Solution ${solutionIndex + 1}`}
                className="block h-auto w-full"
              />

              <figcaption className="bg-card p-2 text-center">
                <span className="text-sm font-semibold text-emerald-400">
                  #{solutionIndex + 1}
                </span>
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      {/* Completion Message */}
      {hasFoundAllSolutions && (
        <div className="mt-4 rounded-lg bg-emerald-900 p-4 text-emerald-100">
          <p className="text-sm">
            <span className="font-semibold">Complete!</span>
            <br />
            All {maxSolutions} solutions found. Press Reset to start over.
          </p>
        </div>
      )}
    </Card>
  );
};

export default Gallery;
