import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // ISR: revalidate every hour
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import { Truck, RotateCcw, Shield, ChevronRight, Star, Zap, Layers } from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'
import BundleOffer from '@/components/product/bundle-offer'
import UrgencyBanner from '@/components/product/urgency-banner'
import TrustSignals from '@/components/product/trust-signals'

// Handles of products that get the full conversion-optimized experience
const HERO_PRODUCT_HANDLES = new Set(['aurora-clear-case'])

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)
  const isHeroProduct = HERO_PRODUCT_HANDLES.has(product.handle)

  // Lowest inventory among in-stock variants — used for urgency banner
  const stockCount = Object.values(variantExtensions)
    .map((v) => v.inventory_quantity)
    .filter((n): n is number => typeof n === 'number' && n > 0)
    .sort((a, b) => a - b)[0] ?? null

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: any) => img.url !== product.thumbnail),
  ]

  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Title + reviews */}
            <div>
              {product.subtitle && (
                <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {product.subtitle}
                </p>
              )}
              <h1 className="text-h2 font-heading font-semibold">{product.title}</h1>
              {isHeroProduct && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">4.9</span>
                  <span className="text-muted-foreground">· 2,847 happy customers</span>
                </div>
              )}
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={product.variants?.[0]?.calculated_price?.currency_code || 'usd'}
              value={product.variants?.[0]?.calculated_price?.calculated_amount ?? null}
            />

            {/* Urgency banner on hero product */}
            {isHeroProduct && <UrgencyBanner stockCount={stockCount} />}

            {/* Variant Selector + Price + Add to Cart */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* Bundle offer — hero product only */}
            {isHeroProduct && (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Or save with a bundle
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <BundleOffer product={product} />
              </>
            )}

            {/* Feature highlights on hero product */}
            {isHeroProduct && (
              <div className="grid grid-cols-3 gap-3 border-y py-5">
                <div className="text-center">
                  <Zap className="mx-auto mb-1.5 h-5 w-5" strokeWidth={1.75} />
                  <p className="text-xs font-semibold">10-ft drop</p>
                  <p className="text-[10px] text-muted-foreground">MIL-STD-810H</p>
                </div>
                <div className="text-center">
                  <Layers className="mx-auto mb-1.5 h-5 w-5" strokeWidth={1.75} />
                  <p className="text-xs font-semibold">MagSafe</p>
                  <p className="text-[10px] text-muted-foreground">N52 magnets</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-1.5 h-5 w-5" strokeWidth={1.75} />
                  <p className="text-xs font-semibold">Anti-yellow</p>
                  <p className="text-[10px] text-muted-foreground">2-yr guarantee</p>
                </div>
              </div>
            )}

            {/* Trust Signals */}
            {isHeroProduct ? (
              <TrustSignals />
            ) : (
              <div className="grid grid-cols-3 gap-4 py-6 border-t">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1.5" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-1.5" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground">30-Day Returns</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-1.5" strokeWidth={1.5} />
                  <p className="text-xs text-muted-foreground">Secure Checkout</p>
                </div>
              </div>
            )}

            {/* Accordion */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />

            {/* Guarantee callout — hero product only */}
            {isHeroProduct && (
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Shield className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">
                      Try it for 60 days. Love it or send it back — on us.
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-900/80">
                      We&apos;ll refund every cent, no questions asked. And if your case
                      ever fails, lifetime warranty has your back.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
