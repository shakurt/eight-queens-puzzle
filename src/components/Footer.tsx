const Footer = () => {
  return (
    <footer className="bg-card mt-auto py-4 text-gray-300">
      <div className="container mx-auto text-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://github.com/shakurt/eight-queens-puzzle"
            target="_blank"
            className="underline"
          >
            Eight Queens Puzzle
          </a>
          . All rights reserved.
          {" • "}Developed by{" "}
          <span className="font-semibold">ThePrimeShak</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
