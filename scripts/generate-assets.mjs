import { existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "assets");
const width = 880;

const themes = {
  dark: {
    bg: "#080B12",
    surface: "#101827",
    fg: "#E7EEF9",
    accent: "#3478F6",
    muted: "#74829B",
    line: "#243044",
  },
  light: {
    bg: "#F4F7FB",
    surface: "#FFFFFF",
    fg: "#101827",
    accent: "#3478F6",
    muted: "#5C6B82",
    line: "#D3DCE8",
  },
};

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const sans = "system-ui, Segoe UI, sans-serif";

const proposal = [
  "I design and build digital solutions",
  "that transform opportunities into",
  "scalable products, processes",
  "and experiences.",
];

const about = [
  ["01", "Systems Information Engineering student with a strong focus on software, systems architecture and digital products."],

  ["02", "🚀 I build solutions that combine frontend, backend, integrations, automation and business logic instead of treating technology as an isolated layer."],

  ["03", "⚙️ Currently working with digital operations, integrations, order flows, automation and operational monitoring in e-commerce environments."],

  ["04", "🧠 Interested in Artificial Intelligence, automation, software engineering, product development and digital business."],

  ["05", "📊 I enjoy turning complex operations into observable systems, dashboards, workflows and measurable processes."],

  ["06", "🧩 I like working on problems where technology meets real business constraints."],

  ["07", "🌎 Building from Argentina, thinking globally."],
];

const pillars = [
  ["01", "Technology", ["Software engineering", "and architecture"]],
  ["02", "Product", ["Digital products and", "product engineering"]],
  ["03", "Automation", ["Workflows, integrations,", "and event-driven systems"]],
  ["04", "Business", ["Digital business and", "entrepreneurship"]],
];

