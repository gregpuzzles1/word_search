<!--
Sync Impact Report
- Version change: 0.0.0-placeholder -> 1.0.0
- Modified principles: Initialized minimal static + Pages deployment constraints
- Added sections: Hosting & Deployment; Development Workflow
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md: ✅ updated
	- .specify/templates/spec-template.md: ✅ updated
	- .specify/templates/tasks-template.md: ✅ updated
- Follow-up TODOs: none
-->
# Word Search Constitution

## Core Principles

### I. Static-Only Web App
The app MUST ship as static HTML, CSS, JavaScript, and assets. No server-side
code, databases, or runtime backends are allowed in this repo. External APIs are
allowed only if they are public and do not require secret keys.

### II. GitHub Pages Deployments
Production hosting MUST be GitHub Pages. Deployments MUST run via GitHub Actions
and only from the `main` branch; no manual uploads or alternate branches.

### III. No Server-Side Secrets
No secrets or private keys may be required at runtime. Any build-time variables
MUST be non-sensitive and scoped to static asset generation.

## Hosting & Deployment

- GitHub Pages is the only production hosting target.
- A GitHub Actions workflow publishes the static build to Pages.
- The workflow triggers on `main` and publishes only from `main`.
- Build output is static assets; the output directory is defined in the workflow.

## Development Workflow

- Changes to deployment or hosting MUST update the workflow and this document.
- Any feature requiring a server-side component is out of scope and MUST be
	rejected or redesigned as static.

## Governance

- The constitution is the source of truth for project constraints.
- Amendments require a PR that updates this file, explains rationale, and bumps
	the version per semantic versioning.
- Compliance is reviewed in plans and PRs; any violation requires an explicit
	exception recorded in the plan.

**Version**: 1.0.0 | **Ratified**: 2026-02-10 | **Last Amended**: 2026-02-10
