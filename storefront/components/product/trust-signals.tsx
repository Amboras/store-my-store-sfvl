import { ShieldCheck, Truck, RotateCcw, Lock, BadgeCheck } from 'lucide-react'

export default function TrustSignals() {
  return (
    <div className="space-y-3">
      {/* 4-badge grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="flex flex-col items-center rounded-lg border bg-neutral-50 px-3 py-3 text-center">
          <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
          <p className="mt-1.5 text-[11px] font-semibold leading-tight">
            Lifetime warranty
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border bg-neutral-50 px-3 py-3 text-center">
          <Truck className="h-5 w-5" strokeWidth={1.5} />
          <p className="mt-1.5 text-[11px] font-semibold leading-tight">
            Free shipping $40+
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border bg-neutral-50 px-3 py-3 text-center">
          <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
          <p className="mt-1.5 text-[11px] font-semibold leading-tight">
            60-day returns
          </p>
        </div>
        <div className="flex flex-col items-center rounded-lg border bg-neutral-50 px-3 py-3 text-center">
          <BadgeCheck className="h-5 w-5" strokeWidth={1.5} />
          <p className="mt-1.5 text-[11px] font-semibold leading-tight">
            MIL-STD-810H
          </p>
        </div>
      </div>

      {/* Secure checkout strip */}
      <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Lock className="h-3 w-3" strokeWidth={2} />
        <span>Guaranteed safe checkout</span>
        <span className="text-neutral-300">·</span>
        <span className="font-semibold tracking-wider">VISA</span>
        <span className="text-neutral-300">·</span>
        <span className="font-semibold tracking-wider">MASTERCARD</span>
        <span className="text-neutral-300">·</span>
        <span className="font-semibold tracking-wider">AMEX</span>
      </div>
    </div>
  )
}