const stack = [
  ["Frontend", ["React   ·   TypeScript   ·   Tailwind CSS", "shadcn/ui   ·   GSAP   ·   Framer Motion", "Three.js   ·   R3F"]],
  ["Backend / Data", ["Node.js   ·   PostgreSQL   ·   Supabase   ·   MongoDB", "Redis   ·   RabbitMQ   ·   REST APIs"]],
  ["Cloud", ["AWS   ·   DigitalOcean   ·   Google Cloud"]],
  ["Automation", ["n8n   ·   Webhooks   · APIs   · Event-driven systems"]],
  ["Tools", ["Git   ·   GitHub   ·   Docker", "Cursor   ·   Figma   ·   Jira"]],
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function documentSvg(height, theme, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <style>
    .motion-dash { stroke-dasharray: 5 7; animation: march 9s linear infinite; }
    .motion-dot { animation: pulse 2.8s ease-in-out infinite; }
    .motion-cursor { animation: blink 1.15s steps(1) infinite; }
    @keyframes march { to { stroke-dashoffset: -96; } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
    @keyframes blink { 0%, 45% { opacity: 1; } 50%, 100% { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) {
      .motion-dash, .motion-dot, .motion-cursor { animation: none; }
    }
  </style>
  <rect width="${width}" height="${height}" fill="${theme.bg}"/>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${theme.line}"/>
  ${body}
</svg>
`;
}

function wrap(value, maxChars) {
  const words = String(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function text(x, y, content, { size, fill, family, weight = 500, anchor = "start", spacing = 0, cls = "" }) {
  const extra = cls ? ` class="${cls}"` : "";
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${spacing}" text-anchor="${anchor}"${extra}>${esc(content)}</text>`;
}

function hero(theme) {
  const nodes = [
    [742, 118],
    [808, 184],
    [742, 250],
    [676, 184],
  ];
  const spokes = nodes
    .map(([x, y]) => `<line x1="742" y1="184" x2="${x}" y2="${y}" stroke="${theme.accent}" stroke-width="1.25" class="motion-dash"/>`)
    .join("");
  const dots = nodes
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${theme.accent}"/>`)
    .join("");
  const lines = proposal
    .map((line, index) => text(32, 214 + index * 32, line, { size: 22, fill: theme.fg, family: sans, weight: 500 }))
    .join("");

  const body = `
    ${text(32, 38, "SYS.IDENTITY", { size: 13, fill: theme.muted, family: mono, spacing: 1.4 })}
    <circle class="motion-dot" cx="168" cy="33" r="4" fill="${theme.accent}"/>
    ${text(848, 38, "AR   /   PUBLIC", { size: 13, fill: theme.accent, family: mono, spacing: 1.2, anchor: "end" })}
    <line x1="32" y1="56" x2="848" y2="56" stroke="${theme.line}"/>
    ${text(32, 112, "Lautaro Lopez Lecube", { size: 40, fill: theme.fg, family: sans, weight: 650 })}
    ${text(32, 146, "SOFTWARE DEVELOPER", { size: 16, fill: theme.accent, family: mono, spacing: 1.6 })}
    ${lines}
    <g>
      <circle cx="742" cy="184" r="36" fill="none" stroke="${theme.accent}" stroke-width="1.25" class="motion-dash"/>
      ${spokes}
      <circle cx="742" cy="184" r="3" fill="${theme.fg}"/>
      ${dots}
    </g>
    <line x1="32" y1="356" x2="848" y2="356" stroke="${theme.line}"/>
    ${text(32, 382, "ready", { size: 14, fill: theme.muted, family: mono })}
    <rect class="motion-cursor" x="84" y="370" width="8" height="14" fill="${theme.accent}"/>
  `;

  return documentSvg(404, theme, body);
}

function aboutSvg(theme) {
  const cardX = 24;
  const cardW = 832;
  let y = 56;
  const blocks = about.map(([code, sentence]) => {
    const lines = wrap(sentence, 70);
    const height = 22 + lines.length * 28 + 18;
    const copy = lines
      .map((line, index) => text(cardX + 78, y + 36 + index * 28, line, { size: 18, fill: theme.fg, family: sans }))
      .join("");
    const block = `
      <rect x="${cardX}" y="${y}" width="${cardW}" height="${height}" fill="${theme.surface}" stroke="${theme.line}"/>
      ${text(cardX + 22, y + 36, code, { size: 13, fill: theme.accent, family: mono, spacing: 1.2 })}
      ${copy}
    `;
    y += height + 12;
    return block;
  });

  const body = `
    ${text(24, 36, "WHO I AM", { size: 13, fill: theme.muted, family: mono, spacing: 1.4 })}
    ${blocks.join("")}
  `;

  return documentSvg(y + 12, theme, body);
}

function pillarsSvg(theme) {
  const cardW = 406;
  const cardH = 150;
  const originX = 24;
  const originY = 64;
  const gap = 20;
  const cards = pillars.map((pillar, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = originX + column * (cardW + gap);
    const y = originY + row * (cardH + gap);
    const [code, title, lines] = pillar;
    const copy = lines
      .map((line, lineIndex) => text(x + 22, y + 96 + lineIndex * 24, line, { size: 18, fill: theme.muted, family: sans }))
      .join("");
    return `
      <rect x="${x}" y="${y}" width="${cardW}" height="${cardH}" fill="${theme.surface}" stroke="${theme.line}"/>
      ${text(x + 22, y + 36, code, { size: 13, fill: theme.accent, family: mono, spacing: 1.2 })}
      ${text(x + 22, y + 68, title, { size: 28, fill: theme.fg, family: sans, weight: 640 })}
      ${copy}
    `;
  });

  const body = `
    ${text(24, 36, "TECHNOLOGY  ×  PRODUCT  ×  AUTOMATION  ×  BUSINESS", { size: 15, fill: theme.muted, family: mono, spacing: 0.6 })}
    <line x1="430" y1="224" x2="450" y2="224" stroke="${theme.accent}" stroke-width="1.5"/>
    <line x1="440" y1="214" x2="440" y2="234" stroke="${theme.accent}" stroke-width="1.5"/>
    <circle class="motion-dot" cx="440" cy="224" r="2.5" fill="${theme.accent}"/>
    ${cards.join("")}
  `;

  return documentSvg(400, theme, body);
}

function stackSvg(theme) {
  let y = 28;
  const bands = stack.map(([label, lines]) => {
    const height = 36 + lines.length * 30 + 18;
    const block = `
      <rect x="24" y="${y}" width="832" height="${height}" fill="${theme.surface}" stroke="${theme.line}"/>
      ${text(44, y + 28, label.toUpperCase(), { size: 13, fill: theme.accent, family: mono, spacing: 1.3 })}
      ${lines.map((line, index) => text(44, y + 58 + index * 30, line, { size: 22, fill: theme.fg, family: sans, weight: 560 })).join("")}
    `;
    y += height + 14;
    return block;
  });

  return documentSvg(y + 10, theme, bands.join(""));
}

function activitySvg(theme, stats) {
  if (!stats) {
    const body = `
      ${text(32, 42, "PUBLIC ACTIVITY", { size: 13, fill: theme.muted, family: mono, spacing: 1.4 })}
      ${text(32, 96, "Snapshot unavailable", { size: 32, fill: theme.fg, family: sans, weight: 640 })}
      ${text(32, 136, "The public GitHub API did not respond. No figures were invented.", { size: 16, fill: theme.muted, family: sans })}
    `;
    return documentSvg(176, theme, body);
  }

  const languageLine = stats.languages.map(([name, count]) => `${name} ${count}`).join("   ·   ");
  const body = `
    ${text(32, 40, "PUBLIC ACTIVITY", { size: 13, fill: theme.muted, family: mono, spacing: 1.4 })}
    ${text(848, 40, "SNAPSHOT", { size: 13, fill: theme.accent, family: mono, spacing: 1.2, anchor: "end" })}
    <line x1="32" y1="56" x2="848" y2="56" stroke="${theme.line}"/>
    ${text(32, 118, String(stats.publicRepos), { size: 48, fill: theme.fg, family: sans, weight: 650 })}
    ${text(32, 148, "PUBLIC REPOS", { size: 13, fill: theme.muted, family: mono, spacing: 1.2 })}
    ${text(320, 118, stats.since, { size: 36, fill: theme.fg, family: sans, weight: 640 })}
    ${text(320, 148, "SINCE", { size: 13, fill: theme.muted, family: mono, spacing: 1.2 })}
    ${text(32, 196, languageLine || "No primary language reported", { size: 20, fill: theme.fg, family: sans, weight: 560 })}
    ${text(32, 226, "Primary language of public repositories, forks excluded.", { size: 14, fill: theme.muted, family: sans })}
  `;

  return documentSvg(256, theme, body);
}

async function loadActivity() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "profile-readme",
  };
  const userResponse = await fetch("https://api.github.com/users/Lautarolecube", { headers });
  if (!userResponse.ok) throw new Error(`user ${userResponse.status}`);
  const user = await userResponse.json();

  const reposResponse = await fetch("https://api.github.com/users/Lautarolecube/repos?per_page=100&type=owner", { headers });
  if (!reposResponse.ok) throw new Error(`repos ${reposResponse.status}`);
  const repos = await reposResponse.json();
  if (!Array.isArray(repos)) throw new Error("repos payload");

  const counts = new Map();
  for (const repo of repos) {
    if (repo.fork || !repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  return {
    publicRepos: user.public_repos,
    since: String(user.created_at).slice(0, 10),
    languages: [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
  };
}

function writeAsset(name, contents) {
  writeFileSync(join(assets, name), contents);
  const bytes = Buffer.byteLength(contents);
  console.log(`${name}  ${bytes} bytes`);
}

for (const [name, theme] of Object.entries(themes)) {
  writeAsset(`hero-${name}.svg`, hero(theme));
  writeAsset(`about-${name}.svg`, aboutSvg(theme));
  writeAsset(`pillars-${name}.svg`, pillarsSvg(theme));
  writeAsset(`stack-${name}.svg`, stackSvg(theme));
}

let stats = null;
try {
  stats = await loadActivity();
  console.log(`activity  repos=${stats.publicRepos} since=${stats.since} languages=${stats.languages.map(([language, count]) => `${language}:${count}`).join(",")}`);
} catch (error) {
  const dark = join(assets, "activity-dark.svg");
  const light = join(assets, "activity-light.svg");
  if (existsSync(dark) && existsSync(light)) {
    console.log(`activity kept previous snapshot (${error.message})`);
  } else {
    console.log(`activity unavailable (${error.message})`);
    for (const [name, theme] of Object.entries(themes)) {
      writeAsset(`activity-${name}.svg`, activitySvg(theme, null));
    }
  }
  process.exit(0);
}

for (const [name, theme] of Object.entries(themes)) {
  writeAsset(`activity-${name}.svg`, activitySvg(theme, stats));
}
