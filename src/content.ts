export type Exhibit = {
  id: string;
  title: string;
  kind: "Project" | "Experience";
  object: string;
  period: string;
  role: string;
  summary: string;
  details: string[];
  stack: string[];
  link?: string;
};

// Factual content transcribed from the supplied RReoner_CV.pdf. No invented impact metrics.
export const exhibits: Exhibit[] = [
  {
    id: "blokisle",
    title: "Blokisle",
    kind: "Project",
    object: "The time-block calendar",
    period: "October 2026",
    role: "Personal project · Full-stack development",
    summary: "Give your day a clear shape, one block at a time.",
    details: [
      "Built a personal time-block planner for teachers and anyone who prefers a structured day, with reusable routines, daily objectives, task urgency, and reminders.",
      "Created an interactive Three.js studio that responds to the current time block, with task progress and optional Pomodoro or continuous focus sessions, pause, and break controls.",
      "Connected Google sign-in and Firestore sync across devices, with local caching and optional two-way Google Calendar event sync through a Cloudflare service.",
      "Packaged the app for Android with Capacitor and scheduled local reminders, alongside responsive web layouts and mobile bottom sheets.",
    ],
    stack: ["React", "TypeScript", "Three.js", "React Three Fiber", "Firebase", "Cloudflare Workers", "Capacitor"],
    link: "https://blokisle.vercel.app",
  },
  {
    id: "blackrose",
    title: "Black Rose",
    kind: "Project",
    object: "The Black Rose display",
    period: "July 2026 – present",
    role: "Full-stack developer · Volunteer",
    summary: "A place for a gaming community to become a team.",
    details: [
      "Built a gaming and esports community platform end to end, with player profiles, Discord verification, role-gated access, and team and roster management.",
      "Created tournament administration with Single Elimination, Swiss, and Double Elimination formats, game management, audit logging, and a Hall of Champions.",
      "The platform has supported tournaments including an officially partnered VALORANT / Riot Games event.",
    ],
    stack: [
      "React 19",
      "TypeScript",
      "TanStack Start",
      "Supabase",
      "Tailwind CSS",
      "Capacitor",
    ],
    link: "https://blackrose.asia",
  },
  {
    id: "predikta",
    title: "PREDIKTA",
    kind: "Project",
    object: "The dual-screen setup",
    period: "March 2025 – August 2026",
    role: "Frontend development & API integration",
    summary: "From Figma designs to a connected marketing application.",
    details: [
      "Initially served as the sole frontend developer for the platform rebrand, translating Netopia AI's UI/UX team designs into production-ready components, interfaces, and pages.",
      "Connected the React and Next.js frontend to FastAPI services, independently testing integrations and resolving issues.",
      "Worked directly with client stakeholders to translate requirements, triage UAT feedback, and ship fixes against a client-driven timeline.",
    ],
    stack: ["React", "Next.js", "FastAPI", "REST APIs", "Figma"],
    link: "https://predikta.ai/",
  },
  {
    id: "portfolio",
    title: "Client portfolios",
    kind: "Project",
    object: "The portfolio collection",
    period: "Selected client work",
    role: "Freelance development",
    summary: "Different people. Their own place on the web.",
    details: [],
    stack: [],
  },
  {
    id: "experience",
    title: "The path so far",
    kind: "Experience",
    object: "The experience wall",
    period: "2021 – 2026",
    role: "Learning, building, taking ownership",
    summary: "From learning the craft to finding my place in it.",
    details: [
      "June 2025 – August 2026 · Junior Fullstack Software Engineer. Promoted from intern to full-time based on internship performance. Collaborated in a 3–5 person agile team and owned frontend delivery for PREDIKTA.",
      "March – May 2025 · Full Stack Software Engineer Intern. Built PREDIKTA features and completed a development curriculum, including TaskFlow with CRUD, authentication, and session handling.",
      "February 2021 · Data Entry Clerk, work immersion. Transcribed medical documents with an emphasis on accuracy and quality assurance.",
    ],
    stack: [
      "Client collaboration",
      "Agile / Scrum",
      "Quality assurance",
      "Figma-to-code",
    ],
  },
];

