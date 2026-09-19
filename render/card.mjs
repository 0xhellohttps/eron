/* Renders a holographic card page (assets/*.html) to a looping MP4 plus a PNG still.
   Usage: node render/card.mjs --page assets/ea.html --out assets/ea-holo --w 1080 --h 1350 [--fps 30] [--still 1.5]
*/
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { existsSync, createReadStream, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? a.push([v.slice(2), arr[i + 1] ?? true]) : 0, a), []));
const PAGE = args.page, OUT = path.join(ROOT, args.out), W = +(args.w ?? 1080), H = +(args.h ?? 1350);
const FPS = +(args.fps ?? 30), STILL = +(args.still ?? 1.5);
const CHROME = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium"].find(existsSync);

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  try { statSync(p); res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" }); createReadStream(p).pipe(res); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"] });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/${PAGE}?render=1`, { waitUntil: "networkidle0" });
await page.evaluate(() => window.CARD_READY);
const DUR = await page.evaluate(() => window.CARD_DURATION);
const frames = Math.round(DUR * FPS);

await page.evaluate((t) => window.seek(t), STILL);
await page.screenshot({ path: OUT + ".png", type: "png", clip: { x: 0, y: 0, width: W, height: H } });

const enc = spawn(ffmpegPath, ["-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "17", "-movflags", "+faststart", OUT + ".mp4"],
  { stdio: ["pipe", "ignore", "inherit"] });
const done = new Promise((res, rej) => enc.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg " + c)))));
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.seek(t), i / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 95, clip: { x: 0, y: 0, width: W, height: H } });
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
}
enc.stdin.end(); await done; await browser.close(); server.close();
console.log(`wrote ${OUT}.png and ${OUT}.mp4 (${frames} frames, ${DUR}s loop)`);
