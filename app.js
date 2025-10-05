
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

async function loadClue(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '25';
  try{
    const res = await fetch('./clues.json', {cache:'no-store'});
    const data = await res.json();
    const clue = data[id] || data['25'];
    document.getElementById('title').textContent = clue.title || 'Clue';
    document.getElementById('meta').textContent = `Clue: ${clue.number}   •   Difficulty: ${clue.difficulty}`;
    document.getElementById('clue').textContent = clue.text;
    document.getElementById('code').textContent = `Code: ${clue.code}`;
  }catch(e){
    document.getElementById('clue').textContent = 'Unable to load clue.';
  }
}
document.addEventListener('DOMContentLoaded', loadClue);
