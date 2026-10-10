import { $ } from '../utils/dom.js';

export function initSoundToggle() {
  const soundBtn = $('#soundBtn');
  const audio = $('#ambientAudio');

  if (!soundBtn || !audio) return;

  soundBtn.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
        soundBtn.classList.add('on');
        soundBtn.setAttribute('aria-pressed', 'true');
      } else {
        audio.pause();
        soundBtn.classList.remove('on');
        soundBtn.setAttribute('aria-pressed', 'false');
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  });
}