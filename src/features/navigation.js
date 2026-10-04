import { $, $$, RM } from '../utils/dom.js';

export function initNavigation(){
  const railBtns = $$('#rail button');

  /* ---------- rail navigation ---------- */
  railBtns.forEach(function(b){
    b.addEventListener('click', function(){
      const t = $(b.dataset.t);
      if (t) t.scrollIntoView({behavior: RM ? 'auto' : 'smooth'});
    });
  });

  /* ---------- menu ---------- */
  const menu = $('#menu'), menuBtn = $('#menuBtn'), menuClose = $('#menuClose');
  const links = $$('#menu .menu-inner a');
  const box = $('#maBox'), num = $('#maNum'), kick = $('#maKicker'), desc = $('#maDesc');
  const gauge = $$('#maGauge i');
  let swapTimer = 0;

  const isOpen = function(){ return menu.classList.contains('open'); };

  /* index of the section the visitor is currently in (rail tracks it) */
  function currentIndex(){
    const i = railBtns.findIndex(function(b){ return b.classList.contains('active'); });
    return i < 0 ? 0 : i;
  }

  /* side panel: depth gauge + chapter description */
  function preview(i){
    const a = links[i];
    if (!a || box.dataset.i === String(i)) return;
    box.dataset.i = String(i);

    gauge.forEach(function(g, k){
      g.classList.toggle('on', k === i);
      g.classList.toggle('done', k < i);
    });

    clearTimeout(swapTimer);
    box.classList.add('swap');
    swapTimer = setTimeout(function(){
      num.textContent = String(i).padStart(2, '0');
      kick.textContent = $('.mi-t', a).textContent;
      desc.textContent = a.dataset.d || '';
      box.classList.remove('swap');
    }, RM ? 0 : 200);
  }

  function setMenu(open, restoreFocus){
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);

    if (open){
      const cur = currentIndex();
      links.forEach(function(a, i){
        if (i === cur) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
      box.dataset.i = '';
      preview(cur);
      links[cur].focus({preventScroll: true});
    } else if (restoreFocus){
      menuBtn.focus({preventScroll: true});
    }
  }

  menuBtn.addEventListener('click', function(){ setMenu(!isOpen(), true); });
  menuClose.addEventListener('click', function(){ setMenu(false, true); });

  links.forEach(function(a, i){
    a.addEventListener('click', function(){ setMenu(false, false); });
    a.addEventListener('mouseenter', function(){ preview(i); });
    a.addEventListener('focus', function(){ preview(i); });
  });

  document.addEventListener('keydown', function(e){
    if (!isOpen()) return;

    if (e.key === 'Escape'){ setMenu(false, true); return; }

    /* arrow keys walk the chapter list */
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      const at = links.indexOf(document.activeElement);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      const next = at < 0 ? 0 : (at + step + links.length) % links.length;
      links[next].focus({preventScroll: true});
      return;
    }

    /* keep Tab inside the dialog */
    if (e.key === 'Tab'){
      const items = [menuClose].concat(links);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
}
