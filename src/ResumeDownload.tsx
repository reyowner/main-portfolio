export default function ResumeDownload({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <a
      className={`resume-download ${compact ? "resume-compact" : ""}`}
      href="/documents/RReoner_CV.pdf"
      download="Renato-Reoner-Jr-Resume.pdf"
      aria-label="Download Renato Reoner Jr. CV, PDF"
    >
      <span className="resume-document" aria-hidden="true">
        <svg viewBox="0 0 32 40" fill="none">
          <path
            d="M5 2h14l8 8v28H5zM19 2v9h8M10 19h12M10 24h12M10 29h8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </span>
      <span className="resume-download-copy">
        <strong>{compact ? "Download CV" : "My experience, on paper."}</strong>
        <small>{compact ? "PDF document" : "Download CV · PDF"}</small>
      </span>
      <span className="resume-download-arrow" aria-hidden="true">
        ↓
      </span>
    </a>
  );
}
