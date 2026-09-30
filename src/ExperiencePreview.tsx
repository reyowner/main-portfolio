import { career } from "./content";

export default function ExperiencePreview({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="experience-preview">
      <p className="experience-years">
        2021 <span /> 2026
      </p>
      <h3>
        A little more
        <br />
        with every chapter.
      </h3>
      <p>From engineering intern to owning a production frontend.</p>
      <ol>
        {career.slice(0, 3).map((item) => (
          <li key={item.title}>
            <span>{item.date}</span>
            <strong>{item.title}</strong>
          </li>
        ))}
      </ol>
      <button onClick={onOpen}>
        Explore my experience <span>↗</span>
      </button>
    </div>
  );
}
