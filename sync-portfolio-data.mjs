import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const githubUser = "agarwalujala3-lang";
const brainApiUrl = "https://d77odxxfwhwwpw4s3c4uvnwcdq0nifbp.lambda-url.ap-south-1.on.aws/";
const projectBrandingSources = [
  { id: "receiptpulse", repo: "ReceiptPulse", manifestPath: "portfolio-branding.json" },
  { id: "lumenstack", repo: "LumenStack-AI", manifestPath: "portfolio-branding.json" },
  { id: "amazon-ui-clone", repo: "Amazon-UI-Clone", manifestPath: "portfolio-branding.json" },
  { id: "valentine", repo: "VALENTINE-CHAUDHRAIN", manifestPath: "portfolio-branding.json" },
];

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
    repoMap: new Map(repos.map((repo) => [repo.name, repo])),
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

function normalizeProjectBranding(manifest) {
  if (!manifest || typeof manifest !== "object") {
    return null;
  }

  const branding = {};

  ["title", "icon", "iconImage", "lockupImage", "badge", "accent", "brandTheme"].forEach((key) => {
    if (typeof manifest[key] === "string" && manifest[key].trim()) {
      branding[key] = manifest[key].trim();
    }
  });

  if (manifest.theme && typeof manifest.theme === "object") {
    const theme = {};
    [
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
    ].forEach((key) => {
      if (typeof manifest.theme[key] === "string" && manifest.theme[key].trim()) {
        theme[key] = manifest.theme[key].trim();
      }
    });

    if (Object.keys(theme).length) {
      branding.theme = theme;
    }
  }

  return Object.keys(branding).length ? branding : null;
}

async function fetchProjectBranding(repoMap) {
  const entries = await Promise.all(
    projectBrandingSources.map(async (source) => {
      const repo = repoMap.get(source.repo);
      if (!repo) {
        return null;
      }

      const branch = repo.default_branch || "main";
      const manifestUrl = `https://raw.githubusercontent.com/${githubUser}/${source.repo}/${branch}/${source.manifestPath}`;

      try {
        const response = await fetch(manifestUrl, {
          headers: {
            "User-Agent": "ujala-portfolio-sync",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          return null;
        }

        const branding = normalizeProjectBranding(await response.json());
        return branding ? [source.id, branding] : null;
      } catch {
        return null;
      }
    })
  );

  return Object.fromEntries(entries.filter(Boolean));
}

async function main() {
  const learningLog = await readJson("content/learning-log.json", []);
  const ideaInbox = await readJson("content/idea-inbox.json", []);
  const roadmap = await readJson("content/roadmap.json", []);

  let githubActivity = [];
  let projectBranding = {};
  let status = "offline";

  try {
    const githubData = await fetchGithubRepos();
    githubActivity = githubData.activity;
    projectBranding = await fetchProjectBranding(githubData.repoMap);
    status = "synced";
  } catch (error) {
    console.warn(`GitHub sync warning: ${error.message}`);
  }

  const runtime = {
    sync: {
      status,
      syncedAt: new Date().toISOString(),
      syncedAtLabel: formatDate(new Date().toISOString()),
      repoCount: githubActivity.length,
      githubUser,
    },
    brain: {
      status: "live",
      apiUrl: brainApiUrl,
      label: "Live portfolio brain connected through a serverless backend with portfolio-aware fallback.",
    },
    githubActivity,
    projectBranding,
    learningLog,
    ideaInbox,
    roadmap,
  };

  await writeFile(path.join(rootDir, "portfolio-runtime.json"), `${JSON.stringify(runtime, null, 2)}\n`, "utf8");
  console.log(`portfolio-runtime.json updated with ${githubActivity.length} repo entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
