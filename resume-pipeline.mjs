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
      "Worked with AWS services including Lambda, S3, DynamoDB, API Gateway, IAM, and Rekognition during cloud application tasks.",
      "Developed and tested basic serverless backend workflows as part of internship assignments.",
      "Gained hands-on experience in deployment, debugging, and service integration across AWS-based applications.",
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
  fresher: [
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    { label: "Backend", values: ["Node.js", "Express.js", "REST APIs"] },
    {
      label: "Cloud",
      values: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "Cognito", "Textract", "CloudFront", "IAM"],
    },
    { label: "Databases", values: ["MySQL", "DynamoDB"] },
    { label: "Web", values: ["HTML", "CSS", "Responsive UI"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics"] },
  ],
  backend: [
    { label: "Languages", values: ["Java", "JavaScript", "C"] },
    { label: "Backend", values: ["Node.js", "Express.js", "REST APIs", "JSON"] },
    {
      label: "AWS",
      values: ["Lambda", "API Gateway", "S3", "DynamoDB", "Cognito", "Textract", "CloudFront", "IAM"],
    },
    { label: "Databases", values: ["MySQL", "DynamoDB"] },
    { label: "Web", values: ["HTML", "CSS", "Client-Side JavaScript"] },
    { label: "Tools", values: ["Git", "GitHub", "Docker Basics"] },
  ],
};

const variants = {
  general: {
    label: "Fresher Software Resume",
    htmlFile: "Ujala_Agarwal_Resume_ATS.html",
    pdfFile: "Ujala_Agarwal_Resume.pdf",
    documentTitle: "Ujala Agarwal - Fresher Software Resume",
    headline: "Entry-Level Software Engineer | Backend, AWS, and Full-Stack Projects",
    summary:
      "Entry-level software engineer with hands-on project experience in backend development, AWS serverless applications, and full-stack web projects. Built applications using JavaScript, Node.js, Express, AWS Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract, with public GitHub repositories and live demos. Seeking software engineering roles focused on backend development, cloud systems, and practical problem solving.",
    projectOrder: ["ReceiptPulse", "LumenStack-AI", "Safety-Copilot"],
    skills: skills.fresher,
  },
  backend: {
    label: "Backend/AWS Fresher Resume",
    htmlFile: "Ujala_Agarwal_Resume_Software.html",
    pdfFile: "Ujala_Agarwal_Resume_Software.pdf",
    documentTitle: "Ujala Agarwal - Backend AWS Fresher Resume",
    headline: "Entry-Level Backend Developer | Node.js, REST APIs, and AWS Projects",
    summary:
      "Entry-level backend-focused developer with project experience in REST APIs, Node.js/Express services, and AWS serverless workflows. Built GitHub-backed projects using JavaScript, Node.js, Express, Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract. Seeking fresher backend or software engineering roles where I can grow in backend fundamentals, debugging, and cloud-based application development.",
    projectOrder: ["ReceiptPulse", "LumenStack-AI", "Safety-Copilot"],
    skills: skills.backend,
  },
};

const projectBlueprints = {
  ReceiptPulse: {
    repo: "ReceiptPulse",
    id: "receiptpulse",
    title: "ReceiptPulse",
    status: "GitHub",
    summary:
      "Receipt processing web application with user authentication, file upload, OCR extraction, duplicate review, and receipt history tracking.",
    stack: ["AWS Lambda", "S3", "DynamoDB", "API Gateway", "Cognito", "Textract", "CloudFront", "JavaScript"],
    liveUrl: "https://agarwalujala3-lang.github.io/ReceiptPulse/",
    bullets: {
      general: [
        "Built a receipt processing web application with user authentication, file upload, OCR extraction, and receipt history tracking.",
        "Integrated AWS Lambda, S3, DynamoDB, API Gateway, Cognito, and Textract in a serverless workflow.",
        "Added duplicate review and receipt label management features for authenticated users.",
      ],
      backend: [
        "Built backend workflows for authenticated receipt upload, OCR extraction, duplicate review, and receipt history retrieval.",
        "Connected AWS Lambda, API Gateway, S3, DynamoDB, Cognito, and Textract in a serverless application flow.",
        "Implemented receipt validation, duplicate handling, and label update/delete features around user-scoped data.",
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
        "Added compare, export, and explanation features to make repository review easier to scan.",
      ],
      backend: [
        "Built Node.js and Express routes for repository input, analysis sessions, generated summaries, and export flows.",
        "Separated static parsing from AI-assisted explanation so outputs stay connected to repository structure.",
        "Added compare and export paths to support repeatable codebase review workflows.",
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
    general: "Best all-purpose fresher resume for software, backend, and cloud-trainee applications.",
    backend: "Use this when the role emphasizes backend APIs, Node.js, or AWS project work.",
  };

  return Object.entries(resumeRuntime.variants || {}).map(([key, variant]) => ({
    label: variant.label,
    href: `https://raw.githubusercontent.com/${resumeRuntime.sync.githubUser}/ujala-portfolio/main/${variant.pdfFile}`,
    note: noteByVariant[key] || "Generated from GitHub-verified resume source data.",
  }));
}
