import { $, $$, RM } from "../utils/dom.js";

export function initDreamLevels() {
  const background = $("#dreamBackground");
  const stage = $("#dreamStage");
  const hint = $("#dreamHint");
  const layers = $$("[data-dream-layer]", stage);

  if (!stage || !layers.length) return;

  /* -------------------------------------------------------
     Reduced motion
     ------------------------------------------------------- */

  if (RM) {
    document.documentElement.classList.add("reduced");
    return;
  }

  let ticking = false;

  /* -------------------------------------------------------
     Update
     ------------------------------------------------------- */

  function update() {
    const viewportHeight = window.innerHeight;

    const stageRect = stage.getBoundingClientRect();

    const scrollDistance = stage.offsetHeight - viewportHeight;

    if (scrollDistance <= 0) return;

    /*
     * 0 = شروع Level 01
     * 1 = پایان Level 03
     */

    const progress = Math.max(0, Math.min(1, -stageRect.top / scrollDistance));

    const backgroundProgress = Math.max(
      0,
      Math.min(1, (progress - 0.66) / 0.34),
    );

    if (background) {
      background.style.opacity = backgroundProgress;
    }

    /*
     * برای 3 Level:
     *
     * 0 → Level 01
     * 1 → Level 02
     * 2 → Level 03
     */

    const depth = progress * layers.length;

    layers.forEach((layer, index) => {
      const distance = depth - index;

      let scale;
      let opacity;
      let translateY = 0;

      if (distance >= 0) {
        scale = 1 + distance * 1.8;
        opacity = Math.max(0, 1 - distance * 1.4);

        // آخرین Level هنگام خروج به پایین می‌رود
        if (index === layers.length - 1) {
          const fadeProgress = Math.min(1, distance * 1.4);

          translateY = fadeProgress * 250;
        }
      } else {
        scale = 1 + distance * 0.45;
        opacity = Math.max(0, 1 + distance * 1.1);
      }

      const blur = Math.abs(distance) * 6;

      layer.style.transform = `translateY(${translateY}px) scale(${Math.max(scale, 0.2)})`;

      layer.style.opacity = Math.max(0, Math.min(1, opacity));

      layer.style.filter = `blur(${blur}px)`;
    });

    /* ---------- hint ---------- */

    if (hint) {
      hint.style.opacity = progress > 0.05 ? "0" : "1";
    }

    ticking = false;
  }

  /* -------------------------------------------------------
     Request animation frame
     ------------------------------------------------------- */

  function requestUpdate() {
    if (ticking) return;

    ticking = true;

    requestAnimationFrame(update);
  }

  /* -------------------------------------------------------
     Events
     ------------------------------------------------------- */

  window.addEventListener("scroll", requestUpdate, { passive: true });

  window.addEventListener("resize", requestUpdate);

  /* -------------------------------------------------------
     Initial state
     ------------------------------------------------------- */

  update();
}
