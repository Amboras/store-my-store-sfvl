'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import ProductCard from '@/components/product/product-card'
import { trackMetaEvent } from '@/lib/meta-pixel'

export default function HomePage() {
  const { data: products, isLoading } = useProducts({ limit: 8 })
  const [newsletterEmail, setNewsletterEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
  }

  return (
    <>
      {/* ============================================= */}
      {/* HERO — full-bleed dark, asymmetric            */}
      {/* ============================================= */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        {/* Background gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-cyan-400/20 via-sky-500/10 to-transparent blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="container-custom relative grid items-center gap-10 py-20 lg:grid-cols-12 lg:py-32">
          {/* Left: copy */}
          <div className="space-y-7 lg:col-span-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>New — iPhone 16 Collection</span>
            </div>

            <h1 className="font-heading text-5xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Cases that
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent">
                disappear.
              </span>
              <br />
              Protection that doesn&apos;t.
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              Military-grade drop protection in cases so thin you&apos;ll forget they&apos;re
              there. Engineered in California. Obsessed over in every detail.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products/aurora-clear-case"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10"
                prefetch={true}
              >
                Shop Bestsellers
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                prefetch={true}
              >
                Browse All Cases
              </Link>
            </div>

            {/* Social proof bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                <span>MIL-STD-810H tested</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                <span>MagSafe compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                <span>Lifetime warranty</span>
              </div>
            </div>
          </div>

          {/* Right: product image */}
          <div className="relative lg:col-span-6 animate-fade-in">
            <div className="relative mx-auto aspect-square max-w-xl">
              {/* Glow ring */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-500/20 to-transparent blur-2xl" />
              <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm">
                <Image
                  src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=1600&q=80"
                  alt="Aurora Clear Case"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating spec card */}
              <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-white/10 bg-neutral-900/80 p-4 backdrop-blur-md sm:block">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Drop tested
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold">10 ft.</p>
              </div>
              <div className="absolute -top-4 -right-4 hidden rounded-2xl border border-white/10 bg-neutral-900/80 p-4 backdrop-blur-md sm:block">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Case thickness
                </p>
                <p className="mt-1 font-heading text-2xl font-semibold">1.4mm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ticker */}
        <div className="relative border-t border-white/10 bg-black/30 backdrop-blur">
          <div className="container-custom flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4 text-xs uppercase tracking-[0.2em] text-white/60">
            <span className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5" /> Free US shipping $40+
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5" /> 60-day returns
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Lifetime warranty
            </span>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FEATURES — 3-up spec block                    */}
      {/* ============================================= */}
      <section className="border-b bg-background py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Engineered Different
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
              The details other brands skip.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-neutral-50 p-8 transition-all hover:border-neutral-900 hover:shadow-xl">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white">
                <Zap className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-xl font-semibold">Drop-tested to 10ft</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                MIL-STD-810H certified. Air pockets in the corners absorb impacts that
                would crack other cases — and your screen.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border bg-neutral-50 p-8 transition-all hover:border-neutral-900 hover:shadow-xl">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white">
                <Sparkles className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-xl font-semibold">Never turns yellow</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our anti-yellow nanocoat keeps clear cases crystal clear for 2+ years.
                Backed by written guarantee.
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border bg-neutral-50 p-8 transition-all hover:border-neutral-900 hover:shadow-xl sm:col-span-2 lg:col-span-1">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white">
                <Layers className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="font-heading text-xl font-semibold">MagSafe perfected</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Industry-strongest N52 magnets. Snaps on. Charges through. Holds
                wallets, mounts, and anything else you throw at it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* BESTSELLERS — product grid                    */}
      {/* ============================================= */}
      <section className="py-20">
        <div className="container-custom">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Shop
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
                Bestsellers
              </h2>
            </div>
            <Link
              href="/products"
              className="group hidden items-center gap-2 text-sm font-semibold uppercase tracking-wide sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-sm bg-muted" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-6 lg:grid-cols-4">
              {products.slice(0, 4).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ============================================= */}
      {/* EDITORIAL SPLIT — "Built for real life"       */}
      {/* ============================================= */}
      <section className="bg-neutral-950 py-20 text-white">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1600&q=80"
              alt="Built for real life"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">
              The Philosophy
            </p>
            <h2 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              A case should protect your phone —{' '}
              <span className="text-white/60">not hide it.</span>
            </h2>
            <p className="text-base leading-relaxed text-white/70">
              We spent 3 years engineering cases that are thinner, tougher, and more
              precise than anything else on the market. Every bevel, cutout, and button
              feel is measured to the tenth of a millimeter. It&apos;s obsessive. It&apos;s
              the point.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <p className="font-heading text-3xl font-semibold">200K+</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                  Cases shipped
                </p>
              </div>
              <div>
                <p className="font-heading text-3xl font-semibold">4.9★</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                  Avg. rating
                </p>
              </div>
              <div>
                <p className="font-heading text-3xl font-semibold">60-day</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                  Try risk-free
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* NEWSLETTER                                    */}
      {/* ============================================= */}
      <section className="border-t py-20">
        <div className="container-custom max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Join the list
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
            Get 10% off your first case.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Plus early access to new drops, drop-test videos, and the occasional bad
            pun.
          </p>
          <form className="mx-auto mt-8 flex max-w-md gap-2" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="you@domain.com"
              className="flex-1 rounded-full border bg-background px-5 py-3.5 text-sm placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get 10% off
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
