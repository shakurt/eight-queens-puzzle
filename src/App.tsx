// src/App.tsx
import React, { useEffect, useRef, useState } from "react";

type Board = number[]; // board[row] = col or -1
const N = 8;
const TARGET = 12;

// --- Utilities ---
function boardToString(b: Board) {
  return b.join(",");
}

function drawBoardImage(board: Board, size = 360) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const n = board.length;
  const cell = size / n;
  // dark background
  ctx.fillStyle = "#030305";
  ctx.fillRect(0, 0, size, size);
  // draw squares
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const isDark = (r + c) % 2 === 1;
      ctx.fillStyle = isDark ? "#000000" : "#ffffff";
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }
  }
  // draw queen symbol (simple crown) scaled to cell
  ctx.strokeStyle = "#b91c1c";
  ctx.lineWidth = Math.max(1, cell * 0.06);
  for (let r = 0; r < n; r++) {
    const c = board[r];
    if (c === -1) continue;
    const x = c * cell;
    const y = r * cell;
    const pad = cell * 0.12;
    ctx.beginPath();
    ctx.moveTo(x + pad, y + cell - pad);
    ctx.lineTo(x + pad, y + pad);
    ctx.lineTo(x + cell * 0.4, y + cell * 0.4);
    ctx.lineTo(x + cell * 0.55, y + pad);
    ctx.lineTo(x + cell * 0.7, y + cell * 0.45);
    ctx.lineTo(x + cell - pad, y + pad);
    ctx.lineTo(x + cell - pad, y + cell - pad);
    ctx.stroke();
  }
  return canvas.toDataURL("image/png");
}

// Inline queen svg for live board (keeps layout stable)
function QueenSVG({ size = 48 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <path d="M8 52 L56 52 L56 56 L8 56 Z" fill="#111827" />
        <path d="M10 48 C14 38, 50 38, 54 48 L10 48 Z" fill="#111827" />
        <path
          d="M12 16 C13 12, 17 10, 20 12 C23 14, 27 14, 30 11 C33 8, 37 8, 40 11 C43 14, 47 14, 50 12 C53 10, 57 12, 58 16 C60 22, 51 28, 32 28 C13 28, 4 22, 6 16 Z"
          fill="#f9fafb"
        />
        <circle cx="14" cy="16" r="2.5" fill="#f97316" />
        <circle cx="32" cy="12" r="2.5" fill="#f97316" />
        <circle cx="50" cy="16" r="2.5" fill="#f97316" />
      </g>
    </svg>
  );
}

// --- Backtracking generator ---
// yields events: { type: 'place'|'remove'|'solution'|'done', board }
function* backtrackingGenerator(): Generator<any, void, unknown> {
  const board: Board = Array(N).fill(-1);
  const cols = Array(N).fill(false);
  const diag1 = Array(2 * N).fill(false);
  const diag2 = Array(2 * N).fill(false);

  function* backtrack(r: number): Generator<any, void, unknown> {
    if (r === N) {
      yield { type: "solution", board: board.slice() };
      return;
    }
    for (let c = 0; c < N; c++) {
      if (cols[c] || diag1[r + c] || diag2[r - c + N]) continue;
      // place
      board[r] = c;
      cols[c] = diag1[r + c] = diag2[r - c + N] = true;
      yield { type: "place", board: board.slice(), row: r, col: c };
      // recurse
      yield* backtrack(r + 1);
      // remove
      board[r] = -1;
      cols[c] = diag1[r + c] = diag2[r - c + N] = false;
      yield { type: "remove", board: board.slice(), row: r, col: c };
    }
  }

  yield* backtrack(0);
  yield { type: "done", board: board.slice() };
}

