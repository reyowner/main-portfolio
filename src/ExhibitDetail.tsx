import { clientPortfolios, type Exhibit } from "./content";
import ProjectMark from "./ProjectMark";
import Experience from "./Experience";
export default function ExhibitDetail({
  exhibit,
  onClose,
}: {
  exhibit: Exhibit;
  onClose: () => void;
}) {
  return (
    <>
      <div className="folio-bar">
        <span>R.R. / Selected works & field notes</span>
        <button
          className="folio-close"
          aria-label="Close details"
          onClick={onClose}
          autoFocus
        >
          Close <span>×</span>
        </button>
      </div>
      <div className={`folio-sheet folio-${exhibit.id}`}>
        <header className="folio-header">
          <div className="folio-eyebrow">
            {exhibit.kind === "Project"
              ? "Project dossier"
              : "Professional journal"}
            <span>{exhibit.period}</span>
          </div>
          <div className="folio-title-row">
            <h2 id="detail-title">{exhibit.title}</h2>
            <span
              className={`folio-stamp stamp-${exhibit.id}`}
              aria-hidden="true"
            >
              <ProjectMark id={exhibit.id} />
            </span>
          </div>
          <p className="folio-role">{exhibit.role}</p>
        </header>
        <p className="folio-summary">{exhibit.summary}</p>
        {exhibit.id === "portfolio" ? (
          <div className="client-collection">
            {clientPortfolios.map((client) => (
              <article className="client-entry" key={client.id}>
                <div className="client-entry-heading">
                  <span className="client-mark" aria-hidden="true">
                    <ProjectMark id={client.id} />
                  </span>
                  <div>
                    <p>{client.period}</p>
                    <h3>{client.title}</h3>
                  </div>
                </div>
                <p className="client-summary">{client.summary}</p>
                {client.details.map((text) => (
                  <p className="client-description" key={text}>
                    {text}
                  </p>
                ))}
                <ul className="stack-list">
                  {client.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a
                  className="folio-visit"
                  href={client.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit {client.title} <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        ) : exhibit.kind === "Experience" ? (
          <Experience detailed />
        ) : (
          <div className="folio-notes">
            <span className="folio-eyebrow">Inside the project</span>
            {exhibit.details.map((text, i) => (
              <div className="folio-note" key={text}>
                <span>0{i + 1}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        )}
        {exhibit.stack.length > 0 && (
          <div className="folio-tools">
            <span className="folio-eyebrow">
              {exhibit.kind === "Project"
                ? "Tools of the craft"
                : "Ways of working"}
            </span>
            <ul className="stack-list">
              {exhibit.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <footer className="folio-footer">
          <span>
            Renato Reoner Jr.
            <br />
            <em>Design-minded. Built with care.</em>
          </span>
          {exhibit.link && (
            <a
              className="folio-visit"
              href={exhibit.link}
              target="_blank"
              rel="noreferrer"
            >
              Visit live site <span>↗</span>
            </a>
          )}
        </footer>
      </div>
    </>
  );
}
