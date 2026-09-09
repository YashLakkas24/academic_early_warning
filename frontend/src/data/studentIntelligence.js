/**
 * studentIntelligence.js
 * ----------------------------------------------------------------
 * Mock data for the Student Navigation Intelligence layer of E.A.R.N.
 *
 * IMPORTANT: everything in this file is illustrative/demo data, clearly
 * labeled as such in the UI. It is shaped so a real backend response
 * (e.g. from the adaptive Gemini-driven interest discovery flow) could
 * replace it without changing how components consume it.
 *
 * Each entry in `directions` carries its OWN skillAssessment,
 * transferableSkills, skillGaps and roadmap — this is what lets the UI
 * update every downstream panel the moment a student selects a
 * different potential direction.
 */

export const student = {
  id: "demo-student-01",
  name: "Alex",
  currentInterest: "Public Speaking",
  existingSkills: ["Python", "Data Analysis", "Communication", "Presentation"],
  previousInterests: ["Data Visualization"],
};

export const interestAnalysis = {
  interest: "Public Speaking",
  interestStrength: 0.8,
  confidence: 0.5,
  experience: 0.6,
  capability: 0.6,
  strengths: [
    "Comfortable structuring an argument for an audience",
    "Consistent motivation across multiple sessions",
  ],
  developmentAreas: [
    "Confidence in unscripted / live settings",
    "Limited exposure outside MUN and debate",
  ],
  evidence: [
    "Described public speaking as \"the part of the week I look forward to most.\"",
    "Mentioned MUN and debate participation across two responses.",
    "Showed hesitation when asked about impromptu speaking situations.",
  ],
  whyThisMatters:
    "The student shows strong motivation toward public speaking but has limited practical experience and developing confidence. This suggests a development opportunity rather than a lack of suitability.",
};

/**
 * The Adaptive Discovery journey shown in the Navigation Journey pathway.
 * `title` is the stage name; `description` is what appears on hover/click.
 * This copy intentionally avoids implying a fixed question sequence.
 */
export const navigationJourneyStages = [
  {
    id: "interest",
    title: "Interest",
    description: "The student shares what genuinely interests them, in their own words.",
  },
  {
    id: "discovery",
    title: "Adaptive Discovery",
    description:
      "Up to 5 adaptive questions. Gemini dynamically selects the next question based on what the student has already revealed — there is no fixed question sequence.",
  },
  {
    id: "analysis",
    title: "Interest Analysis",
    description:
      "Interpret interest strength, confidence, experience and development needs from the student's responses.",
  },
  {
    id: "direction",
    title: "Direction",
    description: "Explore potential directions using interests, evidence and existing skills.",
  },
  {
    id: "skills",
    title: "Skills",
    description: "Understand what the student already brings, independent of the chosen direction.",
  },
  {
    id: "transferable",
    title: "Transferable Skills",
    description: "Recognize existing skills that can support a change in direction.",
  },
  {
    id: "gap",
    title: "Skill Gap",
    description: "Compare current capabilities with what the selected direction requires.",
  },
  {
    id: "roadmap",
    title: "Roadmap",
    description: "Turn the selected direction into a practical, personalized next-step plan.",
  },
];

/**
 * Potential directions. Selecting one (in the UI) swaps the active
 * skillAssessment / transferableSkills / skillGaps / roadmap shown
 * further down the page.
 */
