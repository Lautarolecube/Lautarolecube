import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assets = join(root, "assets");
const width = 880;

const themes = {
  dark: {
    bg: "#05060A",
    surface: "#10182A",
    fg: "#F4F7FF",
    accent: "#F6D43A",
    muted: "#8B97B3",
    line: "#1A4DFF",
    wallHi: "#5C86FF",
    ink: "#070B16",
  },
  light: {
    bg: "#EEF2FA",
    surface: "#FFFFFF",
    fg: "#101827",
    accent: "#C89600",
    muted: "#5C6B82",
    line: "#1A4DFF",
    wallHi: "#6E97FF",
    ink: "#12306E",
  },
};

const mono = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const sans = "system-ui, Segoe UI, sans-serif";

const about = [
  ["01", "💻 Systems Information Engineering student with a strong focus on software, systems architecture and digital products."],

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

const stackIcons = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "stack-icons.json"), "utf8"));

const stack = [
  ["Frontend", [
    ["React", "react"],
    ["Tailwind CSS", "tailwindcss"],
    ["shadcn/ui", "shadcnui"],
    ["GSAP", "gsap"],
    ["Framer Motion", "framer"],
    ["Three.js", "threedotjs"],
    ["R3F", "r3f"],
  ]],
  ["Backend / Data", [
    ["TypeScript", "typescript"],
    ["JavaScript", "javascript"],
    ["REST APIs", "rest"],
    ["OpenAPI", "openapiinitiative"],
    ["Python", "python"],
    ["Node.js", "nodedotjs"],
    ["PostgreSQL", "postgresql"],
    ["Supabase", "supabase"],
    ["MongoDB", "mongodb"],
    ["Redis", "redis"],
    ["RabbitMQ", "rabbitmq"],
  ]],
  ["Cloud and OPS", [
    ["AWS", "aws"],
    ["DigitalOcean", "digitalocean"],
    ["Google Cloud", "googlecloud"],
    ["Docker", "docker"],
    ["GitHub Actions", "githubactions"],
  ]],
  ["Automation", [
    ["n8n", "n8n"],
    ["Webhooks", "webhooks"],
    ["APIs", "apis"],
    ["Event-driven systems", "events"],
  ]],
  ["Tools", [
    ["Git", "git"],
    ["GitHub", "github"],
    ["Bash", "gnubash"],
    ["Cursor", "cursor"],
    ["Figma", "figma"],
    ["Jira", "jira"],
  ]],
];

