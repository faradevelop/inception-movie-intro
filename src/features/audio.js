import { $ } from '../utils/dom.js';

/* ---------- ambient sound (generated, off by default) ---------- */
let actx=null, master=null, filt=null, soundOn=false;
function initAudio(){
  const AC = window.AudioContext || window.webkitAudioContext;
  actx = new AC();
  master = actx.createGain(); master.gain.value = 0;
  filt = actx.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value = 300; filt.Q.value = .6;
  const len = actx.sampleRate*3, buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for (let i=0;i<len;i++){ const w = Math.random()*2-1; last = (last + .02*w)/1.02; d[i] = last*3.1; }
  const noise = actx.createBufferSource(); noise.buffer = buf; noise.loop = true;
  const gN = actx.createGain(); gN.gain.value = .5;
  const o1 = actx.createOscillator(); o1.frequency.value = 55;  o1.type='sine';
  const o2 = actx.createOscillator(); o2.frequency.value = 82.4; o2.type='sine';
  const gO = actx.createGain(); gO.gain.value = .16;
  const lfo = actx.createOscillator(); lfo.frequency.value = .07; lfo.type='sine';
  const lfoG = actx.createGain(); lfoG.gain.value = .035;
  noise.connect(gN); gN.connect(filt);
  o1.connect(gO); o2.connect(gO); gO.connect(filt);
  lfo.connect(lfoG); lfoG.connect(master.gain);
  filt.connect(master); master.connect(actx.destination);
  noise.start(); o1.start(); o2.start(); lfo.start();
}

export function updateAmbient(progress){
  if (filt && soundOn) filt.frequency.value = 300 - 175*progress;
}

export function initSoundToggle(){
  const soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', function(){
    if (!actx) initAudio();
    if (actx.state === 'suspended') actx.resume();
    soundOn = !soundOn;
    const t = actx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(soundOn ? .16 : 0, t, .7);
    soundBtn.classList.toggle('on', soundOn);
    soundBtn.setAttribute('aria-pressed', String(soundOn));
  });
}
