const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const {workMilliseconds,accrualState,dailyState,parseStart}=require('../js/calculations');
test('workweek contains 40 hours and skips weekends',()=>{
 assert.equal(workMilliseconds(new Date(2026,9,5),new Date(2026,9,12)),40*3600000);
 assert.equal(workMilliseconds(new Date(2026,9,10),new Date(2026,9,12)),0);
});
test('start dates, year end and daily boundaries',()=>{
 assert.equal(accrualState(new Date(2026,9,5),2026,new Date(2026,10,1)).p,0);
 assert.equal(accrualState(new Date(2027,0,1),2026,new Date(2026,0,1)).p,1);
 for(const [hour,p] of [[8,0],[9,0],[13,.5],[17,1]])assert.equal(dailyState(new Date(2026,9,5,hour),new Date(2026,0,1)).p,p);
 assert.equal(parseStart('2026-02-30'),null);
});
function load(saved){
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 const nodes=Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(([,id])=>[id,{style:{setProperty(){}},classList:{toggle(){},add(){},remove(){}},replaceChildren(){},appendChild(){},checked:true,setAttribute(k,v){this[k]=v},addEventListener(k,v){this[k]=v},focus(){},reset(){}}]));
 nodes['work-start'].value='09:00';nodes['work-end'].value='17:00';
 const store=new Map(saved?[['steady.dashboard.v1',JSON.stringify(saved)]]:[]);
 const context={Intl,Date,Math,Number,String,JSON,console,confirm:()=>true,setTimeout(){},clearTimeout(){},document:{createElement(){return {style:{setProperty(){}}}},getElementById:id=>{assert.ok(nodes[id],id);return nodes[id]},addEventListener(){}},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},setInterval(fn,ms){assert.equal(ms,1000)}};
 vm.createContext(context);for(const file of ['calculations','storage','pets','app'])vm.runInContext(fs.readFileSync(path.join(root,`js/${file}.js`),'utf8'),context);
 return {nodes,store,context};
}
test('settings restore, percentage conversion, updates save and opt-out removes storage',()=>{
 const {nodes,store}=load({version:1,salary:120000,bonusPercent:20,startDate:'2026-01-01'});
 assert.equal(nodes['bonus-target'].textContent,'$24,000.00');
 nodes.edit.onclick();nodes['salary-input'].valueAsNumber=100000;nodes['bonus-input'].valueAsNumber=12.5;nodes['income-form'].submit({preventDefault(){}});
 assert.equal(nodes['bonus-target'].textContent,'$12,500.00');assert.equal(JSON.parse(store.get('steady.dashboard.v1')).salary,100000);
 nodes.remember.checked=false;nodes['income-form'].submit({preventDefault(){}});assert.equal(store.size,0);
});
test('invalid imports are rejected and clear removes saved data',()=>{
 const {context,nodes,store}=load({version:1,salary:120000,bonusPercent:20,startDate:'2026-01-01'});
 assert.throws(()=>vm.runInContext("validateSettings({version:1,salary:-5,bonusPercent:20,startDate:'2026-01-01'})",context));
 nodes.clear.onclick();assert.equal(store.size,0);assert.equal(nodes.dashboard.hidden,true);
});

test('custom hours determine daily progress and annual work time',()=>{
 assert.equal(workMilliseconds(new Date(2026,9,5),new Date(2026,9,6),'10:30','16:30'),6*3600000);
 assert.equal(dailyState(new Date(2026,9,5,13,30),new Date(2026,0,1),'10:30','16:30').p,.5);
 const {validSchedule}=require('../js/calculations');
 assert.equal(validSchedule('17:00','09:00'),false);
 assert.equal(validSchedule('09:00','09:00'),false);
 assert.equal(validSchedule('09:30','18:00'),true);
});

test('return celebration selects latest completed weekday, never a future workday',()=>{
 const {context}=load();
 assert.equal(vm.runInContext("completedWorkday(new Date(2026,9,5,16),new Date(2026,9,5),'09:00','17:00')",context),null);
 assert.equal(vm.runInContext("completedWorkday(new Date(2026,9,5,18),new Date(2026,9,5),'09:00','17:00')",context),'2026-10-05');
 assert.equal(vm.runInContext("completedWorkday(new Date(2026,9,11,12),new Date(2026,9,5),'09:00','17:00')",context),'2026-10-09');
 assert.equal(vm.runInContext('bonkReaction(.1)',context),'retreated');
 assert.equal(vm.runInContext('bonkReaction(.3)',context),'protesting');
 assert.equal(vm.runInContext('bonkReaction(.8)',context),'bonked');
});
