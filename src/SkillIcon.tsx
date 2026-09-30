import {
  siReact,
  siNextdotjs,
  siTypescript,
  siJavascript,
  siHtml5,
  siCss,
  siTailwindcss,
  siPython,
  siFastapi,
  siPostgresql,
  siSupabase,
  siMongodb,
  siDocker,
  siGit,
  siGithub,
  siFigma,
  siDiscord,
} from "simple-icons";

const icons = {
  "React.js": siReact,
  "Next.js": siNextdotjs,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  HTML: siHtml5,
  CSS: siCss,
  "Tailwind CSS": siTailwindcss,
  Python: siPython,
  FastAPI: siFastapi,
  PostgreSQL: siPostgresql,
  Supabase: siSupabase,
  MongoDB: siMongodb,
  Docker: siDocker,
  Git: siGit,
  GitHub: siGithub,
  "Figma-to-code": siFigma,
  "Discord OAuth": siDiscord,
};
export default function SkillIcon({ name }: { name: string }) {
  const icon = icons[name as keyof typeof icons];
  return icon ? (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="skill-brand-icon"
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="skill-brand-icon"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path
        d={
          name.includes("API")
            ? "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"
            : "M6 5h12v14H6zM9 9h6m-6 3h6m-6 3h4"
        }
      />
    </svg>
  );
}
