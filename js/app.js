
const $=id=>document.getElementById(id);
const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2});
const whole=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
let salary=0,bonus=0,bonusPercent=0,started=false,preview=null,startDate=null,workStart="09:00",workEnd="17:00";
$('start-input').value=new Date().getFullYear()+'-01-01';
function positionPet(id,progress){
 const angle=progress*Math.PI*2;
 $(id).style.left=(50+38.8889*Math.sin(angle))+'%';
 $(id).style.top=(50-38.8889*Math.cos(angle))+'%';
}
function render(){if(!started)return;const now=new Date(),y=yearState(now),stamp=preview===null?now:new Date(+y.start+y.duration*preview),state=accrualState(stamp,y.year,startDate,workStart,workEnd),p=state.p,percent=(p*100).toFixed(2)+'%';
$('accrual-start').textContent='From '+state.effective.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
const daily=dailyState(stamp,startDate,workStart,workEnd),dailyPercent=(daily.p*100).toFixed(1)+'%';
$('daily-ring-fill').style.strokeDashoffset=100-daily.p*100;$('daily-percent').textContent=dailyPercent;$('daily-progress').setAttribute('aria-valuenow',(daily.p*100).toFixed(1));$('daily-progress').setAttribute('aria-valuetext',dailyPercent+' of '+(daily.duration/3600000)+' hours; '+daily.status);$('daily-status').textContent=daily.status+' · '+(daily.elapsed/3600000).toFixed(2)+' / '+(daily.duration/3600000)+' hours';$('daily-earned').textContent=money.format(salary/state.total*daily.elapsed);
$('schedule-summary').textContent='Mon–Fri · '+workStart+'–'+workEnd+' local · before tax';
$('year-label').textContent=y.year+' calendar year';$('salary-earned').textContent=money.format(salary*p);$('salary-target').textContent=whole.format(salary);$('salary-fill').style.strokeDashoffset=100-p*100;positionPet('annual-pet',p);positionPet('daily-pet',daily.p);$('salary-progress').setAttribute('aria-valuenow',(p*100).toFixed(2));$('salary-progress').setAttribute('aria-valuetext',money.format(salary*p)+' of '+money.format(salary));$('salary-percent').textContent=percent;
$('daily-rate').textContent=money.format(salary/state.total*daily.duration)+' / workday';$('increment').textContent='+'+money.format(salary/state.total*1000)+' / working second';$('bonus-earned').textContent=money.format(bonus*p);$('bonus-target').textContent=money.format(bonus);$('bonus-remaining').textContent=money.format(bonus*(1-p));
$('bonus-fill').style.transform='scaleX('+p+')';$('bonus-progress').setAttribute('aria-valuenow',(p*100).toFixed(2));$('bonus-progress').setAttribute('aria-valuetext',money.format(bonus*p)+' of '+money.format(bonus));$('bonus-percent').textContent=percent+' accrued';$('bonus-start').textContent=$('accrual-start').textContent;$('bonus-rate').textContent=bonusPercent+'% of base salary';
$('status').textContent=preview===null?'Live · every second · '+(state.active?'Accruing now':'Paused outside work hours or before start'):'Preview · '+percent+' accrued';$('live').disabled=preview===null;if(preview===null)$('preview-range').value=y.p*100;
updateDelight(stamp,now,preview!==null,workEnd);
updatePets(stamp,state.active,{preview:preview!==null,start:startDate,workStart,workEnd,remember:$('remember').checked});
$('as-of').textContent=(preview===null?'As of ':'Preview: ')+stamp.toLocaleString(undefined,{dateStyle:'medium',timeStyle:'medium'});}
function showDashboard(){started=true;preview=null;$('setup').hidden=true;$('dashboard').hidden=false;render()}
$('income-form').addEventListener('submit',e=>{e.preventDefault();const s=$('salary-input').valueAsNumber,b=$('bonus-input').valueAsNumber,date=parseStart($('start-input').value);if(!validSchedule($('work-start').value,$('work-end').value)||!date||!Number.isFinite(s)||!Number.isFinite(b)||s<0||b<0||s>1e9||!Number.isFinite(s*(b/100))){$('error').hidden=false;return}workStart=$('work-start').value;workEnd=$('work-end').value;salary=s;bonusPercent=b;bonus=s*(b/100);startDate=date;$('error').hidden=true;persistSettings();showDashboard()});
$('sample').onclick=()=>{workStart='09:00';workEnd='17:00';$('work-start').value=workStart;$('work-end').value=workEnd;$('remember').checked=false;$('salary-input').value=120000;$('bonus-input').value=20;salary=120000;bonusPercent=20;bonus=24000;startDate=new Date(new Date().getFullYear(),0,1);$('start-input').value=startDate.getFullYear()+'-01-01';showDashboard()};
$('edit').onclick=()=>{$('work-start').value=workStart;$('work-end').value=workEnd;$('salary-input').value=salary;$('bonus-input').value=bonusPercent;$('start-input').value=[startDate.getFullYear(),String(startDate.getMonth()+1).padStart(2,'0'),String(startDate.getDate()).padStart(2,'0')].join('-');$('setup').hidden=false;$('dashboard').hidden=true;$('cancel').hidden=false;$('salary-input').focus()};$('cancel').onclick=()=>{$('setup').hidden=true;$('dashboard').hidden=false;render()};
$('preview-range').oninput=e=>{preview=Number(e.target.value)/100;render()};$('live').onclick=()=>{preview=null;render()};
setInterval(render,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});

