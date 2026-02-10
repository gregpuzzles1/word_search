<!--
Sync Impact Report
- Version change: 0.0.0-placeholder -> 1.0.0
- Modified principles: Initialized five principles for static web app + GitHub Pages
- Added sections: Technology Constraints; Development Workflow
- Removed sections: None
- Templates requiring updates:
	- .specify/templates/plan-template.md: ✅ updated
	- .specify/templates/spec-template.md: ✅ updated
	- .specify/templates/tasks-template.md: ✅ updated
	- .specify/templates/commands/*.md: ✅ no files found
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): original adoption date not found
-->
# Word Search Constitution

## Core Principles

### I. Static-Only App
The app MUST be fully static and run in the browser with no server-side
runtime, databases, or server builds in this repository. External services
are allowed only when they do not require server code in this repo.
Rationale: GitHub Pages hosts static content only.

### II. Main-Only Actions Deploy
Deployments to GitHub Pages MUST be performed by GitHub Actions and MUST run
only on the `main` branch. Manual uploads or deployments from other branches
are not allowed.
Rationale: Ensures reproducible and traceable releases.

### III. Minimal Dependency Surface
Dependencies MUST be added only when native browser capabilities are
insufficient. Each new dependency MUST include a brief justification in the
change description.
Rationale: Keeps bundle size and maintenance cost low.

### IV. Baseline Accessibility and Performance
The UI MUST use semantic HTML, support keyboard access for interactive
controls, and avoid large unoptimized assets. The primary page MUST load
without blocking on non-critical resources.
Rationale: Basic quality and usability for a public static site.

### V. Build Output Is Ephemeral
Build outputs for GitHub Pages MUST be generated in GitHub Actions and MUST
NOT be committed to the repository unless the hosting setup explicitly
requires it.
Rationale: Prevents source control drift and keeps the repo clean.

## Technology Constraints

- The site MUST be a static web app using HTML, CSS, and JavaScript.
- The deployment target is GitHub Pages via a GitHub Actions workflow.
- Any build step MUST produce static assets suitable for Pages hosting.

## Development Workflow

- All changes MUST be merged into `main` before deployment.
- Feature work MUST include a Constitution Check in the implementation plan.
- Exceptions to any principle MUST be documented with rationale in the plan.

## Governance

- This constitution supersedes other project guidance.
- Amendments require a documented change, review, and update to version and
	dates.
- Versioning follows semantic versioning: MAJOR for breaking governance
	changes, MINOR for new principles or sections, PATCH for clarifications.
- Compliance is reviewed during planning and before merge to `main`.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): original adoption date not found | **Last Amended**: 2026-02-10
