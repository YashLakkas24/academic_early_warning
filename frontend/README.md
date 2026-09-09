# 🎓 Academic Early Warning E.A.R.N

### From Early Warning to Early Direction

**An AI-powered student intelligence platform that doesn't just flag who's falling behind — it explains why, and shows every student where to go next.**


## 🎯 Problem We Solve

> Education systems track student **performance** — but rarely understand student **growth**.

| Gap | What Happens Today |
|---|---|
| **Late Intervention** | Academic decline is usually noticed only after poor results — marks, exams, or a failed semester. |
| **No Root-Cause Understanding** | Dashboards show *that* attendance or marks dropped, but never *why*. |
| **Static Career Direction** | Career guidance is typically offered once and treated as permanent, even though student interests evolve constantly. |
| **Opportunity Overload** | Students are flooded with workshop, hackathon, and internship notices with no way to know which ones are actually relevant to them. |

## 💡 Our Solution

A single platform that connects four capabilities most institutions run separately — or not at all:

**01 · AI-Powered Early Risk Detection**
Analyzes attendance, marks, assignments, and performance trends to classify students as **Low / Medium / High risk** before academic failure occurs.

**02 · Root-Cause & Personalized Intervention**
Goes beyond the score — explains *why* a student is struggling and surfaces timely, actionable interventions for teachers.

**03 · AI-Powered Interest & Career Direction**
Understands a student's interests, strengths, skills, and aspirations through **Interest+**, and maps them to suitable directions and skill gaps.

**04 · Dynamic Interest & Opportunity Intelligence**
When a student's interests change, the system preserves history, identifies transferable skills, builds a transition roadmap, and matches relevant workshops, hackathons, and internships.

---

## 🔥 Why This Is Different

Most student platforms stop at a single sentence:

> **"This student is performing poorly."**

Academic Early Warning turns that into a full chain of understanding:

```
Student may be at risk
        ↓
Understand WHY (root-cause analysis)
        ↓
Understand WHAT they're interested in (Interest+)
        ↓
Identify capability & skill gaps
        ↓
Recommend actionable, personalized next steps
```

No other conventional dashboard combines **academic early warning**, **interest discovery**, **adaptive questioning**, and **AI-driven qualitative analysis** into one continuous student journey — most tools do the first and stop.

---

## 👥 Who Uses It?

| Role | Core Experience |
|---|---|
| 👨‍🏫 **Teacher** | Secure login → upload student data → view risk-classified dashboard → drill into any student → see AI-generated root cause → act on suggested intervention. |
| 🎓 **Student** | Secure login → view academic/risk status → take the adaptive Interest+ assessment → receive strengths, skill gaps, potential directions, and next steps. |
| 👪 **Parent** *(supported by the architecture, scoped for future rollout)* | View child's progress, risk alerts, and recommendations. |

---

## 🔄 Complete System Workflow

```mermaid
flowchart TD
    A[User] --> B[Login]
    B --> C[JWT Authentication & Authorization]
    C --> D{Role Detection}
    D -->|Teacher| E[Teacher Flow]
    D -->|Student| F[Student Flow]
    E --> G[Risk Engine + Analytics Dashboard]
    G --> H[Student-Level Detail]
    H --> I[Early Intervention Support]
    F --> J[Interest+ Adaptive Assessment]
    J --> K[Deterministic Scoring + LLM Analysis]
    K --> L[Personalized Growth Path]
```

Both flows are powered by the same backend and the same PostgreSQL data layer — teacher-side risk signals and student-side interest signals live in one connected profile per student, not two disconnected systems.

---

## 🧠 How the AI Works

This is the part most dashboards get vague about, so here's exactly where AI is used — and where it isn't.

### A. Deterministic Processing (rules & math, not the LLM)
- Academic **risk score** calculation from attendance, internal marks, tests, assignment/practical performance, and previous-semester CGPA
- **Low / Medium / High** risk classification via weight/threshold-based rules
- Academic **trend analysis** across terms
- Interest+ **quantitative scoring** (interest, confidence, experience, capability) from structured responses

### B. Adaptive Logic (decision layer, not the LLM)
- Selecting the **next Interest+ question** based on the student's previous answers
- Deciding what information is still missing before a confident profile can be built

