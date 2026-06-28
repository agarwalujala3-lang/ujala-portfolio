import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(rootDir, "dist");
const publicSiteBase = (process.env.PUBLIC_SITE_BASE || "https://ujala-portfolio-world.netlify.app").replace(/\/+$/, "");
const sourcePages = [
  "index.html",
  "work.html",
  "systems.html",
  "about.html",
  "playground.html",
  "contact.html",
];
const passthroughFiles = [
  "styles.css",
  "script.js",
  "portfolio-data.js",
  "portfolio-runtime.json",
  "app-core.js",
  "app-render.js",
  "app-main.js",
  "resume-data.js",
  "resume-renderer.js",
  "resume-runtime.json",
  "robots.txt",
  "sitemap.xml",
];
const passthroughDirs = ["content", "resume"];

function pagePublicUrl(page) {
  return page === "index.html" ? `${publicSiteBase}/` : `${publicSiteBase}/${page}`;
}

function rewriteHeadUrls(html, page) {
  const pageUrl = pagePublicUrl(page);
  return html
    .replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${pageUrl}">`)
    .replace(/<meta property="og:url" content="[^"]+">/, `<meta property="og:url" content="${pageUrl}">`);
}

function rewriteRobots(text) {
  return text.replace(/Sitemap:\s*https:\/\/[^\s]+/i, `Sitemap: ${publicSiteBase}/sitemap.xml`);
}

function rewriteSitemap(text) {
  return text.replace(/https:\/\/agarwalujala3-lang\.github\.io\/ujala-portfolio\//g, `${publicSiteBase}/`);
}

async function main() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  for (const page of sourcePages) {
    const html = await readFile(path.join(rootDir, page), "utf8");
    await writeFile(path.join(distDir, page), rewriteHeadUrls(html, page), "utf8");
  }

  for (const file of passthroughFiles) {
    let content = await readFile(path.join(rootDir, file), "utf8");
    if (file === "robots.txt") {
      content = rewriteRobots(content);
    } else if (file === "sitemap.xml") {
      content = rewriteSitemap(content);
    }
    await writeFile(path.join(distDir, file), content, "utf8");
  }

  for (const dir of passthroughDirs) {
    await cp(path.join(rootDir, dir), path.join(distDir, dir), { recursive: true });
  }

  console.log(`render static build generated: ${sourcePages.length} pages -> ${distDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
