import { readdir, readFile, stat, writeFile } from "node:fs/promises";
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
const requiredStringKeys = ["id", "title", "kind", "status", "summary", "proof", "tradeoff", "badge", "icon"];

async function readJson(relativePath, fallback) {
  try {
    const file = await readFile(path.join(rootDir, relativePath), "utf8");
    return JSON.parse(file);
  } catch {
    return fallback;
  }
}

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readLocalGitCommitIso(repoDir) {
  try {
    const refPath = path.join(repoDir, ".git", "refs", "heads", "main");
    const refStats = await stat(refPath);
    return refStats.mtime.toISOString();
  } catch {
    return "";
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

  const version = cleanString(repo?.pushed_at || repo?.updated_at || "");
  const baseUrl = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://raw.githubusercontent.com/${githubUser}/${repo.name}/${branch}/${candidate.replace(/^\/+/, "")}`;

  if (!version) {
    return baseUrl;
  }

  try {
    const parsedUrl = new URL(baseUrl);
    parsedUrl.searchParams.set("v", version);
    return parsedUrl.toString();
  } catch {
    const joinChar = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${joinChar}v=${encodeURIComponent(version)}`;
  }
}

function validateManifestShape(manifest) {
  const issues = [];
  if (!manifest || typeof manifest !== "object") {
    return ["Manifest is not a valid JSON object."];
  }

  for (const key of requiredStringKeys) {
    if (!cleanString(manifest[key])) {
      issues.push(`Missing required string: ${key}`);
    }
  }

  if (!Number.isFinite(manifest.priority)) {
    issues.push("Missing required number: priority");
  }

  if (typeof manifest.featured !== "boolean") {
    issues.push("Missing required boolean: featured");
  }

  if (!Array.isArray(manifest.tags) || cleanStringArray(manifest.tags).length === 0) {
    issues.push("Missing required non-empty array: tags");
  }

  if (!Array.isArray(manifest.details) || cleanStringArray(manifest.details).length === 0) {
    issues.push("Missing required non-empty array: details");
  }

  if (!Array.isArray(manifest.architecture) || cleanStringArray(manifest.architecture).length === 0) {
    issues.push("Missing required non-empty array: architecture");
  }

  for (const key of lensKeys) {
    if (!Number.isFinite(manifest.lensPriority?.[key])) {
      issues.push(`Missing required lensPriority.${key}`);
    }
  }

  if (!manifest.links || typeof manifest.links !== "object") {
    issues.push("Missing links object (links.live is optional but links must exist).");
  }

  for (const key of themeKeys) {
    if (!cleanString(manifest.theme?.[key])) {
      issues.push(`Missing required theme.${key}`);
    }
  }

  return issues;
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

  return project;
}

async function fetchProjectCatalog(repos) {
  const projects = [];
  const warnings = [];

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

        const manifest = await response.json();
        const issues = validateManifestShape(manifest);
        if (issues.length > 0) {
          warnings.push({
            repo: repo.name,
            issues,
          });
          return;
        }

        const project = normalizeProjectManifest(repo, manifest);
        if (project) {
          projects.push(project);
        }
      } catch {
        // Ignore repos without manifest support.
      }
    })
  );

  return {
    projects: projects.sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }
      return left.title.localeCompare(right.title);
    }),
    warnings,
  };
}

async function fetchLocalManifestCatalog() {
  const workspaceDir = path.dirname(rootDir);
  const entries = await readdir(workspaceDir, { withFileTypes: true });
  const repos = [];
  const warnings = [];

  await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const repoName = cleanString(entry.name);
        if (!repoName || repoName === path.basename(rootDir)) {
          return;
        }

        const repoDir = path.join(workspaceDir, repoName);
        const candidateManifestPath = path.join(repoDir, manifestPath);
        if (!(await pathExists(candidateManifestPath))) {
          return;
        }

        try {
          const manifest = JSON.parse(await readFile(candidateManifestPath, "utf8"));
          const issues = validateManifestShape(manifest);
          if (issues.length > 0) {
            warnings.push({
              repo: repoName,
              issues,
            });
            return;
          }

          const manifestStats = await stat(candidateManifestPath);
          const commitIso = (await readLocalGitCommitIso(repoDir)) || manifestStats.mtime.toISOString();
          const repo = {
            name: repoName,
            default_branch: "main",
            pushed_at: commitIso,
            updated_at: commitIso,
            html_url: `https://github.com/${githubUser}/${repoName}`,
            homepage: cleanString(manifest.links?.live),
            language: cleanString(manifest.stack?.[0]) || "Project update",
            description: cleanString(manifest.summary) || `Updated ${formatDate(commitIso)}`,
          };

          const project = normalizeProjectManifest(repo, manifest);
          if (project) {
            repos.push(repo);
          }
        } catch (error) {
          warnings.push({
            repo: repoName,
            issues: [`Local manifest read failed: ${error.message}`],
          });
        }
      })
  );

  const activity = repos
    .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at))
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language || "Project update",
      note: repo.description || `Updated ${formatDate(repo.pushed_at)}`,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage || "",
    }));

  const projects = repos
    .map((repo) => {
      const manifestFile = path.join(workspaceDir, repo.name, manifestPath);
      return readFile(manifestFile, "utf8")
        .then((file) => normalizeProjectManifest(repo, JSON.parse(file)))
        .catch(() => null);
    });

  return {
    repos,
    activity,
    projects: (await Promise.all(projects))
      .filter(Boolean)
      .sort((left, right) => {
        if (right.priority !== left.priority) {
          return right.priority - left.priority;
        }
        return left.title.localeCompare(right.title);
      }),
    warnings,
  };
}

async function main() {
  const learningLog = await readJson("content/learning-log.json", []);
  const ideaInbox = await readJson("content/idea-inbox.json", []);
  const roadmap = await readJson("content/roadmap.json", []);

  let githubActivity = [];
  let projects = [];
  let repoCount = 0;
  let status = "offline";
  let source = "none";

  try {
    const githubData = await fetchGithubRepos();
    githubActivity = githubData.activity;
    repoCount = githubData.repos.length;
    const catalog = await fetchProjectCatalog(githubData.repos);
    projects = catalog.projects;
    if (catalog.warnings.length) {
      console.warn("Project manifest warnings:");
      for (const warning of catalog.warnings) {
        console.warn(`- ${warning.repo}: ${warning.issues.join("; ")}`);
      }
    }
    status = "synced";
    source = "github";
  } catch (error) {
    console.warn(`GitHub sync warning: ${error.message}`);
    try {
      const localCatalog = await fetchLocalManifestCatalog();
      githubActivity = localCatalog.activity;
      projects = localCatalog.projects;
      repoCount = localCatalog.repos.length;
      if (localCatalog.warnings.length) {
        console.warn("Local manifest warnings:");
        for (const warning of localCatalog.warnings) {
          console.warn(`- ${warning.repo}: ${warning.issues.join("; ")}`);
        }
      }
      status = "synced";
      source = "local-manifests";
    } catch (localError) {
      console.warn(`Local manifest fallback warning: ${localError.message}`);
    }
  }

  const runtime = {
    sync: {
      status,
      syncedAt: new Date().toISOString(),
      syncedAtLabel: formatDate(new Date().toISOString()),
      repoCount,
      githubUser,
      source,
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
