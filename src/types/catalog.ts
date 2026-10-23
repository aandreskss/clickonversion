export type PriceType = 'ONE_TIME' | 'RECURRING' | 'STARTING_AT' | 'CUSTOM_QUOTE'
export type BillingPeriod = 'monthly' | 'quarterly' | 'annual' | 'one_time'
export type ServiceCategory = 'seo' | 'paid-media' | 'automation' | 'support'

export interface ServicePrice {
  id: string
  serviceId: string
  nameEn: string
  nameEs: string
  priceType: PriceType
  basePriceUsd: number | null
  billingPeriod: BillingPeriod | null
  stripePriceId: string | null
  paypalPlanId: string | null
  isActive: boolean
  sortOrder: number
}

export interface ServiceCatalogItem {
  id: string
  slug: string
  category: ServiceCategory
  nameEn: string
  nameEs: string
  descriptionEn: string
  descriptionEs: string
  isPublished: boolean
  sortOrder: number
  deliverables: string[]
  requirements: string[]
  onboardingFields: OnboardingField[]
  prices: ServicePrice[]
}

export interface OnboardingField {
  key: string
  labelEn: string
  labelEs: string
  type: 'text' | 'textarea' | 'url' | 'select' | 'checkbox'
  required: boolean
  options?: string[]
}

/** Cart item — lives in localStorage */
export interface CartItem {
  /** Unique cart line key (serviceId + priceId) */
  key: string
  serviceId: string
  priceId: string
  quantity: number
  /** Snapshot for display — server re-validates at checkout */
  displayName: string
  displayPrice: number
  priceType: PriceType
  billingPeriod: BillingPeriod | null
  currency: 'USD'
}

export type CartState = CartItem[]

export interface CartSplit {
  oneTimeItems: CartItem[]
  recurringItems: CartItem[]
  quoteItems: CartItem[]
}
