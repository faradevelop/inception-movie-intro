export const $  = (s,c)=> (c||document).querySelector(s);
export const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
export const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = window.matchMedia('(pointer: fine)').matches;
export const clamp = (v,a,b)=> Math.max(a, Math.min(b, v));
