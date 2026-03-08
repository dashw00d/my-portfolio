# Ryan Stefan
Brenham, TX (Remote)  
(737) 205-9226 | ryan@dashwood.net | https://dashwood.net

## Target Role
Entry-Level Python Engineer

## Professional Summary
Hands-on software engineer with 4+ years building production systems across Python, backend APIs, queue workers, and data pipelines. Strong foundation in Python, OOP, async workflows, Git-based development, and pragmatic debugging. Built and operated distributed crawler infrastructure, FastAPI tooling, and Redis/PostgreSQL-backed services with measurable reliability and performance gains.

## Technical Skills
- Languages: Python, TypeScript/JavaScript, PHP, SQL
- Backend: FastAPI, Flask (prior), REST API design, JSON/HTTP, Jinja2 templates
- Data & Storage: PostgreSQL, MySQL, Redis, SQLite
- Distributed Systems: ARQ, Redis Streams, worker pools, retries, queue recovery, graceful shutdown
- Tooling: Git, Docker, Linux, pytest, Ruff
- Core CS: Data structures, algorithms, OOP, concurrency fundamentals

## Professional Experience
### Web Developer & IT Specialist
Austin's Elite Catering | June 2021 - Present
- Served as sole engineer/IT owner for business-critical web and operations systems.
- Migrated and stabilized production infrastructure, including hosting and server operations under outage pressure.
- Built and maintained backend workflows for customer and staff communication using automated email/SMS flows.
- Developed and iterated internal tooling and marketing systems that improved operational speed and reduced manual work.
- Re-platformed and modernized core web properties with maintainability and performance in mind.

### Sole Proprietor / Independent Engineer
Self-Employed | December 2019 - Present
- Designed, built, and maintained custom software and automation tools for business and client workflows.
- Shipped full-stack products end-to-end: requirements, implementation, debugging, deployment, and support.
- Owned technical decision-making, delivery, and iterative improvement in fast-changing environments.

### Marketing Associate / Designer (with software development responsibilities)
Protect America | October 2017 - February 2019
- Built an internal Python/Flask tool that reduced labor time and human error for recurring operational tasks.
- Combined technical and UX improvements to increase efficiency and support organic traffic growth.

## Selected Python Engineering Projects (2026)
### Distributed Crawler Platform (Python, Redis, PostgreSQL, ARQ/Redis Streams)
- Scaled crawler infrastructure to 50 cloud instances with centralized fleet visibility and orchestration workflows.
- Replaced sequential URL fetching with controlled asyncio concurrency (5-wide), reducing crawl time by ~70%.
- Implemented two-phase crawl strategy (probe then deep extract), improving domain coverage speed by ~60% while reducing browser overhead.
- Built atomic Redis state recovery for worker shutdowns, eliminating job-loss scenarios in queue handoff paths.
- Added resilient requeue/recovery endpoint for orphaned Redis Stream jobs, reducing stuck-job incidents by 90%+.

### FastAPI Operations Dashboard for Scraping Workers
- Built a lightweight web UI for worker status, logs, settings, and exports using FastAPI + server-rendered templates.
- Exposed operational endpoints (`/workers`, `/logs`, `/settings`, `/export`) for real-time debugging and control.
- Reduced debugging turnaround by ~70% by centralizing visibility and controls in one interface.

### Worker Architecture Refactors
- Consolidated fragmented worker scripts into a unified task model with consistent interfaces and retry behavior.
- Later simplified queue runtime by replacing heavy abstractions with a focused Redis Streams worker loop.
- Removed 6,000+ lines of worker complexity while improving observability and operational clarity.

## Additional Project Highlights
- Built marketing intelligence pipeline from 15 years of historical staffing logs, contributing to a reported 20x marketing lift.
- Improved web performance in production systems (example: reducing one platform's average page load from ~9s to ~0.8s).

## Education
Equivalent professional software engineering experience through production delivery, systems ownership, and continuous self-directed training.

## Notes for Recruiters
- Open to fully remote teams.
- Comfortable collaborating with senior engineers in code review and agile workflows.
- Available to discuss production code samples and architecture decisions from published engineering writeups.
