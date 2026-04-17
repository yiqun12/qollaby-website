import { stripe } from "@/lib/stripe";
import { Client as ServerClient, Databases as ServerDatabases } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

const serverDatabases = (() => {
  const endpoint = process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID ?? process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!endpoint || !projectId || !apiKey) return null;
  const client = new ServerClient()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
  return new ServerDatabases(client);
})();

const APPWRITE_DB =
  process.env.APPWRITE_DATABASE_ID ?? process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const PLANS_COLLECTION = "plans";

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, planId, previousStripeSubscriptionId } =
      await req.json();

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!serverDatabases || !APPWRITE_DB) {
      console.error(
        "[Checkout] Missing Appwrite server credentials (APPWRITE_ENDPOINT / APPWRITE_PROJECT_ID / APPWRITE_API_KEY / APPWRITE_DATABASE_ID)",
      );
      return NextResponse.json(
        { error: "Server not configured for checkout" },
        { status: 500 },
      );
    }

    let priceId: string;
    try {
      const plan = await serverDatabases.getDocument(
        APPWRITE_DB,
        PLANS_COLLECTION,
        planId,
      );
      const resolved = (plan as { stripePriceIdMonthly?: string })
        .stripePriceIdMonthly;
      if (!resolved) {
        return NextResponse.json(
          { error: "Selected plan is not configured for Stripe checkout" },
          { status: 400 },
        );
      }
      priceId = resolved;
    } catch (err) {
      console.error("[Checkout] Failed to load plan for priceId resolution:", err);
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 },
      );
    }

    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { appwriteUserId: userId },
      });
      customerId = customer.id;
    }

    const metadata: Record<string, string> = { userId, planId };
    if (previousStripeSubscriptionId) {
      metadata.previousStripeSubscriptionId = previousStripeSubscriptionId;
    }

    // Upgrade: one-time coupon = credit for unused days on old plan.
    // Stripe forbids amount_off coupons together with billing_cycle_anchor on Checkout
    // ("create_prorations"), so we never set both — coupon only.
    let discounts: Stripe.Checkout.SessionCreateParams["discounts"] = undefined;
    let billingCycleAnchor: number | undefined;

    if (previousStripeSubscriptionId) {
      try {
        const oldSub = await stripe.subscriptions.retrieve(
          previousStripeSubscriptionId,
          { expand: ["items.data.price"] },
        );
        const item = oldSub.items.data[0];
        const periodStart = item?.current_period_start ?? 0;
        const periodEnd = item?.current_period_end ?? 0;
        const now = Math.floor(Date.now() / 1000);

        const totalSeconds = periodEnd - periodStart;
        const remainingSeconds = periodEnd - now;

        if (remainingSeconds > 0 && totalSeconds > 0) {
          const oldPriceCents = item?.price?.unit_amount ?? 0;
          const credit = Math.round(
            (remainingSeconds / totalSeconds) * oldPriceCents,
          );

          if (credit > 0) {
            const coupon = await stripe.coupons.create({
              amount_off: credit,
              currency: oldSub.currency || "usd",
              duration: "once",
              name: "Proration credit from previous plan",
            });
            discounts = [{ coupon: coupon.id }];
          } else {
            billingCycleAnchor = periodEnd;
          }

          console.log(
            `[Checkout] upgrade: credit=${credit}c, anchor=${billingCycleAnchor ? new Date(periodEnd * 1000).toISOString() : "none"}, ` +
              `remaining≈${Math.round(remainingSeconds / 86400)}d`,
          );
        }
      } catch (err) {
        console.error("[Checkout] Failed to calculate proration:", err);
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.nextUrl.origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/pricing`,
      metadata,
      subscription_data: {
        metadata,
        ...(billingCycleAnchor
          ? { billing_cycle_anchor: billingCycleAnchor }
          : {}),
      },
      ...(discounts ? { discounts } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
