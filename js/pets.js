const CELEBRATION_KEY='steady.celebration.v1';
let celebratedDay=null,celebrationTimer;
try{celebratedDay=localStorage.getItem(CELEBRATION_KEY)}catch{}
function completedWorkday(now,start,workStart,workEnd){
 const day=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 for(let i=0;i<8;i++,day.setDate(day.getDate()-1)){
  if(day<start)return null;
  if(day.getDay()===0||day.getDay()===6)continue;
  if(now>=workBounds(day,workStart,workEnd).close)return [day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');
 }
 return null;
}
function bonkReaction(random=Math.random()){return random<.2?'retreated':random<.4?'protesting':'bonked'}
function updatePets(at,active,options){
 const weekend=at.getDay()===0||at.getDay()===6;
 for(const id of ['annual-pet','daily-pet']){
  const pet=document.getElementById(id);
  pet.classList.toggle('sleeping',!active&&!weekend);
  pet.classList.toggle('weekend',weekend);
 }
 if(options.preview||document.hidden||document.getElementById('dashboard').hidden)return;
 const day=completedWorkday(at,options.start,options.workStart,options.workEnd);
 if(!day||day===celebratedDay)return;
 celebratedDay=day;
 if(options.remember){try{localStorage.setItem(CELEBRATION_KEY,day)}catch{}}
 const pet=document.getElementById('daily-pet'),message=document.getElementById('celebration');
 pet.classList.add('celebrating');message.textContent='Workday complete! You made it, brick by brick. ('+day+')';message.hidden=false;
 const confetti=document.getElementById('confetti');confetti.replaceChildren();
 for(let i=0;i<28;i++){
  const piece=document.createElement('i');piece.style.setProperty('--x',(i*37%100)+'%');piece.style.setProperty('--turn',(i*53)+'deg');piece.style.setProperty('--delay',(i%7*.06)+'s');piece.style.background=['#ad59d0','#e17c55','#9dbd69','#eac66b'][i%4];confetti.appendChild(piece);
 }
 clearTimeout(celebrationTimer);celebrationTimer=setTimeout(()=>{pet.classList.remove('celebrating');confetti.replaceChildren();message.hidden=true},4500);
}
