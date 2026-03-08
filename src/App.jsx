import { useState, useEffect } from "react"
import { morningMessages, eveningMessages } from "./data"
import "./App.css"

function randomMessage(list){
return list[Math.floor(Math.random()*list.length)]
}

function getTimeMode(){
const hour = new Date().getHours()
if(hour < 14) return "morning"
return "evening"
}

export default function App(){

const [screen,setScreen] = useState("loading")
const [level,setLevel] = useState(1)
const [rant,setRant] = useState("")
const [message,setMessage] = useState("")
const [dayMood,setDayMood] = useState("")
const [journal,setJournal] = useState([])
const [streak,setStreak] = useState([])

const mode = getTimeMode()

useEffect(()=>{

const today = new Date().toDateString()
const lastOpen = localStorage.getItem("lastOpen")
const finishedDay = localStorage.getItem("finishedDay")

const savedLevel = localStorage.getItem("level")
if(savedLevel){
setLevel(parseInt(savedLevel))
}

const savedJournal = JSON.parse(localStorage.getItem("journal")) || []
setJournal(savedJournal)

const savedStreak = JSON.parse(localStorage.getItem("streak")) || []
setStreak(savedStreak)

if(finishedDay === today){
setScreen("dayComplete")
return
}

if(lastOpen && lastOpen !== today){
setScreen("missed")
}else{
setScreen(mode)
}

localStorage.setItem("lastOpen",today)

},[])

function chooseMorning(type){

if(type==="period"){
setScreen("periodSelect")
return
}

const msg = randomMessage(morningMessages[type])
setMessage(msg)
setScreen("morningMessage")

}

function choosePeriod(day){

const msg = randomMessage(morningMessages.period[day])
setMessage(msg)
setScreen("morningMessage")

}

function chooseEvening(type){

setDayMood(type)

const msg = randomMessage(eveningMessages[type])
setMessage(msg)

setScreen("eveningMessage")

}

function shouldShowWeeklyReflection(streakArray){
if(streakArray.length > 0 && streakArray.length % 7 === 0){
return true
}
return false
}

function closeDay(){

const today = new Date().toDateString()

const newLevel = level + 1
setLevel(newLevel)

localStorage.setItem("level", newLevel)
localStorage.setItem("finishedDay", today)

let savedStreak = JSON.parse(localStorage.getItem("streak")) || []

if(!savedStreak.includes(today)){
savedStreak.push(today)
}

localStorage.setItem("streak", JSON.stringify(savedStreak))
setStreak(savedStreak)

if(shouldShowWeeklyReflection(savedStreak)){
setScreen("weeklyReflection")
}else{
setScreen("levelUp")
}

}

function saveRant(){

const today = new Date().toDateString()

const entry = {
date: today,
text: rant
}

let saved = JSON.parse(localStorage.getItem("journal")) || []
saved.push(entry)

localStorage.setItem("journal", JSON.stringify(saved))
setJournal(saved)

setRant("")
setScreen("dayComplete")

}

function getGift(){

if(dayMood==="exhausted"){
return "You carried a lot today. Drink some water, stretch your shoulders, and allow your body to rest."
}

if(dayMood==="normal"){
return "Today moved forward quietly. Take a calm breath and enjoy a peaceful moment."
}

if(dayMood==="productive"){
return "You used your energy well today. Take a moment to feel proud of what you achieved."
}

if(dayMood==="heavy"){
return "Some days weigh more than others. Tonight your only responsibility is rest."
}

if(dayMood==="survived"){
return "Survival days still matter. You stayed here and kept going."
}

return "Take a slow breath. Tonight is yours."

}

function renderPage(){

if(screen==="loading") return null

if(screen==="missed"){
return(
<div className="container">
<h2>We haven't seen you for a few days.</h2>
<p>Would you like to talk about it?</p>
<button onClick={()=>setScreen(getTimeMode())}>Maybe</button>
<button onClick={()=>setScreen(getTimeMode())}>Skip</button>
</div>
)
}

if(screen==="morning"){
return(
<div className="container">
<h1>Good morning</h1>
<p>How are we feeling today?</p>

<button onClick={()=>chooseMorning("working")}>Working again today</button>
<button onClick={()=>chooseMorning("dayoff")}>Finally a day off</button>
<button onClick={()=>chooseMorning("period")}>Having my period</button>
<button onClick={()=>chooseMorning("overwhelmed")}>Feeling overwhelmed</button>
<button onClick={()=>chooseMorning("calm")}>Feeling calm</button>

</div>
)
}

if(screen==="periodSelect"){
return(
<div className="container">
<h2>Which day of your cycle?</h2>

<button onClick={()=>choosePeriod("day1")}>Day 1</button>
<button onClick={()=>choosePeriod("day2")}>Day 2</button>
<button onClick={()=>choosePeriod("day3")}>Day 3</button>
<button onClick={()=>choosePeriod("day4")}>Day 4</button>
<button onClick={()=>choosePeriod("day5")}>Day 5</button>

</div>
)
}

if(screen==="morningMessage"){
return(
<div className="container">
<h2>{message}</h2>
<p>Have a good day.</p>
<button onClick={()=>setScreen("dayWait")}>
See you tonight
</button>
</div>
)
}

if(screen==="dayWait"){
return(
<div className="container">
<h2>Come back tonight</h2>
<p>The evening reflection will appear after your day.</p>
</div>
)
}

if(screen==="evening"){
return(
<div className="container">

<h1>Welcome back</h1>
<p>How was our day today?</p>

<button onClick={()=>chooseEvening("exhausted")}>Exhausting</button>
<button onClick={()=>chooseEvening("normal")}>Normal</button>
<button onClick={()=>chooseEvening("productive")}>Productive</button>
<button onClick={()=>chooseEvening("heavy")}>Emotionally heavy</button>
<button onClick={()=>chooseEvening("survived")}>I survived</button>

</div>
)
}

if(screen==="eveningMessage"){
return(
<div className="container">

<h2>{message}</h2>

<button onClick={closeDay}>
Close the day
</button>

</div>
)
}

if(screen==="weeklyReflection"){
return(
<div className="container">

<h2>A week has passed</h2>

<p>
You completed seven days. Take a moment to think about the week.
</p>

<p>
What helped you keep going this week?
</p>

<textarea
value={rant}
onChange={(e)=>setRant(e.target.value)}
rows="6"
/>

<button onClick={()=>setScreen("levelUp")}>
Continue
</button>

</div>
)
}

if(screen==="levelUp"){
return(
<div className="container">

<h2>You made it through another day</h2>

<p>Level {level}</p>

<p>We will meet again tomorrow.</p>

<button onClick={()=>setScreen("secret")}>
Continue
</button>

</div>
)
}

if(screen==="secret"){
return(
<div className="container">

<h2>A quiet moment before sleep</h2>

<button onClick={()=>setScreen("rant")}>
Rant about today
</button>

<button onClick={()=>setScreen("gift")}>
Secret gift
</button>

<button onClick={()=>setScreen("journal")}>
Past reflections
</button>

<button onClick={()=>setScreen("streak")}>
Your streak
</button>

</div>
)
}

if(screen==="journal"){
return(
<div className="container">

<h2>Your past reflections</h2>

{journal.length === 0 && (
<p>No reflections yet.</p>
)}

{journal.map((entry,index)=>(
<div key={index} className="journalEntry">
<p><strong>{entry.date}</strong></p>
<p>{entry.text}</p>
</div>
))}

<button onClick={()=>setScreen("secret")}>
Back
</button>

</div>
)
}

if(screen==="streak"){
return(
<div className="container">

<h2>Your streak</h2>

<div className="streakGrid">

{streak.map((day,index)=>(
<div key={index} className="streakDay">
{new Date(day).getDate()}
</div>
))}

</div>

<button onClick={()=>setScreen("secret")}>
Back
</button>

</div>
)
}

if(screen==="rant"){
return(
<div className="container">

<h2>Write anything you need</h2>

<textarea
value={rant}
onChange={(e)=>setRant(e.target.value)}
rows="6"
/>

<button onClick={saveRant}>
Save and rest
</button>

</div>
)
}

if(screen==="gift"){
return(
<div className="container">

<h2>Your secret gift</h2>

<p>{getGift()}</p>

<button onClick={()=>setScreen("dayComplete")}>
Good night
</button>

</div>
)
}

if(screen==="dayComplete"){
return(
<div className="container">

<h2>The day is complete</h2>

<p>Rest well. We'll see you tomorrow.</p>

</div>
)
}

}

return(
<div className={`app ${mode} ${dayMood}`}>
<div className="stars"></div>
<div className="stars2"></div>
<div className="stars3"></div>
{renderPage()}
</div>
)

}