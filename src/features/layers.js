import { $, $$, RM, clamp } from "../utils/dom.js";

/*
 * Scroll timeline of #dreamStage (0 → 1)
 *
 *   0.00 ─ 0.60   Level 01 → 02 → 03 (nested zoom)
 *   0.56 ─ 1.00   Limbo fades in, copy appears, dusk fades to the
 *                 architecture's colour, then the sticky stage releases
 */

const LEVELS_END = 0.6;
const LIMBO_IN = 0.56;
const TIME = ["\u00D720", "\u00D7400", "\u00D78,000", "\u221E"];

const smooth = (t) => t * t * (3 - 2 * t);

/* crumbling city, drawn once (deterministic) */
function buildRuins(g) {
  if (!g) return;
  let s = 17;
  const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  let x = -20;
  let out = "";
  while (x < 1460) {
    const w = 30 + R() * 80;
    const h = 40 + R() * 170 * (0.35 + 0.65 * Math.abs(Math.sin(x / 230)));
    const y = 300 - h;
    out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="#2b2f34"/>`;
    if (R() > 0.7) {
      out += `<rect x="${(x + w * 0.2).toFixed(1)}" y="${(y - 12 - R() * 22).toFixed(1)}" width="${(w * 0.35).toFixed(1)}" height="34" fill="#2b2f34"/>`;
    }
    x += w + (R() < 0.3 ? 10 + R() * 40 : 2 + R() * 6);
  }
  g.innerHTML = out;
}

export function initDreamLevels() {
  const stage = $("#dreamStage");
  if (!stage) return;

  const layers = $$("[data-dream-layer]", stage);
  if (!layers.length) return;

  /* reduced motion → CSS renders a static stack */
  if (RM) {
    document.documentElement.classList.add("reduced");
    return;
  }

  const sticky = $("#dreamSticky");
  const background = $("#dreamBackground");
  const limbo = $("#dreamLimbo");
  const copy = $("#dreamLimboCopy");
  const dusk = $("#dreamDusk");
  const ruins = $("#dreamRuins");
  const ghost = $("#dreamGhost");
  const hint = $("#dreamHint");
  const hud = $("#dreamHud");
  const timeEl = $("#dreamTime");
  const ticks = $$("[data-tick]", stage);
  const N = layers.length;

  buildRuins($("#dreamRuinsG"));

  let target = 0;
  let current = 0;
  let raf = 0;
  let lastActive = -1;

  /* ---------- render ---------- */

  function render(p) {
    const pl = clamp(p / LEVELS_END, 0, 1); // levels phase
    const pb = clamp((p - LIMBO_IN) / (1 - LIMBO_IN), 0, 1); // limbo phase
    const depth = pl * N;

    /* nested levels */
    layers.forEach((layer, index) => {
      const d = depth - index;
      let scale;
      let opacity;
      let translateY = 0;

      if (d >= 0) {
        // current frame: rushes towards the camera and dissolves
        scale = 1 + d * 1.8;
        opacity = 1 - d * 1.4;

        if (index === N - 1) {
          translateY = Math.min(1, d * 1.4) * 250;
        }
      } else {
        // upcoming frame: waits, small, inside the current one
        scale = 1 + d * 0.5;
        opacity = 1 + d * 1.25;
      }

      const blur = Math.min(Math.abs(d) * 6, 9);

      layer.style.transform = `translateY(${translateY}px) scale(${Math.max(scale, 0.2)})`;
      layer.style.opacity = clamp(opacity, 0, 1);
      layer.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
    });

    /* backdrop & limbo */
    const bgIn = clamp((pl - 0.62) / 0.38, 0, 1);
    const limboOp = smooth(clamp(pb / 0.3, 0, 1));
    const copyIn = smooth(clamp((pb - 0.26) / 0.2, 0, 1));
    const copyOut = smooth(clamp((pb - 0.8) / 0.14, 0, 1));
    const copyOp = copyIn * (1 - copyOut);
    const duskOp = smooth(clamp((pb - 0.72) / 0.28, 0, 1));

    background.style.opacity = bgIn * (1 - limboOp);
    limbo.style.opacity = limboOp;
    copy.style.opacity = copyOp;
    copy.style.transform = `translateY(${((1 - copyIn) * 26 - copyOut * 18).toFixed(1)}px)`;
    dusk.style.opacity = duskOp;
    ruins.style.transform = `translateY(${(pb * 70).toFixed(1)}px)`;
    ghost.style.setProperty("--py", `${(-pb * 60).toFixed(1)}px`);

    hud.style.opacity = 1 - smooth(clamp((pb - 0.62) / 0.2, 0, 1));
    hint.style.opacity = p > 0.02 ? "0" : "1";

    sticky.classList.toggle("dl-light", limboOp > 0.55 && duskOp < 0.5);

    /* HUD state */
    const active = limboOp > 0.5 ? N : clamp(Math.floor(depth + 0.3), 0, N - 1);
    if (active !== lastActive) {
      lastActive = active;
      ticks.forEach((t, i) => {
        t.classList.toggle("on", i === active);
        t.classList.toggle("done", i < active);
      });
      if (timeEl) timeEl.textContent = TIME[active] || TIME[0];
    }
  }

  /* ---------- smoothing ---------- */

  function readTarget() {
    const rect = stage.getBoundingClientRect();
    const dist = stage.offsetHeight - window.innerHeight;
    target = dist > 0 ? clamp(-rect.top / dist, 0, 1) : 0;
  }

  function tick() {
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.0003) {
      current = target;
      raf = 0;
      render(current);
      return;
    }
    render(current);
    raf = requestAnimationFrame(tick);
  }

  function onScroll() {
    readTarget();
    if (!raf) raf = requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  readTarget();
  current = target;
  render(current);
}
