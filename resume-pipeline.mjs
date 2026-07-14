const portfolioUrl =
  "https://ujala-portfolio.onrender.com/";

const profile = {
  name: "Ujala Agarwal",
  location: "Bareilly, Uttar Pradesh",
  phone: "+91 7906786403",
  email: "agarwalujala3@gmail.com",
  portfolioUrl,
  githubUrl: "https://github.com/agarwalujala3-lang",
  linkedinUrl: "https://www.linkedin.com/in/ujala-agarwal-30aa28283/",
};

const experience = [
  {
    company: "CETPA Infotech Pvt. Ltd.",
    role: "Cloud Computing Intern",
    location: "Noida, Uttar Pradesh",
    dates: "June 2025 - August 2025",
    bullets: [
      "Built and tested AWS serverless workflows using Lambda, S3, DynamoDB, API Gateway, IAM, Cognito, and Rekognition during cloud application assignments.",
      "Designed conceptual Smart Expense Tracker and resume-builder flows to connect frontend screens with cloud-backed APIs and storage.",
    ],
  },
];

const education = [
  {
    school: "Shri Ram Murti Smarak College of Engineering and Technology",
    degree: "B.Tech in Computer Science and Engineering (CSE)",
    location: "Bareilly, Uttar Pradesh",
    dates: "Final exams completed June 2026",
  },
];

const certifications = [
  "Google Cloud - Gen AI: Unlock Foundational Concepts",
  "Google Cloud - Gen AI: Navigate the Landscape",
  "Google Cloud - Gen AI Apps: Transform Your Work",
  "Google Cloud - Gen AI: Beyond the Chatbot",
  "Google Cloud - Gen AI Agents: Transform Your Organization",
  "Google Cloud - Gemini Enterprise Agent Ready",
  "Power BI for Beginners - Certificate Code 10463374",
  "be10x - AI Tools and ChatGPT Workshop",
  "Unstop - Participation Certificate",
  "AWS Cloud Internship - CETPA Infotech Pvt. Ltd.",
  "IBM SkillsBuild - Introduction to Large Language Models",
  "IBM SkillsBuild AI Campus Connect Bootcamp - Capstone Project Participant",
  "Getting Started with Artificial Intelligence",
];

const skills = {
  general: [
    { label: "Languages", values: ["Java", "JavaScript", "Python", "C"] },
    { label: "Backend", values: ["Node.js", "Express.js", "REST APIs", "JSON"] },
    { label: "Cloud", values: ["AWS Lambda", "API Gateway", "S3", "DynamoDB", "Cognito", "Textract", "IAM"] },
    { label: "AI/Data", values: ["Google Gemini", "AI Agents", "Microsoft Power BI"] },
    { label: "Databases", values: ["MySQL", "DynamoDB"] },
    { label: "Frontend", values: ["React", "Vite", "HTML", "CSS", "Responsive UI"] },
    { label: "Tools", values: ["Git", "GitHub", "Render", "Docker Basics"] },
  ],
  backend: [
    { label: "Languages", values: ["Java", "JavaScript", "Python", "C"] },
    { label: "Backend", values: ["Node.js", "Express.js", "REST APIs", "JSON"] },
    { label: "AWS", values: ["Lambda", "API Gateway", "S3", "DynamoDB", "Cognito", "Textract", "IAM"] },
    { label: "AI/Data", values: ["Google Gemini", "AI Agents", "Microsoft Power BI"] },
    { label: "Databases", values: ["MySQL", "DynamoDB"] },
    { label: "Frontend", values: ["React", "Vite", "HTML", "CSS", "Client-Side JavaScript"] },
    { label: "Tools", values: ["Git", "GitHub", "Render", "Docker Basics"] },
  ],
};

const defaultProjectOrder = ["Atlasiq-Ops-Platform", "LumenStack-AI", "ReceiptPulse"];

