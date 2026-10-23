import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { SITE_URL } from "@/lib/env"
import { validateCartItems } from "@/lib/catalog/queries"
import { createOrder, createPaymentRecord } from "@/lib/orders/service"
import { splitValidatedItems, calculateOrderTotals } from "@/lib/orders/splits"
import { getPaymentProvider } from "@/lib/payments/factory"
import type { CheckoutLineItem, PaymentProviderName } from "@/types/payments"

const CheckoutSchema = z.object({
  clientEmail:   z.string().email(),
  clientName:    z.string().min(2).max(100),
  clientCompany: z.string().max(100).optional(),
  provider:      z.enum(["stripe", "paypal"]),
  items: z.array(z.object({
    serviceId: z.string().uuid(),
    priceId:   z.string().uuid(),
    quantity:  z.number().int().positive().max(10),
  })).min(1).max(20),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown
    const parsed = CheckoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { clientEmail, clientName, clientCompany, provider, items } = parsed.data

    // 1. Validate all items server-side (prices fetched from DB — never trust client)
    const validatedItems = await validateCartItems(items)
    const { oneTime, recurring, quotes } = splitValidatedItems(validatedItems)
    const totals = calculateOrderTotals(validatedItems)

    // 2. Validate provider supports this cart shape
    if (provider === "paypal") {
      if (oneTime.length > 0 && recurring.length > 0) {
        return NextResponse.json(
          {
            error:
              "PayPal does not support mixed one-time + subscription carts. " +
              "Please use Stripe for this combination, or remove one type of service.",
          },
          { status: 422 }
        )
      }
      if (recurring.length > 1) {
        return NextResponse.json(
          {
            error:
              "PayPal supports only one subscription per checkout. " +
              "Use Stripe, or reduce to a single recurring service.",
          },
          { status: 422 }
        )
      }
    }

    // 3. Create order record
    const order = await createOrder({ clientEmail, clientName, clientCompany, validatedItems })

    // 4. If only quotes, no payment needed
    if (!totals.hasPayableItems) {
      return NextResponse.json({
        orderId:      order.id,
        orderNumber:  order.orderNumber,
        checkoutUrl:  null,
        quoteCreated: true,
        message:      "Your quote request has been submitted. We'll send you a proposal within 24 hours.",
      })
    }

    // 5. Build provider line items (server-validated prices)
    const oneTimeLineItems: CheckoutLineItem[] = oneTime.map((i) => ({
      priceId:        i.priceId,
      stripePriceId:  i.stripePriceId,
      name:           `${i.serviceName} — ${i.priceTierName}`,
      quantity:       i.quantity,
      unitAmountUsd:  i.unitPriceUsd,
      billingPeriod:  i.billingPeriod,
    }))

    const recurringLineItems: CheckoutLineItem[] = recurring.map((i) => ({
      priceId:        i.priceId,
      stripePriceId:  i.stripePriceId,
      paypalPlanId:   i.paypalPlanId,
      name:           `${i.serviceName} — ${i.priceTierName}`,
      quantity:       i.quantity,
      unitAmountUsd:  i.unitPriceUsd,
      billingPeriod:  i.billingPeriod,
    }))

    // 6. Create provider checkout session
    const paymentProvider = getPaymentProvider(provider as PaymentProviderName)
    const checkout = await paymentProvider.createCheckout({
      orderId:        order.id,
      clientEmail,
      clientName,
      oneTimeItems:   oneTimeLineItems,
      recurringItems: recurringLineItems,
      successUrl:     `${SITE_URL}/checkout/success`,
      cancelUrl:      `${SITE_URL}/checkout/cancel`,
      metadata: {
        order_number: order.orderNumber,
      },
    })

    // 7. Create pending payment record
    const paymentType = recurring.length > 0
      ? (oneTime.length > 0 ? "subscription_initial" : "subscription_initial")
      : "one_time"

    await createPaymentRecord({
      orderId:            order.id,
      provider,
      providerCheckoutId: checkout.checkoutId,
      amountUsd:          totals.totalUsd,
      paymentType,
    })

    return NextResponse.json({
      orderId:     order.id,
      orderNumber: order.orderNumber,
      checkoutUrl: checkout.checkoutUrl,
      provider,
      quoteCount:  quotes.length,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed"
    console.error("[payments/checkout] POST:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
