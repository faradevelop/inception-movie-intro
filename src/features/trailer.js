import { $ } from '../utils/dom.js';

export function initTrailer(){
  /* ---------- trailer ---------- */
  (function(){
    const f = $('#trailerFrame'), b = $('#trailerBtn'), l = $('#trailerLabel');
    b.addEventListener('click', function(){
      const src = f.dataset.video;
      if (!src){
        l.textContent = 'Trailer file not attached yet';
        setTimeout(function(){ l.textContent = 'Play trailer'; }, 2600);
        return;
      }
      const v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
      if (f.dataset.poster) v.poster = f.dataset.poster;
      f.appendChild(v); f.classList.add('playing');
    });
  })();
}
