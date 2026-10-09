// Decorative skies follow local time, not a weather service.
const dailyJokes=[
 ['Why does the turtle carry three bricks?', 'It’s building wealth at its own pace.'],
 ['Why did the spreadsheet go outside?', 'It needed some fresh rows.'],
 ['What’s a turtle’s favorite investment?', 'A shell-tered savings account.'],
 ['Why was the calendar so confident?', 'Its days were numbered, but fully booked.'],
 ['My budget and I have an agreement.', 'I make plans. It provides constructive criticism.'],
 ['Why did the brick get promoted?', 'It was the foundation of the team.'],
 ['What does a turtle call overtime?', 'Shell we keep going?'],
 ['I asked my savings to grow faster.', 'They said, “We appreciate your interest.”'],
 ['Why did the clock take a break?', 'It had been working around the clock.'],
 ['My wallet started a fitness routine.', 'It’s getting thinner every day.'],
 ['Why is the turtle good at meetings?', 'It always comes out of its shell with a point.'],
 ['What’s a brick’s favorite kind of music?', 'House.'],
 ['I made a five-year plan.', 'The turtle asked if we could walk there.'],
 ['Why did the coin bring a friend?', 'It wanted a little change.'],
 ['My to-do list has a great personality.', 'It’s very outgoing. Nothing ever comes back done.'],
 ['Why did the turtle bring lunch?', 'Fast food was out of the question.'],
 ['What did one savings goal say to another?', 'We’ll get there, bit by bit.'],
 ['Why did the desk get a compliment?', 'It supported everyone’s work.'],
 ['My alarm clock and I are in negotiations.', 'It keeps making early demands.'],
 ['Why don’t turtles rush payday?', 'They know slow and steady pays the bills.'],
 ['What did the tiny house say?', 'Thanks for sticking with me, brick by brick.'],
 ['Why was the calculator calm?', 'It could count on itself.'],
 ['I’m excellent at saving energy.', 'Especially before coffee.'],
 ['Why did Friday wear sunglasses?', 'Its future looked like the weekend.'],
 ['My coffee has a job title.', 'Director of Getting Started.'],
 ['Why did the turtle open a bakery?', 'It had a talent for slow rolls.'],
 ['What’s the hardest part of budgeting?', 'Convincing snacks they aren’t a department.'],
 ['Why did the plant like payday?', 'It was rooting for growth.'],
 ['I told the turtle to think outside the box.', 'It said, “Can I keep the shell?”'],
 ['Why did the notebook smile?', 'It was turning over a new leaf.'],
 ['What’s a turtle’s favorite deadline?', 'One it can see from here.']
];
function jokeForDay(date){const day=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);return dailyJokes[((day%dailyJokes.length)+dailyJokes.length)%dailyJokes.length]}
function skyForTime(date,workEnd){const minute=date.getHours()*60+date.getMinutes(),end=timeMinutes(workEnd);return minute<360||minute>=Math.max(1200,end+90)?'night':minute>=end-60?'sunset':'day'}
let nextSurpriseAt=Date.now()+20000,surpriseUntil=0,surprisePet=null;
function updateDelight(stamp,now,isPreview,workEnd){
 const sky=skyForTime(stamp,workEnd);
 for(const id of ['salary-progress','daily-progress'])document.getElementById(id).setAttribute('data-sky',sky);
 document.getElementById('sky-label').textContent={day:'A little sunshine for your steady steps.',sunset:'Golden hour. Every little step counts.',night:'Under the stars. Time to recharge.'}[sky];
 const [setup,punchline]=jokeForDay(now);document.getElementById('joke-setup').textContent=setup;document.getElementById('joke-punchline').textContent=punchline;
 if(surprisePet&&(Date.now()>=surpriseUntil||isPreview||document.hidden)){
  surprisePet.classList.remove('butterfly-visit','brick-slip');surprisePet=null;
 }
 if(isPreview||document.hidden||document.getElementById('dashboard').hidden||surprisePet||Date.now()<nextSurpriseAt)return;
 const pet=document.getElementById(Math.random()<.5?'annual-pet':'daily-pet');
 if(pet.classList.contains('celebrating'))return;
 pet.classList.add(Math.random()<.5?'butterfly-visit':'brick-slip');surprisePet=pet;surpriseUntil=Date.now()+4200;nextSurpriseAt=Date.now()+45000+Math.random()*45000;
}
