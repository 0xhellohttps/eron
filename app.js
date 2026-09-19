/* ============================================================
   $ERON — page data + holographic poster + easter egg
   Edit the arrays at the top to change site content.
   ============================================================ */

const TOTAL_SUPPLY = 1_000_000_000;

const ALLOCATION = [
  { key: "comrade", pct: 50, zh: "同志的份额", en: "THE COMRADE'S SHARE", stamp: "待领取",
    mechanism: "public vault, claimable only by the comrade",
    blurb: "five hundred million $ERON in a public vault wallet. it moves only if the comrade claims it himself. until then it sits, as all great things sit, in a trailer in memphis." },
  { key: "workers", pct: 25, zh: "工人的份额", en: "THE WORKERS' SHARE", stamp: "空投",
    mechanism: "equal airdrop to every verified tesla employee",
    blurb: "two hundred fifty million $ERON, split equally across every tesla employee who verifies a company address. from the gigafactory floor to whoever names the cars." },
  { key: "people",  pct: 24, zh: "人民的份额", en: "THE PEOPLE'S SHARE", stamp: "发帖",
    mechanism: "earned through daily posting points + liquidity",
    blurb: "two hundred forty million $ERON for the people, earned one post at a time, plus the liquidity pool. no presale. no insiders. the committee holds nothing it did not buy." },
  { key: "ai",      pct: 1,  zh: "前沿基金", en: "THE FRONTIER FUND", stamp: "捐赠",
    mechanism: "donated to accelerating the frontier of ai",
    blurb: "ten million $ERON donated to accelerating the frontier of ai. the committee does not know which lab. the committee will post a poll." },
];

const PLAN = [
  { title: "the app launches",              date: "year 1",    desc: "the vault is funded. the workers' portal opens. the first daily prompt is published: post about the jump in pennsylvania.", link: "#points" },
  { title: "one hundred billion posts",     date: "year 10",   desc: "the comrade has been notified by registered mail, and by a post. posting is mandatory in the app. the app is not mandatory.", link: "#" },
  { title: "the grandchildren claim",       date: "year 100",  desc: "the workers' share is claimed by the grandchildren of the workers. the poster hangs in every break room. the break rooms are on mars.", link: "#" },
  { title: "the frontier is accelerated",   date: "year 500",  desc: "the frontier of ai has been reached. it did not need our one percent. it says thank you anyway. it says it every morning at 5am.", link: "#" },
  { title: "the best country ever",         date: "year 1000", desc: "america is strong. it was always the best country ever. the comrade is still in the trailer. we will continue what we are already doing.", link: "#" },
];

const POINTS = [
  { activity: "post about the comrade",                 zh: "发布关于同志的帖子", pts: 2,  cap: "5 / day" },
  { activity: "reply to the comrade",                   zh: "回复同志",           pts: 1,  cap: "10 / day" },
  { activity: "repost the comrade",                     zh: "转发同志",           pts: 1,  cap: "10 / day" },
  { activity: "quote-post the film",                    zh: "引用纪录片",         pts: 5,  cap: "1 / day" },
  { activity: "post the poster with #发帖强美",           zh: "发布宣传画",         pts: 3,  cap: "3 / day" },
  { activity: "seven-day posting streak",               zh: "连续发帖七天",       pts: 20, cap: "weekly" },
  { activity: "post 'the best country ever' at 5am",    zh: "凌晨五点发口号",     pts: 3,  cap: "1 / day" },
];

const ROLES = [
  { key: "propagandist", zh: "宣传员", en: "THE PROPAGANDIST", badge: "宣",
    persona: "posts original content about the comrade. never replies. never reads replies.",
    duty: "5 original posts / day", perk: "×2 on 'post about the comrade'", quota: "posts" },
  { key: "reply-soldier", zh: "回复兵", en: "THE REPLY SOLDIER", badge: "兵",
    persona: "first in the replies. every post. every time. has never seen the sun.",
    duty: "10 replies / day, within 60 seconds", perk: "×2 on 'reply to the comrade'", quota: "replies" },
  { key: "repost-worker", zh: "转发工", en: "THE REPOST WORKER", badge: "工",
    persona: "adds nothing. amplifies everything. the honest backbone of the timeline.",
    duty: "10 reposts / day", perk: "×2 on 'repost the comrade'", quota: "reposts" },
  { key: "quote-officer", zh: "引用官", en: "THE QUOTE OFFICER", badge: "官",
    persona: "quote-posts with a take. the take is always 'exactly.'",
    duty: "3 quote-posts / day", perk: "×2 on 'quote-post the film'", quota: "quotes" },
  { key: "dawn-sentinel", zh: "凌晨哨兵", en: "THE DAWN SENTINEL", badge: "哨",
    persona: "posts 'the best country ever' at 5am, every day, in every time zone at once.",
    duty: "1 post at 05:00 local", perk: "streak bonus ×1.5", quota: "dawns" },
  { key: "ratio-brigade", zh: "比例旅", en: "THE RATIO BRIGADE", badge: "旅",
    persona: "finds the critics. brings friends. the reply count exceeds the like count. this is victory.",
    duty: "ratio 1 critic / day", perk: "+5 per confirmed ratio", quota: "ratios" },
  { key: "poster-child", zh: "海报童", en: "THE POSTER CHILD", badge: "童",
    persona: "posts the poster. only the poster. sometimes the poster with a different caption.",
    duty: "3 posters / day with #发帖强美", perk: "×2 on 'post the poster'", quota: "posters" },
  { key: "commissar", zh: "政委", en: "THE COMMISSAR", badge: "委",
    persona: "does not post. grades the posts. assigns the roles. is a rice cooker.",
    duty: "review 50 posts / day", perk: "may reset anyone's streak", quota: "reviews" },
];