### C. LLM — Qwen (qualitative layer)
- Generating **contextual Interest+ questions and options** as the assessment progresses
- Interpreting **free-text student responses** for meaning, not just keywords
- Producing **root-cause explanations** for why a student's risk score looks the way it does
- Turning quantitative scores into **personalized strengths, skill gaps, potential directions, and next steps**

**Why combine all three?** Deterministic scoring keeps the risk classification measurable, auditable, and free of hallucination. Adaptive logic keeps the Interest+ conversation short and relevant instead of a static 30-question form. The LLM is reserved for what LLMs are actually good at — reading nuance in language and turning numbers into a coherent, personalized narrative. None of the three is asked to do the others' job.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph FE["Frontend Layer — React.js + Vite"]
        T["Teacher Console<br/>Upload · Dashboard · Interventions"]
        S["Student Console<br/>Profile · Interest+ · Roadmap"]
        P["Parent Console<br/>Progress · Alerts (planned)"]
    end

    subgraph BE["Backend Layer — FastAPI (Python)"]
        Auth["Authentication & Authorization<br/>JWT · Role-Based Access"]
        RM["User & Profile Management"]
        RE["Report Processing Engine<br/>Validation · Cleaning · Mapping"]
        RAC["Risk & Analysis Controller"]
        NC["Notification Controller"]
    end

    subgraph AI["AI Intelligence Layer"]
        RiskE["Risk Engine<br/>Score + Classification"]
        RootE["Root Cause Engine"]
        IntE["Interest & Direction Engine"]
        SkillE["Skill Gap Engine"]
        OppE["Opportunity Matching Engine"]
        LLM["Qwen LLM<br/>Adaptive Qs · Explanations · Roadmaps"]
    end

    subgraph DB["Data Layer — PostgreSQL"]
        D1[(Users)]
        D2[(Students / Academic Records)]
        D3[(Interest Records)]
        D4[(Quiz Attempts)]
        D5[(Skills & Gaps)]
        D6[(Notices & Recommendations)]
    end

    subgraph EXT["External Services"]
        Mail["Email Service (SMTP)"]
    end

    FE -->|HTTPS / JSON| BE
    BE --> AI
    AI --> LLM
    BE --> DB
    AI --> DB
    BE --> Mail
```

---

## 👨‍🏫 Teacher Journey

```mermaid
flowchart LR
    A["Upload Student Data<br/>(Excel/CSV)"] --> B[Report Processing Engine]
    B --> C["Risk Engine<br/>Attendance + Marks + Trends"]
    C --> D[Risk Score Calculated]
    D --> E{Risk Level}
    E -->|Low| F[Dashboard: Low Risk]
    E -->|Medium| G[Dashboard: Medium Risk]
    E -->|High| H[Dashboard: High Risk]
    F & G & H --> I[Student-Level Detail View]
    I --> J["Root Cause Engine<br/>(LLM Explanation)"]
    J --> K[Recommended Intervention]
```

The teacher never sees a bare number. Every risk score arrives with a classification, a trend, and — where the root cause engine has enough signal — a plain-language explanation of what's driving it.

## 🎓 Student Journey

```mermaid
flowchart TD
    A[Student Login] --> B[Academic Profile + Risk Status]
    B --> C[Start Interest+ Assessment]
    C --> D["LLM Generates Question<br/>(+ options where suitable)"]
    D --> E[Student Responds — choice or text]
    E --> F{Enough Signal?}
    F -->|No| G[Adaptive Logic Picks Next Question]
    G --> D
    F -->|Yes| H["Deterministic Scoring<br/>Interest · Confidence · Experience · Capability"]
    H --> I[LLM Qualitative Analysis]
    I --> J["Strengths + Skill Gaps<br/>+ Potential Directions"]
    J --> K[Personalized Next Steps + Opportunity Matches]
