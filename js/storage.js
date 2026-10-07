const STORAGE_KEY='steady.dashboard.v1';
function validateSettings(data){
 if(!data||data.version!==1||typeof data.salary!=='number'||!Number.isFinite(data.salary)||data.salary<0||data.salary>1e9||typeof data.bonusPercent!=='number'||!Number.isFinite(data.bonusPercent)||data.bonusPercent<0||!Number.isFinite(data.salary*(data.bonusPercent/100))||typeof data.startDate!=='string'||!parseStart(data.startDate))throw new Error('Invalid dashboard settings');
 const workStart=data.workStart===undefined?'09:00':data.workStart,workEnd=data.workEnd===undefined?'17:00':data.workEnd;
 if(!validSchedule(workStart,workEnd))throw new Error('Invalid working hours');
 return {workStart,workEnd,version:1,salary:data.salary,bonusPercent:data.bonusPercent,startDate:data.startDate};
}