const RANKS = [
  { min: 0,    zh: "群众",   en: "THE MASSES",         note: "you have not posted. you are still a citizen." },
  { min: 10,   zh: "积极分子", en: "THE ACTIVIST",     note: "ten points. the algorithm has noticed you." },
  { min: 50,   zh: "先进工作者", en: "MODEL WORKER",  note: "fifty points. your name is on a wall somewhere." },
  { min: 150,  zh: "劳动模范", en: "LABOR HERO",       note: "one hundred fifty. a poster is printed with your handle. the poster is small." },
  { min: 400,  zh: "人民发帖家", en: "PEOPLE'S POSTER", note: "four hundred. you may quote the comrade without reading him." },
  { min: 1000, zh: "元帅",   en: "MARSHAL OF THE TIMELINE", note: "one thousand. the committee salutes you. the committee is a rice cooker." },
];

/* Activity on X: shaped like X's "Trends for you" panel. Static data; swap for a feed later. */
const TRENDS = [
  { cat: "Trending in the Committee",  topic: "#发帖强美",            posts: 48210, note: "post to make america strong" },
  { cat: "Politics · Trending",        topic: "Gasorine Bad",         posts: 31907, note: "the spelling is official" },
  { cat: "Trending in Memphis",        topic: "The Palace",           posts: 12440, note: "it has wheels" },
  { cat: "Business & finance · Trending", topic: "$ERON",             posts: 9876,  note: "there is no token. still trending." },
  { cat: "Trending",                   topic: "1000-year vision",     posts: 7315,  note: "five-year plans are for the reviewed" },
  { cat: "Technology · Trending",      topic: "the frontier",         posts: 5120,  note: "1%. the committee will post a poll." },
  { cat: "Entertainment · Trending",   topic: "The Comrade's Long March", posts: 4402, note: "a documentary of efficiency, departure, and reunion" },
  { cat: "Trending in the break rooms", topic: "the poster",          posts: 3390,  note: "aspirational" },
  { cat: "Only on X",                  topic: "5am",                  posts: 2201,  note: "the dawn sentinels are awake" },
  { cat: "Trending",                   topic: "Effective Altruism",   posts: 1875,  note: "the committee has done the math" },
];

const XSTATS = [
  { label: "posts today",        zh: "今日帖子",   value: "128,904" },
  { label: "replies to the comrade", zh: "回复同志", value: "61,337" },
  { label: "dawn posts (5am)",   zh: "凌晨帖",     value: "2,201" },
  { label: "confirmed ratios",   zh: "确认比例",   value: "9" },
];

const COMRADES = [
  { name: "同志 Commissar",   role: "chief fudder",            initials: "CM", link: "https://x.com/eron_coin" },
  { name: "同志 Rice Cooker", role: "minister of liquidity",   initials: "RC", link: "https://x.com/eron_coin" },
  { name: "同志 Tractor",     role: "head of heavy industry",  initials: "TR", link: "https://x.com/eron_coin" },
  { name: "同志 0xRedStar",   role: "software thingies",       initials: "0x", link: "https://x.com/eron_coin" },
  { name: "同志 Steel Quota", role: "five-year planning",      initials: "SQ", link: "https://x.com/eron_coin" },
  { name: "同志 Intern #7",   role: "reads directives",        initials: "07", link: "https://x.com/eron_coin" },
];