```

<p align="center">
  <img src="/docs/images/Student-journey.png" width="360" alt="Student Journey — screenshot flow"/>
</p>

<p align="center"><sub>The same journey as it appears in-product — see the <a href="#-screenshots--demo">Screenshots</a> section for the full gallery.</sub></p>

---

## 📊 Risk Detection

The Risk Engine consumes each student's academic footprint:

- Attendance
- Internal marks & tests
- Practical / assignment performance
- Previous-semester CGPA
- Academic trend across terms

...and produces a **risk score**, a **Low / Medium / High classification**, and — via the Root Cause Engine — a plain-language explanation of the leading factors, so a teacher isn't left guessing what the number means.

## 💜 Interest+ — Student Interest Discovery

Interest+ is the student-facing counterpart to the risk engine. Instead of a static form, it's a short, adaptive conversation:

1. The LLM generates a question (and options, where a closed response fits better than free text).
2. The student answers — by choice or in their own words.
3. Adaptive logic decides whether enough signal exists yet, or whether a follow-up question is needed.
4. Once complete, deterministic scoring produces **Interest, Confidence, Experience, and Capability** scores.
5. The LLM turns those scores — plus the qualitative responses — into **personalized strengths, skill gaps, potential directions, and next steps.**

If a student's interests shift later, the platform doesn't overwrite the old profile — it preserves the interest history, identifies which skills transfer to the new direction, and generates a fresh transition roadmap.

---
## 🔐 Authentication & Security

* **Firebase Authentication** for secure Student ID / Teacher ID login.
* **Firebase ID tokens** used to verify authenticated sessions.
* **Role-based access control (RBAC)** for Student, Teacher, and Parent access.
* **Protected routes & APIs** with independent backend authorization.
* **Environment variables** used for Firebase, API, and database secrets.
* **Secure ORM-based database access** to reduce injection risks.

---

## 🗄️ Database & Backend

**Backend (FastAPI)** is organized around a handful of responsibilities:
- Authentication & Authorization (Firebase)
- User & Profile Management (students, teachers, parents)
- Report Processing Engine (Excel/CSV validation, cleaning, student mapping)
- Risk & Analysis Controller (risk calculation, trend analysis, root cause)
- Notification Controller (email / in-app alerts)

**Database (PostgreSQL)** holds:
- `Users` — teachers, students, parents
- `Students` — academic info, attendance, marks
- `Interest Records` — history, status, scores, evolution over time
- `Quiz Attempts` — answers, scores, sessions
- `Skills & Gaps` — current skills, identified gaps, levels
- `Recommendations` — matched notices, scores, reasons

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js + Vite, HTML/CSS/JS | Responsive, interactive UI for teachers and students |
| Backend | Python + FastAPI | APIs, business logic, authentication, report processing |
| Database | PostgreSQL | Persistent storage for profiles, academic records, interest data, recommendations |
| AI / LLM | OPEN AI  | Qualitative Interest+ analysis, adaptive question generation, root-cause explanations |
| Scoring Logic | Python (deterministic) | Risk scoring, Interest+ quantitative scoring, trend analysis |
| Authentication | Firebase | Secure, role-aware session management |
| Visualization | Charting library (e.g. Recharts) | Risk trends, performance patterns, dashboards |

---

## 📁 Project Structure
```text
academic-early-warning/
├── ai/                      
│   ├── risk_engine/         
│   └── data/                
│
├── ai_student/              
│   ├── career_pivot/        
│   ├── interest_analysis/   
│   ├── interest_plus/       
│   ├── llm/                 
│   └── quiz/                
│
├── backend/                 
│   ├── routes/              
│   ├── auth_dependencies.py 
│   ├── database.py          
│   ├── firebase_admin_config.py 
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
└── README.md
>

---

⚙️ Installation & Setup

#Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd academic-early-warning
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in your values, see below
```

### 3. Configure PostgreSQL
Create a database and update `DATABASE_URL` in `backend/.env` accordingly.

### 4. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env            # set VITE_API_BASE_URL to your backend URL
```

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/academic_early_warning
JWT_SECRET=your_secret_here
JWT_ALGORITHM=HS256
JWT_EXPIRY_MINUTES=60
QWEN_API_KEY=your_key_here
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

**Frontend (`frontend/.env`)**
```env
VITE_API_BASE_URL=http://localhost:8000
```

> Never commit a real `.env` file. Only `.env.example` with placeholders should be tracked in git.

## ▶️ Running the Project