function notify(message){$('notice').textContent=message;$('notice').hidden=false}
function currentSettings(){return {version:1,salary,bonusPercent,workStart,workEnd,startDate:$('start-input').value}}
function persistSettings(){
 try{if($('remember').checked) localStorage.setItem(STORAGE_KEY,JSON.stringify(currentSettings()));else {localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(CELEBRATION_KEY);}
 notify($('remember').checked?'Saved on this device.':'Temporary session. Settings are not saved.');
 }catch{notify('Browser storage is unavailable. This session still works; export a backup to keep your settings.')}
}
function applySettings(data){
 const settings=validateSettings(data);workStart=settings.workStart;workEnd=settings.workEnd;$('work-start').value=workStart;$('work-end').value=workEnd;salary=settings.salary;bonusPercent=settings.bonusPercent;bonus=salary*(bonusPercent/100);startDate=parseStart(settings.startDate);
 $('salary-input').value=salary;$('bonus-input').value=bonusPercent;$('start-input').value=settings.startDate;$('error').hidden=true;showDashboard();
}
$('export').onclick=()=>{
 const data={version:1,salary,bonusPercent,workStart,workEnd,startDate:[startDate.getFullYear(),String(startDate.getMonth()+1).padStart(2,'0'),String(startDate.getDate()).padStart(2,'0')].join('-')};
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='steady-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('import').onclick=$('setup-import').onclick=()=>{$('import-file').click()};
$('import-file').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 try{if(file.size>10000)throw new Error('Backup is too large.');const settings=validateSettings(JSON.parse(await file.text()));
 if(started&&!confirm('Replace the current dashboard with this backup?'))return;
 applySettings(settings);persistSettings();
 }catch{notify('Could not import this backup. Choose a valid Steady JSON export. Your current dashboard was kept.')}finally{e.target.value=''}
};
$('clear').onclick=()=>{
 if(!confirm('Delete saved settings and clear this dashboard? Export a backup first if you want to keep it.'))return;
 try{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(CELEBRATION_KEY);celebratedDay=null}catch{notify('Could not clear browser storage. Clear this site’s data in your browser settings.');return}
 salary=bonus=bonusPercent=0;startDate=null;started=false;preview=null;$('income-form').reset();$('start-input').value=new Date().getFullYear()+'-01-01';$('setup').hidden=false;$('dashboard').hidden=true;$('cancel').hidden=true;notify('Your dashboard data has been cleared.');
};
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved){applySettings(JSON.parse(saved));notify('Restored from this browser.')}}catch{notify('Saved settings could not be loaded. Enter your details or import a backup.')}

for(const id of ['annual-pet','daily-pet']){
 let bonkTimer;
 $(id).onclick=()=>{
  clearTimeout(bonkTimer);
  $(id).classList.remove('bonked','retreated','protesting');
  void $(id).offsetWidth;
  const reaction=bonkReaction();$(id).classList.add(reaction);
  bonkTimer=setTimeout(()=>$(id).classList.remove('bonked','retreated','protesting'),reaction==='bonked'?550:1600);
 };
}
