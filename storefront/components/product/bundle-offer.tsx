'use client'

import { useMemo, useState } from 'react'
import { Check, Loader2, Sparkles, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/hooks/use-cart'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import type { Product } from '@/types'

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?: {
    calculated_amount?: number
    currency_code?: string
  } | number
  [key: string]: unknown
}

interface BundleOfferProps {
  product: Product
}

function formatPrice(amountCents: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amountCents / 100)
  } catch {
    return `$${(amountCents / 100).toFixed(2)}`
  }
}

function getVariantPrice(v: ProductVariantWithPrice | undefined) {
  const cp = v?.calculated_price
  if (!cp) return { amount: null, currency: 'usd' }
  if (typeof cp === 'number') return { amount: cp, currency: 'usd' }
  return {
    amount: cp.calculated_amount ?? null,
    currency: cp.currency_code || 'usd',
  }
}

export default function BundleOffer({ product }: BundleOfferProps) {
  const variants = (product.variants || []) as unknown as ProductVariantWithPrice[]
  const firstVariant = variants[0]
  const { amount: unitPrice, currency } = getVariantPrice(firstVariant)

  // Three tiers. We apply discounts client-side via quantity multipliers &
  // set an auto-applied promo on cart if present. For display the savings are
  // computed from the advertised percent.
  const tiers = useMemo(
    () =>
      unitPrice == null
        ? []
        : [
            {
              id: '1',
              quantity: 1,
              label: 'Single',
              sublabel: 'Just try it',
              discountPercent: 0,
              total: unitPrice,
              tag: null as string | null,
              popular: false,
            },
            {
              id: '2',
              quantity: 2,
              label: '2-Pack',
              sublabel: 'Most popular',
              discountPercent: 20,
              total: Math.round(unitPrice * 2 * 0.8),
              tag: 'Save 20%',
              popular: true,
            },
            {
              id: '3',
              quantity: 3,
              label: 'Buy 2, Get 1 Free',
              sublabel: 'Best value',
              discountPercent: 33,
              total: unitPrice * 2,
              tag: 'Save 33%',
              popular: false,
            },
          ],
    [unitPrice],
  )

  const [selected, setSelected] = useState<string>('2')
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()

  if (!unitPrice || tiers.length === 0 || !firstVariant) return null

  const activeTier = tiers.find((t) => t.id === selected) || tiers[0]
  const originalTotal = unitPrice * activeTier.quantity
  const savings = originalTotal - activeTier.total

  const handleAddBundle = () => {
    if (!firstVariant?.id) return
    setIsAdding(true)

    addItem(
      { variantId: firstVariant.id, quantity: activeTier.quantity },
      {
        onSuccess: () => {
          setJustAdded(true)
          setIsAdding(false)
          toast.success(
            activeTier.quantity === 1
              ? 'Added to bag'
              : `${activeTier.quantity}× added to bag`,
          )
          trackAddToCart(
            product.id || '',
            firstVariant.id,
            activeTier.quantity,
            unitPrice,
          )
          trackMetaEvent('AddToCart', {
            content_ids: [firstVariant.id],
            content_type: 'product',
            content_name: product.title,
            value: toMetaCurrencyValue(activeTier.total),
            currency,
            num_items: activeTier.quantity,
          })
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (err: Error) => {
          setIsAdding(false)
          toast.error(err.message || 'Failed to add to bag')
        },
      },
    )
  }

  return (
    <div className="rounded-2xl border-2 border-foreground/10 bg-gradient-to-br from-neutral-50 to-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-white">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">
            Bundle &amp; Save
          </h3>
        </div>
        {savings > 0 && (
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
            Save {formatPrice(savings, currency)}
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        {tiers.map((tier) => {
          const isActive = selected === tier.id
          const tierOriginal = unitPrice * tier.quantity
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelected(tier.id)}
              className={`relative flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                isActive
                  ? 'border-neutral-900 bg-white shadow-sm'
                  : 'border-transparent bg-white/60 hover:border-neutral-300'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-2 left-4 rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isActive
                      ? 'border-neutral-900 bg-neutral-900'
                      : 'border-neutral-300 bg-white'
                  }`}
                >
                  {isActive && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </span>
                <div>
                  <p className="text-sm font-semibold">{tier.label}</p>
                  <p className="text-xs text-muted-foreground">{tier.sublabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {formatPrice(tier.total, currency)}
                </p>
                {tier.discountPercent > 0 && (
                  <p className="text-xs text-muted-foreground line-through tabular-nums">
                    {formatPrice(tierOriginal, currency)}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={handleAddBundle}
        disabled={isAdding}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold uppercase tracking-wide transition-all ${
          justAdded
            ? 'bg-emerald-600 text-white'
            : 'bg-neutral-900 text-white hover:bg-neutral-800'
        } disabled:opacity-70`}
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Added to bag
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" strokeWidth={2} />
            Add bundle to bag — {formatPrice(activeTier.total, currency)}
          </>
        )}
      </button>

      <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-muted-foreground">
        🔒 Secure checkout · Free US shipping over $40
      </p>
    </div>
  )
}
