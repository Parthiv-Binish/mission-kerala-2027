import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, CalendarDays, Check, ChevronRight, Clock3, Flag, MapPin, RotateCcw, Target } from 'lucide-react'

const TARGET = new Date('2027-08-28T00:00:00')
const JOINED = new Date('2025-08-28T00:00:00')
const initialTasks = [
  { id: 'policy', title: 'Review the latest internal mobility policy', note: 'Confirm the applicable tenure and eligibility rules' },
  { id: 'manager', title: 'Discuss the move with reporting manager', note: 'Understand the approval path and business requirements' },
  { id: 'hr', title: 'Reconnect with HR about the Kerala request', note: 'Keep the earlier family circumstances and request documented' },
  { id: 'locations', title: 'Identify preferred Kerala base locations', note: 'Prioritise Kochi and locations closer to home' },
  { id: 'profile', title: 'Update internal profile and skills', note: 'Keep role, project experience and contact details current' },
  { id: 'application', title: 'Prepare the internal transfer application', note: 'Collect supporting documents before the target date' },
  { id: 'submit', title: 'Submit transfer request when eligible', note: 'Eligibility and approval remain subject to TCS policy' },
]
const milestones = [
  { date: '2027-02-28', label: '18 months at TCS' },
  { date: '2027-05-28', label: '21 months at TCS' },
  { date: '2027-07-28', label: '23 months at TCS' },
  { date: '2027-08-28', label: '2-year anniversary' },
]
function diffDays(a: Date, b: Date) { return Math.max(0, Math.ceil((b.getTime() - a.getTime()) / 86400000)) }
function workingDays(from: Date, to: Date) {
  const d = new Date(from); d.setHours(0,0,0,0)
  const end = new Date(to); end.setHours(0,0,0,0)
  let count = 0
  while (d < end) { const day = d.getDay(); if (day !== 0 && day !== 6) count++; d.setDate(d.getDate()+1) }
  return count
}
function App() {
  const [now, setNow] = useState(new Date())
  const [checked, setChecked] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('mk27-tasks') || '[]') } catch { return [] } })
  const [notes, setNotes] = useState(() => localStorage.getItem('mk27-notes') || '')
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 60000); return () => window.clearInterval(id) }, [])
  useEffect(() => { localStorage.setItem('mk27-tasks', JSON.stringify(checked)) }, [checked])
  useEffect(() => { localStorage.setItem('mk27-notes', notes) }, [notes])
  const days = diffDays(now, TARGET)
  const total = diffDays(JOINED, TARGET)
  const elapsed = Math.min(total, diffDays(JOINED, now))
  const progress = Math.max(0, Math.min(100, elapsed / total * 100))
  const weeks = Math.floor(days / 7), rem = days % 7
  const work = workingDays(now, TARGET)
  const nextMilestone = useMemo(() => milestones.find(m => new Date(m.date+'T00:00:00') >= now), [now])
  const toggle = (id: string) => setChecked(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id])
  return <main className="shell">
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark"><Flag size={17}/></span><span>MISSION <b>KERALA</b></span><small>2027</small></a><div className="top-right"><span className="live-dot"/> PERSONAL TRACKER <span className="top-date">{now.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div></header>
    <section className="hero">
      <div className="eyebrow"><span/> THE NEXT CHAPTER STARTS CLOSER TO HOME</div>
      <h1>One step closer<br/><em>to Kerala.</em></h1>
      <p className="intro">A countdown to completing two years at TCS — and preparing for the next move.</p>
      <div className="countdown-card">
        <div className="count-head"><div><span className="muted-label">TWO-YEAR MILESTONE</span><h2>28 August 2027</h2></div><div className="target-icon"><Target size={21}/></div></div>
        <div className="numbers"><div><strong>{days}</strong><span>DAYS TO GO</span></div><div><strong>{weeks}<small>w</small> {rem}<small>d</small></strong><span>WEEKS + DAYS</span></div><div><strong>{work}</strong><span>WEEKDAYS LEFT</span></div></div>
        <div className="progress-meta"><span>TIME IN TCS</span><b>{progress.toFixed(1)}%</b></div><div className="progress-track"><div style={{width:progress+'%'}}/></div>
        <div className="progress-foot"><span>Joined 28 Aug 2025</span><span>2 years · 28 Aug 2027</span></div>
      </div>
    </section>
    <section className="stats">
      <article className="stat"><span className="stat-icon"><CalendarDays size={18}/></span><div><b>{Math.floor(days/30.4375)}</b><span>MONTHS APPROX.</span></div></article>
      <article className="stat"><span className="stat-icon"><Clock3 size={18}/></span><div><b>{checked.length}/{initialTasks.length}</b><span>PREP TASKS DONE</span></div></article>
      <article className="stat"><span className="stat-icon"><MapPin size={18}/></span><div><b>Kerala</b><span>DESTINATION</span></div></article>
    </section>
    <section className="content-grid">
      <div className="panel milestones"><div className="section-head"><div><span className="kicker">THE ROAD AHEAD</span><h3>Milestones</h3></div><span className="pill">2027</span></div>
        <div className="timeline">{milestones.map((m,i)=>{const passed=now>=new Date(m.date+'T00:00:00');return <div className={'milestone '+(passed?'passed':'')} key={m.date}><span className="timeline-dot">{passed?<Check size={13}/>:null}</span><div><b>{m.label}</b><span>{new Date(m.date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</span></div>{i===3&&<span className="final-tag">TARGET</span>}</div>})}</div>
        {nextMilestone&&<div className="next-box"><span className="kicker">UP NEXT</span><b>{nextMilestone.label}</b><span>{diffDays(now,new Date(nextMilestone.date+'T00:00:00'))} days away</span></div>}
      </div>
      <div className="panel checklist"><div className="section-head"><div><span className="kicker">MAKE THE MOVE COUNT</span><h3>Transfer preparation</h3></div><span className="pill">{Math.round(checked.length/initialTasks.length*100)}%</span></div>
        <div className="task-list">{initialTasks.map(t=><button className={'task '+(checked.includes(t.id)?'done':'')} key={t.id} onClick={()=>toggle(t.id)}><span className="check">{checked.includes(t.id)&&<Check size={14}/>}</span><span className="task-copy"><b>{t.title}</b><small>{t.note}</small></span><ChevronRight size={16} className="task-arrow"/></button>)}</div>
        <button className="reset" onClick={()=>{if(confirm('Reset all checklist progress?'))setChecked([])}}><RotateCcw size={13}/> Reset checklist</button>
      </div>
    </section>
    <section className="panel notes-panel"><div className="section-head"><div><span className="kicker">YOUR PRIVATE SPACE</span><h3>Notes to self</h3></div><span className="saved">SAVED ON THIS DEVICE</span></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Add reminders, HR conversations, policy details or anything you want to remember…"/></section>
    <footer><div className="footer-brand">MISSION <b>KERALA</b> 2027</div><span>Built for the days between now and the next chapter.</span><span className="footer-right">KEEP GOING <ArrowUpRight size={13}/></span></footer>
  </main>
}
export default App