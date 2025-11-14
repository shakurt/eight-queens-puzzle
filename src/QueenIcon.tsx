// QueenIcon - SVG icon for queens

export function QueenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <path d="M8 52 L56 52 L56 56 L8 56 Z" fill="#1f2937" />
        <path d="M10 48 C14 38, 50 38, 54 48 L10 48 Z" fill="#1f2937" />
        <path
          d="M12 16 C13 12, 17 10, 20 12 C23 14, 27 14, 30 11 C33 8, 37 8, 40 11 C43 14, 47 14, 50 12 C53 10, 57 12, 58 16 C60 22, 51 28, 32 28 C13 28, 4 22, 6 16 Z"
          fill="#f3f4f6"
        />
        <circle cx="14" cy="16" r="2.5" fill="#ef4444" />
        <circle cx="32" cy="12" r="2.5" fill="#ef4444" />
        <circle cx="50" cy="16" r="2.5" fill="#ef4444" />
      </g>
    </svg>
  );
}
