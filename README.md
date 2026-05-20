# 🏥 AI Clinical Documentation Assistant

> **Ambient AI clinical scribe** — records consultations, transcribes with speaker labels, generates SOAP notes, suggests billing codes, and exports to EHR in one click.


[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://docker.com)

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Why This Exists](#-why-this-exists)
- [How It Works](#-how-it-works)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [API Keys Required](#api-keys-required)
  - [Method 1 — Local Development](#method-1--local-development)
  - [Method 2 — Docker (Recommended)](#method-2--docker-recommended)
- [Environment Variables](#-environment-variables)
- [First Time Setup](#-first-time-setup)
- [Build and Test](#-build-and-test)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Cost Estimate](#-cost-estimate)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 📖 Introduction

The **AI Clinical Documentation Assistant** is an ambient AI scribe system designed for physicians, specialists, and telemedicine providers. It eliminates the documentation burden that consumes 2–3 hours of a physician's day — letting doctors focus on patients, not paperwork.

The system listens to doctor-patient conversations, transcribes them with labeled speakers, automatically generates structured **SOAP clinical notes**, suggests **ICD-10 and CPT billing codes** with confidence scores, and exports finalized notes in **FHIR R4 format** for direct EHR integration.

> **The physician always remains in full control.** The AI assists documentation — it never diagnoses, prescribes, or makes autonomous clinical decisions.

---

## 💡 Why This Exists

Physicians currently spend **2–3 hours per day** on documentation, contributing to:

| Problem | Impact |
|---|---|
| Manual note-taking during consultations | Reduced eye contact and patient rapport |
| Post-visit documentation burden | Delayed chart completion |
| Excessive EHR navigation | Physician burnout |
| Administrative overhead | **$125 billion** lost annually across the US |

**The solution:** AI listens and drafts. The physician reviews and approves in one click.

Compared to a human medical scribe (~$3,000/month), this system costs approximately **$90-100/month** — a saving of **~$2,900/month per physician**.

---

## 🔄 How It Works

```
Doctor starts recording
        ↓
Audio captured in browser (ambient listening)
        ↓
AssemblyAI transcribes with Doctor / Patient speaker labels
        ↓
Gemini 2.5 Flash generates structured SOAP note
        ↓
ICD-10 + CPT billing codes extracted with confidence scores
        ↓
Doctor reviews, checks uncertain content, edits if needed
        ↓
Doctor clicks Approve
        ↓
FHIR R4 file generated → inserted into EHR system
```

---

## ✅ Features

| Feature | Status |
|---|---|
| 🎙️ Ambient audio capture | ✅ Complete |
| 🗣️ Real-time transcription with Doctor/Patient speaker labels | ✅ Complete |
| 📝 SOAP note generation (Subjective, Objective, Assessment, Plan) | ✅ Complete |
| 🏷️ ICD-10 diagnosis codes with confidence scoring | ✅ Complete |
| 💰 CPT billing codes with confidence scoring | ✅ Complete |
| ⚠️ Highlight uncertain / AI-assumed content | ✅ Complete |
| ✔️ Physician review + one-click approval workflow | ✅ Complete |
| 📤 FHIR R4 EHR export | ✅ Complete |
| 🗂️ Session management + encounter history | ✅ Complete |
| 📋 Audit logging | ✅ Complete |
| 👤 Admin panel with doctor management | ✅ Complete |
| 🔐 Role-based authentication (Admin / Doctor) | ✅ Complete |
| 🔄 Auto-refresh dashboards | ✅ Complete |
| 💬 Tooltip descriptions on billing code chips | ✅ Complete |
| 🐳 Docker containerization | ✅ Complete |

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Audio Transcription | AssemblyAI REST API |
| Note Generation | Gemini 2.5 Flash |
| ICD-10 + CPT Extraction | Gemini 2.5 Flash |
| Uncertainty Highlighting | Gemini 2.5 Flash |
| Transcription Server | Python FastAPI |
| Scribe Frontend (OpenScribe) | Next.js 16, port 3001 |
| Auth + Admin App | Next.js 16 + Better Auth + Prisma |
| Database | Neon.tech PostgreSQL |
| UI Components | Shadcn UI + Tailwind CSS |
| EHR Export Format | FHIR R4 DocumentReference |
| Containerization | Docker + Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

Install the following software before you begin.

| Software | Version | Download |
|---|---|---|
| Node.js | v20 or higher | https://nodejs.org |
| Python | 3.11 or higher | https://python.org |
| pnpm | v10.23.0 | Run: `npm install -g pnpm@10.23.0` |
| Docker Desktop | Latest | https://docker.com/products/docker-desktop |
| Git | Latest | https://git-scm.com |

---

### API Keys Required

You need accounts and API keys from the following services before running the application.

| Service | What It Does | Where to Get Your Key |
|---|---|---|
| **AssemblyAI** | Transcribes audio with speaker labels | https://assemblyai.com |
| **Gemini API** | Generates SOAP notes + billing codes | https://ai.google.dev |
| **Neon PostgreSQL** | Hosts the application database | https://neon.tech |
| **Resend** *(optional)* | Sends email notifications | https://resend.com |

> 💡 **Tip:** Neon PostgreSQL has a free tier that is sufficient for development and small clinics.

---

### Method 1 — Local Development

Use this method if you want to run the application directly on your machine without Docker.

**Step 1 — Clone the repository**

```bash
git clone <your-repo-url>
cd clinical-scribe
```

**Step 2 — Set up the Auth App**

```bash
cd auth-app
npm install
npx prisma generate
npx prisma db push
cd ..
```

> ℹ️ `prisma db push` creates all the database tables in your Neon PostgreSQL database. Make sure your `DATABASE_URL` is set in `auth-app/.env` before running this step (see [Environment Variables](#-environment-variables)).

**Step 3 — Set up the OpenScribe Frontend**

```bash
cd frontend
pnpm install
cd ..
```

**Step 4 — Set up the Transcription Server**

```bash
cd whisper-server
python -m venv venv

# On Windows:
venv\Scripts\activate

# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

**Step 5 — Configure your environment files**

See the [Environment Variables](#-environment-variables) section below and create the required `.env` files.

**Step 6 — Start all three services** (open 3 separate terminal windows)

```bash
# Terminal 1 — Transcription Server
cd whisper-server
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
python transcribe_server.py

# Terminal 2 — OpenScribe UI (Scribe Frontend)
cd frontend
pnpm dev

# Terminal 3 — Auth App (Login + Admin)
cd auth-app
npm run dev
```

**Step 7 — Open the application**

| App | URL |
|---|---|
| Auth + Admin App | http://localhost:3000 |
| OpenScribe Scribe UI | http://localhost:3001 |

---

### Method 2 — Docker (Recommended)

Use this method to run everything in containers with a single command. Best for consistent environments and team deployments.

**Step 1 — Clone the repository**

```bash
git clone <your-repo-url>
cd clinical-scribe
```

**Step 2 — Configure environment files**

See the [Environment Variables](#-environment-variables) section below and create all required `.env` files before building.

**Step 3 — Build and start all services**

```bash
docker-compose build
docker-compose up
```

> ⏱️ The first build may take 5–10 minutes as Docker downloads dependencies. Subsequent starts are much faster.

**Step 4 — Open the application**

| App | URL |
|---|---|
| Auth + Admin App | http://localhost:3000 |
| OpenScribe Scribe UI | http://localhost:3001 |

To stop all services:

```bash
docker-compose down
```

---

## 🔧 Environment Variables

Create the following `.env` files exactly as shown. Replace placeholder values with your actual API keys.

### `auth-app/.env`

```env
DATABASE_URL="postgresql://your-neon-connection-string"
BETTER_AUTH_SECRET="your-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_your_resend_key"
EMAIL_SENDER_NAME="ClinicalScribe"
EMAIL_SENDER_ADDRESS="onboarding@resend.dev"
GEMINI_API_KEY="AIza_your_gemini_key"
```

### `frontend/apps/web/.env.local`

```env
GEMINI_API_KEY="AIza_your_gemini_key"
TRANSCRIPTION_PROVIDER="whisper_local"
WHISPER_LOCAL_URL="http://127.0.0.1:8000/v1/audio/transcriptions"
WHISPER_LOCAL_MODEL="assemblyai/base"
WHISPER_LOCAL_BACKEND="openai"
WHISPER_LOCAL_TIMEOUT_MS="120000"
WHISPER_LOCAL_MAX_RETRIES="1"
NEXT_PUBLIC_SECURE_STORAGE_KEY="your-base64-encoded-32-byte-key"
```

### `.env` (root — used by Docker)

```env
ASSEMBLYAI_API_KEY=your-assemblyai-api-key
```

> ⚠️ **Security reminder:** Never commit `.env` files to version control. Add them to `.gitignore`.

---

## 🏁 First Time Setup

After the application is running for the first time, follow these steps to create your first users.

1. Go to http://localhost:3000/login
2. Log in with the default admin account: `admin@clinic.com`
3. Navigate to **Admin Panel → Doctors → Add Doctor**
4. Create doctor accounts by entering: name, email, and password
5. The doctor can now log in at http://localhost:3000/login
6. Doctor navigates to the **Dashboard** and clicks **New Encounter** to begin recording

### Complete Doctor Workflow

Once set up, a typical encounter follows these steps:

1. Doctor logs in → sees **Dashboard** with full encounter history
2. Doctor clicks **New Encounter** → OpenScribe opens at port 3001
3. Doctor clicks **Start Recording** at the start of the patient consultation
4. System captures audio → AssemblyAI transcribes with **Doctor / Patient** speaker labels
5. Recording stops → Gemini generates a complete **SOAP clinical note** automatically
6. **ICD-10** diagnosis codes appear as blue chips with confidence scores
7. **CPT** billing codes appear as purple chips with confidence scores
8. Doctor clicks **Check Uncertain** to highlight any AI assumptions that need review
9. Doctor edits the note if needed → clicks **Approve**
10. Dashboard updates automatically → encounter status changes to **APPROVED**
11. Doctor clicks **⬇ FHIR** to download the FHIR R4 file for EHR insertion
12. Admin can view all encounters across all doctors in the **Admin Panel**

---

## 🧪 Build and Test

### Running in Development Mode

```bash
# Auth App
cd auth-app && npm run dev

# OpenScribe Frontend
cd frontend && pnpm dev

# Transcription Server
cd whisper-server && python transcribe_server.py
```

### Building for Production

```bash
# Auth App
cd auth-app && npm run build

# OpenScribe Frontend
cd frontend && pnpm build
```

### Database Management

```bash
# Generate Prisma client after schema changes
cd auth-app && npx prisma generate

# Push schema changes to database
cd auth-app && npx prisma db push

# Open Prisma Studio (visual database browser)
cd auth-app && npx prisma studio
```

### Docker Commands

```bash
# Build all containers
docker-compose build

# Start all services (foreground)
docker-compose up

# Start all services (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild a single service
docker-compose build whisper-server
```

---

## 📁 Project Structure

```
clinical-scribe/
├── .env                              ← Root Docker env (ASSEMBLYAI_API_KEY)
├── docker-compose.yml                ← Orchestrates all 3 services
│
├── whisper-server/
│   ├── transcribe_server.py          ← AssemblyAI FastAPI transcription server
│   ├── requirements.txt              ← Python dependencies
│   ├── Dockerfile                    ← Original GPU Dockerfile (DO NOT USE)
│   └── Dockerfile.assemblyai         ← Dockerfile for AssemblyAI (use this one)
│
├── frontend/                         ← OpenScribe monorepo (pnpm)
│   ├── package.json                  ← Root monorepo package.json
│   ├── pnpm-lock.yaml
│   ├── apps/web/
│   │   ├── src/app/
│   │   │   ├── actions.ts            ← Note generation + DB save + ICD/CPT logic
│   │   │   └── page.tsx              ← Main recording UI
│   │   ├── Dockerfile                ← OpenScribe Docker build
│   │   └── next.config.mjs           ← Imports from config/
│   ├── packages/pipeline/render/src/components/
│   │   └── note-editor.tsx           ← Approve + Check Uncertain buttons
│   └── config/
│       └── next.config.mjs           ← output: standalone, CSP config
│
└── auth-app/                         ← Authentication + Admin app
    ├── Dockerfile                    ← Auth-app Docker build
    ├── next.config.ts                ← output: standalone
    ├── prisma/
    │   └── schema.prisma             ← Database schema definition
    ├── prisma.config.ts              ← Prisma configuration
    └── src/app/
        ├── admin/
        │   ├── page.tsx              ← Admin dashboard with real DB data
        │   └── doctors/page.tsx      ← Doctor management (create/activate)
        ├── dashboard/
        │   └── (overview)/page.tsx   ← Doctor dashboard
        ├── (auth)/
        │   └── login/                ← Login page
        └── api/encounters/
            ├── save/route.ts         ← Save encounter + ICD + CPT codes
            ├── approve/route.ts      ← Approve note + write audit log
            ├── fhir-export/route.ts  ← Generate FHIR R4 export
            └── highlight-uncertain/route.ts  ← AI uncertainty detection
```

---

## 🗄️ Database Schema

The application uses five core models in PostgreSQL via Prisma.

| Model | Key Fields | Description |
|---|---|---|
| `User` | `role: "admin" \| "doctor"` | All system users with role-based access |
| `Encounter` | `patientName`, `status`, `duration` | Individual patient consultation sessions |
| `Transcript` | `content` | Full Doctor/Patient labeled transcription text |
| `ClinicalNote` | `aiGeneratedContent`, `finalContent`, `icdCodes`, `cptCodes`, `status` | SOAP note with DRAFT/APPROVED status |
| `AuditLog` | `userId`, `encounterId`, `action` | Immutable record of all NOTE_APPROVED actions |

---

## 💰 Cost Estimate

Estimated monthly cost for a clinic seeing approximately **20 patients per day**.

| Service | Monthly Cost |
|---|---|
| AssemblyAI (transcription) | ~$70 |
| Gemini API (note generation + coding) | ~$0.09 |
| Neon PostgreSQL | Free tier / $19 |
| Hosting (Railway or VPS) | ~$15 |
| **Total** | **~$90-100/month** |

**Compared to a human clinical scribe:** ~$3,000/month
**Monthly savings per physician: ~$2,900**

---

## 🗺️ Roadmap

### ✅ Current (MVP — All Complete)
Ambient audio, real-time transcription, SOAP note generation, ICD-10/CPT coding, physician review workflow, FHIR R4 export, session management, audit logging, admin panel, role-based auth, Docker support.

### 🔜 Phase 2
- Epic FHIR R4 live integration (registration at [open.epic.com](https://open.epic.com))
- Editable CPT code suggestions
- Specialty-specific note templates (cardiology, orthopedics, pediatrics, etc.)
- Medication reconciliation

### 🔮 Phase 3
- Multi-hospital deployment and tenant management
- Advanced analytics dashboard for administrators
- Multi-agent clinical workflows
- Longitudinal patient memory across visits
- Care coordination automation

---

## 🤝 Contributing

We welcome contributions from clinicians, developers, and healthcare administrators.

### How to Contribute

1. **Fork** the repository
2. Create a **feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit** your changes with clear messages: `git commit -m "Add specialty template for cardiology"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request** with a description of what you changed and why

### Reporting Issues

Open an issue in Azure DevOps with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Screenshots if applicable

### Clinical Accuracy

If you are a clinician and notice any issues with note generation quality, ICD-10/CPT code accuracy, or FHIR R4 compliance — please open an issue with details. Clinical accuracy is the highest priority.

---

### API References

| Service | Documentation |
|---|---|
| AssemblyAI | https://www.assemblyai.com/docs |
| Gemini API | https://ai.google.dev/docs |
| FHIR R4 | https://hl7.org/fhir/R4 |
| Neon PostgreSQL | https://neon.tech/docs |
| Better Auth | https://better-auth.com/docs |
| Prisma | https://www.prisma.io/docs |

---

> **⚕️ Important Disclaimer:** This system is a documentation assistance tool only. It is not a diagnostic system. All AI-generated content requires physician review and approval before clinical use. The physician remains the sole decision-maker for all clinical judgments.
