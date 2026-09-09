# 🎓 E.A.R.N.

### From Early Warning to Early Direction

**An AI-powered student intelligence platform that doesn't just flag who's falling behind — it explains why, and shows every student where to go next.**

> **E.A.R.N. = Early Academic Risk & Navigation**

[🚀 Live Demo](https://academic-early-warning-woad.vercel.app) · [📂 GitHub Repository](https://github.com/YashLakkas24/academic_early_warning)

---

## 🎯 Problem Statement

> Education systems track student **performance** — but rarely understand student **growth**.

| Gap | What Happens Today |
|---|---|
| **Late Intervention** | Academic decline is usually noticed only after poor results — marks, exams, or a failed semester. |
| **No Root-Cause Understanding** | Dashboards can show that attendance or marks are low, but do not explain the underlying academic signals clearly enough for timely action. |
| **Static Career Direction** | Career guidance is often treated as a one-time decision, even though student interests and capabilities can evolve. |
| **Disconnected Student Development** | Academic performance and student interests are commonly handled as separate systems instead of being viewed as part of the same student journey. |

---

## 💡 Solution

E.A.R.N. connects **academic early warning** with **student interest discovery and personalized direction** on one platform.

### 01 · AI-Powered Early Risk Detection

The system analyzes academic signals such as attendance, internal marks, tests, assignments, practical performance, and previous-semester CGPA to classify students into **Low, Medium, or High academic risk**.

### 02 · Root-Cause & Personalized Intervention

Risk classification is calculated deterministically so that the result remains measurable and auditable. When a teacher opens a student's detailed view, AI is used to explain the leading factors and provide a concise intervention recommendation.

### 03 · Interest+ Student Discovery

Students complete an adaptive **Interest+** assessment that combines structured responses and free-text answers to build a profile around:

- Interest
- Confidence
- Experience
- Capability
- Strengths
- Skill gaps
- Potential directions

### 04 · Personalized Next Steps

The resulting profile is converted into potential directions and personalized next steps rather than giving the student a generic career-test result.

---

## 🌟 Why E.A.R.N. Is Different

Unlike conventional academic dashboards that focus primarily on performance monitoring, E.A.R.N. connects **academic risk detection**, **adaptive interest discovery**, and **personalized student direction**.

The platform creates a continuous chain:

```text
Student may be at academic risk
              ↓
Understand measurable academic signals
              ↓
Explain the leading root causes
              ↓
Understand student interests and capabilities
              ↓
Identify skill gaps and potential directions
              ↓
Recommend personalized next steps
```

The key architectural principle is that **deterministic scoring and generative AI have different responsibilities**.

---

## 🚀 Current Implementation

### 👨‍🏫 Teacher

- Secure teacher authentication
- Student academic profiles
- Deterministic Low / Medium / High risk classification
- Risk analytics dashboard
- Student-level drill-down
- AI-generated root-cause explanation
- AI-generated intervention recommendation

### 🎓 Student

- Secure student authentication
- Academic profile
- Interest+ assessment
- Adaptive AI-generated questions
- Multiple-choice and free-text responses
- Interest / Confidence / Experience / Capability scoring
- AI-generated strengths
- Skill-gap identification
- Potential directions
- Personalized next steps / roadmap

---

## 🔄 How It Works

### Teacher Flow

```text
Teacher Login
      ↓
Student Academic Data
      ↓
Deterministic Risk Engine
      ↓
Low / Medium / High Risk
      ↓
Teacher Analytics Dashboard
      ↓
Select Student
      ↓
AI Root-Cause Analysis
      ↓
Intervention Recommendation
```

### Student Flow

```text
Student Login
      ↓
Academic Profile
      ↓
Select Interest
      ↓
Interest+ Assessment
      ↓
Adaptive Questions
      ↓
Student Responses
      ↓
Deterministic Scoring
      ↓
AI Qualitative Analysis
      ↓
Strengths + Skill Gaps
      ↓
Potential Directions
      ↓
Personalized Next Steps
```

---

## 🧠 AI Architecture

E.A.R.N. deliberately separates deterministic computation, adaptive decision-making, and generative AI.

### A. Deterministic Layer

Responsible for measurable calculations:

- Academic risk score calculation
- Low / Medium / High risk classification
- Interest+ quantitative scoring
- Interest, confidence, experience, and capability scores
- Thresholds and measurable academic signals

### B. Adaptive Decision Layer

Responsible for deciding what information is needed next:

- Selecting the next Interest+ question
- Using previous answers to guide subsequent questions
- Avoiding unnecessary questions
- Determining when sufficient information has been collected

### C. Generative AI Layer — OpenAI

Responsible for qualitative reasoning and natural-language generation:

- Generating contextual Interest+ questions and suitable response options
- Interpreting free-text student responses
- Producing teacher-facing root-cause explanations
- Generating personalized strengths
- Interpreting skill gaps
- Suggesting potential directions
- Generating personalized next steps

> **The LLM does not determine the academic risk score.** Risk classification remains deterministic; the LLM explains and contextualizes the result.

### End-to-End Intelligence

```text
Teacher detects risk
        ↓
Deterministic engine calculates measurable risk
        ↓
AI explains root cause
        ↓
Student explores interests
        ↓
Adaptive AI asks relevant questions
        ↓
Deterministic scoring builds the student profile
        ↓
AI converts the profile into directions,
skill gaps, and personalized next steps
```

---

## 🏗️ System Architecture

```text
                    ┌───────────────────────┐
                    │     React + Vite      │
                    │       Frontend        │
                    └───────────┬───────────┘
                                │
                           HTTPS / JSON
                                │
                                ▼
                    ┌───────────────────────┐
                    │    FastAPI Backend    │
                    │                       │
                    │ Auth · APIs · Logic   │
                    └───────┬───────┬───────┘
                            │       │
                   ┌────────┘       └────────┐
                   ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │     PostgreSQL      │   │     OpenAI API      │
        │                     │   │                     │
        │ Users               │   │ Adaptive Questions  │
        │ Students            │   │ Free-text Analysis  │
        │ Interests           │   │ Root Cause          │
        │ Quiz Answers        │   │ Personalized Output │
        │ Interest Analysis   │   │                     │
        └─────────────────────┘   └─────────────────────┘

                    Firebase Authentication
                              │
                              ▼
                    Firebase ID Token
                              │
                              ▼
                    Backend Authorization
```

### Application Layers

**Frontend**
- React
- Vite
- Role-specific teacher and student interfaces

**Backend**
- Python
- FastAPI
- Authentication and authorization
- Student data APIs
- Interest+ session management
- AI orchestration
- Risk and analysis logic

**AI**
- OpenAI
- Adaptive question generation
- Qualitative analysis
- Root-cause explanations
- Personalized student insights

**Database**
- PostgreSQL
- Persistent student, academic, interest, quiz, and analysis data

---

## 🔐 Authentication & Security

- **Firebase Authentication** for student and teacher login
- **Firebase ID tokens** for authenticated API requests
- **Role-based access control (RBAC)** for student and teacher access
- Protected frontend routes
- Backend authorization checks
- Environment variables for API keys and service credentials
- SQLAlchemy ORM for database access

---

## 🗄️ Database

PostgreSQL is used as the persistent application database.

### Core Tables

| Table | Purpose |
|---|---|
| `users` | Student and teacher accounts, names, and roles |
| `students` | Student academic profile and core academic information |
| `student_interests` | Selected student interests |
| `quiz_answers` | Interest+ assessment responses |
| `interest_analysis` | Generated Interest+ analysis and resulting profile |

The academic AI dataset used by the risk engine is maintained separately under:

```text
ai/data/students.csv
```

This allows the AI risk-analysis pipeline to work with the required academic signals without unnecessarily expanding the core `students` database model.

---

## 📊 Academic Risk Detection

The Risk Engine uses academic signals including:

- Attendance
- Internal marks
- Assignment performance
- Test performance
- Practical performance
- Previous-semester CGPA
- Hackathon / extracurricular signals where applicable

The deterministic engine produces:

```text
Risk Score
    ↓
Low / Medium / High Classification
    ↓
Teacher Analytics
```

AI is used separately for the selected-student explanation and intervention layer.

This separation keeps the core risk classification **consistent, measurable, and auditable**.

---

## 💜 Interest+ — Student Interest Discovery

Interest+ is the student-facing adaptive assessment.

Instead of presenting a long static questionnaire:

1. The student selects a primary interest.
2. The backend starts an Interest+ session.
3. AI generates a contextually relevant question.
4. The student responds through a structured choice or free text.
5. The system stores the response.
6. The adaptive process continues until the required assessment is complete.
7. Deterministic scoring calculates **Interest, Confidence, Experience, and Capability**.
8. OpenAI generates qualitative analysis.
9. The student receives strengths, skill gaps, potential directions, and personalized next steps.

The resulting analysis is stored so the student's Interest+ profile can be retrieved later.

---

## 🔌 Core API Routes

### Authentication

```text
POST /api/auth/login
```

### Student

```text
GET  /api/students/{student_id}
```

### Interest+

```text
GET  /api/students/{student_id}/interests/status

POST /api/students/{student_id}/interests

POST /api/students/{student_id}/interest-session/start

POST /api/students/{student_id}/interest-session/answer

GET  /api/students/{student_id}/interest-analysis

GET  /api/students/{student_id}/career-directions

GET  /api/students/{student_id}/skill-gap

GET  /api/students/{student_id}/roadmap

POST /api/students/{student_id}/career-pivot/analyze
```

### Teacher

```text
GET /api/teacher/analytics
```

The Teacher Analytics endpoint calculates the deterministic risk distribution for the student dataset. AI analysis is generated when a teacher opens an individual student's detailed view, reducing unnecessary model calls.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite | Teacher and student interfaces |
| Backend | Python + FastAPI | APIs, business logic, authentication |
| Authentication | Firebase Authentication | Login and ID token verification |
| Database | PostgreSQL | Persistent application data |
| AI / LLM | OpenAI `gpt-5.4-mini` | Adaptive questions, qualitative analysis, root-cause explanations |
| Scoring | Python | Deterministic academic and Interest+ scoring |
| Deployment | Vercel + Render | Frontend and backend hosting |

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

## ⚙️ Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Firebase project
- OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/YashLakkas24/academic_early_warning.git
cd academic_early_warning
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
```

**Windows:**

```cmd
venv\Scripts\activate
```

**macOS / Linux:**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r ../requirements.txt
```

Run the backend locally:

```bash
PYTHONPATH=.. uvicorn main:app --reload
```

On Windows CMD, if required:

```cmd
set PYTHONPATH=..
uvicorn main:app --reload
```

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:8000
```

---

## 🔑 Environment Variables

### Backend

Create the required backend environment configuration for:

```text
DATABASE_URL
OPENAI_API_KEY
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
```

The Firebase service-account credentials are loaded through environment variables rather than committing a Firebase service-account JSON file to the repository.

### Frontend

Create:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://academic-early-warning.onrender.com
```

> **Never commit real API keys, database passwords, Firebase private keys, or other secrets.**

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

**Frontend:**  
[https://academic-early-warning-woad.vercel.app](https://academic-early-warning-woad.vercel.app)

**Backend:**  
[https://academic-early-warning.onrender.com](https://academic-early-warning.onrender.com)

### Render Start Command

```bash
cd backend && PYTHONPATH=.. uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## 🔑 Demo Credentials

> These accounts are intended for project evaluation and demonstration.

### Student

| Student ID | Password |
|---|---|
| `STU001` | `student001` |
| `STU002` | `student002` |

### Teacher

| Teacher ID | Password |
|---|---|
| `TCH001` | `teacher001` |

---

## 📸 Screenshots

### 🔐 Login

<p align="center">
  <img src="docs/images/login.png" width="380" alt="E.A.R.N. Login Screen"/>
</p>

<p align="center">
  <i>Role-aware login for students and teachers.</i>
</p>

---

### 👨‍🏫 Teacher — Risk Detection & Analytics

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/images/teacher-dashboard.jpeg" alt="Teacher Dashboard"/><br/>
      <sub><b>Teacher Dashboard</b> — Academic signals and student overview</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/images/risk-analysis.jpeg" alt="Academic Risk Analytics"/><br/>
      <sub><b>Academic Risk Analytics</b> — High / Medium / Low risk distribution</sub>
    </td>
  </tr>
</table>

---

### 🎓 Student — Dashboard & Interest+

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/images/student-dashboard.jpeg" alt="Student Dashboard"/><br/>
      <sub><b>Student Workspace</b> — Academic profile and student insights</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/images/interest-plus.png" alt="Interest Plus Adaptive Assessment"/><br/>
      <sub><b>Interest+ Assessment</b> — Adaptive interest discovery</sub>
    </td>
  </tr>
</table>

---

### 🗺️ End-to-End Student Journey

<p align="center">
  <img src="docs/images/student-journey.png" width="420" alt="E.A.R.N. Student Journey"/>
</p>

<p align="center">
  <i>
  Login → Dashboard → Select Interest → Interest+ Assessment →
  Adaptive Questions → AI Analysis → Skill Gaps →
  Potential Directions → Personalized Next Steps
  </i>
</p>

---

## 💎 Innovation

### 1. Academic Risk + Student Direction

E.A.R.N. does not treat academic performance and student interests as completely separate problems. The platform brings both into the same student journey.

### 2. Deterministic Risk + Generative AI

The academic risk classification is deterministic and measurable, while AI is used for interpretation and personalization.

This avoids making an LLM responsible for a critical numerical classification while still using AI where natural-language reasoning provides value.

### 3. Adaptive Interest Discovery

Interest+ is not designed as a fixed questionnaire. Questions are generated based on the information being collected, allowing the assessment to remain focused on the student's responses.

### 4. From Detection to Direction

The platform extends beyond:

> "This student may be at risk."

It aims to answer:

> "Why is this happening, what does the student care about, what capabilities do they have, and what could they do next?"

---

## 📈 Impact

### For Teachers

- Identify students requiring attention earlier
- Prioritize students using measurable risk classification
- Understand the leading academic signals behind a student's risk
- Receive concise intervention recommendations

### For Students

- Understand their academic profile
- Discover interests and capabilities
- Identify skill gaps
- Explore potential directions
- Receive personalized next steps rather than generic advice

### For Institutions

- Move toward earlier, data-driven intervention
- Connect academic monitoring with student development
- Build a foundation for more personalized student support

---

## 🔮 Future Scope

### 01 · Continuous Predictive Academic Intelligence

Continuously update attendance, marks, assessments, and engagement data to detect emerging risk patterns in near real time.

### 02 · Adaptive AI & Personalized Development

Continue adapting assessments, skill-gap analysis, learning recommendations, and career roadmaps as student interests, skills, and academic progress evolve.

### 03 · Parent–Teacher Early Intervention

Enable secure parent–teacher communication when a student's academic performance shows significant or persistent risk.

### 04 · Opportunity Intelligence

Extend the platform to match students with relevant:

- Internships
- Scholarships
- Hackathons
- Competitions
- Workshops
- Research opportunities

### 05 · Institution-Wide Scaling

Support larger student populations and integrate E.A.R.N. with institutional academic systems for continuous student intelligence.

---

## 👨‍💻 Team — Teen Titans

| Name | Role | Profile / Portfolio |
| :--- | :--- | :--- |
| Vaibhav Kulkarni | Member | [GitHub / Portfolio](https://github.com/VaibhavCodes26) |
| Yash Lakkas | Lead | [GitHub / Portfolio](https://github.com/YashLakkas24) |
| Isha Samant | Member | [GitHub / Portfolio](https://github.com/IshaSamant04) |

---

## 📄 License

This project is intended for hackathon / academic project use.

If the repository includes an `MIT License` file, this section can be changed to:

> This project is licensed under the [MIT License](LICENSE).
