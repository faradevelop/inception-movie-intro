import { $ } from '../utils/dom.js';

export function initFinale(){
  /* ---------- finale — cut to black ---------- */
  const cutOverlay = $('#cutOverlay'), btnCut = $('#btnCut'), finaleNote = $('#finaleNote'), heroTag = $('#heroTag');
  let cutBusy = false;
  btnCut.addEventListener('click', function(){
    if (cutBusy) return;
    cutBusy = true;
    cutOverlay.classList.add('show');
    cutOverlay.setAttribute('aria-hidden','false');
    setTimeout(function(){ cutOverlay.classList.add('txt'); }, 750);
    setTimeout(function(){ cutOverlay.classList.remove('txt'); }, 3400);
    setTimeout(function(){
      cutOverlay.classList.remove('show');
      cutOverlay.setAttribute('aria-hidden','true');
      document.body.classList.add('awoken');
      finaleNote.classList.add('swap');
      setTimeout(function(){ finaleNote.textContent = 'It never stopped spinning.'; finaleNote.classList.remove('swap'); }, 620);
      /* the surface has changed while you were under */
      heroTag.classList.add('swap');
      setTimeout(function(){
        heroTag.textContent = '\u201CThe dream is collapsing.\u201D';
        heroTag.classList.remove('swap');
      }, 700);
      cutBusy = false;
    }, 4000);
  });
}
