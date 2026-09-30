import ResumeDownload from "./ResumeDownload";
import AiLoader from "./components/ui/ai-loader";
import ExperiencePreview from "./ExperiencePreview";
import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { exhibits, skills, type Exhibit } from "./content";
import SkillIcon from "./SkillIcon";
import ProjectMark from "./ProjectMark";
import Experience from "./Experience";
import ExhibitDetail from "./ExhibitDetail";
import ContactForm from "./ContactForm";

const Studio = lazy(() => import("./Studio"));
const Hologram = lazy(() => import("./Hologram"));
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function Mark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none">
      <path
        d="M10 35V12h13c13 0 13 15 0 15H10m13 0 14 8M17 35V18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function App() {
  const [view, setView] = useState<"room" | "list">("room");
  const [filter, setFilter] = useState<"Project" | "Experience">("Project");
  const [selected, setSelected] = useState<Exhibit | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [roomVisible, setRoomVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [reset, setReset] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const studioSection = useRef<HTMLElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRoomVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    if (studioSection.current) observer.observe(studioSection.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [selected]);

  function openExhibit(id: string) {
    const exhibit = exhibits.find((item) => item.id === id);
    if (!exhibit) return;
    lastFocused.current = document.activeElement as HTMLElement;
    setSelected(exhibit);
  }
  function closeExhibit() {
    dialog.current?.close();
  }
  function keepDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const elements = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex="0"]',
      ),
    ];
    const first = elements[0],
      last = elements.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  const review = new URLSearchParams(location.search).get("review");
  if (review)
    return (
      <main className="review-page">
        <h1>Ren’s studio · Concept review</h1>
        <p>
          Previsualization for layout approval. Procedural concept geometry;
          final composition and room gates remain pending.
        </p>
        <Suspense fallback={<p>Loading room…</p>}>
          <Studio
            review={review}
            selectedId={null}
            reset={0}
            onSelect={() => {}}
            onHover={() => {}}
            onReady={() => {}}
            onError={() => {}}
          />
        </Suspense>
        <p>
          Views: <a href="?review=production">Production</a> ·{" "}
          <a href="?review=plan">Floor plan</a> ·{" "}
          <a href="?review=ceiling">Reflected ceiling</a> ·{" "}
          <a href="?review=back">Back elevation</a> ·{" "}
          <a href="?review=left">Left elevation</a> ·{" "}
          <a href="?review=props">Prop references</a> ·{" "}
          <a href="/">Portfolio</a>
        </p>
      </main>
    );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header page-width">
        <a className="brand" href="#" aria-label="Renato Reoner Jr., home">
          <Mark />
          <span>Renato Reoner Jr.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#studio">My studio</a>
          <a href="#skills">Skills</a>
          <a href="#contact">
            Let’s talk <Arrow diagonal />
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-intro">
              <span className="status-dot" />
              Renato Reoner Jr. <span>/ Full-stack developer</span>
            </div>
            <h1 id="hero-title">
              Pixels up front.
              <br />
              Logic underneath.
              <br />
              Me in the middle.
            </h1>
            <p>
              I'm Ren, a full-stack developer who cares about how things look
              and how they work. I build interfaces, connect APIs, and work
              through the details—from the first Figma screen to the fixes after
              feedback.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#studio">
                Step inside my studio <Arrow />
              </a>
              <a className="quiet-link" href="#contact">
                Let's connect <Arrow diagonal />
              </a>
            </div>
            <div className="hero-footnote">
              <span className="location-marker" aria-hidden="true">
                ⌖
              </span>{" "}
              Metro Manila, Philippines <span className="hero-footnote-rule" />{" "}
              Building for the web.
            </div>
            <ResumeDownload compact />
          </div>
          <div className="hero-model">
            <Suspense fallback={<AiLoader text="Loading hologram" />}>
              <Hologram />
            </Suspense>
          </div>
        </section>

        <section
          className="studio-section"
          id="studio"
          ref={studioSection}
          aria-labelledby="studio-title"
        >
          <div className="studio-heading page-width">
            <div>
              <div className="section-context">
                <span className="small-square" />
                Behind the screen
              </div>
              <h2 id="studio-title">Where work meets play.</h2>
            </div>
            <p>
              Pick an object. Discover a project.
              <br /> There’s a story behind each one.
            </p>
          </div>
          <div className="studio-shell page-width">
            <div className="studio-toolbar">
              <div className="studio-name">
                <span className="status-dot" />
                Ren’s studio{" "}
                <span className="room-type">/ Work & experience</span>
              </div>
              <div className="view-toggle" aria-label="Display mode">
                <button
                  aria-pressed={view === "room"}
                  onClick={() => {
                    if (view !== "room") setReady(false);
                    setView("room");
                  }}
                >
                  <span aria-hidden="true">◇</span> Room view
                </button>
                <button
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                >
                  <span aria-hidden="true">☷</span> List view
                </button>
              </div>
            </div>
            <div
              className={`studio-body ${view === "list" || failed ? "list-mode" : ""}`}
            >
              {view === "room" && !failed && (
                <div className="room-wrap">
                  <div className="room-caption">
                    <span>The after-hours setup</span>
                    <span>Code, coffee, and a little competition.</span>
                  </div>
                  {roomVisible && (
                    <Suspense fallback={null}>
                      <Studio
                        selectedId={hovered}
                        reset={reset}
                        onSelect={openExhibit}
                        onHover={setHovered}
                        onReady={() => setReady(true)}
                        onError={() => setFailed(true)}
                      />
                    </Suspense>
                  )}
                  {!ready && roomVisible && <AiLoader text="Opening studio" />}
                  <div className="room-controls">
                    <span>
                      <svg
                        aria-hidden="true"
                        width="17"
                        height="17"
                        viewBox="0 0 20 20"
                      >
                        <rect
                          x="5"
                          y="2"
                          width="10"
                          height="16"
                          rx="5"
                          fill="none"
                          stroke="currentColor"
                        />
                        <path d="M10 3v5" stroke="currentColor" />
                      </svg>
                      Drag to look around · Select an object
                    </span>
                    <button
                      onClick={() => setReset((value) => value + 1)}
                      aria-label="Reset room camera"
                    >
                      ↺ <span>Reset view</span>
                    </button>
                  </div>
                </div>
              )}
              <div className="collection-panel">
                {failed && (
                  <p className="fallback-note" role="status">
                    The 3D room isn’t available on this device. You can explore
                    everything below.
                  </p>
                )}
                <div className="collection-heading">
                  <h3>Take a closer look</h3>
                  <p>Explore the things I’ve built.</p>
                </div>
                <div
                  className="collection-tabs"
                  role="group"
                  aria-label="Collection category"
                >
                  <button
                    aria-pressed={filter === "Project"}
                    onClick={() => setFilter("Project")}
                  >
                    Projects{" "}
                    <span>
                      {
                        exhibits.filter((item) => item.kind === "Project")
                          .length
                      }
                    </span>
                  </button>
                  <button
                    aria-pressed={filter === "Experience"}
                    onClick={() => setFilter("Experience")}
                  >
                    Experience
                  </button>
                </div>
                <div
                  className={`exhibit-list ${filter === "Experience" ? "experience-content" : ""}`}
                >
                  {filter === "Experience" ? (
                    view === "room" && !failed ? (
                      <ExperiencePreview
                        onOpen={() => openExhibit("experience")}
                      />
                    ) : (
                      <Experience onOpen={() => openExhibit("experience")} />
                    )
                  ) : (
                    exhibits
                      .filter((item) => item.kind === filter)
                      .map((item) => (
                        <button
                          key={item.id}
                          className={`exhibit-button ${hovered === item.id ? "is-hovered" : ""}`}
                          onMouseEnter={() => setHovered(item.id)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(item.id)}
                          onBlur={() => setHovered(null)}
                          onClick={() => openExhibit(item.id)}
                        >
                          <span
                            className={`exhibit-icon icon-${item.id}`}
                            aria-hidden="true"
                          >
                            <ProjectMark id={item.id} />
                          </span>
                          <span>
                            <strong>{item.title}</strong>
                            <small>{item.object}</small>
                          </span>
                          <Arrow diagonal />
                        </button>
                      ))
                  )}
                </div>
                <div className="collection-foot">
                  <span className="tiny-cross" aria-hidden="true">
                    +
                  </span>
                  <p>
                    Built with curiosity.
                    <br />
                    Best explored at your own pace.
                  </p>
                </div>
              </div>
            </div>
            <div className="studio-footer">
              <span>Personal projects. Real-world experience.</span>
              <a href="#skills">
                The tools behind the work <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <section
          className="skills-section page-width"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="section-heading">
            <div className="section-context">
              <span className="small-square" />
              My toolkit
            </div>
            <h2 id="skills-title">
              From the first pixel
              <br />
              to the final endpoint.
            </h2>
            <p>
              A connected set of skills for building
              <br className="desktop-break" /> thoughtful, working products.
            </p>
          </div>
          <div className="skills-grid">
            {skills.map((group, i) => (
              <article key={group.name} className="skill-group">
                <div className={`skill-symbol symbol-${i}`} aria-hidden="true">
                  {i === 0 ? "⌘" : i === 1 ? "{ }" : "✳"}
                </div>
                <h3>{group.name}</h3>
                <p>{group.note}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <SkillIcon name={item} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          className="contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="page-width contact-heading">
            <span className="section-context">Start a conversation</span>
            <h2 id="contact-title">
              Good work starts
              <br />
              with a conversation.
            </h2>
            <p>
              For a website with a point of view,
              <br />
              or a team with something worth building.
            </p>
          </div>
          <div className="page-width contact-inner">
            <div className="contact-copy">
              <div className="contact-profile">
                <Mark />
                <div>
                  <strong>Renato Reoner Jr.</strong>
                  <span>Full-stack developer · Metro Manila</span>
                </div>
              </div>
              <p>
                Tell me what you’re working on, where you want to take it, and
                how I can help.
              </p>
              <div className="contact-destinations">
                <a
                  className="contact-email"
                  href="mailto:domasigreoner@gmail.com"
                >
                  <span>
                    <small>Email me directly</small>domasigreoner@gmail.com
                  </span>
                  <Arrow diagonal />
                </a>
                <a
                  className="contact-social"
                  href="https://www.linkedin.com/in/rreonerjr/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <small>Professional profile</small>Connect on LinkedIn
                  </span>
                  <Arrow diagonal />
                </a>
              </div>
              <ResumeDownload />
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="footer page-width">
        <span>© {new Date().getFullYear()} Renato Reoner Jr.</span>
        <span>A small space for things I build.</span>
        <a href="#">Back to the top ↑</a>
      </footer>

      <dialog
        ref={dialog}
        className="exhibit-dialog"
        onKeyDown={keepDialogFocus}
        onClose={() => {
          setSelected(null);
          lastFocused.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const r = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < r.left ||
              event.clientX > r.right ||
              event.clientY < r.top ||
              event.clientY > r.bottom
            )
              closeExhibit();
          }
        }}
        aria-labelledby="detail-title"
      >
        {selected && (
          <ExhibitDetail exhibit={selected} onClose={closeExhibit} />
        )}
      </dialog>
    </>
  );
}
