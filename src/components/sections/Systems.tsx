'use client'
// src/components/sections/Systems.tsx
import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard, Users, Calendar, CheckSquare,
  BarChart3, UsersRound, Zap, Settings as SettingsIcon,
} from 'lucide-react'
import { t } from '@/lib/typography'
import Btn from '@/components/ui/Btn'

// ─── Tabs ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',   label: 'Dashboard',   Icon: LayoutDashboard },
  { id: 'leads',       label: 'Leads',       Icon: Users           },
  { id: 'scheduling',  label: 'Scheduling',  Icon: Calendar        },
  { id: 'tasks',       label: 'Tasks',       Icon: CheckSquare     },
  { id: 'analytics',   label: 'Analytics',   Icon: BarChart3       },
  { id: 'team',        label: 'Team',        Icon: UsersRound      },
  { id: 'automations', label: 'Automations', Icon: Zap             },
  { id: 'settings',    label: 'Settings',    Icon: SettingsIcon    },
]

// ─── Shared micro-styles ────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '8px',
  padding: '10px',
}
const lbl: React.CSSProperties = {
  fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#4a5a6a', marginBottom: '6px',
}

// ─── Views ──────────────────────────────────────────────────────────────

function ViewDashboard() {
  const bars = [42, 68, 55, 82, 60, 75, 91]
  const days = ['M','T','W','T','F','S','S']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
        {[
          { label: 'Revenue',      val: '$24.8K', sub: '▲ +12%',    pos: true  },
          { label: 'Active Leads', val: '47',     sub: '▲ +8 new',  pos: true  },
          { label: 'Conv. Rate',   val: '34%',    sub: '▼ −2%',     pos: false },
          { label: 'Open Tasks',   val: '12',     sub: '3 due',     pos: null  },
        ].map(k => (
          <div key={k.label} style={card}>
            <p style={lbl}>{k.label}</p>
            <p style={{ fontSize: '17px', fontWeight: 800, color: '#eef2f8', lineHeight: 1, marginBottom: '3px' }}>{k.val}</p>
            <p style={{ fontSize: '9px', fontWeight: 600, color: k.pos === true ? '#1cc7c3' : k.pos === false ? '#f06060' : '#5a6a7a' }}>{k.sub}</p>
          </div>
        ))}
      </div>
      <div style={{ ...card, flex: 1 }}>
        <p style={lbl}>Revenue · Last 7 Days</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '44px', marginBottom: '4px' }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <div style={{ width: '100%', height: `${h}%`, background: i === 6 ? '#1cc7c3' : 'rgba(28,199,195,0.3)', borderRadius: '2px 2px 0 0' }} />
              <span style={{ fontSize: '7px', color: '#3a4a5a' }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={card}>
        <p style={lbl}>Recent Activity</p>
        {[
          { text: 'Jake Thompson requested proposal', time: '2m' },
          { text: 'Automation "New Lead" triggered',  time: '1h' },
          { text: 'CRM synced 14 new contacts',       time: '3h' },
        ].map((a, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '4px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1cc7c3', flexShrink: 0 }} />
            <p style={{ fontSize: '10px', color: '#7a8898', flex: 1, margin: 0 }}>{a.text}</p>
            <span style={{ fontSize: '9px', color: '#3a4a5a', flexShrink: 0 }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ViewLeads() {
  const stages = [
    { label: 'New',      count: 12, color: '#5a7aff', leads: [{ name: 'Jake Thompson', co: 'Mountain Ridge', val: '$2.4K' }, { name: 'Sara Collins', co: 'Bloom Bakery', val: '$1.8K' }] },
    { label: 'Qualified',count: 8,  color: '#1cc7c3', leads: [{ name: 'MtnTop Brew',   co: 'Food & Bev',    val: '$5.8K' }, { name: 'Walker Dental', co: 'Healthcare', val: '$7.2K' }] },
    { label: 'Proposal', count: 4,  color: '#f0a020', leads: [{ name: 'Jasper HVAC',   co: 'Services',     val: '$9.5K' }] },
    { label: 'Won',      count: 18, color: '#30c060', leads: [{ name: 'Jasper Coffee', co: 'Retail',        val: '$4.2K' }, { name: 'Ridge Realty', co: 'Real Estate', val: '$6.8K' }] },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>Lead Pipeline</p>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '9px', background: 'rgba(28,199,195,0.12)', color: '#1cc7c3', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>42 Total</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', flex: 1 }}>
        {stages.map(s => (
          <div key={s.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#7a8898' }}>{s.label}</span>
              <span style={{ fontSize: '9px', color: '#4a5a6a', marginLeft: 'auto' }}>{s.count}</span>
            </div>
            {s.leads.map(lead => (
              <div key={lead.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderLeft: `2px solid ${s.color}`, borderRadius: '6px', padding: '6px 7px', marginBottom: '4px' }}>
                <p style={{ fontSize: '9px', fontWeight: 700, color: '#c0d0e0', marginBottom: '1px', lineHeight: 1.2 }}>{lead.name}</p>
                <p style={{ fontSize: '8px', color: '#5a6a7a', marginBottom: '3px' }}>{lead.co}</p>
                <p style={{ fontSize: '9px', color: s.color, fontWeight: 700 }}>{lead.val}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ViewScheduling() {
  const days = ['Mon','Tue','Wed','Thu','Fri']
  const times = ['9:00','10:00','11:00','12:00','1:00','2:00','3:00']
  const events: Record<string,{label:string;color:string}> = {
    '0-9:00':  { label: 'Discovery Call',    color: '#5a7aff' },
    '1-10:00': { label: 'Client Meeting',    color: '#1cc7c3' },
    '1-2:00':  { label: 'Team Standup',      color: '#f0a020' },
    '2-11:00': { label: 'Strategy Session',  color: '#1cc7c3' },
    '3-9:00':  { label: 'Discovery Call',    color: '#5a7aff' },
    '3-3:00':  { label: 'Proposal Review',   color: '#30c060' },
    '4-10:00': { label: 'Client Onboarding', color: '#30c060' },
  }
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>June 2025</p>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '9px', color: '#1cc7c3', background: 'rgba(28,199,195,0.1)', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>7 this week</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '32px repeat(5,1fr)', gap: '3px' }}>
        <div />
        {days.map(d => <div key={d} style={{ fontSize: '9px', fontWeight: 700, color: '#5a6a7a', textAlign: 'center', paddingBottom: '3px' }}>{d}</div>)}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
        {times.map(time => (
          <div key={time} style={{ display: 'grid', gridTemplateColumns: '32px repeat(5,1fr)', gap: '3px', flex: 1 }}>
            <span style={{ fontSize: '7px', color: '#3a4a5a', textAlign: 'right', paddingRight: '4px', paddingTop: '2px' }}>{time}</span>
            {days.map((_, di) => {
              const ev = events[`${di}-${time}`]
              return (
                <div key={di} style={{ borderRadius: '4px', background: ev ? `${ev.color}20` : 'rgba(255,255,255,0.02)', border: `1px solid ${ev ? ev.color + '40' : 'rgba(255,255,255,0.04)'}`, padding: ev ? '2px 4px' : '0', overflow: 'hidden' }}>
                  {ev && <p style={{ fontSize: '7px', color: ev.color, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>{ev.label}</p>}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ViewTasks() {
  const cols = [
    { label: 'To Do',       color: '#5a6a7a', tasks: [{ title: 'Homepage copy', tag: 'Content', dot: '#f0a020' }, { title: 'SEO keywords', tag: 'SEO', dot: '#5a7aff' }, { title: 'Review brand guide', tag: 'Brand', dot: '#1cc7c3' }] },
    { label: 'In Progress', color: '#5a7aff', tasks: [{ title: 'Redesign Walker Dental', tag: 'Design', dot: '#f0a020' }, { title: 'Lead automation', tag: 'Dev', dot: '#f06060' }] },
    { label: 'Review',      color: '#f0a020', tasks: [{ title: 'SEO audit report', tag: 'SEO', dot: '#5a7aff' }] },
    { label: 'Done',        color: '#30c060', tasks: [{ title: 'Brand guide v2', tag: 'Brand', dot: '#30c060' }, { title: 'CRM setup', tag: 'Dev', dot: '#30c060' }] },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>Task Board</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px', flex: 1 }}>
        {cols.map(col => (
          <div key={col.label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '2px', background: col.color }} />
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#7a8898' }}>{col.label}</span>
              <span style={{ fontSize: '8px', color: '#3a4a5a', marginLeft: 'auto', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '3px' }}>{col.tasks.length}</span>
            </div>
            {col.tasks.map(task => (
              <div key={task.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', padding: '7px 8px', marginBottom: '4px' }}>
                <p style={{ fontSize: '9px', fontWeight: 600, color: '#b0c0d0', marginBottom: '5px', lineHeight: 1.3 }}>{task.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '7px', background: `${task.dot}20`, color: task.dot, borderRadius: '3px', padding: '1px 4px', fontWeight: 600 }}>{task.tag}</span>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: task.dot, marginLeft: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function ViewAnalytics() {
  const sources = [
    { label: 'Organic SEO', pct: 42, color: '#1cc7c3' },
    { label: 'Paid Ads',    pct: 28, color: '#5a7aff' },
    { label: 'Direct',      pct: 18, color: '#f0a020' },
    { label: 'Referral',    pct: 12, color: '#30c060' },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>Analytics</p>
      <div style={card}>
        <p style={lbl}>Traffic · 30 Days</p>
        <svg viewBox="0 0 280 52" style={{ width: '100%', height: '52px', display: 'block' }}>
          <defs>
            <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1cc7c3" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1cc7c3" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="0,48 35,36 70,40 105,20 140,28 175,16 210,22 245,10 280,6 280,52 0,52" fill="url(#aGrad)" />
          <polyline points="0,48 35,36 70,40 105,20 140,28 175,16 210,22 245,10 280,6" fill="none" stroke="#1cc7c3" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
        <div style={card}>
          <p style={lbl}>Lead Sources</p>
          {sources.map(s => (
            <div key={s.label} style={{ marginBottom: '7px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '9px', color: '#7a8898' }}>{s.label}</span>
                <span style={{ fontSize: '9px', color: s.color, fontWeight: 700 }}>{s.pct}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { label: 'Avg. Session', val: '2m 48s', color: '#1cc7c3' },
            { label: 'Bounce Rate',  val: '38%',    color: '#f0a020' },
            { label: 'New Users',    val: '+284',    color: '#30c060' },
            { label: 'Conv. Goal',   val: '34%',     color: '#5a7aff' },
          ].map(m => (
            <div key={m.label} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: '#6a7a8a' }}>{m.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: m.color }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ViewTeam() {
  const members = [
    { name: 'Sam Cole',     role: 'Founder & Lead',    dept: 'Executive',  init: 'SC', color: '#1cc7c3', online: true  },
    { name: 'Alex Rivera',  role: 'Brand Designer',    dept: 'Creative',   init: 'AR', color: '#5a7aff', online: true  },
    { name: 'Jordan Kim',   role: 'Dev & Systems',     dept: 'Technical',  init: 'JK', color: '#f0a020', online: false },
    { name: 'Taylor Moore', role: 'Growth Strategist', dept: 'Marketing',  init: 'TM', color: '#30c060', online: true  },
    { name: 'Casey Walsh',  role: 'Project Manager',   dept: 'Operations', init: 'CW', color: '#a060f0', online: false },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>Team Members</p>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '9px', color: '#1cc7c3', background: 'rgba(28,199,195,0.1)', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>3 Online</span>
      </div>
      {members.map(m => (
        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', ...card, padding: '8px 10px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${m.color}22`, border: `1.5px solid ${m.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: m.color }}>{m.init}</div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '7px', height: '7px', borderRadius: '50%', background: m.online ? '#30c060' : '#3a4a5a', border: '1.5px solid #0a0f1a' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', marginBottom: '1px' }}>{m.name}</p>
            <p style={{ fontSize: '9px', color: '#5a6a7a', margin: 0 }}>{m.role}</p>
          </div>
          <span style={{ fontSize: '8px', background: `${m.color}18`, color: m.color, borderRadius: '4px', padding: '2px 6px', fontWeight: 600, flexShrink: 0 }}>{m.dept}</span>
        </div>
      ))}
    </div>
  )
}

function ViewAutomations() {
  const workflows = [
    { name: 'New Lead Router',    active: true,  steps: ['Form Submit','Qualify Score','Assign CRM','Notify Team'], colors: ['#5a7aff','#f0a020','#1cc7c3','#30c060'] },
    { name: 'Follow-Up Sequence', active: true,  steps: ['Lead Created','Wait 24h','Send Email','Log Activity'],   colors: ['#5a7aff','#f0a020','#1cc7c3','#30c060'] },
    { name: 'Proposal Alert',     active: false, steps: ['Stage Change','Check Value','Slack Alert'],               colors: ['#5a7aff','#f0a020','#1cc7c3'] },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>Automation Workflows</p>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '9px', color: '#30c060', background: 'rgba(48,192,96,0.1)', borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>2 Active</span>
      </div>
      {workflows.map(wf => (
        <div key={wf.name} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${wf.active ? 'rgba(28,199,195,0.15)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: wf.active ? '#30c060' : '#3a4a5a' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#b0c0d0' }}>{wf.name}</span>
            <span style={{ marginLeft: 'auto', fontSize: '8px', color: wf.active ? '#30c060' : '#4a5a6a', fontWeight: 600 }}>{wf.active ? 'Active' : 'Paused'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {wf.steps.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ background: `${wf.colors[i]}20`, border: `1px solid ${wf.colors[i]}40`, borderRadius: '4px', padding: '2px 6px', fontSize: '8px', color: wf.colors[i], fontWeight: 600 }}>{step}</div>
                {i < wf.steps.length - 1 && <span style={{ fontSize: '8px', color: '#3a4a5a' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ViewSettings() {
  const integrations = [
    { name: 'Stripe',           connected: true,  init: 'ST', color: '#5a7aff' },
    { name: 'Zapier',           connected: true,  init: 'ZP', color: '#f0a020' },
    { name: 'Slack',            connected: true,  init: 'SL', color: '#a060f0' },
    { name: 'Google Analytics', connected: true,  init: 'GA', color: '#1cc7c3' },
    { name: 'Mailchimp',        connected: false, init: 'MC', color: '#4a5a6a' },
    { name: 'QuickBooks',       connected: false, init: 'QB', color: '#4a5a6a' },
  ]
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#c0d0e0', margin: 0 }}>Integrations & API</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
        {integrations.map(int => (
          <div key={int.name} style={{ ...card, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `${int.color}22`, border: `1px solid ${int.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 800, color: int.color, flexShrink: 0 }}>{int.init}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#b0c0d0', marginBottom: '1px' }}>{int.name}</p>
              <p style={{ fontSize: '8px', color: int.connected ? '#30c060' : '#4a5a6a', fontWeight: 600, margin: 0 }}>{int.connected ? 'Connected' : 'Not connected'}</p>
            </div>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: int.connected ? '#30c060' : '#3a4a5a', flexShrink: 0 }} />
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(28,199,195,0.05)', border: '1px solid rgba(28,199,195,0.12)', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#c0d0e0', marginBottom: '2px' }}>API Key</p>
          <p style={{ fontSize: '9px', color: '#4a5a6a', fontFamily: 'monospace', margin: 0 }}>sk_live_••••••••••••••4f8a</p>
        </div>
        <span style={{ fontSize: '9px', background: 'rgba(28,199,195,0.1)', color: '#1cc7c3', borderRadius: '4px', padding: '3px 8px', fontWeight: 600, flexShrink: 0 }}>Regenerate</span>
      </div>
    </div>
  )
}

// ─── View registry ───────────────────────────────────────────────────────
const VIEWS: Record<string, () => React.ReactElement> = {
  dashboard:   ViewDashboard,
  leads:       ViewLeads,
  scheduling:  ViewScheduling,
  tasks:       ViewTasks,
  analytics:   ViewAnalytics,
  team:        ViewTeam,
  automations: ViewAutomations,
  settings:    ViewSettings,
}

// ─── Dashboard shell ─────────────────────────────────────────────────────
function GrowthOS() {
  const [active, setActive] = useState('dashboard')
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const ids = TABS.map(tab => tab.id)
    const timer = setInterval(() => {
      setActive(prev => {
        const idx = ids.indexOf(prev)
        return ids[(idx + 1) % ids.length]
      })
    }, 1800)
    return () => clearInterval(timer)
  }, [paused])

  const Content = VIEWS[active]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ background: '#0a0f1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 32px 80px rgba(0,0,0,0.55)', overflow: 'hidden', width: '100%' }}
    >
      <style>{`
        @keyframes view-fade {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .view-enter { animation: view-fade 0.22s ease both; }
        .sidebar-btn { position: relative; }
        .sidebar-btn:not(.sidebar-btn-active):hover {
          background: rgba(255,255,255,0.05) !important;
        }
        .sidebar-btn:hover .sidebar-tip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }
        .sidebar-tip {
          position: absolute;
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%) translateX(-4px);
          background: #162030;
          border: 1px solid rgba(255,255,255,0.1);
          color: #a0b4c4;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 5px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease, transform 0.15s ease;
          z-index: 100;
        }
      `}</style>

      {/* Chrome */}
      <div style={{ height: '36px', background: '#0d1420', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '6px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#febc2e' }} />
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28c840' }} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#3a4a5a', letterSpacing: '0.06em' }}>GrowthOS</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#30c060' }} />
          <span style={{ fontSize: '9px', color: '#30c060', fontWeight: 600 }}>Live</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', height: '340px' }}>
        {/* Sidebar */}
        <div style={{ width: '52px', background: '#0d1420', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '8px 0', gap: '1px', flexShrink: 0 }}>
          {TABS.map(({ id, label, Icon }) => {
            const on = active === id
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`sidebar-btn${on ? ' sidebar-btn-active' : ''}`}
                onMouseEnter={() => setActive(id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 0', background: on ? 'rgba(28,199,195,0.1)' : 'transparent', border: 'none', borderLeft: on ? '2px solid #1cc7c3' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <Icon size={14} style={{ color: on ? '#1cc7c3' : '#3a4a5a', transition: 'color 0.15s ease' }} />
                <span className="sidebar-tip">{label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '12px', overflow: 'hidden', minWidth: 0 }}>
          <div className="view-enter" key={active} style={{ height: '100%' }}>
            <Content />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────
const MODULES = ['CRM', 'Reporting', 'Scheduling', 'Automations', 'Analytics', 'Team Mgmt']

export default function Systems() {
  return (
    <section style={{ background: '#070d17', padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: '72px', alignItems: 'center' }}>

          {/* Left */}
          <div>
            <p style={{ ...t.eyebrow, marginBottom: '20px' }}>Modern Business Infrastructure</p>
            <h2 style={{ ...t.h2, color: '#f0f4f8', marginBottom: '24px' }}>
              If There&apos;s a Smarter Way to Build It,{' '}
              <span style={{ color: '#1cc7c3' }}>We&apos;ll Help Create It.</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
              <p style={{ ...t.body, color: '#7a8898', margin: 0 }}>
                From custom applications and client portals to intelligent automations, dashboard
                reporting systems, and operational infrastructure — we help businesses modernize
                the way they work.
              </p>
              <p style={{ ...t.body, color: '#7a8898', margin: 0 }}>
                Whether it&apos;s managing leads, streamlining workflows, improving visibility, or
                automating repetitive tasks, we build solutions designed around how your business
                actually operates.
              </p>
            </div>
            <Btn href="/services/ai-systems" variant="primary">Explore AI Solutions →</Btn>
          </div>

          {/* Right */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30c060', boxShadow: '0 0 6px #30c06099' }} />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#2a5a3a', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Live Modules</span>
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {MODULES.map(m => (
                  <span key={m} style={{ fontSize: '9px', color: '#1cc7c3', background: 'rgba(28,199,195,0.08)', border: '1px solid rgba(28,199,195,0.14)', borderRadius: '4px', padding: '2px 7px', fontWeight: 600 }}>
                    <span style={{ color: '#30c060' }}>✓ </span>{m}
                  </span>
                ))}
              </div>
            </div>
            <GrowthOS />
          </div>

        </div>
      </div>
    </section>
  )
}