// --- App ---
export default function App() {
  // generator reference
  const genRef = useRef<Generator | null>(null);

  // UI state
  const [board, setBoard] = useState<Board>(Array(N).fill(-1));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(400);
  const [gallery, setGallery] = useState<string[]>([]);
  const capturedSetRef = useRef<Set<string>>(new Set());
  const timerRef = useRef<number | null>(null);
  const [lastEvent, setLastEvent] = useState<string>("idle");

  // initialize generator
  const initGenerator = () => {
    genRef.current = backtrackingGenerator();
  };

  useEffect(() => {
    initGenerator();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // process a single generator step
  const step = (captureWhenSolution = true) => {
    if (!genRef.current) return;
    const res = genRef.current.next();
    if (res.done) {
      setLastEvent("done");
      setRunning(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    const ev = res.value as { type: string; board: Board };
    setBoard(ev.board.slice());
    setLastEvent(ev.type);

    if (ev.type === "solution") {
      if (captureWhenSolution) captureSolution(ev.board.slice());
      if (capturedSetRef.current.size >= TARGET) {
        setRunning(false);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  };

  const captureSolution = (b: Board) => {
    const key = boardToString(b);
    if (capturedSetRef.current.has(key)) return;
    if (capturedSetRef.current.size >= TARGET) return;
    capturedSetRef.current.add(key);
    const data = drawBoardImage(b, 360);
    setGallery((g) => {
      if (g.length >= TARGET) return g;
      return [...g, data];
    });
  };

  const runToggle = () => {
    if (capturedSetRef.current.size >= TARGET) return;
    if (running) {
      setRunning(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setRunning(true);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      timerRef.current = window.setInterval(
        () => {
          step(true);
        },
        Math.max(50, speed)
      );
    }
  };

  const stepOnce = () => {
    if (capturedSetRef.current.size >= TARGET) return;
    step(true);
  };

  const stepBack = () => {
    // Step-back implemented by rebuilding generator and replaying until one step before current board
    const currentKey = boardToString(board);
    if (currentKey === Array(N).fill(-1).join(",")) return; // nothing to undo

    const newGen = backtrackingGenerator();
    let prevBoard: Board = Array(N).fill(-1);
    let found = false;
    while (true) {
      const r = newGen.next();
      if (r.done) break;
      const ev = r.value as { type: string; board: Board };
      if (boardToString(ev.board) === currentKey) {
        // set generator to continue from here
        genRef.current = newGen;
        setBoard(prevBoard.slice());
        setLastEvent("stepped-back");
        found = true;
        break;
      }
      prevBoard = ev.board.slice();
    }
    if (!found) {
      // fallback: clear board
      setBoard(Array(N).fill(-1));
      initGenerator();
    }
  };

  const resetAll = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    genRef.current = backtrackingGenerator();
    setBoard(Array(N).fill(-1));
    setRunning(false);
    setGallery([]);
    capturedSetRef.current.clear();
    setLastEvent("reset");
  };

  // when speed changes while running, restart interval
  useEffect(() => {
    if (running) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(
        () => {
          step(true);
        },
        Math.max(50, speed)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  useEffect(() => {
    if (capturedSetRef.current.size >= TARGET) {
      setRunning(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [gallery.length]);

  // --- UI subcomponents ---
  function BoardView({ board }: { board: Board }) {
    return (
      <div className="mx-auto w-full max-w-[520px]">
        <div className="grid grid-cols-8 overflow-hidden rounded-lg border-2 border-slate-800">
          {Array.from({ length: N }).map((_, r) =>
            Array.from({ length: N }).map((__, c) => {
              const isDark = (r + c) % 2 === 1;
              const hasQueen = board[r] === c;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex aspect-square items-center justify-center ${isDark ? "bg-black" : "bg-white"} border-[1px] border-slate-800`}
                >
                  {hasQueen ? (
                    <div className="flex h-3/4 w-3/4 items-center justify-center">
                      <QueenSVG />
                    </div>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  function Controls() {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            onClick={runToggle}
            className={`rounded px-4 py-2 ${running ? "bg-yellow-400 text-black" : "bg-emerald-400 text-black"}`}
          >
            {running ? "Pause" : "Run"}
          </button>
          <button
            onClick={stepOnce}
            className="rounded bg-sky-500 px-4 py-2 text-black"
          >
            Step once
          </button>
          <button
            onClick={stepBack}
            className="rounded bg-orange-400 px-4 py-2 text-black"
          >
            Step back
          </button>
          <button
            onClick={resetAll}
            className="rounded bg-red-600 px-4 py-2 text-white"
          >
            Reset
          </button>
        </div>
        <div>
          <label className="text-sm text-slate-300">Speed (ms):</label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="range"
              min={50}
              max={1500}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-64"
            />
            <div className="w-20 text-right text-sm text-slate-300">
              {speed} ms
            </div>
          </div>
        </div>
        <div className="text-xs text-slate-400">Last event: {lastEvent}</div>
        <div className="text-xs text-slate-400">
          Captured: {capturedSetRef.current.size}/{TARGET}
        </div>
      </div>
    );
  }

  function Gallery() {
    return (
      <div>
        <h3 className="mb-2 text-lg font-semibold">Solutions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {gallery.length === 0 && (
            <div className="col-span-full text-slate-400">No solutions yet</div>
          )}
          {gallery.map((src, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-md border border-slate-800 bg-slate-900"
            >
              <img
                src={src}
                alt={`solution-${i + 1}`}
                className="block h-auto w-full"
              />
              <figcaption className="p-1 text-center text-xs text-slate-300">
                Solution {i + 1}
              </figcaption>
            </figure>
          ))}
        </div>
        {capturedSetRef.current.size >= TARGET && (
          <div className="mt-3 rounded bg-green-900 p-3 text-green-200">
            All {TARGET} unique solutions captured. Press Reset to run again.
          </div>
        )}
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#05060a] p-6 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Eight Queens — Correct Backtracking Visualizer
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              True row-by-row backtracking generator. Captures exact board
              images for unique solutions.
            </p>
          </div>
          <div className="text-sm text-slate-300">
            Captured: {capturedSetRef.current.size}/{TARGET}
          </div>
        </header>

        <main className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl bg-[#0b1220] p-4 shadow-md">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex justify-center md:w-1/2">
                <BoardView board={board} />
              </div>
              <div className="flex-1">
                <Controls />
              </div>
            </div>
          </section>

          <aside className="rounded-2xl bg-[#0b1220] p-4 shadow-md">
            <Gallery />
          </aside>
        </main>

        <footer className="mt-8 text-sm text-slate-500">
          Project name suggestion: QueenStepper
        </footer>
      </div>
    </div>
  );
}