const contact = [
  ["01", "LinkedIn", "https://www.linkedin.com/in/lautaro-lópez-lecube-7a9b3a25b/"],
  ["02", "GitHub", "https://github.com/Lautarolecube"],
  ["03", "Email", "mailto:lautalecube@gmail.com"],
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pixelWindow(x, y, w, h, theme) {
  return [
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${theme.line}"/>`,
    `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="2" fill="${theme.wallHi}"/>`,
    `<rect x="${x + 2}" y="${y + 2}" width="2" height="${h - 4}" fill="${theme.wallHi}"/>`,
    `<rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" fill="${theme.ink}"/>`,
    `<rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" fill="${theme.surface}"/>`,
  ].join("");
}

function documentSvg(height, theme, body, { frame = true } = {}) {
  const border = frame ? pixelWindow(0, 0, width, height, theme) : "";
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
  ${border}
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
      ${pixelWindow(cardX, y, cardW, height, theme)}
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
      ${pixelWindow(x, y, cardW, cardH, theme)}
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

function iconFill(hex, theme) {
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance < 0.22 ? theme.fg : `#${hex}`;
}

function customIcon(kind, theme) {
  if (kind === "aws") {
    return `<path d="M6.2 15.4c0-.4 0-.8.1-1.1.3-1.4 1.5-2.5 3-2.8.6-2.3 2.7-4 5.1-4 2.3 0 4.3 1.5 5 3.6 1.8.2 3.2 1.7 3.2 3.5 0 2-1.6 3.5-3.5 3.5H8.6c-1.4 0-2.4-1-2.4-2.7z"/>`;
  }
  if (kind === "r3f") {
    return `<path fill="${theme.accent}" d="M12 3.5 19.5 8 12 12.5 4.5 8Z"/><path fill="${theme.line}" d="M4.5 8 12 12.5 12 20.5 4.5 16Z"/><path fill="${theme.wallHi}" d="M12 12.5 19.5 8 19.5 16 12 20.5Z"/>`;
  }
  if (kind === "rest") {
    return `<rect x="1" y="6" width="8" height="12"/><rect x="15" y="6" width="8" height="12"/><rect x="9" y="10.5" width="6" height="3" fill="${theme.line}"/>`;
  }
  if (kind === "webhooks") {
    return `<rect x="8" y="1" width="7" height="6"/><rect x="8" y="6" width="4" height="9"/><rect x="8" y="15" width="12" height="4"/><rect x="16" y="8" width="4" height="11"/>`;
  }
  if (kind === "apis") {
    return `<rect x="1" y="2" width="4" height="20"/><rect x="1" y="2" width="9" height="4"/><rect x="1" y="18" width="9" height="4"/><rect x="19" y="2" width="4" height="20"/><rect x="14" y="2" width="9" height="4"/><rect x="14" y="18" width="9" height="4"/>`;
  }
  if (kind === "events") {
    return `<rect x="1" y="8" width="6" height="8"/><rect x="9" y="8" width="6" height="8"/><rect x="17" y="8" width="6" height="8"/><rect x="7" y="11" width="2" height="2" fill="${theme.line}"/><rect x="15" y="11" width="2" height="2" fill="${theme.line}"/>`;
  }
  return "";
}

function stackIcon(slug, x, y, size, theme) {
  const scale = size / 24;
  const brand = stackIcons[slug];
  const fill = brand ? iconFill(brand.hex, theme) : theme.accent;
  const body = brand
    ? brand.paths.map((path) => `<path d="${esc(path)}"/>`).join("")
    : customIcon(slug, theme);
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${fill}">${body}</g>`;
}

function stackSvg(theme) {
  let y = 28;
  const rowH = 58;
  const iconSize = 34;
  const bands = stack.map(([label, tools]) => {
    const rows = Math.ceil(tools.length / 2);
    const height = 46 + rows * rowH + 8;
    const items = tools.map(([name, slug], index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const iconX = 48 + column * 412;
      const iconY = y + 48 + row * rowH;
      return `
        ${stackIcon(slug, iconX, iconY, iconSize, theme)}
        ${text(iconX + iconSize + 14, iconY + 24, name, { size: 20, fill: theme.fg, family: sans, weight: 560 })}
      `;
    }).join("");
    const block = `
      ${pixelWindow(24, y, 832, height, theme)}
      ${text(48, y + 30, label.toUpperCase(), { size: 13, fill: theme.accent, family: mono, spacing: 1.3 })}
      ${items}
    `;
    y += height + 14;
    return block;
  });

  return documentSvg(y + 10, theme, bands.join(""));
}

function contactHrefText(href) {
  if (href.startsWith("mailto:")) return href.slice("mailto:".length);
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function contactSlug(label) {
  return label.toLowerCase();
}

function contactCardSvg(theme, code, label, href) {
  const body = `
    ${pixelWindow(12, 4, 856, 100, theme)}
    ${text(46, 36, code, { size: 13, fill: theme.accent, family: mono, spacing: 1.2 })}
    ${text(102, 40, label, { size: 22, fill: theme.fg, family: sans, weight: 640 })}
    ${text(102, 70, contactHrefText(href), { size: 16, fill: theme.muted, family: mono })}
  `;
  return documentSvg(108, theme, body, { frame: false });
}

function contactReadme() {
  const cards = contact.map(([, label, href]) => {
    const slug = contactSlug(label);
    return `<a href="${esc(href)}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/contact-${slug}-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="assets/contact-${slug}-light.svg">
    <img src="assets/contact-${slug}-dark.svg" width="100%" alt="${esc(label)}, ${esc(contactHrefText(href))}">
  </picture>
</a>`;
  });
  return `<div align="center">\n${cards.join("\n")}\n</div>`;
}

function writeContactReadme() {
  const readmePath = join(root, "README.md");
  const readme = readFileSync(readmePath, "utf8");
  const start = "<!-- contact:start -->";
  const end = "<!-- contact:end -->";
  if (!readme.includes(start) || !readme.includes(end)) {
    throw new Error("README is missing contact markers");
  }
  const next = readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n${contactReadme()}\n${end}`);
  writeFileSync(readmePath, next);
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

const hero = spawnSync("python", ["scripts/generate-hero.py"], { cwd: root, stdio: "inherit" });
if (hero.status !== 0) {
  const dark = join(assets, "hero-dark.gif");
  const light = join(assets, "hero-light.gif");
  if (existsSync(dark) && existsSync(light)) {
    console.log("hero kept previous files");
  } else {
    throw new Error("hero failed");
  }
}

for (const [name, theme] of Object.entries(themes)) {
  writeAsset(`about-${name}.svg`, aboutSvg(theme));
  writeAsset(`pillars-${name}.svg`, pillarsSvg(theme));
  writeAsset(`stack-${name}.svg`, stackSvg(theme));
}

for (const [code, label, href] of contact) {
  const slug = contactSlug(label);
  for (const [name, theme] of Object.entries(themes)) {
    writeAsset(`contact-${slug}-${name}.svg`, contactCardSvg(theme, code, label, href));
  }
}

writeContactReadme();

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
