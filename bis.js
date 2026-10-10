'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const film = $('film');
let currentView = 'home';
function syncFilm(){if(!document.hidden)film.play().catch(()=>{});}
film.addEventListener('pause',syncFilm);
document.addEventListener('visibilitychange',syncFilm);
document.addEventListener('pointerdown',syncFilm,{passive:true});
const objects = [
 ['IS200 / IS300 / ALTEZZA','FRONT GRILLE','is200grillv11.glb'],
 ['MX-5 NA','HEADLIGHT COVER','NAHeadlightCover3.glb'],
 ['RPS13 / 180SX','HEADLIGHT LID','S13HEADLIGHTLIDv2.3.glb'],
 ['RPS13 / 180SX','REAR WING','WINGxS13.glb'],
 ['RPS13 / 180SX','ROOF WING','S13ROOFWING.glb'],
 ['RPS13 / 180SX','DOOR HANDLE','S13SWITCHDRIVERV130.glb'],
 ['SUBARU GC8','TWEETER MOUNT','gc8tweeterV15.glb'],
 ['FIAT 1.4 T-JET','FLANGE','Flansza+1.4+tjet.glb'],
 ['LEXUS SPORTCROSS','TRIM / OVERLAY','SPORTCROSS+NAKLADKA.glb'],
 ['RPS13 / 180SX','AIR INTAKE','WLOTS13_1.glb'],
 ['TOYOTA 1G','INTAKE MANIFOLD','kolkektor+1g+2.glb']
];
let modelInitialized=false;
function selectObject(index){
 const o=objects[index]; $('model').src=o[2]; $('model').alt=o[0]+' — '+o[1]; $('model-name').textContent=o[0]+' / '+o[1]; $('model-download').href=o[2]; $('model-status').textContent='LOADING OBJECT…';
 document.querySelectorAll('.object-menu button').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index));});modelInitialized=true;
}
objects.forEach((o,i)=>{const b=document.createElement('button');b.innerHTML=`${String(i+1).padStart(2,'0')} / ${o[0]}<small>${o[1]}</small>`;b.onclick=()=>selectObject(i);$('object-menu').append(b);});
$('model').addEventListener('load',()=>{$('model-status').textContent='DRAG TO ROTATE / SCROLL TO ZOOM';});
$('model').addEventListener('error',()=>{$('model-status').textContent='Model niedostępny. Użyj DOWNLOAD .GLB.';});
$('rotate').onclick=()=>{const m=$('model');const on=!m.hasAttribute('auto-rotate');m.toggleAttribute('auto-rotate',on);$('rotate').textContent='AUTO ROTATE / '+(on?'ON':'OFF');$('rotate').setAttribute('aria-pressed',String(on));};
if(reduced.matches){$('model').removeAttribute('auto-rotate');$('rotate').textContent='AUTO ROTATE / OFF';$('rotate').setAttribute('aria-pressed','false');}
function navigate(view){
 if(!['home','new','works','concept','gallery','contact','machine'].includes(view))view='home';currentView=view;
 document.querySelectorAll('.view').forEach(s=>{s.hidden=s.id!==view;s.classList.toggle('active',s.id===view);});
 document.querySelectorAll('nav button').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 
 if(view==='works'&&!modelInitialized)selectObject(0);syncFilm();
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.view;});
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));navigate(location.hash.slice(1)||'home');
const galleryPhotos=['IMG_0588.png','IMG_0586.png','IMG_0589.png','IMG_0587.png','IMG_0600.png','IMG_0545.JPG'];
galleryPhotos.forEach((src,i)=>{
 const button=document.createElement('button');
 button.className='photo';button.dataset.image=src;
 button.setAttribute('aria-label','Powiększ zdjęcie '+(i+1));
 const img=document.createElement('img');img.src=src;img.alt='Galeria — zdjęcie '+(i+1);img.loading='lazy';
 button.append(img);$('gallery-grid').append(button);
});
// Only Gallery and Concept participate; new children inherit identical cropping.
document.querySelectorAll('#gallery .fisheye-gallery,#concept .fisheye-gallery').forEach(strip=>{
 function update(position){
  const cards=[...strip.querySelectorAll(':scope > button')];
  cards.forEach((card,i)=>{
   const distance=i-position,falloff=Math.max(0,1-Math.abs(distance)/2.4);
   card.style.setProperty('--depth',String(reduced.matches?0:falloff*115)+'px');
   card.style.setProperty('--tilt',String(reduced.matches?0:distance*falloff*24)+'deg');
   card.style.setProperty('--lift',String(reduced.matches?0:-falloff*10)+'px');
   card.style.setProperty('--light',String(.65+falloff*.35));
  });
 }
 strip.addEventListener('pointermove',event=>{
  if(event.pointerType==='touch')return;
  const cards=[...strip.querySelectorAll(':scope > button')];
  const centers=cards.map(card=>card.offsetLeft+card.offsetWidth/2);
  const x=event.clientX-strip.getBoundingClientRect().left+strip.scrollLeft;
  const step=centers.length>1?centers[1]-centers[0]:1;
  update((x-centers[0])/step);
 });
 strip.addEventListener('pointerleave',()=>update(-10));
 strip.addEventListener('focusin',event=>{const card=event.target.closest('button');if(card)update([...strip.children].indexOf(card));});
 strip.addEventListener('focusout',event=>{if(!strip.contains(event.relatedTarget))update(-10);});
 new MutationObserver(()=>update(-10)).observe(strip,{childList:true});
 update(-10);
});
document.querySelectorAll('[data-image]').forEach(b=>b.onclick=()=>{$('large-image').src=b.dataset.image;$('large-image').alt=b.querySelector('img').alt;$('image-caption').textContent=$('large-image').alt;$('lightbox').showModal();});
$('close-lightbox').onclick=()=>$('lightbox').close();$('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))$('lightbox').close();});
const tracks=[
  {
    "src": "audio/freerun_0.ogg",
    "title": "Jazz Ass"
  },
  {
    "src": "audio/freerun_1.ogg",
    "title": "Blue Haze"
  },
  {
    "src": "audio/freerun_2.ogg",
    "title": "The Essence"
  },
  {
    "src": "audio/freerun_3.ogg",
    "title": "Heat"
  },
  {
    "src": "audio/freerun_4.ogg",
    "title": "Positive Notions"
  },
  {
    "src": "audio/freerun_5.ogg",
    "title": "Rogue Unit"
  },
  {
    "src": "audio/freerun_6.ogg",
    "title": "Subphonic"
  },
  {
    "src": "audio/freerun_7.ogg",
    "title": "Imagine"
  },
  {
    "src": "audio/freerun_8.ogg",
    "title": "Down"
  },
  {
    "src": "audio/garage.ogg",
    "title": "New Generation (Boymerang Remix)"
  },
  {
    "src": "audio/mainmenu.ogg",
    "title": "Circles (Remix)"
  }
];
let track=Math.floor(Math.random()*tracks.length);const audio=$('audio');audio.volume=.35;let musicWanted=true;
function loadTrack(){audio.src=tracks[track].src;$('track-name').textContent=tracks[track].title;}
async function play(){try{initAnalyser();if(audioContext?.state==='suspended')audioContext.resume().catch(()=>{});await audio.play();}catch(error){$('audio-state').textContent=error.name==='NotAllowedError'?'TAP TO PLAY':'PLAYBACK UNAVAILABLE';}}
function stepTrack(dir){musicWanted=true;track=(track+dir+tracks.length)%tracks.length;loadTrack();play();}
$('play').onclick=()=>{musicWanted=audio.paused;if(musicWanted)play();else audio.pause();};
$('next').onclick=()=>stepTrack(1);$('previous').onclick=()=>stepTrack(-1);audio.addEventListener('ended',()=>stepTrack(1));
audio.addEventListener('play',()=>{$('play').textContent='Ⅱ';$('play').setAttribute('aria-pressed','true');if(!reduced.matches)$('receiver-film').play().catch(()=>{});$('audio-state').textContent='PLAYING';document.body.classList.add('playing');});
audio.addEventListener('pause',()=>{$('play').textContent='▶';$('play').setAttribute('aria-pressed','false');$('receiver-film').pause();$('audio-state').textContent='STANDBY';document.body.classList.remove('playing');});
audio.addEventListener('error',()=>{$('audio-state').textContent='TRACK UNAVAILABLE / NEXT →';document.body.classList.remove('playing');$('play').textContent='▶';$('play').setAttribute('aria-pressed','false');$('receiver-film').pause();});
$('volume').oninput=e=>{audio.volume=Number(e.target.value);};
let audioContext, analyser, spectrum;
function initAnalyser(){
 if(audioContext)return;
 const AudioContextClass=window.AudioContext||window.webkitAudioContext;
 if(!AudioContextClass)return;
 try{audioContext=new AudioContextClass();const source=audioContext.createMediaElementSource(audio);analyser=audioContext.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=.78;source.connect(analyser);analyser.connect(audioContext.destination);spectrum=new Uint8Array(analyser.frequencyBinCount);}catch{audioContext=undefined;}
}
let spectrumMode=reduced.matches;
function setVisualMode(){ $('eq').hidden=!spectrumMode;$('receiver-film').hidden=spectrumMode;$('visual-mode').textContent='DISP';$('visual-mode').setAttribute('aria-label',spectrumMode?'Zmień wyświetlacz z EQ na animację':'Zmień wyświetlacz z animacji na EQ');$('visual-mode').setAttribute('aria-pressed',String(spectrumMode));if(spectrumMode||audio.paused||reduced.matches)$('receiver-film').pause();else $('receiver-film').play().catch(()=>{});}
$('visual-mode').onclick=()=>{spectrumMode=!spectrumMode;setVisualMode();};setVisualMode();
const eqContext=$('eq').getContext('2d');let lastFrame=0;
function drawSpectrum(now){
 requestAnimationFrame(drawSpectrum);
 if(now-lastFrame<50||document.hidden||!spectrumMode)return;lastFrame=now;
 if(analyser)analyser.getByteFrequencyData(spectrum);
 eqContext.clearRect(0,0,640,166);
 for(let i=0;i<28;i++){
  const bin=Math.min(127,Math.floor(2*Math.pow(60,i/27)));
  const level=audio.paused||!spectrum?0:Math.round(spectrum[bin]/255*19);
  for(let j=0;j<20;j++){eqContext.fillStyle=j<=level?'#43d8ff':'#07202e';eqContext.shadowColor='#009dff';eqContext.shadowBlur=j<=level?5:0;eqContext.fillRect(i*23,159-j*8,18,5);}
 }
 eqContext.shadowBlur=0;
}
requestAnimationFrame(drawSpectrum);

$('year').textContent=new Date().getFullYear();



loadTrack();audio.play().catch(()=>{$('audio-state').textContent='TAP TO PLAY';});
function startMusic(event){
 if(!musicWanted)return;
 initAnalyser();if(audioContext?.state==='suspended')audioContext.resume().catch(()=>{});
 if(event.target.closest('.transport'))return;
 if(audio.paused)play();
}
document.addEventListener('pointerdown',startMusic,{passive:true});document.addEventListener('keydown',startMusic);

