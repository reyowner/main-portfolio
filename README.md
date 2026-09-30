# Renato Reoner Jr. — Portfolio

A personal portfolio built with React, TypeScript, Vite, and Three.js. It includes an interactive holographic hero, a developer studio for exploring projects and professional experience, a skills section, résumé downloads, and an EmailJS contact form.

## Local development

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

The production files are generated in `dist/`. Publish that directory with a static hosting provider. This repository does not include a deployment configuration.

## Project structure

- `src/content.ts`: project content, client portfolio collection, career summaries and details, and skills.
- `src/App.tsx`: page sections, navigation, display modes, and accessible detail dialog.
- `src/Hologram.tsx`: interactive hero model.
- `src/Studio.tsx`, `src/room-scene.ts`, `src/room-lighting.ts`: studio rendering, geometry, and lighting.
- `src/components/ui/ai-loader.tsx`: shared section loading state.
- `src/ContactForm.tsx`: EmailJS integration and form feedback.
- `src/ResumeDownload.tsx`: reusable résumé download component.
- `src/styles.css`: responsive styling and reduced-motion support.
- `public/`: favicon, project logos, and downloadable résumé.
- `emailjs/`: notification template source and setup instructions.

## Contact form

The browser integration uses an EmailJS public key, service ID, and template ID. These are intentionally public identifiers; no private key belongs in the browser application.

See [EmailJS setup](emailjs/README.md) for the template configuration. The form supplies `name`, `email`, `subject`, `message`, `initials`, and `time`, plus sender aliases for Reply-To settings. Success and failure states have been tested with intercepted requests; live mailbox delivery has not been verified.

## Accessibility and rendering

Each interactive studio exhibit also has a list entry. Detail dialogs support keyboard navigation, Escape dismissal, and focus restoration. Devices without WebGL receive accessible content fallbacks. The scene renders on demand, caps pixel density, and disposes resources on unmount. Animations respect reduced-motion preferences.

The studio is a procedural local concept; no final 3D asset export or production-room approval is claimed.

## Assets

See [asset provenance](THIRD_PARTY_NOTICES.md). The downloadable résumé and supplied project marks are included intentionally. Client portfolio titles use descriptive labels rather than client names.

Dependencies, generated builds, environment files, local review artifacts, and one-off working scripts are excluded through `.gitignore`. `package-lock.json` is committed for reproducible installs.

## Vercel Web Analytics

`@vercel/analytics/react` is mounted once at the application root in `src/main.tsx`. Enable Web Analytics in the Vercel project dashboard, then deploy the branch containing this integration. Production visitor and page-view data appears after visitors load that deployment. Development mode does not collect analytics. No custom events or contact-form values are sent by this integration.
