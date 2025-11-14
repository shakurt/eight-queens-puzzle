interface GalleryProps {
  solutions: string[];
  maxSolutions: number;
}

const Gallery: React.FC<GalleryProps> = ({ solutions, maxSolutions }) => {
  const isComplete = solutions.length >= maxSolutions;

  return (
    <div className="rounded-2xl bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-100">Solutions</h2>
        <span className="rounded-full bg-emerald-600 px-3 py-1 text-sm font-semibold text-white">
          {solutions.length} / {maxSolutions}
        </span>
      </div>

      {solutions.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-500">No solutions yet</p>
          <p className="mt-1 text-xs text-gray-600">Press Run or Step Once</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {solutions.map((imageData, index) => (
            <figure
              key={index}
              className="overflow-hidden rounded-lg border-2 border-gray-700 bg-gray-800 transition-transform hover:scale-105"
            >
              <img
                src={imageData}
                alt={`Solution ${index + 1}`}
                className="block h-auto w-full"
              />
              <figcaption className="bg-gray-900 p-2 text-center">
                <span className="text-sm font-semibold text-emerald-400">
                  #{index + 1}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {isComplete && (
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
