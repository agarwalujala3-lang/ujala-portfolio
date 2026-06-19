const portfolioUrl =
  "https://agarwalujala3-lang.github.io/ujala-portfolio/";

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
      "Built practical AWS service-integration experience across Lambda, S3, DynamoDB, API Gateway, IAM, and Rekognition while supporting cloud application workflows.",
      "Developed and tested serverless backend processes and automation flows, reducing manual intervention by approximately 40-50%.",
      "Practiced deployment basics, service boundaries, and debugging habits needed to move cloud workflows from concept to usable delivery.",
    ],
  },
];

const education = [
  {
    school: "Shri Ram Murti Smarak College of Engineering and Technology",
    degree: "Bachelor of Science in Computer Science",
    location: "Bareilly, Uttar Pradesh",
    dates: "Completed May 2026",
  },
];

const certifications = [
  "Cloud Computing Internship Completion Certificate - CETPA Infotech Pvt. Ltd.",
  "IBM Introduction to Large Language Models",
  "IBM Getting Started with Artificial Intelligence",
  "IBM SkillsBuild AI Campus Connect Bootcamp - Capstone Project Participant",
];

const skills = {
  general: [
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    {
      label: "Backend and Web",
      values: ["Node.js", "Express", "REST APIs", "HTML", "CSS", "Responsive UI", "Modular Client-Side JavaScript"],
    },
    {
      label: "AWS Cloud",
      values: ["Lambda", "S3", "DynamoDB", "API Gateway", "IAM", "Rekognition", "Textract", "CloudFront", "Cognito"],
    },
    { label: "Databases", values: ["DynamoDB", "MySQL"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics", "OpenAI API", "Mermaid"] },
  ],
  software: [
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    { label: "Web and Backend", values: ["HTML", "CSS", "JavaScript", "Node.js", "Express", "Responsive UI", "REST APIs"] },
    {
      label: "Cloud and Services",
      values: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "IAM", "Rekognition", "Textract", "CloudFront", "Cognito"],
    },
    { label: "Databases", values: ["DynamoDB", "MySQL"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics", "OpenAI API", "Mermaid"] },
  ],
  cloud: [
    {
      label: "AWS Cloud",
      values: ["Lambda", "S3", "DynamoDB", "API Gateway", "IAM", "Rekognition", "Textract", "CloudFront", "Cognito"],
    },
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    { label: "Backend and Web", values: ["Node.js", "Express", "HTML", "CSS", "REST APIs"] },
    { label: "Databases", values: ["DynamoDB", "MySQL"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics", "OpenAI API", "Mermaid"] },
  ],
  frontend: [
    { label: "Frontend", values: ["HTML", "CSS", "JavaScript", "Responsive UI", "Interaction Design"] },
    { label: "Full-Stack", values: ["Node.js", "Express", "REST APIs", "JavaScript", "Java"] },
    { label: "Cloud", values: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "CloudFront", "Cognito", "Textract"] },
    { label: "Databases", values: ["DynamoDB", "MySQL"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics", "OpenAI API", "Mermaid"] },
  ],
};

const variants = {
  general: {
    label: "General Resume",
    htmlFile: "Ujala_Agarwal_Resume_ATS.html",
    pdfFile: "Ujala_Agarwal_Resume.pdf",
    documentTitle: "Ujala Agarwal - ATS Resume",
    headline: "Software Engineer | Cloud, AI, and Full-Stack Developer",
    summary:
      "Software engineer with public GitHub proof across AWS serverless systems, AI-assisted developer tooling, and full-stack product interfaces. Builds end-to-end flows across JavaScript, Java, Node.js, Express, Lambda, API Gateway, S3, DynamoDB, Cognito, Textract, and CloudFront. Seeking backend, cloud, or full-stack software engineering roles where implementation quality and product clarity both matter.",
    coreStrengths: [
      "Builds repo-verified projects with clear source links, live routes, and role-specific proof.",
      "Connects backend workflows, cloud services, and user-facing UI into complete product experiences.",
      "Explains architecture decisions, tradeoffs, and implementation paths in recruiter- and engineer-readable language.",
    ],
    projectOrder: ["ReceiptPulse", "Safety-Copilot", "LumenStack-AI"],
    skills: skills.general,
  },
  software: {
    label: "Software Resume",
    htmlFile: "Ujala_Agarwal_Resume_Software.html",
    pdfFile: "Ujala_Agarwal_Resume_Software.pdf",
    documentTitle: "Ujala Agarwal - Software Developer Resume",
    headline: "Software Engineer | Full-Stack and Backend Developer",
    summary:
      "Software engineer building full-stack, cloud-backed GitHub products with JavaScript, Java, Node.js, Express, REST APIs, AWS Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract. Strongest work sits at the overlap of backend logic, API design, cloud workflows, AI integration, and product-quality user-facing delivery.",
    coreStrengths: [
      "Implements API-driven product flows from frontend events to backend storage and review states.",
      "Keeps code proof visible through GitHub repos, structured project metadata, and live/static demo routes.",
      "Uses AI assistance where it adds product value, while keeping deterministic logic and source-backed behavior explicit.",
    ],
    projectOrder: ["ReceiptPulse", "LumenStack-AI", "Safety-Copilot"],
    skills: skills.software,
  },
  cloud: {
    label: "Cloud Resume",
    htmlFile: "Ujala_Agarwal_Resume_Cloud.html",
    pdfFile: "Ujala_Agarwal_Resume_Cloud.pdf",
    documentTitle: "Ujala Agarwal - Cloud Resume",
    headline: "AWS Serverless Developer | Cloud and Backend Engineer",
    summary:
      "Cloud-focused engineer building GitHub-backed AWS workflows with Lambda, S3, DynamoDB, API Gateway, Cognito, Textract, IAM, and CloudFront. Strong at connecting identity, storage, processing, API layers, and frontend delivery into usable product workflows with clear service boundaries.",
    coreStrengths: [
      "Designs serverless workflows around identity, upload paths, processing, persistence, and API access.",
      "Turns cloud services into usable product flows instead of isolated infrastructure demos.",
      "Documents live links, repos, and project tradeoffs so cloud work is easy to verify.",
    ],
    projectOrder: ["ReceiptPulse", "LumenStack-AI", "Safety-Copilot"],
    skills: skills.cloud,
  },
  frontend: {
    label: "Frontend Resume",
    htmlFile: "Ujala_Agarwal_Resume_Frontend.html",
    pdfFile: "Ujala_Agarwal_Resume_Frontend.pdf",
    documentTitle: "Ujala Agarwal - Frontend Resume",
    headline: "Frontend Developer | Product UI and Full-Stack Web",
    summary:
      "Frontend and product-focused developer building polished, responsive interfaces for GitHub-backed products. Current work emphasizes interaction clarity, reusable visual systems, runtime-driven UI, command navigation, and multi-page product storytelling while staying connected to real backend and cloud workflows.",
    coreStrengths: [
      "Builds responsive, recruiter-readable product surfaces with clear navigation and strong visual hierarchy.",
      "Connects frontend states to real backend/API workflows rather than static mockups.",
      "Uses animation, routing, and interface polish to clarify technical proof instead of hiding it.",
    ],
    projectOrder: ["ujala-portfolio", "ReceiptPulse", "Safety-Copilot"],
    skills: skills.frontend,
  },
};

const projectBlueprints = {
  ReceiptPulse: {
    repo: "ReceiptPulse",
    id: "receiptpulse",
    title: "ReceiptPulse",
    status: "GitHub",
    summary:
      "Private receipt operations workspace with Cognito sign-in, user-scoped uploads, Textract extraction, duplicate decision flow, rename/delete actions, and analytics-ready history.",
    stack: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "Cognito", "Textract", "CloudFront", "JavaScript"],
    liveUrl: "https://agarwalujala3-lang.github.io/ReceiptPulse/",
    bullets: {
      general: [
        "Built a private receipt operations workspace with Cognito sign-in, user-scoped uploads, Textract extraction, duplicate review, label rename/delete actions, and analytics-ready history.",
        "Connected Lambda, S3, DynamoDB, API Gateway, and CloudFront into an event-driven document workflow with clear processing, storage, and retrieval boundaries.",
        "Designed dashboard states for upload, review, results, and account-scoped data so backend processing stays visible and usable.",
      ],
      software: [
        "Implemented the full stack flow from file upload to stored receipt records using JavaScript, Lambda functions, REST endpoints, and DynamoDB.",
        "Added receipt-only validation, duplicate decision handling, rename/delete actions, and history retrieval for a complete review workflow.",
        "Structured UI/API behavior around private user sessions, error states, and repeatable receipt-management flows.",
      ],
      cloud: [
        "Architected a user-scoped serverless pipeline across Cognito identity, S3 storage, Lambda/Textract processing, DynamoDB persistence, and API Gateway access.",
        "Separated upload, extraction, review, and analytics responsibilities so the cloud workflow remains maintainable.",
        "Used CloudFront/static dashboard delivery to wrap AWS backend services in a recruiter-demoable product surface.",
      ],
      frontend: [
        "Designed dashboard UX for receipt upload, duplicate decisions, history, analytics, and receipt management.",
        "Built responsive HTML/CSS/JavaScript interactions around asynchronous cloud APIs and user-scoped data states.",
        "Presented the OCR/backend workflow as a clear product journey from upload to review to stored result.",
      ],
    },
  },
  "LumenStack-AI": {
    repo: "LumenStack-AI",
    id: "lumenstack",
    title: "LumenStack AI",
    status: "GitHub",
    summary:
      "Codebase architecture analyzer that parses repositories, detects structure, and generates Mermaid diagrams with guided explanations.",
    stack: ["Node.js", "Express", "JavaScript", "OpenAI API", "Mermaid", "HTML", "CSS"],
    liveUrl: "https://lumenstack-ai.onrender.com/",
    bullets: {
      general: [
        "Built a repository intelligence tool that accepts GitHub or ZIP inputs, maps code structure, and generates Mermaid architecture diagrams.",
        "Implemented compare mode, quality signals, exports, and an explanation layer to make codebase review easier to scan.",
        "Balanced deterministic static analysis with AI-generated explanations so outputs stay grounded in repository structure.",
      ],
      software: [
        "Built a Node.js/Express analysis workflow that transforms repository input into architecture summaries, Mermaid diagrams, and guided technical insight.",
        "Added compare mode and export paths so engineers can inspect differences and keep generated findings portable.",
        "Kept static parsing and AI explanation as separate layers to reduce vague or unsupported output.",
      ],
      cloud: [
        "Structured the backend as a hosted Node.js analysis service with clear input, parsing, inference, and explanation stages.",
        "Kept deterministic static analysis separate from AI explanation so generated outputs remain traceable to repository structure.",
        "Designed the product around architecture review, compare mode, and exportable technical insight.",
      ],
      frontend: [
        "Built a developer-tool interface for repo analysis, architecture diagrams, compare mode, chat, and exports.",
        "Used Mermaid visualization and guided explanation states to make unfamiliar codebases easier to inspect.",
        "Balanced product polish with technical readability so the interface supports real engineering review.",
      ],
    },
  },
  "Safety-Copilot": {
    repo: "Safety-Copilot",
    id: "safety-copilot",
    title: "Safety Copilot",
    status: "GitHub",
    summary:
      "Cloud-first personal safety platform with trusted circles, live trip monitoring, and SOS escalation across web and Android surfaces.",
    stack: ["React", "Vite", "Node.js", "AWS API Gateway", "AWS Lambda", "CloudFront", "Flutter"],
    bullets: {
      general: [
        "Built a personal safety platform concept with trusted-circle management, live trip monitoring, and SOS plus silent SOS escalation flows.",
        "Connected web and Android client paths to cloud/API workflows for trip telemetry, alert acknowledgments, and safety response states.",
        "Designed operator-style console states for route, threat, incident, and acknowledgment visibility.",
      ],
      software: [
        "Built trusted-circle, live trip, SOS, and silent SOS workflows across web and Android-facing surfaces.",
        "Implemented API-oriented client behavior for alerts, telemetry, acknowledgments, and incident state transitions.",
        "Kept high-risk actions clear through explicit UI states and structured workflow boundaries.",
      ],
      cloud: [
        "Modeled live trip monitoring, trusted-circle coordination, and SOS escalation around cloud/API workflow boundaries.",
        "Integrated web and mobile surfaces with API-driven alert, telemetry, and response-state behavior.",
        "Structured the system as public GitHub proof for cloud-backed safety workflows and multi-surface product thinking.",
      ],
      frontend: [
        "Built a web console for trusted circles, live trip tracking, alert feeds, and SOS escalation workflows.",
        "Designed high-clarity route, threat, and incident surfaces to support fast operational decisions.",
        "Integrated responsive client states with API-driven safety workflows while preserving polished UI behavior.",
      ],
    },
  },
  "ujala-portfolio": {
    repo: "ujala-portfolio",
    id: "ujala-os",
    title: "Ujala OS Portfolio",
    status: "Live + GitHub",
    summary:
      "Repo-driven portfolio system with static-safe runtime data, project routing, command navigation, compare studio, and role-specific resume pack.",
    stack: ["HTML", "CSS", "JavaScript", "Static Runtime Snapshot"],
    liveUrl: portfolioUrl,
    bullets: {
      software: [
        "Built a static-safe portfolio runtime that merges committed project data, GitHub activity, and resume metadata without unsafe browser-side API calls.",
        "Implemented command navigation, route transitions, project filtering, compare studio behavior, and contact/resume routing across a multi-page site.",
        "Extended the sync pipeline so portfolio cards, runtime data, and role-specific resume links stay aligned with GitHub-backed source data.",
      ],
      cloud: [
        "Built a repo-driven portfolio system where project metadata, branding, and resume links are maintained through committed runtime snapshots.",
        "Implemented static-safe rendering, proof-first project routing, and compare studio behavior to present engineering work with stronger clarity.",
        "Kept the portfolio runtime independent from AWS so the public profile remains usable even when cloud hosting changes.",
      ],
      frontend: [
        "Rebuilt the portfolio as a multi-page product experience with audience lenses, project compare studio, command navigation, and static-runtime content.",
        "Designed a cohesive visual system with dark-theme polish, responsive layout rhythm, guided interaction states, and proof-focused UX.",
        "Implemented committed project metadata so cards, accents, and resume links stay aligned without unsafe browser-side API calls.",
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
    summary: cleanString(syncedProject?.summary) || blueprint.summary,
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
    general: "Use this if you want a balanced overview of my GitHub-backed work.",
    software: "Best fit if you are hiring me for software engineering roles.",
    cloud: "Use this if you want my AWS and cloud work highlighted first.",
    frontend: "Best fit if you want to see my interface and product-facing work.",
  };

  return Object.entries(resumeRuntime.variants || {}).map(([key, variant]) => ({
    label: variant.label,
    href: `https://raw.githubusercontent.com/${resumeRuntime.sync.githubUser}/ujala-portfolio/main/${variant.pdfFile}`,
    note: noteByVariant[key] || "Generated from GitHub-verified resume source data.",
  }));
}