export const directions = [
  {
    id: "tpm",
    name: "Technical Product Management",
    alignment: 82,
    whyItFits: ["Communication interest", "Analytical background", "Presentation experience"],
    readiness: 65,
    topSkillGap: "Product Strategy",
    skillAssessment: {
      alreadyHave: ["Python", "Data Analysis", "Communication", "Presentation"],
      developing: ["Product Thinking"],
      needToBuild: ["Product Strategy", "User Research", "Product Analytics"],
    },
    transferableSkills: [
      {
        skill: "Communication",
        sourceContext: "Public speaking & presentation",
        transferableTo: "Stakeholder communication",
        explanation: "Structuring an argument for an audience maps directly onto pitching a product decision to stakeholders.",
      },
      {
        skill: "Data Analysis",
        sourceContext: "Coursework & assignments",
        transferableTo: "Data-driven decision making",
        explanation: "Reading and interpreting data is the same underlying skill a PM uses to justify a roadmap decision.",
      },
      {
        skill: "Presentation",
        sourceContext: "MUN / debate",
        transferableTo: "Product storytelling",
        explanation: "Presenting a case persuasively transfers to telling a clear product narrative.",
      },
      {
        skill: "Python",
        sourceContext: "Technical coursework",
        transferableTo: "Technical understanding",
        explanation: "Working knowledge of code builds credibility when collaborating closely with engineering teams.",
      },
    ],
    skillGaps: [
      { skill: "Communication", current: 8, target: 8, priority: false },
      { skill: "Data Analysis", current: 7, target: 7, priority: false },
      { skill: "Product Strategy", current: 2, target: 8, priority: true },
      { skill: "User Research", current: 1, target: 8, priority: true },
      { skill: "Product Analytics", current: 3, target: 7, priority: true },
    ],
    roadmap: [
      {
        step: 1,
        title: "Strengthen Product Thinking",
        skill: "Product Thinking",
        status: "in-progress",
        description: "Learn how product decisions connect user needs, business goals and technical constraints.",
        activity: "Work through 2–3 product-teardown exercises on existing apps the student already uses.",
        effort: "1–2 weeks",
      },
      {
        step: 2,
        title: "Learn User Research",
        skill: "User Research",
        status: "not-started",
        description: "Understand how to gather and interpret real user feedback before building.",
        activity: "Run a small 5-person interview study on a class project or campus tool.",
        effort: "2 weeks",
      },
      {
        step: 3,
        title: "Build a Product Case Study",
        skill: "Product Strategy",
        status: "not-started",
        description: "Practice framing a product decision the way a PM would present it.",
        activity: "Write a one-page case study proposing a change to a familiar app, with reasoning.",
        effort: "1 week",
      },
      {
        step: 4,
        title: "Apply Skills in a Real Project",
        skill: "Product Analytics",
        status: "not-started",
        description: "Bring the pieces together in a setting with real constraints and real feedback.",
        activity: "Join a hackathon or student project as the product-focused contributor.",
        effort: "Ongoing",
      },
    ],
  },
  {
    id: "tech-comm",
    name: "Technical Communication",
    alignment: 76,
    whyItFits: ["Strong presentation instinct", "Comfort explaining ideas", "Debate background"],
    readiness: 70,
    topSkillGap: "Technical Writing",
    skillAssessment: {
      alreadyHave: ["Communication", "Presentation", "Data Analysis"],
      developing: ["Simplifying Technical Concepts"],
      needToBuild: ["Technical Writing", "Documentation Systems", "API Literacy"],
    },
    transferableSkills: [
      {
        skill: "Presentation",
        sourceContext: "MUN / debate",
        transferableTo: "Explaining technical concepts to non-technical audiences",
        explanation: "The same clarity used to win an argument helps make a complex feature understandable.",
      },
      {
        skill: "Communication",
        sourceContext: "Public speaking",
        transferableTo: "Audience-aware writing",
        explanation: "Reading a room translates into writing docs that anticipate a reader's confusion.",
      },
      {
        skill: "Data Analysis",
        sourceContext: "Coursework",
        transferableTo: "Explaining data & metrics clearly",
        explanation: "Understanding data helps communicate what a metric actually means to a broader audience.",
      },
    ],
    skillGaps: [
      { skill: "Communication", current: 8, target: 8, priority: false },
      { skill: "Presentation", current: 8, target: 8, priority: false },
      { skill: "Technical Writing", current: 2, target: 8, priority: true },
      { skill: "Documentation Systems", current: 1, target: 6, priority: true },
      { skill: "API Literacy", current: 2, target: 6, priority: true },
    ],
    roadmap: [
      {
        step: 1,
        title: "Practice Simplifying Technical Concepts",
        skill: "Simplifying Technical Concepts",
        status: "in-progress",
        description: "Build the habit of translating something technical into plain language.",
        activity: "Rewrite 3 technical README files into beginner-friendly explanations.",
        effort: "1 week",
      },
      {
        step: 2,
        title: "Learn Technical Writing Fundamentals",
        skill: "Technical Writing",
        status: "not-started",
        description: "Understand structure, tone and precision expected in technical documentation.",
        activity: "Complete a short technical writing exercise for an open-source project.",
        effort: "2 weeks",
      },
      {
        step: 3,
        title: "Get Comfortable with Documentation Systems",
        skill: "Documentation Systems",
        status: "not-started",
        description: "Learn the tools technical writers actually use day to day.",
        activity: "Recreate a small docs site using a common documentation framework.",
        effort: "1 week",
      },
      {
        step: 4,
        title: "Apply Skills in a Real Project",
        skill: "API Literacy",
        status: "not-started",
        description: "Document a real API or feature end-to-end.",
        activity: "Volunteer to write docs for a classmate's or open-source project's API.",
        effort: "Ongoing",
      },
    ],
  },
  {
    id: "dev-advocacy",
    name: "Developer Advocacy",
    alignment: 71,
    whyItFits: ["Enjoys public speaking", "Technical foundation", "Community-oriented"],
    readiness: 58,
    topSkillGap: "Developer Community Building",
    skillAssessment: {
      alreadyHave: ["Communication", "Presentation", "Python"],
      developing: ["Public Technical Speaking"],
      needToBuild: ["Developer Community Building", "Content Creation", "Live Demos"],
    },
    transferableSkills: [
      {
        skill: "Presentation",
        sourceContext: "MUN / debate",
        transferableTo: "Conference & meetup speaking",
        explanation: "Presenting confidently to an audience is the core skill developer advocates rely on.",
      },
      {
        skill: "Python",
        sourceContext: "Technical coursework",
        transferableTo: "Building demo projects",
        explanation: "A working technical foundation makes it possible to build credible live demos.",
      },
      {
        skill: "Communication",
        sourceContext: "Public speaking",
        transferableTo: "Community engagement",
        explanation: "The same comfort engaging an audience helps in building and supporting a developer community.",
      },
    ],
    skillGaps: [
      { skill: "Communication", current: 8, target: 8, priority: false },
      { skill: "Python", current: 6, target: 7, priority: false },
      { skill: "Developer Community Building", current: 1, target: 7, priority: true },
      { skill: "Content Creation", current: 2, target: 7, priority: true },
      { skill: "Live Demos", current: 2, target: 8, priority: true },
    ],
    roadmap: [
      {
        step: 1,
        title: "Build Public Technical Speaking Confidence",
        skill: "Public Technical Speaking",
        status: "in-progress",
        description: "Practice presenting technical material, not just persuasive arguments.",
        activity: "Give a short technical lightning talk at a class or student meetup.",
        effort: "1–2 weeks",
      },
      {
        step: 2,
        title: "Start Creating Technical Content",
        skill: "Content Creation",
        status: "not-started",
        description: "Learn to explain a technical concept in writing or video for a wider audience.",
        activity: "Publish one technical blog post or short video walkthrough.",
        effort: "2 weeks",
      },
      {
        step: 3,
        title: "Practice Live Demos",
        skill: "Live Demos",
        status: "not-started",
        description: "Build comfort demoing working software live, including handling things going wrong.",
        activity: "Demo a small personal project live to a small group, unscripted.",
        effort: "1 week",
      },
      {
        step: 4,
        title: "Engage a Developer Community",
        skill: "Developer Community Building",
        status: "not-started",
        description: "Start participating in — and eventually contributing to — a real developer community.",
        activity: "Answer questions or contribute a small fix in an open-source community.",
        effort: "Ongoing",
      },
    ],
  },
];

export const defaultDirectionId = directions[0].id;
