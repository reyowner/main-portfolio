import ResumeDownload from "./ResumeDownload";
import { career } from "./content";
export default function Experience({
  onOpen,
  detailed = false,
}: {
  onOpen?: () => void;
  detailed?: boolean;
}) {
  return (
    <div className="career-layout">
      <div className="career-intro">
        <span className="folio-eyebrow">A record of growth / 2021—26</span>
        <h3>
          From the first feature
          <br />
          to the full picture.
        </h3>
        <p>
          I’ve grown by taking on more of the work: building features,
          connecting services, and working directly with clients.
        </p>
        {onOpen && (
          <button className="career-link" onClick={onOpen}>
            Read the full story <span>↗</span>
          </button>
        )}
        <ResumeDownload compact />
      </div>
      <ol className="career-list">
        {career.map((item, i) => (
          <li key={item.title}>
            <span className="career-number">0{i + 1}</span>
            <div>
              <div className="career-date">
                {item.date}
                <span>{item.label}</span>
              </div>
              <h4>{item.title}</h4>
              {detailed ? (
                <ul className="career-details">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p>{item.summary}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
