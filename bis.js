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
 ['SUBARU GC8','TWEETER MOUNT','gc8tweeterV15.glb']
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
 if(!['home','works','concept','gallery','contact','machine'].includes(view))view='home';currentView=view;
 document.querySelectorAll('.view').forEach(s=>{s.hidden=s.id!==view;s.classList.toggle('active',s.id===view);});
 document.querySelectorAll('nav button').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 
 if(view==='works'&&!modelInitialized)selectObject(0);syncFilm();
}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{location.hash=b.dataset.view;});
window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));navigate(location.hash.slice(1)||'home');
['IMG_0588.png','IMG_0586.png','IMG_0589.png','IMG_0587.png','IMG_0600.png','IMG_0545.JPG'].forEach((src,i)=>{const b=document.createElement('button');b.className='photo';b.dataset.image=src;b.innerHTML=`<img src="${src}" alt="Archiwum — kadr ${i+1}" loading="lazy"><span>FRAME / ${String(i+1).padStart(3,'0')} ↗</span>`;$('gallery-grid').append(b);});
document.querySelectorAll('[data-image]').forEach(b=>b.onclick=()=>{$('large-image').src=b.dataset.image;$('large-image').alt=b.querySelector('img').alt;$('image-caption').textContent=$('large-image').alt;$('lightbox').showModal();});
$('close-lightbox').onclick=()=>$('lightbox').close();$('lightbox').addEventListener('click',e=>{if(e.target===$('lightbox'))$('lightbox').close();});
const tracks=['Gang_Starr_-_Mass_Appeal.mp3','A_Tribe_Called_Quest_-_1nce_Again_ft._Tammy_Lucas.mp3','Black_Moon_-_Enta_Da_Stage.mp3','Craig_Mack_-_Get_Down.mp3','Gang_Starr,_Total_-_Discipline.mp3','Miilkbones_-_Mindgamez.mp3','Redman_-_Pick_It_Up.mp3','Capone_N_Noreaga_-_Capone_Bone.mp3','Get_A_Hold.mp3','2_Thousand.mp3'];
let track=Math.floor(Math.random()*tracks.length);const audio=$('audio');audio.volume=.35;let musicWanted=true;
function loadTrack(){audio.src=tracks[track];$('track-name').textContent=tracks[track].replace(/\.mp3$/,'').replaceAll('_',' ');}
async function play(){try{await audio.play();}catch{$('audio-state').textContent='PLAYBACK UNAVAILABLE';}}
function stepTrack(dir){musicWanted=true;track=(track+dir+tracks.length)%tracks.length;loadTrack();play();}
$('play').onclick=()=>{musicWanted=audio.paused;if(musicWanted)play();else audio.pause();};
$('next').onclick=()=>stepTrack(1);$('previous').onclick=()=>stepTrack(-1);audio.addEventListener('ended',()=>stepTrack(1));
audio.addEventListener('play',()=>{$('play').textContent='Ⅱ PAUSE';$('audio-state').textContent='PLAYING';document.body.classList.add('playing');});
audio.addEventListener('pause',()=>{$('play').textContent='▶ PLAY';$('audio-state').textContent='STANDBY';document.body.classList.remove('playing');});
audio.addEventListener('error',()=>{$('audio-state').textContent='TRACK UNAVAILABLE / NEXT →';document.body.classList.remove('playing');$('play').textContent='▶ RETRY';});
$('volume').oninput=e=>{audio.volume=Number(e.target.value);};
for(let i=0;i<28;i++){const bar=document.createElement('i');bar.style.setProperty('--delay',`${(i%7)*-.13}s`);$('eq').append(bar);}
$('year').textContent=new Date().getFullYear();
function clock(){$('clock').textContent='WARSAW / '+new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}clock();setInterval(clock,1000);


loadTrack();audio.play().catch(()=>{$('audio-state').textContent='TAP TO PLAY';});
function startMusic(event){if(event.target.closest('.transport'))return;if(musicWanted&&audio.paused)play();}
document.addEventListener('pointerdown',startMusic,{passive:true});document.addEventListener('keydown',startMusic);