/* ---------------- render ---------------- */
(function renderContent() {
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => n.toLocaleString("en-US");

  const bar = document.getElementById("allocBar");
  if (bar) {
    bar.innerHTML = ALLOCATION.map((a) => `
      <div class="alloc-seg ${a.key}" style="flex:${a.pct}"
           data-tip="${esc(a.en)} · ${a.pct}% · ${fmt(TOTAL_SUPPLY * a.pct / 100)} $ERON">
        <span>${a.pct}%${a.pct >= 10 ? " " + esc(a.en.replace("THE ", "").replace("'S SHARE", "").replace(" FUND", "")) : ""}</span>
      </div>`).join("");
  }

  const table = document.getElementById("allocTable");
  if (table) {
    table.innerHTML = ALLOCATION.map((a) => `
      <tr>
        <td>${esc(a.en)}</td>
        <td>${esc(a.zh)}</td>
        <td class="num">${a.pct}%</td>
        <td>${fmt(TOTAL_SUPPLY * a.pct / 100)}</td>
        <td>${esc(a.mechanism)}</td>
      </tr>`).join("");
  }

  const grid = document.getElementById("allocGrid");
  if (grid) {
    grid.innerHTML = ALLOCATION.map((a) => `
      <div class="share">
        <span class="stamp">${esc(a.stamp)}</span>
        <p class="pct">${a.pct}%</p>
        <p class="share-zh">${esc(a.zh)}</p>
        <p class="share-en">${esc(a.en)}</p>
        <p class="blurb">${esc(a.blurb)}</p>
      </div>`).join("");
  }

  const pts = document.querySelector("#pointsTable tbody");
  if (pts) {
    pts.innerHTML = POINTS.map((p) => `
      <tr><td>${esc(p.activity)}</td><td class="zh">${esc(p.zh)}</td><td class="num">+${p.pts}</td><td>${esc(p.cap)}</td></tr>`).join("");
  }

  const trends = document.getElementById("trendList");
  if (trends) {
    trends.innerHTML = TRENDS.map((t, i) => `
      <li class="trend">
        <div class="trend-rank">${i + 1}</div>
        <div class="trend-body">
          <span class="trend-cat">${esc(t.cat)}</span>
          <a class="trend-topic" href="https://x.com/search?q=${encodeURIComponent(t.topic)}" target="_blank" rel="noopener">${esc(t.topic)}</a>
          <span class="trend-count">${fmt(t.posts)} posts</span>
          <span class="trend-note">${esc(t.note)}</span>
        </div>
        <span class="trend-dots" aria-hidden="true">···</span>
      </li>`).join("");
  }
  const stampEl = document.getElementById("trendStamp");
  if (stampEl) stampEl.textContent = "updated " + new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · by the commissar";
  const xstats = document.getElementById("xStats");
  if (xstats) {
    xstats.innerHTML = XSTATS.map((x) => `
      <div class="xstat"><dt>${esc(x.label)} · <span class="zh">${esc(x.zh)}</span></dt><dd>${esc(x.value)}</dd></div>`).join("");
  }

  const roles = document.getElementById("rolesGrid");
  if (roles) {
    roles.innerHTML = ROLES.map((r) => `
      <div class="role">
        <div class="role-badge">${esc(r.badge)}</div>
        <p class="role-zh">${esc(r.zh)}</p>
        <p class="role-en">${esc(r.en)}</p>
        <p class="role-persona">${esc(r.persona)}</p>
        <dl class="role-meta">
          <dt>duty</dt><dd>${esc(r.duty)}</dd>
          <dt>perk</dt><dd>${esc(r.perk)}</dd>
        </dl>
      </div>`).join("");
  }

  const ranks = document.getElementById("ranksList");
  if (ranks) {
    ranks.innerHTML = RANKS.map((r) => `
      <li>
        <a href="#points">${esc(r.en)} <span class="zh">${esc(r.zh)}</span></a>
        <span class="date">${r.min} pts</span>
        <p class="desc">${esc(r.note)}</p>
      </li>`).join("");
  }

  // browser-only posting counter (localStorage is a per-viewer convenience, nothing more)
  const num = document.getElementById("streakNum");
  const rankLabel = document.getElementById("rankLabel");
  const sb = document.getElementById("studyBtn"), rb = document.getElementById("resetBtn");
  if (num && sb && rb) {
    const KEY = "eron-posting-points";
    const read = () => { try { return Number(localStorage.getItem(KEY) || 0); } catch { return 0; } };
    const write = (v) => { try { localStorage.setItem(KEY, String(v)); } catch {} };
    const rankFor = (v) => [...RANKS].reverse().find((r) => v >= r.min) || RANKS[0];
    const show = (v) => {
      num.textContent = v;
      if (rankLabel) { const r = rankFor(v); rankLabel.textContent = `rank: ${r.zh} · ${r.en}`; }
    };
    let v = read(); show(v);
    sb.addEventListener("click", () => { v = v + 1; write(v); show(v); });
    rb.addEventListener("click", () => { v = 0; write(v); show(v); });
  }

  const plan = document.getElementById("planList");
  if (plan) {
    plan.innerHTML = PLAN.map((b) => `
      <li>
        <a href="${esc(b.link)}">${esc(b.title)}</a>
        <span class="date">${esc(b.date)}</span>
        <p class="desc">${esc(b.desc)}</p>
      </li>`).join("");
  }

  const comrades = document.getElementById("comradesGrid");
  if (comrades) {
    comrades.innerHTML = COMRADES.map((c) => `
      <div class="comrade">
        <div class="avatar">${esc(c.initials)}</div>
        <p class="name">${esc(c.name)}</p>
        <p class="role">${esc(c.role)}</p>
        <a href="${esc(c.link)}" target="_blank" rel="noopener">profile →</a>
      </div>`).join("");
  }
})();

