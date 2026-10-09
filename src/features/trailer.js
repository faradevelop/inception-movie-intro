import { $ } from '../utils/dom.js';

function withAutoplay(url){
  try {
    const u = new URL(url, window.location.href);
    u.searchParams.set('autoplay', '1');
    u.searchParams.set('rel', '0');
    u.searchParams.set('modestbranding', '1');
    u.searchParams.set('playsinline', '1');
    return u.toString();
  } catch (e) {
    return url;
  }
}

export function initTrailer(){
  /* ---------- trailer (iframe) ---------- */
  const f = $('#trailerFrame'), b = $('#trailerBtn'), l = $('#trailerLabel');
  if (!f || !b || !l) return;

  b.addEventListener('click', function(){
    const embed = f.dataset.embed;
    if (!embed){
      l.textContent = 'Trailer link not attached yet';
      setTimeout(function(){ l.textContent = 'Play trailer'; }, 2600);
      return;
    }

    const ifr = document.createElement('iframe');
    ifr.src = withAutoplay(embed);
    ifr.title = f.dataset.title || 'Trailer';
    ifr.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    ifr.allowFullscreen = true;
    ifr.referrerPolicy = 'strict-origin-when-cross-origin';
    ifr.loading = 'lazy';

    f.appendChild(ifr);
    f.classList.add('playing');
  });
}