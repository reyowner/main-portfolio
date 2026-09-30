import type { CSSProperties } from "react";

interface LoaderProps {
  size?: number;
  text?: string;
}

// Adapted from the supplied ring/letter loader for section-scoped Vite usage.
export function Component({ size = 180, text = "Loading" }: LoaderProps) {
  return (
    <div className="ai-loader" role="status" aria-label={text}>
      <div
        className="ai-loader-orbit"
        style={{ "--loader-size": `${size}px` } as CSSProperties}
        aria-hidden="true"
      >
        <div className="ai-loader-letters">
          {Array.from(text).map((letter, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </div>
        <div className="ai-loader-ring" />
      </div>
    </div>
  );
}
export default Component;
