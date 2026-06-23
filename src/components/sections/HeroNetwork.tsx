'use client'
import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  phase: number
}

const TEAL = '28,199,195'
const NODE_COUNT = 52
const CONNECT_DIST = 190
const CURSOR_DIST = 210   // pointer "reach"
const PULL = 0.018        // how strongly nearby nodes ease toward the cursor (subtle)

export default function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animId = 0
    let nodes: Node[] = []
    // Pointer position in canvas-local coords; null when the cursor is away.
    const mouse: { x: number | null; y: number | null } = { x: null, y: null }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      // Reset before scaling so repeated resizes don't compound the transform.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      resize()
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 1.2,
        opacity: Math.random() * 0.45 + 0.25,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Move nodes + apply a gentle pull toward the cursor when it's near.
      nodes.forEach(n => {
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          n.phase += 0.008
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1

          if (mouse.x !== null && mouse.y !== null) {
            const mdx = mouse.x - n.x
            const mdy = mouse.y - n.y
            const md = Math.sqrt(mdx * mdx + mdy * mdy)
            if (md < CURSOR_DIST && md > 0.001) {
              const ease = PULL * (1 - md / CURSOR_DIST)
              n.x += mdx * ease
              n.y += mdy * ease
            }
          }
        }
      })

      // Draw node-to-node edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.18
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${TEAL},${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw cursor "reach" — brighter lines from the pointer to nearby nodes.
      if (mouse.x !== null && mouse.y !== null) {
        for (const n of nodes) {
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CURSOR_DIST) {
            const alpha = (1 - dist / CURSOR_DIST) * 0.32
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(n.x, n.y)
            ctx.strokeStyle = `rgba(${TEAL},${alpha})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
        // Faint glow at the cursor
        const cg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 60)
        cg.addColorStop(0, `rgba(${TEAL},0.10)`)
        cg.addColorStop(1, `rgba(${TEAL},0)`)
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 60, 0, Math.PI * 2)
        ctx.fillStyle = cg
        ctx.fill()
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = reduce ? 1 : Math.sin(n.phase) * 0.12 + 0.88
        const r = n.radius * pulse
        const a = n.opacity * pulse

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5)
        grd.addColorStop(0, `rgba(${TEAL},${a * 0.22})`)
        grd.addColorStop(1, `rgba(${TEAL},0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${TEAL},${a})`
        ctx.fill()
      })

      if (!reduce) animId = requestAnimationFrame(draw)
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onPointerLeave = () => { mouse.x = null; mouse.y = null }
    const onResize = () => { init(); if (reduce) draw() }

    init()
    draw() // first frame (and the only frame under reduced-motion)

    if (!reduce) {
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerleave', onPointerLeave)
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}
