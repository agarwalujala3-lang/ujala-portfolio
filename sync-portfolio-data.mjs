import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const githubUser = "agarwalujala3-lang";
const brainApiUrl = "https://d77odxxfwhwwpw4s3c4uvnwcdq0nifbp.lambda-url.ap-south-1.on.aws/";

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

  const repos = await response.json();
  return repos
    .filter((repo) => !repo.fork)
    .sort((left, right) => new Date(right.pushed_at) - new Date(left.pushed_at))
    .slice(0, 6)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      language: repo.language || "Repo update",
      note: repo.description || `Updated ${formatDate(repo.pushed_at)}`,
      pushedAt: repo.pushed_at,
      homepage: repo.homepage || "",
    }));
}

async function main() {
  const learningLog = await readJson("content/learning-log.json", []);
  const ideaInbox = await readJson("content/idea-inbox.json", []);
  const roadmap = await readJson("content/roadmap.json", []);

  let githubActivity = [];
  let status = "offline";

  try {
    githubActivity = await fetchGithubRepos();
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
