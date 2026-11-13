import { VIBES, getVibes } from "@/lib/vibes";

// Hex colours for the downloadable card (canvas cannot use Tailwind classes).
export const VIBE_HEX = { analytical: "#38bdf8", creative: "#ff5c8a", social: "#2dd4a7", technical: "#ffc933" };

const INTEREST_LABEL = {
  technology: "Technology",
  healthcare: "Healthcare",
  business: "Business",
  creative: "Creative arts",
  science: "Science",
  law: "Law",
};

/**
 * "Career personality" from what the student has told us: their quiz work
 * style counts triple, and the vibe of every saved career counts once. Returns
 * null until there is something to go on.
 */
export function computePersonality(user, savedCareers = []) {
  const tally = {};
  const style = user?.quizAnswers?.workStyle;
  if (style && VIBES[style]) tally[style] = 3;
  savedCareers.forEach((c) => getVibes(c).forEach((v) => (tally[v] = (tally[v] ?? 0) + 1)));

  const ranked = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return null;

  const [vibe] = ranked[0];
  const interests = (user?.quizAnswers?.interests ?? []).map((i) => INTEREST_LABEL[i]).filter(Boolean);
  return {
    vibe,
    persona: VIBES[vibe].persona,
    blurb: VIBES[vibe].blurb,
    secondary: ranked[1] ? VIBES[ranked[1][0]].label : null,
    interests: interests.slice(0, 3),
    careers: savedCareers.slice(0, 3).map((c) => c.title),
  };
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  });
  if (line) lines.push(line);
  return lines;
}

/** Draws the shareable personality card onto a canvas and returns it as a PNG blob. */
export async function renderPersonalityCard({ name, personality }) {
  await Promise.all([document.fonts.load("700 100px Fredoka"), document.fonts.load("600 40px 'Plus Jakarta Sans'"), document.fonts.load("700 56px Caveat")]).catch(() => {});

  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const color = VIBE_HEX[personality.vibe];
  const ink = "#1b1640";

  ctx.fillStyle = "#fff6e5";
  ctx.fillRect(0, 0, W, H);
  // dotted paper
  ctx.fillStyle = "rgba(27,22,64,0.12)";
  for (let x = 20; x < W; x += 44) for (let y = 20; y < H; y += 44) ctx.fillRect(x, y, 4, 4);

  // sticker card with hard shadow
  const cx = 80;
  const cy = 150;
  const cw = W - 160;
  const ch = 960;
  const radius = 64;
  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };
  ctx.fillStyle = ink;
  rr(cx + 18, cy + 18, cw, ch, radius);
  ctx.fill();
  ctx.fillStyle = color;
  rr(cx, cy, cw, ch, radius);
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = ink;
  rr(cx, cy, cw, ch, radius);
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = "700 64px Caveat, cursive";
  ctx.fillText(`${name}'s career personality`, W / 2, cy + 130);

  ctx.font = "700 150px Fredoka, sans-serif";
  const personaLines = wrap(ctx, personality.persona, cw - 120);
  personaLines.forEach((l, i) => ctx.fillText(l, W / 2, cy + 330 + i * 160));

  ctx.font = "600 44px 'Plus Jakarta Sans', sans-serif";
  const blurbLines = wrap(ctx, personality.blurb, cw - 200);
  blurbLines.forEach((l, i) => ctx.fillText(l, W / 2, cy + 470 + i * 62));

  let y = cy + 470 + blurbLines.length * 62 + 70;
  const chip = (text) => {
    ctx.font = "700 40px 'Plus Jakarta Sans', sans-serif";
    const w = ctx.measureText(text).width + 60;
    ctx.fillStyle = "#fff6e5";
    rr(W / 2 - w / 2, y - 44, w, 70, 35);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.fillStyle = ink;
    ctx.fillText(text, W / 2, y + 4);
    y += 92;
  };
  if (personality.interests.length) chip(personality.interests.join("  ·  "));
  if (personality.careers.length) chip(personality.careers.join("  ·  "));

  ctx.fillStyle = ink;
  ctx.font = "700 80px Fredoka, sans-serif";
  ctx.fillText("NexStep", W / 2, H - 140);
  ctx.font = "600 38px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText("Find a career that feels like you", W / 2, H - 80);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
