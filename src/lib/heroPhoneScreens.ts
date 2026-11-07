export const HERO_SCREEN_W = 540;
export const HERO_SCREEN_H = 1168;

export type HeroScreenId = "hello" | "care" | "ready";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function statusBar(ctx: CanvasRenderingContext2D, light: boolean) {
  ctx.fillStyle = light ? "#1d1d1f" : "rgba(255,255,255,0.9)";
  ctx.font = "600 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("9:41", 42, 58);
  // signal dots
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(420 + i * 14, 52, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = light
      ? i < 3
        ? "#1d1d1f"
        : "rgba(29,29,31,0.25)"
      : i < 3
        ? "#fff"
        : "rgba(255,255,255,0.3)";
    ctx.fill();
  }
  roundRect(ctx, 478, 42, 36, 16, 4);
  ctx.fillStyle = light ? "#1d1d1f" : "#fff";
  ctx.fill();
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
  return yy;
}

export function paintHeroPhoneScreen(
  ctx: CanvasRenderingContext2D,
  id: HeroScreenId,
) {
  const W = HERO_SCREEN_W;
  const H = HERO_SCREEN_H;

  if (id === "hello") {
    // soft dark gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#141418");
    g.addColorStop(1, "#0a0a0c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    statusBar(ctx, false);

    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("MISHA DZHURAN", 44, 150);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 52px -apple-system, BlinkMacSystemFont, sans-serif";
    ["I help you", "build products", "people open."].forEach((l, i) =>
      ctx.fillText(l, 44, 230 + i * 62),
    );

    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "400 25px -apple-system, BlinkMacSystemFont, sans-serif";
    wrap(
      ctx,
      "Apps and websites, clear design, clean code, calm launch.",
      44,
      450,
      W - 88,
      34,
    );

    const pills = [
      { t: "Mobile apps", c: "#0A84FF" },
      { t: "Websites", c: "#30D158" },
      { t: "Launch & care", c: "#FF9F0A" },
    ];
    pills.forEach((p, i) => {
      const y = 620 + i * 110;
      roundRect(ctx, 44, y, W - 88, 90, 26);
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(88, y + 45, 8, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "600 28px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(p.t, 118, y + 55);
    });

    // home indicator
    roundRect(ctx, W / 2 - 60, H - 28, 120, 5, 3);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fill();
    return;
  }

  if (id === "care") {
    ctx.fillStyle = "#f5f5f7";
    ctx.fillRect(0, 0, W, H);
    statusBar(ctx, true);

    ctx.fillStyle = "#86868b";
    ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("HOW WE WORK", 44, 150);

    ctx.fillStyle = "#1d1d1f";
    ctx.font = "700 48px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Simple steps.", 44, 230);
    ctx.fillText("No surprises.", 44, 288);

    const steps = [
      { n: "1", t: "We talk", d: "You share the idea" },
      { n: "2", t: "We agree", d: "Clear plan & price" },
      { n: "3", t: "We build", d: "You see progress" },
      { n: "4", t: "We launch", d: "Live & supported" },
    ];
    steps.forEach((s, i) => {
      const y = 360 + i * 130;
      roundRect(ctx, 44, y, W - 88, 108, 28);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.07)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 6;
      ctx.fill();
      ctx.shadowColor = "transparent";

      ctx.beginPath();
      ctx.arc(98, y + 54, 26, 0, Math.PI * 2);
      ctx.fillStyle = "#0071e3";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "700 24px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(s.n, s.n === "1" ? 92 : 90, y + 62);

      ctx.fillStyle = "#1d1d1f";
      ctx.font = "700 28px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(s.t, 146, y + 48);
      ctx.fillStyle = "#6e6e73";
      ctx.font = "400 22px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(s.d, 146, y + 80);
    });

    roundRect(ctx, W / 2 - 60, H - 28, 120, 5, 3);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fill();
    return;
  }

  // ready, soft blue glass feel
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#2997ff");
  g.addColorStop(1, "#0071e3");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  statusBar(ctx, false);

  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("READY WHEN YOU ARE", 44, 160);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 50px -apple-system, BlinkMacSystemFont, sans-serif";
  ["Let’s build", "something", "people trust."].forEach((l, i) =>
    ctx.fillText(l, 44, 250 + i * 62),
  );

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "400 26px -apple-system, BlinkMacSystemFont, sans-serif";
  wrap(
    ctx,
    "One clear path from idea to launch, so you always know what’s next.",
    44,
    480,
    W - 88,
    36,
  );

  roundRect(ctx, 44, 780, W - 88, 160, 32);
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fill();
  ctx.fillStyle = "#86868b";
  ctx.font = "600 20px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Say hello", 76, 850);
  ctx.fillStyle = "#1d1d1f";
  ctx.font = "700 28px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("hello@mishadzhuran.com", 76, 900);

  roundRect(ctx, W / 2 - 60, H - 28, 120, 5, 3);
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fill();
}
