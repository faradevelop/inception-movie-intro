import { $ } from './dom.js';

/* ---------- seeded skyline generator ---------- */
function mulberry(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function buildSkyline(g, opt){
  opt = opt || {};
  const R = mulberry(opt.seed || 7);
  const W = 1440, H = 300;
  const clusters = opt.clusters || [[0,430],[1010,1440]];
  const minH = opt.minH || 70, maxH = opt.maxH || 250, gold = opt.gold==null ? .05 : opt.gold;
  let out = '';
  clusters.forEach(function(c){
    let x = c[0] + R()*26;
    while (x < c[1]-40){
      const w = 34 + R()*70;
      let h = minH + R()*(maxH-minH);
      const edge = Math.min(x-c[0], c[1]-(x+w));
      if (edge < 150) h *= .4 + .6*(edge/150);
      const y = H - h;
      const fill = R() < .5 ? '#0d0f14' : '#101319';
      out += '<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+h.toFixed(1)+'" fill="'+fill+'"/>';
      if (R() > .78){
        const ah = 14 + R()*18;
        out += '<rect x="'+(x+w/2-1).toFixed(1)+'" y="'+(y-ah).toFixed(1)+'" width="2" height="'+ah.toFixed(1)+'" fill="'+fill+'"/>';
      }
      const cols = Math.max(2, Math.floor(w/12)), rows = Math.floor(h/16);
      for (let cc=0; cc<cols; cc++) for (let r=0; r<rows; r++){
        if (R() < .055){
          const goldWin = R() < gold;
          out += '<rect x="'+(x+4+cc*12).toFixed(1)+'" y="'+(y+6+r*16).toFixed(1)+'" width="2.4" height="3.6" fill="'+(goldWin?'rgba(201,168,108,.55)':'rgba(210,215,225,.13)')+'"/>';
        }
      }
      x += w + (R() < .25 ? 14+R()*30 : 3+R()*8);
    }
  });
  g.innerHTML = out;
}

export function initSkylines(){
  buildSkyline($('#skyTopNear'),  {seed:3});
  buildSkyline($('#skyTopFar'),   {seed:11, minH:30, maxH:120, clusters:[[0,720],[720,1440]]});
  buildSkyline($('#skyBotNear'),  {seed:5});
  buildSkyline($('#skyBotFar'),   {seed:13, minH:30, maxH:120, clusters:[[0,720],[720,1440]]});
  buildSkyline($('#skyFinTNear'), {seed:31});
  buildSkyline($('#skyFinTFar'),  {seed:37, minH:30, maxH:120, clusters:[[0,720],[720,1440]]});
  buildSkyline($('#skyFinBNear'), {seed:33});
  buildSkyline($('#skyFinBFar'),  {seed:39, minH:30, maxH:120, clusters:[[0,720],[720,1440]]});
  buildSkyline($('#skyArch'),     {seed:21, minH:40, maxH:150, clusters:[[0,520],[920,1440]], gold:.07});
  buildSkyline($('#skyRain'),     {seed:11, minH:36, maxH:120, clusters:[[0,720],[720,1440]]});
}
