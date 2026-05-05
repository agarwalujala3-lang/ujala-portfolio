window.UJOS_DATA = {
  profile: {
    name: "Ujala Agarwal",
    shortName: "Ujala",
    title: "Cloud, AI, and product engineer",
    location: "India",
    github: "https://github.com/agarwalujala3-lang",
    linkedin: "https://www.linkedin.com/in/ujala-agarwal-30aa28283/",
    email: "agarwalujala3@gmail.com",
    phone: "+91 7906786403",
    tagline:
      "I built this portfolio as an adaptive, repo-verified space for cloud systems, AI tools, and product-grade delivery.",
    resumes: [
      {
        label: "General Resume",
        href: "Ujala_Agarwal_Resume.pdf",
        note: "Use this if you want a balanced overview of my work.",
      },
      {
        label: "Software Resume",
        href: "Ujala_Agarwal_Resume_Software.pdf",
        note: "Best fit if you are hiring me for software engineering roles.",
      },
      {
        label: "Cloud Resume",
        href: "Ujala_Agarwal_Resume_Cloud.pdf",
        note: "Use this if you want my AWS and cloud work highlighted first.",
      },
      {
        label: "Frontend Resume",
        href: "Ujala_Agarwal_Resume_Frontend.pdf",
        note: "Best fit if you want to see my interface and product-facing work.",
      },
    ],
  },
  modes: {
    recruiter: {
      label: "Recruiter",
      kicker: "Fast Route",
      heroTitle: "See my strongest proof in two minutes.",
      heroLead:
        "This route removes noise and shows the most important things first: live products, deployed systems, and the project work that best represents how I build.",
      summary:
        "Use this view if you want a fast read on my projects, stack, and role fit.",
      highlights: [
        "Live deployed projects",
        "AWS + AI + full-stack proof",
        "Resume routing by role",
      ],
      focus: ["ReceiptPulse", "Safety Copilot", "LumenStack AI", "Resume pack"],
      projectOrder: ["receiptpulse", "safety-copilot", "lumenstack", "cloud-attendance"],
      picoGreeting:
        "Recruiter route ready. I'll keep this fast, clear, and proof-first.",
    },
    engineer: {
      label: "Engineer",
      kicker: "Systems Route",
      heroTitle: "Open the architecture, the tradeoffs, and the real proof.",
      heroLead:
        "This route is for how things work. I focus on event flows, analysis logic, deployment choices, and why I structured each build the way I did.",
      summary:
        "Use this view if you care more about systems and decisions than polished summaries.",
      highlights: [
        "Architecture breakdowns",
        "Deployment links + repos",
        "Project tradeoffs and next steps",
      ],
      focus: ["System flows", "Code proof", "Deployment paths", "Tradeoffs"],
      projectOrder: ["lumenstack", "receiptpulse", "cloud-attendance", "safety-copilot"],
      picoGreeting:
        "Engineer route locked. I'll point you toward flows, internals, and code proof.",
    },
    founder: {
      label: "Founder",
      kicker: "Product Route",
      heroTitle: "See how I turn technical systems into product experiences.",
      heroLead:
        "This route is about execution quality. I highlight product feel, interface decisions, deployment, and how quickly I can turn an idea into something usable.",
      summary:
        "Use this view if you care about product thinking, polish, and speed of execution.",
      highlights: [
        "Product-first project framing",
        "Design + engineering overlap",
        "Memorable UI with live proof",
      ],
      focus: ["Product thinking", "Live demos", "Cloud execution", "Cross-platform delivery"],
      projectOrder: ["safety-copilot", "receiptpulse", "lumenstack", "cloud-attendance"],
      picoGreeting:
        "Founder route online. I'll show you how I think about product feel and shipping quality.",
    },
    friend: {
      label: "Friend",
      kicker: "Human Route",
      heroTitle: "See the person behind the systems.",
      heroLead:
        "This route is lighter and more personal. I use it to show the journey, the curiosity behind my work, and the projects that shaped how I build now.",
      summary:
        "Use this view if you want the story, the personality, and the human side of the portfolio.",
      highlights: [
        "Journey and learning path",
        "Current build momentum",
        "Projects with real deployment proof",
      ],
      focus: ["Journey", "Learning", "Current products", "Contact"],
      projectOrder: ["safety-copilot", "receiptpulse", "lumenstack", "cloud-attendance"],
      picoGreeting:
        "Friend route feels warmer. I'll show the story, not just the scorecard.",
    },
  },
  signals: [
    {
      label: "Flagship Builds",
      value: "4",
      note: "GitHub-backed projects across AWS, AI, and product engineering work",
    },
    {
      label: "Primary Track",
      value: "AWS",
      note: "serverless systems, APIs, event-driven flows, and deployment",
    },
    {
      label: "Style",
      value: "Product + System",
      note: "I prefer building things that work deeply and still feel polished on screen",
    },
  ],
  projects: [
    {
      enabled: true,
      id: "receiptpulse",
      title: "ReceiptPulse",
      kind: "Flagship System",
      status: "Live",
      priority: 100,
      featured: true,
      lensPriority: {
        recruiter: 100,
        engineer: 95,
        founder: 92,
        friend: 78,
      },
      accent: "cyan",
      icon: "RP",
      iconImage: "https://raw.githubusercontent.com/agarwalujala3-lang/ReceiptPulse/main/branding/portfolio-brand-mark.svg",
      lockupImage: "https://raw.githubusercontent.com/agarwalujala3-lang/ReceiptPulse/main/branding/portfolio-brand-lockup.svg",
      badge: "Flagship AWS build",
      theme: {
        surface1: "rgba(251, 245, 236, 0.96)",
        surface2: "rgba(243, 233, 218, 0.94)",
        ring: "rgba(191, 162, 130, 0.2)",
        glow: "rgba(227, 178, 125, 0.2)",
        glowSoft: "rgba(179, 211, 186, 0.2)",
        accentStrong: "#98643f",
        accentSoft: "rgba(152, 100, 63, 0.12)",
        badgeBg: "rgba(152, 100, 63, 0.1)",
        badgeBorder: "rgba(152, 100, 63, 0.2)",
        proofBg: "linear-gradient(135deg, rgba(233, 182, 129, 0.18), rgba(176, 210, 184, 0.14))",
        signalBg: "rgba(239, 246, 250, 0.84)",
        signalBorder: "rgba(151, 179, 197, 0.22)",
        iconBg: "linear-gradient(145deg, rgba(242, 248, 252, 1), rgba(222, 236, 245, 0.98))",
      },
      repoSync: {
        repo: "ReceiptPulse",
        manifestPath: "portfolio-branding.json",
        manifestRequired: true,
      },
      summary:
        "I built ReceiptPulse as a live AWS receipt workspace where each signed-in user can upload receipts, extract structured fields, resolve duplicates, rename labels, and manage the results inside a private dashboard.",
      proof:
        "This project proves event-driven AWS architecture, private user-scoped product flow, extraction workflows, review tooling, and full live deployment.",
      stack: [
        "AWS Lambda",
        "S3",
        "DynamoDB",
        "API Gateway",
        "Cognito",
        "Textract",
        "CloudFront",
        "JavaScript",
      ],
      tags: ["aws", "backend", "full-stack", "live"],
      links: {
        live: "https://d2ijsg7huf2h2p.cloudfront.net",
        repo: "https://github.com/agarwalujala3-lang/ReceiptPulse",
      },
      details: [
        "I built a full upload-to-insight pipeline around private per-user receipt processing.",
        "I added sign-up/sign-in, receipt-only validation, duplicate decision handling, compact auto labels, rename actions, delete actions, and analytics.",
        "I pushed it beyond a backend demo by building a real dashboard flow around uploads, history, review, and stored results.",
      ],
      architecture: [
        "Signed-in users get a private workspace through Cognito-backed auth.",
        "Receipt uploads land in user-scoped S3 paths.",
        "Lambda processes files, validates them, and calls Textract.",
        "The data is normalized, categorized, labeled, and stored in DynamoDB.",
        "API routes power uploads, history, duplicate decisions, rename/delete actions, and analytics views.",
        "CloudFront serves the frontend experience.",
      ],
      tradeoff:
        "I optimized for a believable product-style AWS build with strong user flow first; budget analysis and deeper reporting are the next layer.",
    },
    {
      enabled: true,
      id: "lumenstack",
      title: "LumenStack AI",
      kind: "AI Tooling Product",
      status: "Live",
      priority: 96,
      featured: true,
      lensPriority: {
        recruiter: 96,
        engineer: 100,
        founder: 88,
        friend: 70,
      },
      accent: "cyan",
      icon: "LS",
      iconImage: "https://raw.githubusercontent.com/agarwalujala3-lang/LumenStack-AI/main/branding/portfolio-brand-mark.svg",
      lockupImage: "https://raw.githubusercontent.com/agarwalujala3-lang/LumenStack-AI/main/branding/portfolio-brand-lockup.svg",
      badge: "Flagship AI build",
      theme: {
        surface1: "rgba(246, 246, 253, 0.97)",
        surface2: "rgba(236, 233, 248, 0.95)",
        ring: "rgba(150, 137, 198, 0.2)",
        glow: "rgba(165, 149, 229, 0.2)",
        glowSoft: "rgba(145, 214, 236, 0.18)",
        accentStrong: "#6c59a8",
        accentSoft: "rgba(108, 89, 168, 0.12)",
        badgeBg: "rgba(108, 89, 168, 0.1)",
        badgeBorder: "rgba(108, 89, 168, 0.2)",
        proofBg: "linear-gradient(135deg, rgba(170, 154, 233, 0.18), rgba(152, 220, 241, 0.14))",
        signalBg: "rgba(249, 248, 255, 0.84)",
        signalBorder: "rgba(160, 147, 205, 0.2)",
        iconBg: "linear-gradient(145deg, rgba(234, 247, 255, 1), rgba(217, 236, 250, 0.98))",
      },
      repoSync: {
        repo: "LumenStack-AI",
        manifestPath: "portfolio-branding.json",
        manifestRequired: true,
      },
      summary:
        "I built LumenStack AI as a codebase architecture analyzer that parses repositories, detects structure, and generates Mermaid diagrams with guided explanations.",
      proof:
        "This project proves backend analysis flow, AI-assisted explanation, project framing, and multi-page product design.",
      stack: [
        "Node.js",
        "Express.js",
        "JavaScript",
        "OpenAI API",
        "Mermaid",
        "HTML",
        "CSS",
      ],
      tags: ["ai", "backend", "full-stack", "live"],
      links: {
        live: "https://lumenstack-ai.onrender.com",
        repo: "https://github.com/agarwalujala3-lang/LumenStack-AI",
      },
      details: [
        "I accept repos or uploads and turn them into structured architecture summaries.",
        "I added diagram generation, compare mode, chat, and exports.",
        "I designed it to make unfamiliar codebases easier to understand quickly.",
      ],
      architecture: [
        "Repository input is parsed file by file.",
        "Manifest and import patterns are used to infer dependency structure.",
        "A structured analysis layer feeds diagrams and AI explanations.",
        "The frontend presents the output as a guided developer product.",
      ],
      tradeoff:
        "I balanced deterministic analysis with AI explanation so the tool stays useful without relying blindly on the model.",
    },
    {
      enabled: true,
      id: "safety-copilot",
      title: "Safety Copilot",
      kind: "Cloud Safety Platform",
      status: "Live",
      priority: 90,
      featured: true,
      lensPriority: {
        recruiter: 90,
        engineer: 88,
        founder: 93,
        friend: 76,
      },
      accent: "teal",
      icon: "SC",
      badge: "Cloud + mobile product",
      theme: {
        surface1: "rgba(241, 249, 249, 0.97)",
        surface2: "rgba(229, 242, 242, 0.95)",
        ring: "rgba(60, 133, 132, 0.2)",
        glow: "rgba(91, 175, 173, 0.2)",
        glowSoft: "rgba(124, 194, 192, 0.18)",
        accentStrong: "#2e6e6d",
        accentSoft: "rgba(46, 110, 109, 0.13)",
        badgeBg: "rgba(46, 110, 109, 0.1)",
        badgeBorder: "rgba(46, 110, 109, 0.2)",
        proofBg: "linear-gradient(135deg, rgba(89, 174, 172, 0.18), rgba(117, 199, 197, 0.14))",
        signalBg: "rgba(244, 252, 252, 0.86)",
        signalBorder: "rgba(109, 160, 159, 0.22)",
        iconBg: "linear-gradient(145deg, rgba(233, 248, 248, 1), rgba(216, 239, 239, 0.98))",
      },
      summary:
        "I built Safety Copilot as a cloud-first personal safety platform with trusted circles, live trip monitoring, and SOS escalation across web and Android surfaces.",
      proof:
        "This project proves multi-surface product execution, API orchestration, incident workflows, and AWS-hosted deployment.",
      stack: [
        "React",
        "Vite",
        "Node.js",
        "AWS API Gateway",
        "AWS Lambda",
        "CloudFront",
        "Flutter",
      ],
      tags: ["aws", "full-stack", "product", "live"],
      links: {
        live: "https://d1j7xq1aihw0g3.cloudfront.net",
        repo: "https://github.com/agarwalujala3-lang/Safety-Copilot",
      },
      details: [
        "I built trusted-circle coordination, trip monitoring flows, and SOS plus silent SOS escalation states.",
        "I connected web and mobile clients to a cloud API layer for alerts, trip telemetry, and acknowledgment workflows.",
        "I designed the UI to keep high-risk actions clear, fast, and resilient under stress scenarios.",
      ],
      architecture: [
        "React web and Flutter Android clients connect to an AWS-hosted API layer.",
        "Trip, alert, and trusted-circle workflows are orchestrated through Node.js service modules and Lambda-style runtime paths.",
        "API Gateway routes and cloud hosting keep the system public, testable, and demo-ready.",
        "Incident actions update shared state for safety visibility across surfaces.",
      ],
      tradeoff:
        "I prioritized end-to-end product flow and safety interactions first; deeper long-term persistence hardening is the next infrastructure layer.",
    },
    {
      enabled: true,
      id: "cloud-attendance",
      title: "Cloud Attendance Platform",
      kind: "Serverless Attendance System",
      status: "GitHub",
      priority: 84,
      featured: false,
      lensPriority: {
        recruiter: 84,
        engineer: 86,
        founder: 72,
        friend: 64,
      },
      accent: "amber",
      icon: "CA",
      badge: "AWS serverless build",
      theme: {
        surface1: "rgba(253, 249, 239, 0.97)",
        surface2: "rgba(248, 239, 221, 0.95)",
        ring: "rgba(180, 139, 71, 0.2)",
        glow: "rgba(223, 179, 103, 0.2)",
        glowSoft: "rgba(210, 165, 91, 0.18)",
        accentStrong: "#8c6323",
        accentSoft: "rgba(140, 99, 35, 0.13)",
        badgeBg: "rgba(140, 99, 35, 0.1)",
        badgeBorder: "rgba(140, 99, 35, 0.2)",
        proofBg: "linear-gradient(135deg, rgba(225, 181, 106, 0.18), rgba(210, 160, 82, 0.14))",
        signalBg: "rgba(255, 252, 246, 0.86)",
        signalBorder: "rgba(181, 143, 76, 0.22)",
        iconBg: "linear-gradient(145deg, rgba(255, 246, 226, 1), rgba(246, 231, 196, 0.98))",
      },
      summary:
        "I built a serverless attendance management platform for institutions with role-based authentication and centralized workflow tracking.",
      proof:
        "This project proves AWS-first API design, Lambda business logic, Cognito auth, and scalable DynamoDB-centered architecture.",
      stack: [
        "React",
        "Python",
        "AWS Lambda",
        "API Gateway",
        "DynamoDB",
        "S3",
        "Cognito",
        "Rekognition",
      ],
      tags: ["aws", "backend", "full-stack", "github"],
      links: {
        repo: "https://github.com/agarwalujala3-lang/cloud-attendance-platform",
      },
      details: [
        "I implemented attendance APIs and role-based flows for admin, teacher, and student paths.",
        "I used Lambda and API Gateway to keep the backend serverless and operationally lightweight.",
        "I designed data persistence around DynamoDB and S3 for scalable, centralized records.",
      ],
      architecture: [
        "React client sends authenticated requests through API Gateway.",
        "Lambda functions execute attendance marking and retrieval business logic.",
        "DynamoDB stores attendance records while S3 handles file-oriented assets.",
        "Cognito secures identity and role-aware access control.",
      ],
      tradeoff:
        "The build currently prioritizes core attendance flow and architecture clarity; analytics and broader production modules are planned next.",
    },
  ],
  systems: [
    {
      id: "receiptpulse-system",
      title: "ReceiptPulse System Route",
      subtitle: "Serverless pipeline from upload to structured spend data",
      summary:
        "ReceiptPulse is the clearest example of how I connect cloud services into one usable system.",
      steps: [
        {
          label: "Upload",
          text: "A signed-in user uploads a receipt into a private workspace and the file lands in a user-scoped S3 path.",
        },
        {
          label: "Extract",
          text: "Lambda orchestrates the flow and Textract extracts structured receipt content.",
        },
        {
          label: "Review",
          text: "I apply categorization, confidence scoring, duplicate checks, and receipt-only validation before the result is accepted.",
        },
        {
          label: "Store",
          text: "The normalized result is persisted in DynamoDB for that user's analytics, history, and receipt management views.",
        },
        {
          label: "Surface",
          text: "API routes and a live dashboard turn the backend output into duplicate decisions, label rename flows, history, and analytics.",
        },
      ],
      decisions: [
        "I used serverless architecture to reduce infrastructure overhead.",
        "I chose Textract because receipt extraction is more structured than plain OCR.",
        "I added Cognito-backed private workspaces so the final dashboard feels like a real product instead of a backend demo.",
      ],
    },
    {
      id: "lumenstack-system",
      title: "LumenStack Analysis Route",
      subtitle: "From raw repository input to guided architecture understanding",
      summary:
        "LumenStack AI shows how I combine deterministic logic with AI assistance to build developer-facing products.",
      steps: [
        {
          label: "Input",
          text: "A user provides a repository or upload to analyze.",
        },
        {
          label: "Parse",
          text: "Files, manifests, and import patterns are inspected to build a structured codebase view.",
        },
        {
          label: "Infer",
          text: "Relationships and probable architecture are inferred from the static structure.",
        },
        {
          label: "Explain",
          text: "AI-generated explanation adds readability and product value on top of the analysis.",
        },
        {
          label: "Visualize",
          text: "Mermaid diagrams, compare views, and exports make the result actionable.",
        },
      ],
      decisions: [
        "I kept a deterministic base analysis so the product stays grounded.",
        "I use AI to explain and package insights, not as the only source of truth.",
        "I designed the interface as a real developer tool, not a one-off demo page.",
      ],
    },
  ],
  journey: [
    {
      phase: "Foundation",
      title: "I started with frontend and interface control",
      text:
        "My earlier builds strengthened layout, responsiveness, and the habit of making things feel complete on screen.",
    },
    {
      phase: "Expansion",
      title: "I moved into AWS services and backend thinking",
      text:
        "Project work and cloud exposure pulled my focus toward APIs, event-driven flows, and practical deployment.",
    },
    {
      phase: "Product Layer",
      title: "I started turning technical systems into product experiences",
      text:
        "Projects like ReceiptPulse, Safety Copilot, and LumenStack pushed me toward stronger UX, live hosting, and better project storytelling.",
    },
    {
      phase: "Current Direction",
      title: "I am growing toward deeper backend, cloud, and AI-assisted systems",
      text:
        "My next step is building more user-aware, production-ready software while keeping strong interface quality.",
    },
  ],
  principles: [
    "I build systems that actually work, not just pages that look technical.",
    "I want the first screen to be readable, but I keep deeper proof close by.",
    "I treat deployment as part of the project, not as an optional last step.",
    "I use polish to clarify the work, not to hide weak logic.",
  ],
  guide: {
    intro:
      "Use this layer if you want quick answers without scanning the whole portfolio. I mapped the most common questions to direct proof, routes, and project context.",
    prompts: [
      {
        id: "best-project",
        label: "Best flagship project",
        title: "If you only open one project, start with ReceiptPulse.",
        answer:
          "ReceiptPulse is the strongest single proof of my current direction because it combines AWS architecture, private user flow, backend logic, product design, deployment, and live usability in one system.",
        routeLabel: "Open ReceiptPulse dossier",
        routeHref: "work.html",
      },
      {
        id: "cloud-work",
        label: "Cloud work",
        title: "My cloud-heavy work centers on live AWS systems.",
        answer:
          "ReceiptPulse shows the clearest AWS signal through Lambda, S3, DynamoDB, API Gateway, Cognito, Textract, and CloudFront. It is the best route if you want to understand my serverless, event-driven, and user-scoped product thinking.",
        routeLabel: "Open Systems route",
        routeHref: "systems.html",
      },
      {
        id: "ai-work",
        label: "AI work",
        title: "My AI direction is grounded in product usefulness.",
        answer:
          "LumenStack AI is the clearest example. I used deterministic analysis first, then layered AI explanation and Mermaid generation on top so the output stays useful and not purely model-driven.",
        routeLabel: "Open project dossiers",
        routeHref: "work.html",
      },
      {
        id: "job-fit",
        label: "Role fit",
        title: "The best fit for me right now is cloud, backend, or full-stack product work.",
        answer:
          "My strongest signal comes from AWS systems, APIs, deployment, and building polished interfaces around technical workflows. I am especially strong where backend thinking and product execution overlap.",
        routeLabel: "Open Contact and resumes",
        routeHref: "contact.html",
      },
      {
        id: "next-build",
        label: "What I'm building next",
        title: "The next serious step is deeper product depth plus cleaner repo-aware updates.",
        answer:
          "I am pushing ReceiptPulse, Safety Copilot, and LumenStack AI into stronger product depth while keeping the portfolio cleaner and aligned with my best GitHub repos.",
        routeLabel: "Open Lab route",
        routeHref: "playground.html",
      },
    ],
  },
  brain: {
    intro:
      "This is the live portfolio brain. It is for direct questions when you want answers in my voice instead of scanning every page manually.",
    prompts: [
      "Which project should I open first?",
      "What AWS work have you built?",
      "What makes ReceiptPulse strong?",
      "What role fits you best right now?",
      "What are you planning to build next?",
    ],
    fallback:
      "The live brain is not connected yet, so the portfolio is falling back to the static guide and project routes.",
  },
  lab: {
    nowBuilding: [
      "Deeper reporting, merchant trends, and review tooling for ReceiptPulse",
      "Stronger incident-response and reliability depth for Safety Copilot",
      "Sharper architecture framing and guided explanations for LumenStack AI",
    ],
    nextExperiments: [
      "Cloud Attendance analytics and multi-role insights layer",
      "Portfolio runtime intelligence and fresher repo-aware project narration",
      "Production-style deployment patterns with CI/CD and observability",
    ],
    toolkit: [
      "Python",
      "C",
      "HTML",
      "CSS",
      "JavaScript",
      "Node.js",
      "Express.js",
      "AWS Lambda",
      "S3",
      "DynamoDB",
      "API Gateway",
      "IAM",
      "Rekognition",
      "Textract",
      "MySQL",
      "Git",
      "GitHub",
      "Docker basics",
    ],
  },
  learningLog: [
    {
      phase: "Now",
      title: "Refining product-grade AWS systems",
      note:
        "I am learning how to move from a strong technical build into something that feels closer to a real user-facing product with better structure, cleanup, and roles.",
    },
    {
      phase: "Current Focus",
      title: "Explaining architecture more clearly",
      note:
        "I am working on turning project flows into interview-ready explanations so I can defend decisions, tradeoffs, and system choices more clearly.",
    },
    {
      phase: "Practice Layer",
      title: "Using polish only where it helps comprehension",
      note:
        "I am learning how motion, UI, and narrative can support technical work instead of distracting from it.",
    },
  ],
  ideaInbox: [
    {
      label: "ReceiptPulse Pro",
      note:
        "Expand the current private receipt workspace into deeper spend insights, merchant trends, and stronger review tooling.",
    },
    {
      label: "Voice Interview Coach",
      note:
        "Build an AI practice system that can ask questions, score responses, and adapt by role or company type.",
    },
    {
      label: "Cloud-Native Deploy Track",
      note:
        "Take one product through Docker, CI/CD, and a more production-oriented deployment workflow.",
    },
  ],
  roadmap: [
    {
      stage: "Stage 01",
      title: "Deepen current projects",
      note:
        "Understand and explain ReceiptPulse and LumenStack AI fully before adding more complexity.",
    },
    {
      stage: "Stage 02",
      title: "Refine user-aware product depth",
      note:
        "Authentication and per-user data are now in place, so the next layer is stronger insights, reporting, and product refinement.",
    },
    {
      stage: "Stage 03",
      title: "Level up deployment maturity",
      note:
        "Move beyond basic hosting into stronger cloud-native deployment and production-readiness patterns.",
    },
  ],
};

