/* Renders ../film.html to ../film.mp4 by stepping the film clock frame by frame.
   Usage:  npm run render            (30fps, full length)
           node render.mjs --fps 24 --seconds 12   (quick preview)
   Audio:  put the track at ../audio/track.mp3 and it is muxed in and faded out.
*/
import puppeteer from "puppeteer-core";
import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, statSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? a.push([v.slice(2), arr[i + 1] ?? true]) : 0, a), []));
const FPS = Number(args.fps ?? 30);
const LIMIT = args.seconds ? Number(args.seconds) : null;
const OUT = path.join(ROOT, args.out ?? "film.mp4");
const AUDIO = path.join(ROOT, "audio", "track.mp3");
const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].find(existsSync);
if (!CHROME) throw new Error("Chrome not found");

/* tiny static server so fonts/images resolve the same as in the browser */
const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".mp3": "audio/mpeg" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  try {
    statSync(p);
    res.writeHead(200, { "content-type": MIME[path.extname(p)] ?? "application/octet-stream" });
    createReadStream(p).pipe(res);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const PORT = server.address().port;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--font-render-hinting=none"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${PORT}/film.html?render=1`, { waitUntil: "networkidle0" });
await page.evaluate(() => window.FILM_READY);
const DURATION = await page.evaluate(() => window.FILM_DURATION);
const seconds = LIMIT ? Math.min(LIMIT, DURATION) : DURATION;
const frames = Math.ceil(seconds * FPS);
console.log(`rendering ${frames} frames @ ${FPS}fps (${seconds}s) → ${OUT}`);

const hasAudio = existsSync(AUDIO);
const ff = [
  "-y",
  "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  ...(hasAudio ? ["-ss", "0", "-i", AUDIO] : []),
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "18",
  ...(hasAudio ? ["-c:a", "aac", "-b:a", "192k", "-af", `afade=t=out:st=${Math.max(0, seconds - 2.5)}:d=2.5`, "-shortest"] : []),
  "-t", String(seconds),
  "-movflags", "+faststart",
  OUT,
];
const enc = spawn(ffmpegPath, ff, { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((res, rej) => enc.on("close", (c) => (c === 0 ? res() : rej(new Error("ffmpeg exit " + c)))));

const t0 = Date.now();
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.seek(t), i / FPS);
  const buf = await page.screenshot({ type: "jpeg", quality: 95, captureBeyondViewport: false });
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
  if (i % (FPS * 5) === 0) {
    const el = (Date.now() - t0) / 1000;
    console.log(`  frame ${i}/${frames}  t=${(i / FPS).toFixed(1)}s  elapsed ${el.toFixed(0)}s`);
  }
}
enc.stdin.end();
await done;
await browser.close();
server.close();
console.log(`done: ${OUT}${hasAudio ? " (with audio)" : " (silent — add audio/track.mp3 and re-run)"}`);
