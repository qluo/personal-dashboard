function timeMinutes(value){if(typeof value!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))return NaN;const [h,m]=value.split(':').map(Number);return h*60+m}
function validSchedule(start,end){return Number.isFinite(timeMinutes(start))&&Number.isFinite(timeMinutes(end))&&timeMinutes(end)>timeMinutes(start)}
function workBounds(day,workStart,workEnd){return {open:new Date(day.getFullYear(),day.getMonth(),day.getDate(),0,timeMinutes(workStart)),close:new Date(day.getFullYear(),day.getMonth(),day.getDate(),0,timeMinutes(workEnd))}}
function parseStart(value){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!match)return null;
 const [,y,m,d]=match.map(Number),date=new Date(y,m-1,d);
 return y>=1900&&y<=9999&&date.getFullYear()===y&&date.getMonth()===m-1&&date.getDate()===d?date:null;
}
function workMilliseconds(from,to,workStart="09:00",workEnd="17:00"){
 if(to<=from)return 0;
 let total=0;
 for(const day=new Date(from.getFullYear(),from.getMonth(),from.getDate());day<to;day.setDate(day.getDate()+1)){
   if(day.getDay()===0||day.getDay()===6)continue;
   const {open,close}=workBounds(day,workStart,workEnd);
   total+=Math.max(0,Math.min(+to,+close)-Math.max(+from,+open));
 }
 return total;
}
function isWorkTime(date,workStart,workEnd){const {open,close}=workBounds(date,workStart,workEnd);return date.getDay()>0&&date.getDay()<6&&date>=open&&date<close}
function accrualState(at,year,start,workStart="09:00",workEnd="17:00"){
 const from=new Date(year,0,1),end=new Date(year+1,0,1),effective=new Date(Math.max(+from,+start));
 const total=workMilliseconds(from,end,workStart,workEnd),elapsed=workMilliseconds(effective,new Date(Math.min(+at,+end)),workStart,workEnd);
 return {total,p:Math.min(1,elapsed/total),effective,active:at>=effective&&at<end&&isWorkTime(at,workStart,workEnd)};
}
function yearState(now=new Date()){const year=now.getFullYear(),start=new Date(year,0,1),end=new Date(year+1,0,1);return{year,start,end,duration:end-start,p:Math.max(0,Math.min(1,(now-start)/(end-start)))}}
function dailyState(at,start,workStart="09:00",workEnd="17:00"){
 const day=new Date(at.getFullYear(),at.getMonth(),at.getDate()),{open,close}=workBounds(at,workStart,workEnd),duration=close-open;
 const eligible=day>=start&&day.getDay()>0&&day.getDay()<6;
 const elapsed=eligible?Math.max(0,Math.min(+at,+close)-+open):0;
 const status=day<start?'Before your start date':!eligible?'Weekend · no scheduled work':at<open?'Starts at '+workStart:at>=close?'Workday complete':'Workday in progress';
 return {p:elapsed/duration,elapsed,status,duration};
}

if(typeof module!=="undefined") module.exports={timeMinutes,validSchedule,parseStart,workMilliseconds,accrualState,dailyState,yearState};
