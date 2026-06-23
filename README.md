# 🏥 AI Clinical Documentation Assistant (CareScribe)

> **Ambient AI clinical scribe** — records consultations, transcribes with speaker labels, generates SOAP notes, suggests billing codes, and exports to EHR in one click.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://docker.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploys-blue.svg)](https://vercel.com)

---

## 📋 Table of Contents

- [📖 Introduction](#-introduction)
- [💡 Why This Exists](#-why-this-exists)
- [🔄 How It Works](#-how-it-works)
- [✅ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Quick Start (Docker - Easiest & Recommended)](#-quick-start-docker---easiest--recommended)
- [💻 Manual Local Setup (Without Docker)](#-manual-local-setup-without-docker)
- [🔧 Environment Variables Configuration](#-environment-variables-configuration)
- [☁️ Vercel & Cloud Deployment Guide (Non-IT Friendly)](#%EF%B8%8F-vercel--cloud-deployment-guide-non-it-friendly)
- [🏁 First-Time App Setup & Doctor Workflow](#-first-time-app-setup--doctor-workflow)
- [📁 Project Structure](#-project-structure)
- [🗄️ Database Schema](#-database-schema)
- [💰 Cost Estimate](#-cost-estimate)

---

## 📖 Introduction

The **AI Clinical Documentation Assistant** is an ambient AI scribe system designed for physicians, specialists, and telemedicine providers. It eliminates the documentation burden that consumes 2–3 hours of a physician's day — letting doctors focus on patients, not paperwork.

The system listens to doctor-patient conversations, transcribes them with labeled speakers, automatically generates structured **SOAP clinical notes**, suggests **ICD-10 and CPT billing codes** with confidence scores, and exports finalized notes in **FHIR R4 format** for direct EHR integration.

> ⚕️ **Important Disclaimer:** This system is a documentation assistance tool only. It is not a diagnostic system. All AI-generated content requires physician review and approval before clinical use. The physician remains the sole decision-maker for all clinical judgments.

---

## 💡 Why This Exists

Physicians currently spend **2–3 hours per day** on documentation, contributing to eye-contact loss during consultation, delayed chart completion, and severe administrative burnout.

**The solution:** AI listens and drafts. The physician reviews and approves in one click.

Compared to a human medical scribe (~$3,000/month), this system costs approximately **$90-100/month** in server/API usage — a saving of **~$2,900/month per physician**.

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
| 🐳 Docker containerization (Scribe + Transcriber) | ✅ Complete |

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Audio Transcription | AssemblyAI REST API / Whisper API |
| Note Generation | Gemini 2.5 Flash |
| ICD-10 + CPT Extraction | Gemini 2.5 Flash |
| Scribe Interface (All-in-One) | Next.js 16 (React 19) + Prisma |
| Authentication | Better Auth |
| Database | PostgreSQL (e.g. Neon.tech PostgreSQL cloud) |
| UI Components | Shadcn UI + Tailwind CSS |
| EHR Export Format | FHIR R4 DocumentReference |
| Containerization | Docker + Docker Compose |

---

## 🚀 Quick Start (Docker - Easiest & Recommended)

This is the easiest setup method. It installs and runs the entire system in containers with a single command. **No programming knowledge required.**

### Step 1: Install Prerequisites
Before you start, download and install:
1. **Docker Desktop** (Click "Next" through the installer): [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Step 2: Download the Project
1. Download this project folder as a ZIP file and extract it.
2. Open your terminal (PowerShell on Windows, or Terminal on Mac).
3. Navigate into the folder:
   ```bash
   cd CareScribe
   ```

### Step 3: Configure Environment Keys
1. Create a file named `.env` in the root folder.
2. Paste the following line, replacing with your AssemblyAI Key:
   ```env
   ASSEMBLYAI_API_KEY="your-assemblyai-key-here"
   ```
3. Open the `auth-app` folder, find `.env` (create it if missing), and fill out:
   ```env
   DATABASE_URL="postgresql://neondb_owner:password@ep-xxxxx.neon.tech/neondb?sslmode=require"
   BETTER_AUTH_SECRET="some-random-long-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-google-gemini-key-here"
   ```
   *(See [Environment Variables Configuration](#-environment-variables-configuration) below for details on how to get these keys).*

### Step 4: Build and Start
Run the following command in your terminal:
```bash
docker compose up --build
```
> ⏱️ The first build will take 5-8 minutes as it downloads dependencies. Future starts will take less than 15 seconds.

### Step 5: Open the Application
Open your browser and navigate to:
* **http://localhost:3000** (Auth + Admin + Scribe Workspace)

To stop the application at any time, press `Ctrl + C` in the terminal, or run:
```bash
docker compose down
```

---

## 💻 Manual Local Setup (Without Docker)

Use this method if you want to run the project files directly on your local computer's native processor.

### Step 1: Install Prerequisites
* **Node.js** (v20 or higher): [Download Node.js](https://nodejs.org)
* **Python** (v3.11 or higher): [Download Python](https://python.org)

### Step 2: Set up the Database & UI
Navigate to the `auth-app` directory in your terminal and install packages:
```bash
cd auth-app
npm install
npx prisma generate
npx prisma db push
cd ..
```
*Note: `npx prisma db push` automatically connects to your Neon database and creates all tables.*

### Step 3: Set up the Transcription server
Navigate to the `whisper-server` directory, create a Python environment, and install dependencies:
```bash
cd whisper-server
python -m venv venv

# Activate Virtual Environment:
# On Windows:
venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
cd ..
```

### Step 4: Start both services
You will need **two separate terminal windows** open:

* **Terminal 1 (Transcription Server)**:
  ```bash
  cd whisper-server
  # Activate venv first: venv\Scripts\activate (Windows) or source venv/bin/activate (Mac)
  python transcribe_server.py
  ```
* **Terminal 2 (Next.js Scribe Application)**:
  ```bash
  cd auth-app
  npm run dev
  ```

Open your browser to **http://localhost:3000** to log in.

---

## 🔧 Environment Variables Configuration

Create the following files in their respective folders to provide keys to the application.

### `auth-app/.env` (Next.js Application Keys)
```env
# 1. Neon PostgreSQL Database Connection (obtained from neon.tech dashboard)
DATABASE_URL="postgresql://neondb_owner:npg_zcr09XsplknW@ep-wild-cherry-aqfpp343.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require"

# 2. Authentication Secret (Generate by running `openssl rand -base64 32` in terminal)
BETTER_AUTH_SECRET="secure-random-base64-key"
BETTER_AUTH_URL="http://localhost:3000"

# 3. Google Gemini API Key (obtained from Google AI Studio)
GEMINI_API_KEY="AIzaSy..."

# 4. Resend Email Configurations (optional, for notifications)
RESEND_API_KEY="re_..."
EMAIL_SENDER_NAME="CareScribe AI"
EMAIL_SENDER_ADDRESS="onboarding@resend.dev"
```

### `.env` (Root directory - used by Docker)
```env
ASSEMBLYAI_API_KEY="your-assembly-ai-api-key"
```

---

## ☁️ Vercel & Cloud Deployment Guide (Non-IT Friendly)

Since the scribe interface and authentication are fully unified inside `auth-app`, deploying to the cloud is simple.

### Part A: Deploying the Database (Neon)
1. Go to [neon.tech](https://neon.tech) and sign up for a free account.
2. Click **Create Project**.
3. Copy the **Connection String** shown in the dashboard. This is your `DATABASE_URL`.

### Part B: Uploading to GitHub
Vercel integrates seamlessly with GitHub. To upload your code:
1. Create a free account on [GitHub.com](https://github.com).
2. Download [GitHub Desktop](https://desktop.github.com/) (easiest for non-technical users).
3. Log in, select **Add Local Repository**, choose your `CareScribe` folder, and click **Publish Repository** (make sure to check "Keep this code private").

### Part C: Deploying to Vercel
1. Sign up/Log in to [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Configure Project Settings**:
   * **Framework Preset**: `Next.js`
   * **Root Directory**: Click Edit, select the **`auth-app`** folder, and save.
5. **Add Environment Variables**:
   Under **Environment Variables**, add the following keys from your `auth-app/.env` file:
   * `DATABASE_URL` (your Neon connection string)
   * `BETTER_AUTH_SECRET` (generate a fresh key)
   * `BETTER_AUTH_URL` (e.g. `https://your-project.vercel.app`)
   * `NEXT_PUBLIC_APP_URL` (same as above)
   * `GEMINI_API_KEY` (your Google Gemini key)
   * `TRANSCRIBION_PROVIDER` -> `whisper_local`
   * `WHISPER_LOCAL_URL` -> Set to the address of your hosted whisper-server (e.g., on Fly.io, Railway, or VPS).
6. Click **Deploy**. Vercel will build and launch your application in under 3 minutes!

---

## 🏁 First-Time App Setup & Doctor Workflow

1. Go to **http://localhost:3000/login** (or your Vercel URL).
2. Log in with the default admin account:
   * **Email**: `admin@clinic.com`
   * **Password**: `Admin123!` *(or default password configured in seed data)*
3. Navigate to **Admin Panel** → **Doctors** → **Add Doctor** to create doctor credentials.
4. Log out, then log back in using the created doctor's email.
5. Go to the **Dashboard** and click **New Encounter** to start recording!

---

## 📁 Project Structure

Following our frontend consolidation, the repository is structured into two clean sub-projects:

```
CareScribe/
├── docker-compose.yml           ← Orchestrates both containers
├── README.md
│
├── whisper-server/              ← Python audio transcription backend
│   ├── transcribe_server.py     ← FastAPI endpoints using AssemblyAI API
│   ├── Dockerfile.assemblyai    ← Docker recipe for transcription server
│   └── requirements.txt
│
└── auth-app/                    ← Next.js 16 Web UI Workspace
    ├── Dockerfile               ← Docker recipe for the main Next.js app
    ├── package.json
    ├── prisma/
    │   └── schema.prisma        ← Database schema definitions
    └── src/app/
        ├── scribe/              ← Ambient audio capturing & SOAP note editor
        ├── dashboard/           ← Doctor patient-record logs
        ├── admin/               ← Admin doctor credentials management
        └── api/encounters/      ← SOAP note saves, FHIR exports, & audit log handlers
```

---

## 🗄️ Database Schema

CareScribe maps data models using Prisma ORM:

* **User**: Doctors or administrators, specifying credential security and clinic roles.
* **Encounter**: Records active patient sessions, capture duration, and completion statuses.
* **Transcript**: Stores full consultations with labeled speaker turn-taking transcripts.
* **ClinicalNote**: Holds draft and approved SOAP notes, ICD-10/CPT codes, and certainty highlights.
* **AuditLog**: Keeps chronological records of doctor approvals for regulatory tracking.

---

## 💰 Cost Estimate

Estimated monthly costs for a clinic seeing **20 patients per day**:

* **AssemblyAI (Transcription)**: ~$70.00
* **Gemini API (SOAP + Coding)**: ~$0.09
* **Neon Cloud Database**: Free Tier / $19.00
* **Hosting (Vercel / VPS)**: Free Tier / $15.00
* **Total Estimated Cost**: **~$90.00 - $100.00 / month** (Saves ~$2,900 compared to human scribes).
