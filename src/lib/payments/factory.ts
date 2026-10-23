import { StripeAdapter } from "./stripe/adapter"
import { PayPalAdapter } from "./paypal/adapter"
import type { IPaymentProvider, PaymentProviderName } from "@/types/payments"

const providers = {
  stripe: new StripeAdapter(),
  paypal: new PayPalAdapter(),
} as const satisfies Record<PaymentProviderName, IPaymentProvider>

export function getPaymentProvider(name: PaymentProviderName): IPaymentProvider {
  return providers[name]
}

export { StripeAdapter, PayPalAdapter }
