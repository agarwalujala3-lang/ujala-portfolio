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
      "Worked with AWS services including Lambda, S3, DynamoDB, API Gateway, IAM, and Rekognition during cloud application tasks.",
      "Developed and tested basic serverless backend workflows as part of internship assignments.",
    ],
  },
];

const education = [
  {
    school: "Shri Ram Murti Smarak College of Engineering and Technology",
    degree: "B.Tech in Computer Science and Engineering (CSE)",
    location: "Bareilly, Uttar Pradesh",
    dates: "Graduated May 2026",
  },
];

const certifications = [
  "Cloud Computing Internship Completion Certificate - CETPA Infotech Pvt. Ltd.",
  "IBM Introduction to Large Language Models",
  "IBM SkillsBuild AI Campus Connect Bootcamp - Capstone Project Participant",
];

const skills = {
  general: [
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    { label: "Backend", values: ["Node.js", "Express.js", "REST APIs", "JSON"] },
    { label: "Cloud", values: ["AWS Lambda", "API Gateway", "S3", "DynamoDB", "Cognito", "Textract", "IAM"] },
    { label: "Databases", values: ["MySQL", "DynamoDB"] },
    { label: "Web", values: ["HTML", "CSS", "Responsive UI"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics"] },
  ],
  backend: [
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    { label: "Backend", values: ["Node.js", "Express.js", "REST APIs", "JSON"] },
    { label: "AWS", values: ["Lambda", "API Gateway", "S3", "DynamoDB", "Cognito", "Textract", "IAM"] },
    { label: "Databases", values: ["MySQL", "DynamoDB"] },
    { label: "Frontend Basics", values: ["HTML", "CSS", "Client-Side JavaScript"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics"] },
  ],
};

const defaultProjectOrder = ["Atlasiq-Ops-Platform", "ReceiptPulse", "LumenStack-AI"];

const variants = {
  general: {
    label: "BTech CSE Fresher Software Resume",
    htmlFile: "resume/Ujala_Agarwal_Resume_ATS.html",
    pdfFile: "resume/Ujala_Agarwal_Resume.pdf",
    documentTitle: "Ujala Agarwal - BTech CSE Fresher Software Resume",
    headline: "BTech CSE Fresher | Software Engineer | Backend and AWS Projects",
    summary:
      "BTech CSE fresher with hands-on project experience in JavaScript, Node.js, Express, REST APIs, and AWS serverless workflows. Completed a cloud computing internship and built GitHub-backed projects using Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract. Seeking entry-level software engineering roles where I can contribute to backend, cloud, and full-stack application work.",
    projectOrder: defaultProjectOrder,
    skills: skills.general,
  },
  backend: {
    label: "Backend/AWS BTech Fresher Resume",
    htmlFile: "resume/Ujala_Agarwal_Resume_Software.html",
    pdfFile: "resume/Ujala_Agarwal_Resume_Software.pdf",
    documentTitle: "Ujala Agarwal - Backend AWS BTech Fresher Resume",
    headline: "BTech CSE Fresher | Backend Developer | Node.js and AWS",
    summary:
      "BTech CSE fresher focused on backend development, REST APIs, Node.js/Express services, and AWS serverless workflows. Built project workflows for authenticated upload, OCR extraction, repository analysis, and structured data storage using Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract.",
    projectOrder: defaultProjectOrder,
    skills: skills.backend,
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
        "Built a live knowledge operations platform that transforms raw content into summaries, visual maps, charts, cheat notes, flashcards, and review recommendations.",
        "Added authentication, per-user workspaces, secure server-backed sessions, source traceability, exports, and a polished responsive dashboard experience.",
      ],
      backend: [
        "Built Node.js and Express APIs for authentication, sessions, workspace storage, AI generation, exports, and secure JSON request handling.",
        "Deployed the full frontend and backend on one Render URL with persistent disk-backed data configuration and GitHub auto-deploy.",
      ],
    },
  },
  ReceiptPulse: {
    repo: "ReceiptPulse",
    id: "receiptpulse",
    title: "ReceiptPulse",
    status: "GitHub",
    summary:
      "Receipt processing web application with user authentication, file upload, OCR extraction, duplicate review, and receipt history tracking.",
    stack: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "Cognito", "Textract", "CloudFront", "JavaScript"],
    liveUrl: "https://receipt-pulse.netlify.app/",
    bullets: {
      general: [
        "Built a receipt processing web application with user authentication, file upload, OCR extraction, and receipt history tracking.",
        "Integrated AWS Lambda, S3, DynamoDB, API Gateway, Cognito, and Textract in a serverless workflow.",
      ],
      backend: [
        "Built backend workflows for authenticated receipt upload, OCR extraction, duplicate review, and receipt history retrieval.",
        "Connected AWS Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract in a serverless application flow.",
      ],
    },
  },
  "LumenStack-AI": {
    repo: "LumenStack-AI",
    id: "lumenstack",
    title: "LumenStack AI",
    status: "GitHub",
    summary:
      "Codebase analysis tool that accepts repository input, maps project structure, and generates architecture summaries and Mermaid diagrams.",
    stack: ["Node.js", "Express", "JavaScript", "OpenAI API", "Mermaid", "HTML", "CSS"],
    liveUrl: "https://lumenstack-ai.onrender.com/",
    bullets: {
      general: [
        "Built a codebase analysis tool that accepts GitHub or ZIP input and summarizes project structure for easier review.",
        "Used Node.js, Express, JavaScript, Mermaid, and OpenAI API features to generate diagrams and guided explanations.",
      ],
      backend: [
        "Built Node.js and Express routes for repository input, analysis sessions, generated summaries, and export flows.",
        "Separated static parsing from AI-assisted explanation so outputs stay connected to repository structure.",
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
        "Built a personal safety project with trusted-circle management, live trip monitoring screens, and SOS workflow concepts.",
        "Created web and Android-facing interfaces for alerts, trip state, and response flow visibility.",
        "Practiced connecting frontend states with API-oriented workflow design across multiple user surfaces.",
      ],
      backend: [
        "Modeled backend-friendly workflows for trusted-circle coordination, trip updates, alert states, and SOS actions.",
        "Worked with API-oriented client behavior for alerts, acknowledgments, and incident state transitions.",
        "Built the project as GitHub proof of product workflow thinking across web and mobile-facing surfaces.",
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
    stack: ["HTML", "CSS", "JavaScript", "Static Runtime Snapshot"],
    liveUrl: portfolioUrl,
    bullets: {
      general: [
        "Built a multi-page portfolio website with project routes, contact links, and downloadable resume files.",
        "Connected committed runtime data with GitHub-backed project information so the portfolio can be updated consistently.",
        "Kept the public profile independent from AWS hosting by using static pages and generated data snapshots.",
      ],
      backend: [
        "Built a static portfolio workflow that keeps resume links and project metadata generated from source data.",
        "Added build steps for safe static pages so updates can be regenerated instead of edited manually.",
        "Used GitHub-backed source data to keep public project proof and downloadable assets aligned.",
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

