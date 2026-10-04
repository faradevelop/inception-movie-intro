import { $$ } from '../utils/dom.js';

export function initEntrance(){
  /* ---------- entrance ---------- */
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ document.body.classList.add('loaded'); }); });
}

export function initReveal(){
  /* ---------- reveal observer ---------- */
  const io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.16, rootMargin:'0px 0px -8% 0px'});
   $$('[data-reveal]').forEach(function(el){ io.observe(el); });
}
