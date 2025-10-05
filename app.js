
// Inline clues (no fetch needed)
const CLUES = {
  "25": {
    "title": "?",
    "number": "25/30",
    "difficulty": "5/6",
    "text":
"In the sacred alcove where prayers ascend,\nA box of reverence, where solace blends.\nGaze upwards, where angels might tread,\nOn the right-hand path, a clue is spread.\n\nBeyond eye's reach, a festive light gleams,\nAscend to the top, where the mystery teems.",
    "code": "SugarPlumDreams (December 17th)"
  },
  "26": {
    "title": "🎁",
    "number": "26/30",
    "difficulty": "4/6",
    "text": "Wrapped in red and silver bright,\nI wait in silence through the night.\nWhere lists are kept and plans are made,\nLook to the board where notes are laid.",
    "code": "CandyCaneLane"
  }
};

let audioCtx;
function ensureAudio(){
  if(!audioCtx){
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
  }
}
function buzz(pattern=[160,100,160]){
  if(!audioCtx) return;
  let t = audioCtx.currentTime;
  pattern.forEach((dur,i)=>{
    const on = i % 2 === 0;
    if(on){
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type='square'; osc.frequency.value=75;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
      gain.gain.setValueAtTime(0.08, t + (dur/1000) - 0.02);
      gain.gain.linearRampToValueAtTime(0.001, t + (dur/1000));
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t); osc.stop(t + (dur/1000));
    }
    t += dur/1000;
  });
}

function startExperience({revealMs=3200}={}){
  ensureAudio();
  buzz([160,110,160]);
  document.getElementById('gate').classList.add('hidden');
  const anim = document.getElementById('anim');
  if(anim) anim.classList.remove('hidden');
  setTimeout(()=>{
    if(anim) anim.classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    buzz([80,60,80]);
  }, revealMs);
}

function loadClueInline(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '25';
  const clue = CLUES[id] || CLUES['25'];
  document.getElementById('title').textContent = clue.title || 'Clue';
  document.getElementById('meta').textContent = `Clue: ${clue.number}   •   Difficulty: ${clue.difficulty}`;
  document.getElementById('clue').textContent = clue.text;
  document.getElementById('code').textContent = `Code: ${clue.code}`;
}
document.addEventListener('DOMContentLoaded', loadClueInline);