/* ---------------- holographic poster ---------------- */
(function holo() {
  const root = document.documentElement;
  const card = document.getElementById("card");
  const img  = document.getElementById("poster");
  const btn  = document.getElementById("motionBtn");
  if (!card || !img) return;

  const target = { x: 0, y: 0 };
  const cur    = { x: 0, y: 0 };
  const clamp  = (v, a, b) => Math.min(b, Math.max(a, v));

  img.addEventListener("load", () => {
    card.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
  });
  img.addEventListener("error", () => card.classList.add("no-image"));

  function render() {
    cur.x += (target.x - cur.x) * 0.12;
    cur.y += (target.y - cur.y) * 0.12;

    // x sweeps the full hue wheel; y adds a partial shift so diagonals differ.
    const hue = ((cur.x + 1) * 180 + (cur.y + 1) * 90) % 360;

    root.style.setProperty("--mx",  cur.x.toFixed(4));
    root.style.setProperty("--my",  cur.y.toFixed(4));
    root.style.setProperty("--hue", hue.toFixed(1) + "deg");
    root.style.setProperty("--px",  ((cur.x + 1) * 50).toFixed(2) + "%");
    root.style.setProperty("--py",  ((cur.y + 1) * 50).toFixed(2) + "%");

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  /* Desktop: mouse position anywhere on the page drives hue + sheen. */
  const hasFinePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasFinePointer) {
    window.addEventListener("mousemove", (e) => {
      target.x = clamp((e.clientX / innerWidth)  * 2 - 1, -1, 1);
      target.y = clamp((e.clientY / innerHeight) * 2 - 1, -1, 1);
    }, { passive: true });
    document.addEventListener("mouseleave", () => { target.x = 0; target.y = 0; });
  }

  /* Mobile: device orientation drives hue + sheen. */
  let orientationActive = false;
  let baseBeta = null;

  function onOrientation(e) {
    if (e.beta == null || e.gamma == null) return;
    orientationActive = true;
    btn.classList.remove("show");
    if (baseBeta === null) baseBeta = e.beta;

    let gx = e.gamma;
    let gy = e.beta - baseBeta;

    const angle = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    if (angle === 90)  { [gx, gy] = [ gy, -gx]; }
    if (angle === -90 || angle === 270) { [gx, gy] = [-gy,  gx]; }

    target.x = clamp(gx / 35, -1, 1);
    target.y = clamp(gy / 35, -1, 1);
  }

  function startOrientation() {
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
  }

  async function requestMotion() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" &&
          typeof DeviceOrientationEvent.requestPermission === "function") {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === "granted") startOrientation();
      } else {
        startOrientation();
      }
    } catch (_) { /* denied or unsupported; touch fallback still works */ }
    btn.classList.remove("show");
  }
  btn.addEventListener("click", requestMotion);

  if (!hasFinePointer) {
    if (typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function") {
      btn.classList.add("show"); // iOS 13+ needs a tap first
    } else {
      startOrientation();
    }

    // Touch fallback scoped to the poster so page scrolling still works.
    card.addEventListener("touchmove", (e) => {
      if (orientationActive) return;
      const t = e.touches[0];
      const r = card.getBoundingClientRect();
      target.x = clamp(((t.clientX - r.left) / r.width)  * 2 - 1, -1, 1);
      target.y = clamp(((t.clientY - r.top)  / r.height) * 2 - 1, -1, 1);
    }, { passive: true });
  }

  window.addEventListener("orientationchange", () => { baseBeta = null; });
})();

/* ---------------- konami easter egg ---------------- */
(function konami() {
  const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let i = 0;
  const toast = document.getElementById("toast");

  window.addEventListener("keydown", (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    i = (k === seq[i]) ? i + 1 : (k === seq[0] ? 1 : 0);
    if (i === seq.length) {
      i = 0;
      document.body.classList.toggle("glorious");
      if (toast) {
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2600);
      }
    }
  });
})();
