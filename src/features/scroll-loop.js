import { $, $$, clamp, RM, FINE } from '../utils/dom.js';
import { updateAmbient } from './audio.js';

export function initScrollLoop(){
  /* ---------- cached layout metrics ---------- */
  let vh = window.innerHeight, docH = 1;
  const speedEls = $$('[data-speed]').map(function(el){ return {el:el, s:parseFloat(el.dataset.speed)||0, top:0, h:1}; });
  const paraEls  = $$('[data-para]').map(function(el){ return {el:el, f:parseFloat(el.dataset.para)||0}; });
  const sections = ['reality','film','story','trailer','layers','architecture','cast','totem','limbo','finale'].map(function(id){ return {id:id, el:$('#'+id), top:0, h:1}; });
  const archSec  = $('#archScroll'), archStage = $('#archStage');
  const foldWrap = $('#foldWrap'), foldDeg = $('#foldDeg'), archCopy = $('#archCopy');
  const archTitle = $('#archTitle'), archEcho = $('#archEcho');

  function measure(){
    vh = window.innerHeight;
    docH = document.documentElement.scrollHeight;
    const sy = window.scrollY;
    speedEls.forEach(function(o){ const r = o.el.getBoundingClientRect(); o.top = r.top + sy; o.h = r.height; });
    sections.forEach(function(o){ const r = o.el.getBoundingClientRect(); o.top = r.top + sy; o.h = r.height; });
    const ar = archSec.getBoundingClientRect(); archSec._top = ar.top + sy; archSec._h = ar.height;
  }
  window.addEventListener('load', measure);
  window.addEventListener('resize', measure);
  setTimeout(measure, 900);
  measure();

  /* ---------- pointer parallax ---------- */
  let tx=0, ty=0, px=0, py=0;
  if (FINE && !RM){
    window.addEventListener('pointermove', function(e){
      tx = (e.clientX/window.innerWidth  - .5)*2;
      ty = (e.clientY/window.innerHeight - .5)*2;
    }, {passive:true});
  }

  /* ---------- main rAF loop ---------- */
  const nav = $('#nav'), bar = $('#progressBar');
  const railBtns = $$('#rail button');
  let raf = true;
  function loop(){
    const sy = window.scrollY;
    const progress = clamp(sy / Math.max(docH - vh, 1), 0, 1);

    bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    nav.classList.toggle('scrolled', sy > 40);

    updateAmbient(progress);

    /* active section → rail */
    let active = 0;
    for (let i=0;i<sections.length;i++){
      const o = sections[i];
      if (o.top <= sy + vh*.5) active = i;
    }
    railBtns.forEach(function(b,i){ b.classList.toggle('active', i===active); });

    if (!RM){
      /* pointer parallax */
      px += (tx-px)*.05; py += (ty-py)*.05;
      for (let i=0;i<paraEls.length;i++){
        const o = paraEls[i];
        o.el.style.transform = 'translate3d(' + (px*o.f).toFixed(2) + 'px,' + (py*o.f*.7).toFixed(2) + 'px,0)';
      }
      /* scroll parallax */
      const mid = sy + vh/2;
      for (let i=0;i<speedEls.length;i++){
        const o = speedEls[i];
        const y = (o.top + o.h/2 - mid) * o.s;
        o.el.style.transform = (o.el.classList.contains('plate-1') ? 'rotate(-1.2deg) ' :
                               o.el.classList.contains('plate-2') ? 'rotate(1deg) ' :
                               o.el.classList.contains('plate-3') ? 'rotate(-.8deg) ' : '') +
                               'translate3d(0,' + y.toFixed(1) + 'px,0)';
      }
      /* the folding city */
      const mobile = window.matchMedia('(max-width:760px)').matches;
      let p;
      if (mobile){
        p = clamp((sy + vh - archSec._top) / Math.max(archSec._h, 1), 0, 1);
      } else {
        p = clamp((sy - archSec._top) / Math.max(archSec._h - vh, 1), 0, 1);
      }
      const r = -8 + 15*p;
      foldWrap.style.transform = 'rotate(' + r.toFixed(2) + 'deg) translateY(' + (-p*38).toFixed(1) + 'px) scale(' + (0.96 + .06*p).toFixed(3) + ')';
      const deg = Math.round(r);
      if (foldDeg._d !== deg){ foldDeg._d = deg; foldDeg.textContent = 'Fold ∠ ' + deg + '°'; }
      archTitle.style.transform = 'translateY(' + (-p*30).toFixed(1) + 'px)';
      archEcho.style.opacity = (0.3 + 0.7*p).toFixed(2);
      if (p > .45) archCopy.classList.add('in');
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* limbo ghost slow drift */
  if (!RM){
    const ghost = $('#limboGhost');
    let gt = 0;
    setInterval(function(){ gt += .16; ghost.style.marginTop = (Math.sin(gt)*10).toFixed(1)+'px'; }, 90);
  }
}
