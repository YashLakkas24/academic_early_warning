# E.A.R.N.

**An AI-powered student intelligence platform that doesn't just flag who's falling behind — it explains why, and shows every student where to go next.**

> **E.A.R.N. = Early Academic Risk & Navigation**

[🚀 Live Demo](https://academic-early-warning-woad.vercel.app) ·
[📂 GitHub](https://github.com/YashLakkas24/academic_early_warning)

---

## 📝 Problem Statement

> _[PLACEHOLDER — paste your original Problem Statement section here]_

## 💡 Solution

> _[PLACEHOLDER — paste your original Solution section here]_

## 🌟 Why E.A.R.N. Is Different

Unlike conventional academic dashboards that focus primarily on
performance monitoring, E.A.R.N. connects academic risk detection
with adaptive interest discovery and personalized student direction.

> _[PLACEHOLDER — if there was more to this section beyond the sentence above, paste it here]_

---

## 🚀 Current Implementation

### Teacher
- Secure teacher login
- Student academic data
- Deterministic Low / Medium / High risk classification
- Risk analytics dashboard
- Student-level drill-down
- AI-generated root-cause explanation
- AI intervention recommendation

### Student
- Secure student login
- Academic profile
- Interest+ assessment
- Adaptive AI-generated questions
- Multiple-choice and free-text responses
- Interest / Confidence / Experience / Capability scoring
- AI-generated strengths
- Skill-gap identification
- Potential career directions
- Personalized next steps

---

## 🧑‍🏫 Teacher Journey

> _[PLACEHOLDER — paste your original Teacher Journey narrative here]_

## 🧑‍🎓 Student Journey

> _[PLACEHOLDER — paste your original Student Journey narrative here]_

---

## 🧠 AI Architecture

E.A.R.N. deliberately separates deterministic computation from generative AI.

### Deterministic Layer
Responsible for:
- Academic risk scoring
- Low / Medium / High classification
- Interest+ quantitative scoring
- Thresholds and measurable signals

### Adaptive Decision Layer
Responsible for:
- Selecting the next Interest+ question
- Avoiding unnecessary questions
- Determining when sufficient information has been collected

### Generative AI Layer
Responsible for:
- Natural-language interpretation
- Free-text understanding
- Root-cause explanations
- Personalized strengths
- Skill-gap explanations
- Career-direction suggestions

**The LLM does not determine the academic risk score. It explains and contextualizes deterministic results.**

The end-to-end narrative:

> Teacher detects risk → deterministic engine explains measurable risk → AI explains root cause → Student explores interests → adaptive AI asks only relevant questions → deterministic scoring builds profile → AI converts it into directions, skill gaps, and next steps.

---

## 🏗️ Architecture

```text
Firebase Authentication
        ↓
Firebase ID Token Verification
        ↓
Role-Based Access Control
```

### A. Frontend
- React + Vite

### B. Backend
- FastAPI

### C. LLM — OpenAI
- Generating contextual Interest+ questions and options
- Interpreting free-text student responses
- Producing root-cause explanations
- Turning quantitative scores into personalized strengths, skill gaps,
  potential directions, and next steps

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Teacher & student interfaces |
| Backend | FastAPI | API layer, business logic |
| Auth | Firebase Authentication | Login, ID token verification, role-based access |
| Database | PostgreSQL (Render) | Persistent storage |
| AI / LLM | OpenAI (`gpt-5.4-mini`) | Adaptive questions, qualitative analysis, root-cause explanations |

---

## 📁 Project Structure

```text
academic_early_warning/
├── ai/
│   ├── data/
│   │   └── students.csv
│   ├── risk_engine/
│   └── ...
│
├── backend/
│   ├── routes/
│   ├── auth_dependencies.py
│   ├── database.py
│   ├── firebase_admin_config.py
│   ├── models.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── firebase.js
│   ├── package.json
│   └── vite.config.js
│
├── requirements.txt
├── create_users.py
├── create_students.py
└── README.md
```

---

## ⚙️ Setup

### Backend

```bash
cd backend
python -m venv venv
```

Windows:

```cmd
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

Then:

```bash
pip install -r ../requirements.txt
PYTHONPATH=.. uvicorn main:app --reload
```

**Environment variables** (`backend/.env`):

```env
OPENAI_API_KEY=your_key_here
```

*(plus your Firebase and database configuration variables)*

### Frontend

```bash
cd frontend
npm install
npm run dev
```

**Environment variables** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:8000
```

Production:

```env
VITE_API_URL=https://academic-early-warning.onrender.com
```

---

## 🌐 Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Render PostgreSQL |
| Authentication | Firebase |
| AI | OpenAI API |

### Production

Frontend: [https://academic-early-warning-woad.vercel.app](https://academic-early-warning-woad.vercel.app)

Backend: [https://academic-early-warning.onrender.com](https://academic-early-warning.onrender.com)

Production start command (Render):

```bash
cd backend && PYTHONPATH=.. uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 🔑 Demo Credentials

### Student

| Student ID | Password |
|---|---|
| STU001 | student001 |
| STU002 | student002 |

### Teacher

| Teacher ID | Password |
|---|---|
| TCH001 | teacher001 |

---

## 🔌 Core API Routes

### Authentication
`POST /api/auth/login`

### Student
`GET /api/students/{student_id}`

### Interest+
`GET /api/students/{student_id}/interests/status`

`POST /api/students/{student_id}/interests`

`POST /api/students/{student_id}/interest-session/start`

`POST /api/students/{student_id}/interest-session/answer`

`GET /api/students/{student_id}/interest-analysis`

`GET /api/students/{student_id}/skill-gap`

`GET /api/students/{student_id}/roadmap`

### Teacher
`GET /api/teacher/analytics`

`GET /api/teacher/students/{student_id}`

---

## 📸 Screenshots

*(Ensure every referenced image below actually exists in `docs/images/` before publishing, or GitHub will show broken images.)*

> _[PLACEHOLDER — paste your original screenshot embeds/section here]_

---

## 💎 Innovation

> _[PLACEHOLDER — paste your original Innovation section here]_

## 📈 Impact

> _[PLACEHOLDER — paste your original Impact section here]_

---

## 🔮 Future Scope

- Parent Console
- Notification Controller / Email Service
- Opportunity Matching Engine
- Institution-wide scaling
- Continuous prediction
- Scholarships / internships integration

> _[PLACEHOLDER — paste the rest of your original Future Scope section here if there was more detail]_

---
