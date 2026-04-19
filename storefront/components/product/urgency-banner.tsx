'use client'

import { useEffect, useState } from 'react'
import { Flame, Clock } from 'lucide-react'

interface UrgencyBannerProps {
  stockCount?: number | null
  /** How many people are "viewing" — purely visual. Random between 12-38 if omitted. */
  viewersHint?: number
}

function formatTime(ms: number): string {
  if (ms <= 0) return '00:00:00'
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s
    .toString()
    .padStart(2, '0')}`
}

export default function UrgencyBanner({ stockCount, viewersHint }: UrgencyBannerProps) {
  // Sale ends at midnight local time
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [viewers, setViewers] = useState<number>(viewersHint ?? 24)

  useEffect(() => {
    const computeEndOfDay = () => {
      const now = new Date()
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      return end.getTime() - now.getTime()
    }
    setTimeLeft(computeEndOfDay())
    const t = setInterval(() => setTimeLeft(computeEndOfDay()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (viewersHint != null) return
    setViewers(Math.floor(Math.random() * 26) + 12)
    const t = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.max(8, Math.min(44, v + delta))
      })
    }, 6000)
    return () => clearInterval(t)
  }, [viewersHint])

  const showLowStock = typeof stockCount === 'number' && stockCount > 0 && stockCount < 20

  return (
    <div className="space-y-2.5">
      {/* Sale timer */}
      <div className="flex items-center gap-3 rounded-lg border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-3.5 py-2.5">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-600 text-white">
          <Clock className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-900">
            Flash sale ends in
          </p>
          <p className="font-heading text-lg font-semibold tabular-nums text-rose-950">
            {timeLeft != null ? formatTime(timeLeft) : '—'}
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-[10px] uppercase tracking-wider text-rose-900/70">
            Discount
          </p>
          <p className="font-heading text-lg font-semibold text-rose-950">–34%</p>
        </div>
      </div>

      {/* Low stock + viewers */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        {showLowStock && (
          <span className="inline-flex items-center gap-1.5 font-medium text-amber-700">
            <Flame className="h-3.5 w-3.5" strokeWidth={2} />
            Only <strong className="tabular-nums">{stockCount}</strong> left at this price
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <strong className="tabular-nums text-foreground">{viewers}</strong> people
          viewing right now
        </span>
      </div>
    </div>
  )
}