export const career = [
  {
    date: "Jun 2025 — Aug 2026",
    title: "Junior Fullstack Software Engineer",
    label: "Professional experience",
    summary:
      "Promoted from intern to full-time based on performance. Initially served as PREDIKTA's sole frontend developer and collaborated in a 3-5 person agile team.",
    details: [
      "Initially served as the sole frontend developer for PREDIKTA, completely rebranding the platform from Netopia AI’s UI/UX team designs. Translated Figma designs into production-ready components, interfaces, and pages.",
      "Integrated REST APIs and backend services for each feature, connecting the React and Next.js frontend with FastAPI. Independently tested integrations and resolved issues.",
      "Worked directly with client stakeholders to translate requirements into functional features, triage UAT feedback, and ship fixes against a client-driven Gantt chart timeline.",
      "Collaborated in a 3–5 person agile team and was promoted from intern to full-time based on internship performance.",
    ],
  },
  {
    date: "Mar — May 2025",
    title: "Full Stack Software Engineer Intern",
    label: "The foundation",
    summary:
      "Built and enhanced PREDIKTA features with React, Next.js, and REST APIs. Developed TaskFlow as the final curriculum project before joining the PREDIKTA team.",
    details: [
      "Built and enhanced features for the PREDIKTA Marketing App using React.js, Next.js, and FastAPI, aligned with Figma-based UI/UX designs.",
      "Completed a company-provided development curriculum, culminating in TaskFlow with CRUD, authentication, and session handling. Gained hands-on development experience in a fully remote, agile environment.",
    ],
  },
  {
    date: "Feb 2021",
    title: "Data Entry Clerk",
    label: "Work immersion",
    summary:
      "Transcribed medical documents with a focus on accuracy and quality assurance.",
    details: [
      "Transcribed medical documents from PDFs and images into Microsoft Word while preserving the original formatting.",
      "Maintained accuracy and consistency in document structure and layout, developing fast and precise typing skills for high-volume data entry.",
    ],
  },
];

export const skills = [
  {
    name: "The interface",
    note: "Turning design intent into something people can use.",
    items: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
    ],
  },
  {
    name: "Behind the scenes",
    note: "Connecting the experience to its data and services.",
    items: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "REST APIs",
      "JWT",
      "Discord OAuth",
    ],
  },
  {
    name: "How I work",
    note: "Following through from the first design to the last fix.",
    items: [
      "Figma-to-code",
      "Git",
      "GitHub",
      "Docker",
      "Agile / Scrum",
      "Quality assurance",
      "Client collaboration",
    ],
  },
];

export const clientPortfolios: Exhibit[] = [
  {
    id: "creative",
    title: "Creative professional portfolio",
    kind: "Project",
    object: "The portfolio display",
    period: "August 2026",
    role: "Freelance developer",
    summary: "Architecture, graphics, and video in one creative showcase.",
    details: [
      "Built a multidisciplinary portfolio with dedicated architecture, graphic design, and video sections, translating the client’s creative direction into a responsive website.",
      "Built a project showcase with integrated PDF and video viewers.",
    ],
    stack: [
      "React 19",
      "TypeScript",
      "TanStack Start / Router",
      "Tailwind CSS",
      "EmailJS",
    ],
    link: "https://habagat-jervin-eport.vercel.app/",
  },
  {
    id: "educator",
    title: "Educator portfolio",
    kind: "Project",
    object: "The teaching journal",
    period: "June 2025",
    role: "Portfolio development",
    summary: "An educator’s journey, thoughtfully collected.",
    details: [
      "Built an educator’s personal portfolio, bringing academic work, teaching experience, and activities into a connected, multi-page experience.",
      "Organized photographs and documents into browsable galleries, with responsive carousels and access to résumé and academic materials.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "shadcn/ui",
    ],
    link: "https://portfolio-ria-rho.vercel.app/",
  },
];
