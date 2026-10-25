// Hand-drawn extras. All decorative, so all hidden from screen readers.

const ink = "#3b3340";

export function Sparkle({ size = 28, fill = "#ffe08a" }: { size?: number; fill?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 32 32" className="doodle">
      <path
        d="M16 2 C17 10 22 15 30 16 C22 17 17 22 16 30 C15 22 10 17 2 16 C10 15 15 10 16 2Z"
        fill={fill}
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle({ width = 120 }: { width?: number }) {
  return (
    <svg aria-hidden="true" width={width} height="18" viewBox="0 0 120 18" className="doodle">
      <path
        d="M2 10 C12 2 20 2 30 10 S48 18 58 10 S76 2 86 10 S104 18 118 8"
        fill="none"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowDoodle({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="44"
      height="22"
      viewBox="0 0 44 22"
      className="doodle"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M2 12 C12 4 24 4 38 11" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 4 L39 11 L29 17" fill="none" stroke={ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A nod to the team name, Nekomata: a cat face with ears. */
export function CatFace({ size = 64 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 64 64" className="doodle">
      <path d="M10 28 L12 6 L26 16 Z" fill="#ffc9d6" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M54 28 L52 6 L38 16 Z" fill="#ffc9d6" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="32" cy="36" rx="23" ry="19" fill="#fff8ec" stroke={ink} strokeWidth="2.5" />
      <circle cx="24" cy="34" r="2.6" fill={ink} />
      <circle cx="40" cy="34" r="2.6" fill={ink} />
      <path d="M29 41 Q32 44 35 41" fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 38 L18 40 M8 45 L18 43 M56 38 L46 40 M56 45 L46 43" stroke={ink} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Pixel heart built from squares, for stamps and small accents. */
export function PixelHeart({ size = 20, color = "#ff8fab" }: { size?: number; color?: string }) {
  const cells = [
    [1, 0], [2, 0], [4, 0], [5, 0],
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4],
    [3, 5],
  ];
  return (
    <svg aria-hidden="true" width={size} height={(size * 6) / 7} viewBox="0 0 7 6" shapeRendering="crispEdges" className="doodle">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
}