```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend (in a separate terminal)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

---

## 📸 Screenshots / Demo

A quick visual walkthrough of both the teacher and student sides of E.A.R.N — from login, to risk analytics, to the AI-driven Interest+ journey.

### 🔐 Login

<p align="center">
  <img src="docs/images/login.png" width="380" alt="Login Screen"/>
</p>

<p align="center"><i>Role-aware login — students and teachers sign into the same platform through separate, secure flows.</i></p>

<br/>

### 👨‍🏫 Teacher Side — Risk Detection & Analytics

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/images/teacher-dashboard.jpeg" alt="Teacher Home"/><br/>
      <sub><b>Teacher Home</b> — "Turn Academic Signals Into Action"</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/images/risk-analysis.jpeg" alt="Academic Risk Analytics"/><br/>
      <sub><b>Academic Risk Analytics</b> — risk distribution & drill-down by High / Medium / Low</sub>
    </td>
  </tr>
</table>

<br/>

### 🎓 Student Side — Dashboard & Interest+ Discovery

<table>
  <tr>
    <td width="50%" align="center">
      <img src="docs/images/student-dashboard.jpeg" alt="Student Dashboard"/><br/>
      <sub><b>Student Workspace</b> — academic snapshot + AI-generated interest profile</sub>
    </td>
    <td width="50%" align="center">
      <img src="docs/images/interest-plus.png" alt="Interest+ Adaptive Questioning"/><br/>
      <sub><b>Interest+ Discovery</b> — adaptive interest selection that drives follow-up questions</sub>
    </td>
  </tr>
</table>

<br/>

### 🗺️ End-to-End Student Journey

<p align="center">
  <img src="docs/images/student-journey.png" width="420" alt="Student Journey Flow"/>
</p>

<p align="center"><i>Login → Dashboard → Select Interest → Interest+ AI Assessment → Adaptive Questions → AI Analysis (interest, confidence, experience, capability, strengths, skill gaps) → Skill Gap Analysis → Personalized Roadmap.</i></p>



## 🏆 Innovation & Competitive Advantage

Academic early-warning tools exist. Career-interest quizzes exist. What's uncommon is combining them on the **same student profile, in real time**:

- Risk detection and interest discovery aren't bolted-on features — they share the same student record and the same platform, so an intervention can be informed by both *what's failing* and *what the student actually cares about*.
- Interest+ is **adaptive**, not a fixed questionnaire — the next question depends on the last answer, so students spend less time on irrelevant questions.
- The system explicitly separates **deterministic scoring** from **LLM interpretation**, keeping risk classification measurable and auditable while still giving students a genuinely personalized, human-readable narrative.
- Interest **history is preserved**, not overwritten — if a student pivots, the platform tracks transferable skills instead of starting from zero.

---

## 🌍 Impact

**For Teachers**
- Identify at-risk students earlier, before results decline
- Prioritize which students need intervention first, backed by an explanation, not just a number

**For Students**
- Understand personal strengths and skill gaps in plain language
- Discover potential directions aligned with actual interests, not a one-time career test
- Receive concrete, personalized next steps instead of generic advice

**For Institutions**
- Move from reactive, post-result academic support to earlier, data-driven intervention
- Combine academic monitoring and student development on one platform instead of two disconnected systems

---

## 🔮 Future Scope

### 01 · Continuous Predictive Academic Intelligence

Continuously update student data such as attendance, marks, assessments, and engagement to detect emerging risk patterns in near real time and enable early intervention before academic performance declines significantly.

### 02 · Adaptive AI & Personalized Development

Continuously adapt assessments, skill-gap analysis, learning recommendations, and career roadmaps as a student's interests, skills, responses, and academic progress evolve over time.

### 03 · Parent–Teacher Early Intervention

Enable secure communication between teachers and parents when a student's academic performance shows significant or persistent risk, allowing timely alerts, discussions, and coordinated support for the student.

### 04 · Scalable Student Intelligence

As the platform expands across institutions, integrate personalized opportunities such as internships, scholarships, hackathons, competitions, and research programs based on each student's interests, skills, and career goals.



---

## 👨‍💻 Team — Teen Titans

| Name |
|---|
| Vaibhav Kulkarni |
| Yash Lakkas |
| Isha Samant |

*(Add GitHub profile links here.)*

## 📄 License

This project is available under the [MIT License](LICENSE). *(Add a `LICENSE` file if this applies to your submission.)*
