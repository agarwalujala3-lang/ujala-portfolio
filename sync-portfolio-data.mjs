import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const githubUser = "agarwalujala3-lang";
const brainApiUrl = "https://d77odxxfwhwwpw4s3c4uvnwcdq0nifbp.lambda-url.ap-south-1.on.aws/";
const manifestPath = "portfolio-branding.json";
const themeKeys = [
  "surface1",
  "surface2",
  "ring",
  "glow",
  "glowSoft",
  "accentStrong",
  "accentSoft",
  "badgeBg",
  "badgeBorder",
  "proofBg",
  "signalBg",
  "signalBorder",
  "iconBg",
];
const lensKeys = ["recruiter", "engineer", "founder", "friend"];

async function readJson(relativePath, fallback) {
  try {
    const file = await readFile(path.join(rootDir, relativePath), "utf8");
    return JSON.parse(file);
  } catch {
    return fallback;
  }
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function cleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => cleanString(item)).filter(Boolean);
}

function resolveManifestAsset(repo, branch, value) {
  const candidate = cleanString(value);
  if (!candidate) {
    return "";
  }

  if (/^https?:\/\//i.test(candidate)) {
    return candidate;
  }

  const normalized = candidate.replace(/^\/+/, "");
  return `https://raw.githubusercontent.com/${githubUser}/${repo.name}/${branch}/${normalized}`;
}

async function fetchGithubRepos() {
  const response = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`, {
    headers: {
      "User-Agent": "ujala-portfolio-sync",
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub sync failed with status ${response.status}`);
  }

  const repos = (await response.json())
    .filter((repo) => !repo.fork)
    .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at));

  return {
    repos,
    activity: repos.slice(0, 6).map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language || "Repo update",
      note: repo.description || `Updated ${formatDate(repo.pushed_at)}`,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage || "",
    })),
  };
}

function normalizeProjectManifest(repo, manifest) {
  if (!manifest || typeof manifest !== "object" || manifest.enabled === false) {
    return null;
  }

  const branch = cleanString(repo.default_branch) || "main";
  const project = {
    enabled: true,
    id: cleanString(manifest.id),
    title: cleanString(manifest.title),
    kind: cleanString(manifest.kind),
    status: cleanString(manifest.status),
    priority: Number.isFinite(manifest.priority) ? manifest.priority : 0,
    featured: Boolean(manifest.featured),
    badge: cleanString(manifest.badge),
    icon: cleanString(manifest.icon),
    iconImage: resolveManifestAsset(repo, branch, manifest.iconImage),
    lockupImage: resolveManifestAsset(repo, branch, manifest.lockupImage),
    summary: cleanString(manifest.summary),
    proof: cleanString(manifest.proof),
    details: cleanStringArray(manifest.details),
    architecture: cleanStringArray(manifest.architecture),
    tradeoff: cleanString(manifest.tradeoff),
    tags: cleanStringArray(manifest.tags),
    stack: cleanStringArray(manifest.stack),
    links: {
      live: cleanString(manifest.links?.live) || cleanString(repo.homepage),
      repo: repo.html_url,
    },
    theme: {},
    lensPriority: {},
    repoSync: {
      repo: repo.name,
      manifestPath,
      manifestRequired: true,
    },
  };

  for (const key of themeKeys) {
    const value = cleanString(manifest.theme?.[key]);
    if (value) {
      project.theme[key] = value;
    }
  }

  for (const key of lensKeys) {
    const value = manifest.lensPriority?.[key];
    if (Number.isFinite(value)) {
      project.lensPriority[key] = value;
    }
  }

  const requiredStrings = [
    project.id,
    project.title,
    project.kind,
    project.status,
    project.summary,
    project.proof,
    project.tradeoff,
    project.badge,
    project.icon,
  ];
  const hasRequiredArrays = project.tags.length && project.details.length && project.architecture.length;
  const hasRequiredPriority = lensKeys.every((key) => Number.isFinite(project.lensPriority[key]));

  if (requiredStrings.some((value) => !value) || !hasRequiredArrays || !hasRequiredPriority) {
    return null;
  }

  return project;
}

async function fetchProjectCatalog(repos) {
  const projects = [];

  await Promise.all(
    repos.map(async (repo) => {
      const branch = cleanString(repo.default_branch) || "main";
      const manifestUrl = `https://raw.githubusercontent.com/${githubUser}/${repo.name}/${branch}/${manifestPath}`;

      try {
        const response = await fetch(manifestUrl, {
          headers: {
            "User-Agent": "ujala-portfolio-sync",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const project = normalizeProjectManifest(repo, await response.json());
        if (project) {
          projects.push(project);
        }
      } catch {
        // Ignore repos without manifest support.
      }
    })
  );

  return projects.sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority;
    }
    return left.title.localeCompare(right.title);
  });
}

async function main() {
  const learningLog = await readJson("content/learning-log.json", []);
  const ideaInbox = await readJson("content/idea-inbox.json", []);
  const roadmap = await readJson("content/roadmap.json", []);

  let githubActivity = [];
  let projects = [];
  let repoCount = 0;
  let status = "offline";

  try {
    const githubData = await fetchGithubRepos();
    githubActivity = githubData.activity;
    repoCount = githubData.repos.length;
    projects = await fetchProjectCatalog(githubData.repos);
    status = "synced";
  } catch (error) {
    console.warn(`GitHub sync warning: ${error.message}`);
  }

  const runtime = {
    sync: {
      status,
      syncedAt: new Date().toISOString(),
      syncedAtLabel: formatDate(new Date().toISOString()),
      repoCount,
      githubUser,
    },
    brain: {
      status: "live",
      apiUrl: brainApiUrl,
      label: "Live portfolio brain connected through a serverless backend with portfolio-aware fallback.",
    },
    githubActivity,
    projects,
    learningLog,
    ideaInbox,
    roadmap,
  };

  await writeFile(path.join(rootDir, "portfolio-runtime.json"), `${JSON.stringify(runtime, null, 2)}\n`, "utf8");
  console.log(`portfolio-runtime.json updated with ${projects.length} manifest-backed projects.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