const variants = {
  general: {
    label: "BTech CSE Fresher Software Resume",
    htmlFile: "resume/Ujala_Agarwal_Resume_ATS.html",
    pdfFile: "resume/Ujala_Agarwal_Resume.pdf",
    documentTitle: "Ujala Agarwal - BTech CSE Fresher Software Resume",
    headline: "BTech CSE Fresher | Software Engineer | Backend and AWS Projects",
    summary:
      "Entry-level Software Engineer (B.Tech CSE) with project proof across JavaScript, React/Vite, Node.js/Express REST APIs, AWS serverless services, and AI-assisted web products. Built and deployed live apps on Render, completed Google Cloud Gen AI, Gemini Enterprise Agent, Power BI, AWS, and AI tools certifications, and solved 250+ DSA problems in Java/Python.",
    projectOrder: defaultProjectOrder,
    skills: skills.general,
    coreStrengths: [
      "Built and deployed live JavaScript + Node.js/Express products on Render with GitHub-backed source control and public proof links.",
      "Integrated REST-style flows for authentication, file upload, AI generation, OCR extraction, dashboard data, and exports.",
      "Completed Google Cloud Gen AI badges, Gemini Enterprise Agent Ready, Power BI for Beginners, be10x AI Tools Workshop, and AWS Cloud Internship.",
    ],
  },
  backend: {
    label: "Backend/AWS BTech Fresher Resume",
    htmlFile: "resume/Ujala_Agarwal_Resume_Software.html",
    pdfFile: "resume/Ujala_Agarwal_Resume_Software.pdf",
    documentTitle: "Ujala Agarwal - Backend AWS BTech Fresher Resume",
    headline: "BTech CSE Fresher | Backend Developer | Node.js and AWS",
    summary:
      "B.Tech CSE fresher focused on backend APIs, Node.js/Express services, AWS serverless workflows, and deployable product systems. Built repo-backed workflows for Cognito login, upload, Textract OCR, repository analysis, AI generation, exports, and dashboard data using Lambda, API Gateway, S3, DynamoDB, Node.js, and Express. Completed Google Cloud Gen AI, Power BI, AWS, and AI tools certifications.",
    projectOrder: ["ReceiptPulse", "Atlasiq-Ops-Platform", "LumenStack-AI"],
    skills: skills.backend,
    coreStrengths: [
      "Built AWS serverless workflows with Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract for authenticated OCR receipt processing.",
      "Developed Node.js/Express REST APIs for authentication, workspace sessions, AI generation, repository analysis, exports, and JSON data flows.",
      "Solved 250+ DSA problems in Java/Python across arrays, strings, hashing, recursion, sorting, and core problem-solving patterns.",
    ],
  },
};
const projectBlueprints = {
  "Atlasiq-Ops-Platform": {
    repo: "Atlasiq-Ops-Platform",
    id: "atlasiq-ops",
    title: "AtlasIQ Ops",
    status: "Live + GitHub",
    summary:
      "AI-powered visual knowledge transformation platform with authentication, per-user workspaces, summaries, concept maps, charts, cheat notes, flashcards, and review workflows.",
    stack: ["Node.js", "Express.js", "JavaScript", "OpenAI API", "HTML", "CSS", "Render"],
    liveUrl: "https://atlasiq-ops-platform.onrender.com/",
    bullets: {
      general: [
        "Built a Node.js + Express + JavaScript knowledge platform with authentication, per-user workspaces, AI summaries, visual maps, charts, flashcards, and review workflows.",
        "Integrated REST-style APIs for sessions, workspace storage, AI generation, exports, and dashboard data; deployed the full app on Render.",
      ],
      backend: [
        "Developed Node.js + Express APIs for authentication, server-backed sessions, workspace storage, AI generation, exports, and secure JSON request handling.",
        "Deployed frontend and backend together on Render with persistent disk-backed data configuration and GitHub auto-deploy.",
      ],
    },
  },
  ReceiptPulse: {
    repo: "ReceiptPulse",
    id: "receiptpulse",
    title: "ReceiptPulse",
    status: "GitHub Proof",
    summary:
      "Receipt processing web application with user authentication, file upload, OCR extraction, duplicate review, and receipt history tracking.",
    stack: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "Cognito", "Textract", "CloudFront", "JavaScript"],
    liveUrl: "",
    bullets: {
      general: [
        "Built an AWS serverless receipt processor with Cognito login, authenticated upload, Textract OCR extraction, duplicate review, and receipt history tracking.",
        "Integrated Lambda, API Gateway, S3, DynamoDB, Cognito, Textract, and CloudFront to move receipts from upload to structured dashboard data.",
      ],
      backend: [
        "Developed AWS Lambda/API Gateway workflows for authenticated receipt upload, OCR extraction, duplicate detection, and receipt history retrieval.",
        "Integrated S3, DynamoDB, Cognito, Textract, and CloudFront in a repo-backed serverless architecture with clean API boundaries.",
      ],
    },
  },
  "LumenStack-AI": {
    repo: "LumenStack-AI",
    id: "lumenstack",
    title: "LumenStack AI",
    status: "Live + GitHub",
    summary:
      "Codebase analysis tool that accepts repository input, maps project structure, and generates architecture summaries and Mermaid diagrams.",
    stack: ["Node.js", "Express", "JavaScript", "OpenAI API", "Mermaid", "HTML", "CSS"],
    liveUrl: "https://lumenstack-ai.onrender.com/",
    bullets: {
      general: [
        "Built a Node.js + Express codebase analysis tool that accepts GitHub/ZIP input, maps project structure, and generates architecture summaries.",
        "Integrated OpenAI-assisted explanations with Mermaid diagrams and export-ready outputs so repositories are easier to review and present.",
      ],
      backend: [
        "Developed Node.js + Express routes for repository ingestion, analysis sessions, generated summaries, Mermaid diagrams, and export flows.",
        "Separated static parsing from AI-assisted explanation so outputs stay grounded in actual repository structure.",
      ],
    },
  },
  "Safety-Copilot": {
    repo: "Safety-Copilot",
    id: "safety-copilot",
    title: "Safety Copilot",
    status: "GitHub",
    summary:
      "Personal safety project with trusted-circle management, trip monitoring screens, and SOS workflow concepts across web and Android surfaces.",
    stack: ["React", "Vite", "Node.js", "AWS API Gateway", "AWS Lambda", "CloudFront", "Flutter"],
    bullets: {
      general: [
        "Built a React + Vite safety workflow prototype with trusted-circle management, trip monitoring screens, and SOS response states.",
        "Connected web/mobile-facing UI concepts to API-oriented flows for alerts, trip updates, acknowledgement states, and incident visibility.",
        "Practiced product-level safety workflow design across React web and Flutter Android-facing surfaces.",
      ],
      backend: [
        "Modeled REST-friendly workflows for trusted-circle coordination, trip updates, alert states, acknowledgments, and SOS actions.",
        "Worked with API-oriented client behavior for alerts, incident visibility, response states, and multi-surface safety flows.",
        "Built GitHub proof of product workflow thinking across React web and Flutter Android-facing safety surfaces.",
      ],
    },
  },
  "ujala-portfolio": {
    repo: "ujala-portfolio",
    id: "ujala-os",
    title: "Ujala OS Portfolio",
    status: "Live + GitHub",
    summary:
      "Portfolio website with static runtime data, GitHub-backed project sync, and downloadable fresher resume links.",
    stack: ["HTML", "CSS", "JavaScript", "Static Runtime Snapshot", "Render"],
    liveUrl: portfolioUrl,
    bullets: {
      general: [
        "Built a high-polish HTML/CSS/JavaScript portfolio with multi-page routes, case studies, contact links, and downloadable ATS resume PDFs.",
        "Automated GitHub-backed project/runtime data generation so live demos, repo links, and resume assets stay aligned before deployment.",
        "Deployed the public profile on Render using static pages and generated data snapshots instead of manual resume/link updates.",
      ],
      backend: [
        "Built a static-generation workflow that syncs portfolio project metadata, resume links, and verified GitHub repos from source data.",
        "Added build steps for safe static pages and deployable Render assets so public proof can be regenerated instead of manually edited.",
        "Used GitHub-backed source data to keep live project proof, downloadable PDFs, and resume runtime data aligned.",
      ],
    },
  },
};

function cleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function cleanArray(value) {
  return Array.isArray(value) ? value.map(cleanString).filter(Boolean) : [];
}

function repoNameFromUrl(value) {
  const candidate = cleanString(value);
  if (!candidate) {
    return "";
  }

  try {
    const url = new URL(candidate);
    if (url.hostname.toLowerCase() !== "github.com") {
      return "";
    }
    const [, owner, repo] = url.pathname.split("/");
    return owner && repo ? repo.replace(/\.git$/i, "") : "";
  } catch {
    return "";
  }
}

function unique(values) {
  return [...new Set(values.map(cleanString).filter(Boolean))];
}

function mergeBlueprintWithSyncedProject(blueprint, syncedProject, repo, githubUser) {
  const repoUrl = cleanString(repo?.html_url) || `https://github.com/${githubUser}/${blueprint.repo}`;
  const manifestLiveUrl = cleanString(syncedProject?.links?.live);
  const blueprintLiveUrl = cleanString(blueprint.liveUrl);
  const stack = unique([...(cleanArray(syncedProject?.stack).length ? cleanArray(syncedProject.stack) : cleanArray(blueprint.stack))]);

  return {
    id: cleanString(syncedProject?.id) || blueprint.id,
    repo: blueprint.repo,
    title: cleanString(syncedProject?.title) || blueprint.title,
    status: blueprint.status,
    summary: blueprint.summary,
    stack,
    source: syncedProject ? "github-manifest" : "github-repo-blueprint",
    pushedAt: cleanString(repo?.pushed_at),
    language: cleanString(repo?.language),
    links: {
      live: manifestLiveUrl || blueprintLiveUrl,
      repo: repoUrl,
    },
    bullets: blueprint.bullets,
  };
}

