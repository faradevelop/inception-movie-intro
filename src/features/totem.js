import { $, RM } from '../utils/dom.js';

export function initTotem() {
  /* ---------- the totem ---------- */

  const totemStage = $('#totemStage');
  const totemBtn = $('#totemBtn');
  const totemCap = $('#totemCap');

  const LINES = [
    'You\u2019re waiting for a train\u2026',
    'a train that will take you far away\u2026',
    'You know where you hope it will take you, but you can\u2019t know for sure.',
    'Yet it doesn\u2019t matter. What is real?',
  ];

  let totemBusy = false;

  totemBtn.addEventListener('click', function () {
    if (totemBusy || RM) {
      if (RM) return;
    }

    if (totemBusy) return;

    totemBusy = true;

    totemStage.classList.add('spun');
    totemCap.classList.add('swap');

    const timers = [];

    // Line 1
    timers.push(
      setTimeout(function () {
        totemCap.textContent = LINES[0];
        totemCap.classList.remove('swap');
      }, 700)
    );

    timers.push(
      setTimeout(function () {
        totemCap.classList.add('swap');
      }, 4000)
    );

    // Line 2
    timers.push(
      setTimeout(function () {
        totemCap.textContent = LINES[1];
        totemCap.classList.remove('swap');
      }, 4500)
    );

    timers.push(
      setTimeout(function () {
        totemCap.classList.add('swap');
      }, 8300)
    );

    // Line 3
    timers.push(
      setTimeout(function () {
        totemCap.textContent = LINES[2];
        totemCap.classList.remove('swap');
      }, 8800)
    );

    timers.push(
      setTimeout(function () {
        totemCap.classList.add('swap');
      }, 13800)
    );

    // Line 4
    timers.push(
      setTimeout(function () {
        totemCap.textContent = LINES[3];
        totemCap.classList.remove('swap');
      }, 14300)
    );

    // Stop fast movement
    timers.push(
      setTimeout(function () {
        totemStage.classList.remove('spun');
      }, 19000)
    );

    // Return to initial caption
    timers.push(
      setTimeout(function () {
        totemCap.classList.add('swap');

        setTimeout(function () {
          totemCap.textContent =
            'Click the totem \u2014 it never stopped spinning';

          totemCap.classList.remove('swap');
          totemBusy = false;
        }, 550);
      }, 19500)
    );
  });
}