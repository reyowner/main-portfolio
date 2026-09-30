export default function ProjectMark({ id }: { id: string }) {
  if (id === "blackrose" || id === "predikta")
    return (
      <img
        src={
          id === "blackrose"
            ? "/images/black-rose-emblem.png"
            : "/images/predikta-signup.png"
        }
        alt=""
      />
    );
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className="project-mark"
    >
      {id === "portfolio" ? (
        <>
          <path
            d="M10 35V12h13c13 0 13 15 0 15H10m13 0 14 8M17 35V18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </>
      ) : id === "creative" ? (
        <>
          <path
            d="M9 12h30M16 12v24m16-24v18c0 10-15 10-15 2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M9 41h30" stroke="currentColor" />
        </>
      ) : id === "educator" ? (
        <>
          <path
            d="M24 14c-5-5-12-6-18-4v26c7-2 12 0 18 4 6-4 11-6 18-4V10c-6-2-13-1-18 4Zm0 0v26M12 17l7 3m-7 4 7 3m10-7 7-3m-7 10 7-3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </>
      ) : (
        <>
          <circle
            cx="24"
            cy="24"
            r="17"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M24 12v13l8 5" stroke="currentColor" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}
