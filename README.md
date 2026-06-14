# CodeJudge — Scalable Online Judge & Remote Code Execution Engine

A full-stack modern web application for developers to solve algorithmic challenges, write code in an integrated browser editor, and execute it securely against hidden test cases.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Modules](#core-modules)
- [Tech Stack](#tech-stack)
- [Infrastructure](#infrastructure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Communication Flow](#communication-flow)
- [Project Structure](#project-structure)

## Overview

CodeJudge is a comprehensive developer platform that enables:

- **Problem Solving:** Solve complex data structures and algorithmic challenges through an integrated online judge system.
- **Remote Code Execution:** Securely compile and execute code across multiple runtimes inside isolated sandbox container blocks.
- **Real-time Evaluation:** Automated validation of user scripts against strict hidden test cases with execution telemetry metrics (Runtime/Memory tracking).
- **Integrated Editor:** Full-featured code editing experience inside a highly responsive workspace.
- **User Identity Tracking:** Secure session monitoring, validation checkpoints, and historical submission metrics.

## Architecture

┌───────────────────────────────────────────────────────┐
│ Client (Browser) │
│ Next.js (App Router) · Tailwind CSS │
└──────────────────────┬────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│ Next.js API Layer │
│ Better-Auth · Prisma ORM · RESTful API Controllers │
└─────────┬─────────────────────────────┬─────────────────┘
│ │
▼ ▼
┌──────────────────┐ ┌────────────────────┐
│ Business Logic │ │ Execution Engine │
│ │ │ │
│ Problems │ │ Judge0 API Worker │
│ Submissions │ │ (Docker Container) │
└────────┬─────────┘ └──────────┬─────────┘
│ │
│ Data Persistence │
└────────────┬───────┘
│
▼
┌──────────────────┐
│ PostgreSQL │
│ │
│ Prisma Models │
└──────────────────┘

Key patterns:

- **Asynchronous Sandboxing:** Restricts untrusted compilation workflows away from core application APIs using containerized worker layers.
- **Centralized Identity Management:** Cookie-based state persistence leveraging Better-Auth engine pipelines.
- **Type-Safe Data Flow:** Full structural end-to-end type schema handling mapped across PostgreSQL via Prisma backend clients.

## Core Modules

### 1. Coding Workspace & Editor

| Category  | Details                                                    |
| :-------- | :--------------------------------------------------------- |
| **Logic** | Language routing controllers, template injection utilities |
| **Stack** | Next.js Client Components · Extended Coding Editor         |

A robust system for developer compilation. Supports split-view workspace execution, custom starter configurations, and live error log outputs.

### 2. Algorithmic Problem Matrix

| Category  | Details                                           |
| :-------- | :------------------------------------------------ |
| **Logic** | ProblemController · TestCase Configuration Models |
| **Stack** | Next.js API Matrix · Prisma System Client         |

Interactive online judge dashboard component. Hosts challenges cataloged by performance complexity tiers (Easy, Medium, Hard) coupled with dynamic variable restrictions.

### 3. Submission Engine

| Category   | Details                                                       |
| :--------- | :------------------------------------------------------------ |
| **Logic**  | Submission Validation Model · Remote Code Pipeline            |
| **Status** | Accepted · Wrong Answer · Time Limit Exceeded · Runtime Error |

Interprets code payloads, pipes structural evaluation configurations into isolated containers, verifies expected parameters, and tracks historical data tables.

### 4. User Identity

| Category  | Details                                              |
| :-------- | :--------------------------------------------------- |
| **Logic** | Session Handling Services · Route Shield Middlewares |
| **Stack** | Better-Auth Core · Session Database Storage          |

Comprehensive verification layers tracking execution records, authenticated sub-routes, and protected entry validations.

## Tech Stack

| Layer                      | Technology                            |
| :------------------------- | :------------------------------------ |
| **Frontend Framework**     | Next.js (App Router Router) + React   |
| **Language**               | TypeScript                            |
| **Styling**                | Tailwind CSS + UI Layout Primitives   |
| **Database Engine**        | PostgreSQL                            |
| **Data Access Layer**      | Prisma ORM                            |
| **Code Isolation Sandbox** | Judge0 API Engine (Docker Deployment) |
| **Authentication Wrapper** | Better-Auth                           |

## Infrastructure

The platform is designed with isolated cloud microservices patterns:

- **API Gateway & Core Server:** Vercel/Next.js hosted controllers tracking app views and database connections.
- **Persistent Cache & Data:** Relational tables utilizing optimized indexing parameters.
- **Compute Workers:** Isolated local instances utilizing Docker containers to execute shell code parameters safely away from parent systems.

External dependencies required:

- PostgreSQL Instance
- Local Docker Workspace Engine

## Getting Started

### Prerequisites

- Node.js 18+ / 20+
- PostgreSQL Engine
- Docker Instance Active

### Installation & Execution

1. **Clone the repository directory structure**

```bash
   git clone [https://github.com/yourusername/code-judge.git](https://github.com/yourusername/code-judge.git)
   cd code-judge
   npm install
Spin up container networks

Bash
   docker-compose up -d
Synchronize schemas and inject starter files

Bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
Launch development environment

Bash
   npm run dev
Environment Variables
Variable	Description	Default
DATABASE_URL	PostgreSQL Server Link URI Connection	—
NEXT_PUBLIC_JUDGE0_URL	Code Compiler Endpoint Target Route	http://localhost:2358
BETTER_AUTH_SECRET	System Secure Key Validation Token	—
BETTER_AUTH_URL	Application Development Target Base URL	http://localhost:3000
Communication Flow
Plaintext
User Submission (Click "Run Code" Pipeline)
  │
  ▼
Next.js Frontend Workspace UI
  │  POST Request Execution Pipeline Payload
  ▼
Next.js API Gateway Middleware (Auth Verification)
  │  Session Validated & Payload Forwarded
  ├──► Database Validation
  │       │
  │       ├─ Prisma Query Mapper
  │       │     └─ Fetch Hidden Test Parameters (PostgreSQL)
  │       │
  │       ├─ Microservice Router
  │       │     └─ Stream Code Payload to Judge0 Docker Sandbox
  │       │
  │       └─ Telemetry Tracker
  │             └─ Log Memory Usage, Runtime, and Status Result
  │
  └──► Interactive Frontend Refresh
           │
           └─ Real-time Output Terminal UI Rendering
Project Structure
Plaintext
code-judge/
├── prisma/             # Structural Schema Configs, Seed Definitions & Migrations
├── public/             # System Media Assets
├── src/
│   ├── app/            # System Core Route Architecture Layouts (App Router)
│   ├── components/     # Code Editor Workspace Views & Presentation Layers
│   ├── lib/            # Configuration Client Hubs (Prisma, Better-Auth Connectors)
│   └── api/            # API Route Gateway Controllers (Auth, Problems, Submissions)
└── README.md
License
MIT License — Copyright (c) 2026.

upload this project in my github rep and also in read.md the avobe text should be present and remeber the the credentials in .env file should not be shown to  anyone
```
