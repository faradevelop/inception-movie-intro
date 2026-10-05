import { $ } from '../utils/dom.js';

/* Assets live in /public → served from the site root (dev) and copied to dist (build).
   JS-created URLs are not rewritten by Vite, so normalise them against BASE_URL. */
const asset = (p) => p ? import.meta.env.BASE_URL + p.replace(/^\/?(?:public\/)?/, '') : p;

export function initTrailer(){
  /* ---------- trailer ---------- */
  const f = $('#trailerFrame'), b = $('#trailerBtn'), l = $('#trailerLabel');
  if (!f || !b || !l) return;

  b.addEventListener('click', function(){
    const src = asset(f.dataset.video);
    if (!src){
      l.textContent = 'Trailer file not attached yet';
      setTimeout(function(){ l.textContent = 'Play trailer'; }, 2600);
      return;
    }
    const v = document.createElement('video');
    v.src = src; v.controls = true; v.autoplay = true; v.playsInline = true;
    if (f.dataset.poster) v.poster = asset(f.dataset.poster);
    f.appendChild(v); f.classList.add('playing');
  });
}