function orderProjectsForVariant(projects, projectOrder) {
  const byRepo = new Map(projects.map((project) => [project.repo, project]));
  return projectOrder.map((repo) => byRepo.get(repo)).filter(Boolean);
}

export function buildResumeRuntime({ githubUser, githubRepos, projects, sync }) {
  const repoMap = new Map(
    (Array.isArray(githubRepos) ? githubRepos : [])
      .filter((repo) => repo && !repo.fork && cleanString(repo.name))
      .map((repo) => [repo.name, repo])
  );
  const syncedProjectByRepo = new Map(
    (Array.isArray(projects) ? projects : [])
      .map((project) => [cleanString(project?.repoSync?.repo) || repoNameFromUrl(project?.links?.repo), project])
      .filter(([repo]) => repo)
  );

  const removedProjects = [];
  const resumeProjects = Object.values(projectBlueprints)
    .map((blueprint) => {
      const repo = repoMap.get(blueprint.repo);
      if (!repo) {
        removedProjects.push({
          repo: blueprint.repo,
          title: blueprint.title,
          reason: "not present in verified GitHub repo list",
        });
        return null;
      }

      return mergeBlueprintWithSyncedProject(blueprint, syncedProjectByRepo.get(blueprint.repo), repo, githubUser);
    })
    .filter(Boolean);

  const syncedAt = cleanString(sync?.syncedAt) || new Date().toISOString();
  const variantRecords = Object.fromEntries(
    Object.entries(variants).map(([key, variant]) => [
      key,
      {
        ...variant,
        projects: orderProjectsForVariant(resumeProjects, variant.projectOrder).map((project) => project.repo),
      },
    ])
  );

  return {
    schemaVersion: 1,
    generatedAt: syncedAt,
    sync: {
      status: cleanString(sync?.status) || "offline",
      source: cleanString(sync?.source) || "none",
      githubUser,
      verifiedRepoNames: [...repoMap.keys()].sort(),
      includedRepos: resumeProjects.map((project) => project.repo),
      removedProjects,
      note: "Resume project data is generated from the same GitHub-backed sync flow and filtered against the verified repo list.",
    },
    profile,
    variants: variantRecords,
    projects: resumeProjects,
    experience,
    education,
    certifications,
  };
}

export function createResumeDataScript(resumeRuntime) {
  return `window.UJOS_RESUME_DATA = ${JSON.stringify(resumeRuntime, null, 2)};\n`;
}

export function createPortfolioResumeLinks(resumeRuntime) {
  const noteByVariant = {
    general: "Best all-purpose fresher resume for software, backend, and cloud-trainee applications.",
    backend: "Use this when the role emphasizes backend APIs, Node.js, or AWS project work.",
  };

  return Object.entries(resumeRuntime.variants || {}).map(([key, variant]) => ({
    label: variant.label,
    href: `https://raw.githubusercontent.com/${resumeRuntime.sync.githubUser}/ujala-portfolio/main/${variant.pdfFile}`,
    note: noteByVariant[key] || "Generated from GitHub-verified resume source data.",
  }));
}
