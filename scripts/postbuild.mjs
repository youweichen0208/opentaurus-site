import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const indexHtml = path.join(distDir, "index.html");
const notFoundHtml = path.join(distDir, "404.html");

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
}
