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
  function setMenu(open){
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }
  menuBtn.addEventListener('click', function(){ setMenu(!menu.classList.contains('open')); });
  menuClose.addEventListener('click', function(){ setMenu(false); });
   $$('#menu a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setMenu(false); });
}
