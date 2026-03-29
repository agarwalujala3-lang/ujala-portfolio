window.UJOS_DATA = {
  profile: {
    name: "Ujala Agarwal",
    shortName: "Ujala",
    title: "Cloud, AI, and full-stack builder",
    location: "India",
    github: "https://github.com/agarwalujala3-lang",
    linkedin: "https://www.linkedin.com/in/ujala-agarwal-30aa28283/",
    email: "agarwalujala3@gmail.com",
    phone: "+91 7906786403",
    tagline:
      "I built this portfolio as an adaptive space for cloud systems, AI tools, and polished product delivery.",
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
      focus: ["ReceiptPulse", "LumenStack AI", "AWS systems", "Resume pack"],
      projectOrder: ["receiptpulse", "lumenstack", "amazon-ui-clone", "valentine"],
      picoGreeting:
        "Recruiter route ready. I’ll keep this fast, clear, and proof-first.",
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
      projectOrder: ["lumenstack", "receiptpulse", "amazon-ui-clone", "valentine"],
      picoGreeting:
        "Engineer route locked. I’ll point you toward flows, internals, and code proof.",
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
      focus: ["Product thinking", "Live demos", "UI polish", "Execution range"],
      projectOrder: ["receiptpulse", "amazon-ui-clone", "lumenstack", "valentine"],
      picoGreeting:
        "Founder route online. I’ll show you how I think about product feel and shipping quality.",
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
        "Playful lab side",
        "Projects with personality",
      ],
      focus: ["Journey", "Learning", "Creative side", "Contact"],
      projectOrder: ["valentine", "amazon-ui-clone", "receiptpulse", "lumenstack"],
      picoGreeting:
        "Friend route feels warmer. I’ll show the story, not just the scorecard.",
    },
  },
  signals: [
    {
      label: "Flagship Builds",
      value: "4",
      note: "live or portfolio-grade projects across AWS, AI, and frontend work",
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
      id: "receiptpulse",
      title: "ReceiptPulse",
      kind: "Flagship System",
      status: "Live",
      accent: "cyan",
      icon: "RP",
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
      id: "lumenstack",
      title: "LumenStack AI",
      kind: "AI Tooling Product",
      status: "Live",
      accent: "amber",
      icon: "LS",
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
      id: "amazon-ui-clone",
      title: "Amazon UI Clone",
      kind: "Frontend Build",
      status: "Live",
      accent: "violet",
      icon: "AZ",
      summary:
        "I built this frontend recreation of Amazon’s homepage to sharpen my layout control, section composition, and dense commercial UI structuring.",
      proof:
        "This project proves visual composition discipline, spacing control, and my ability to recreate complex real-world layouts cleanly.",
      stack: ["HTML", "CSS"],
      tags: ["frontend", "ui", "live"],
      links: {
        live: "https://d22imnrsdj0eeu.cloudfront.net",
        repo: "https://github.com/agarwalujala3-lang/Amazon-UI-Clone",
      },
      details: [
        "I focused on layout recreation and visual fidelity.",
        "It strengthened my understanding of dense navigation and catalog-style interfaces.",
      ],
      architecture: [
        "Static HTML sections define the structure.",
        "CSS handles layout, spacing, and responsive adjustments.",
        "Deployment through CloudFront keeps it accessible as a live demo.",
      ],
      tradeoff:
        "This build is intentionally frontend-only; its strength is UI control, not backend depth.",
    },
    {
      id: "valentine",
      title: "Valentine Interactive Web Experience",
      kind: "Creative Interaction Build",
      status: "Live",
      accent: "rose",
      icon: "VX",
      summary:
        "I built this animated single-page interactive experience around media transitions, lightweight logic, and playful emotional design.",
      proof:
        "This project proves personality, interaction design instincts, and my willingness to build something expressive instead of purely utilitarian.",
      stack: ["HTML", "CSS", "JavaScript"],
      tags: ["frontend", "interactive", "live"],
      links: {
        live: "https://d3lrcs5kkqcuas.cloudfront.net",
        repo: "https://github.com/agarwalujala3-lang/VALENTINE-CHAUDHRAIN",
      },
      details: [
        "I built it around interaction flow, timing, and media-led transitions.",
        "I later optimized the loading behavior to improve the first render.",
      ],
      architecture: [
        "The interface is driven by a single-page DOM interaction flow.",
        "JavaScript coordinates transitions and state changes.",
        "Optimized media loading improved perceived performance.",
      ],
      tradeoff:
        "This build prioritizes memorable interaction and emotional tone over formal system complexity.",
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
        "Projects like ReceiptPulse and LumenStack pushed me toward stronger UX, live hosting, and better project storytelling.",
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
        title: "The next serious step is deeper reporting and stronger product depth.",
        answer:
          "I want to push my current systems into stronger reporting, merchant insight, and cleaner review flows while improving how clearly I explain the architecture in interviews and product conversations.",
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
      "Deeper spend insights and merchant trends for ReceiptPulse",
      "Stronger system-design explanations for interviews",
      "Adaptive portfolio experiences that respond to the visitor",
    ],
    nextExperiments: [
      "Receipt-level reporting and review tooling",
      "AI helper experiences with better grounding",
      "Cloud-native deployment patterns beyond static hosting",
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
