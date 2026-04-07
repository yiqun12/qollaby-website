"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Collections, databases, FUNCTION_ID, functions, Query } from "@/lib/appwrite";
import { ExecutionMethod } from "appwrite";
import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    Check,
    Crown,
    Loader2,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Plan {
  $id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  stripePriceIdMonthly?: string;
  features: string[];
  idealFor: string[];
  status?: string;
}

interface Subscription {
  $id: string;
  userId: string;
  planId: string | { $id: string; name?: string; slug?: string; priceMonthly?: number };
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: string;
  cancelAtPeriodEnd?: boolean;
  cancelAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  nextPlanId?: string | { $id: string; name?: string };
}

const ACCENT: Record<string, string> = {
  free: "#64748b",
  host: "#0891b2",
  essential: "#059669",
  professional: "#7c3aed",
  dominion: "#d97706",
};

const PLAN_GRADIENTS: Record<string, [string, string]> = {
  free: ["#64748b", "#475569"],
  host: ["#0891b2", "#0e7490"],
  essential: ["#059669", "#047857"],
  professional: ["#7c3aed", "#6d28d9"],
  dominion: ["#d97706", "#b45309"],
};

function formatDate(dateValue: string | number | undefined): string {
  if (!dateValue) return "N/A";
  const date = typeof dateValue === "string" ? new Date(dateValue) : new Date(dateValue * 1000);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

type ModalState = {
  type: "confirm" | "success" | "error";
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
} | null;

export default function PricingPage() {
  const { webUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const fetchPlans = useCallback(async () => {
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        Collections.PLANS,
        [Query.equal("status", "active"), Query.orderAsc("priceMonthly")]
      );
      setPlans(res.documents as unknown as Plan[]);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    if (!webUser) { setCurrentSub(null); return; }
    try {
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        Collections.SUBSCRIPTIONS,
        [
          Query.equal("userId", webUser.user.$id),
          Query.equal("status", "active"),
          Query.limit(1),
        ]
      );
      setCurrentSub(
        res.documents.length > 0 ? (res.documents[0] as unknown as Subscription) : null
      );
    } catch { setCurrentSub(null); }
  }, [webUser]);

  useEffect(() => {
    void fetchPlans();
  }, [fetchPlans]);
  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  const getCurrentPlanId = (): string | null => {
    if (!currentSub) return null;
    return typeof currentSub.planId === "string" ? currentSub.planId : currentSub.planId.$id;
  };

  const getCurrentPrice = (): number => {
    if (!currentSub) return 0;
    if (typeof currentSub.planId === "object" && currentSub.planId.priceMonthly != null) {
      return currentSub.planId.priceMonthly;
    }
    const planDoc = plans.find((p) => p.$id === getCurrentPlanId());
    return planDoc?.priceMonthly ?? 0;
  };

  const getNextPlanName = (): string | null => {
    if (!currentSub?.nextPlanId) return null;
    if (typeof currentSub.nextPlanId === "object") return currentSub.nextPlanId.name ?? null;
    const p = plans.find((pl) => pl.$id === currentSub.nextPlanId);
    return p?.name ?? null;
  };

  const freePlan = plans.find((p) => p.slug === "free");
  const currentPlan: Plan | null | undefined = currentSub?.planId
    ? typeof currentSub.planId === "object"
      ? (currentSub.planId as unknown as Plan)
      : plans.find((p) => p.$id === currentSub.planId)
    : webUser ? freePlan : null;
  const nextPlan = currentSub?.nextPlanId
    ? typeof currentSub.nextPlanId === "object"
      ? plans.find((p) => p.$id === (currentSub.nextPlanId as { $id: string }).$id)
      : plans.find((p) => p.$id === currentSub.nextPlanId)
    : null;

  // ——— Subscribe / Upgrade / Downgrade ———
  const handleSubscribe = (plan: Plan) => {
    if (!webUser) { router.push("/login?redirect=/pricing"); return; }
    if (!plan.stripePriceIdMonthly || plan.priceMonthly === 0) {
      setModal({
        type: "confirm",
        title: "Downgrade to Free Plan",
        message: "Are you sure you want to downgrade to the Free plan? Your current subscription will be cancelled.",
        confirmLabel: "Yes, Downgrade",
        destructive: true,
        onConfirm: executeCancel,
      });
      return;
    }

    const currentP = getCurrentPrice();
    const isUpgrade = plan.priceMonthly > currentP;
    const isDowngrade = currentSub && plan.priceMonthly < currentP && plan.priceMonthly > 0;

    if (isDowngrade) {
      // Downgrade: no payment needed, call /subscribe to schedule
      setModal({
        type: "confirm",
        title: "Confirm Downgrade",
        message: `Downgrade to ${plan.name}? The change takes effect at the end of your current billing period.`,
        confirmLabel: "Downgrade",
        destructive: true,
        onConfirm: () => processDowngrade(plan),
      });
      return;
    }

    // New subscription or upgrade: go to Stripe Checkout (pay first, then update)
    setModal({
      type: "confirm",
      title: isUpgrade ? "Confirm Upgrade" : "Confirm Subscription",
      message: isUpgrade
        ? `Upgrade to ${plan.name} for $${plan.priceMonthly.toFixed(2)}/month?`
        : `Subscribe to ${plan.name} for $${plan.priceMonthly.toFixed(2)}/month?`,
      confirmLabel: "Confirm",
      destructive: false,
      onConfirm: () => goToCheckout(plan),
    });
  };

  // Downgrade via Appwrite Function (safe — no payment involved)
  const processDowngrade = async (plan: Plan) => {
    setModal(null);
    setActionLoading(plan.$id);
    try {
      const response = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify({ userId: webUser!.user.$id, planId: plan.$id }),
        false,
        "/subscribe",
        ExecutionMethod.POST,
        { "Content-Type": "application/json" }
      );
      const result = JSON.parse(response.responseBody);
      if (result.error) throw new Error(result.error);

      const effectiveDate = result.effectiveDate
        ? new Date(result.effectiveDate).toLocaleDateString()
        : "the end of your current billing period";
      setModal({
        type: "success",
        title: "Plan Change Scheduled",
        message: `Your current plan will remain active. The ${plan.name} plan will take effect on ${effectiveDate}.`,
      });
      await fetchSubscription();
    } catch (err) {
      setModal({
        type: "error",
        title: "Error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally { setActionLoading(null); }
  };

  // New subscription / upgrade via Stripe Checkout (payment happens BEFORE subscription changes)
  const goToCheckout = async (plan: Plan) => {
    setModal(null);
    setActionLoading(plan.$id);
    try {
      const body: Record<string, string> = {
        priceId: plan.stripePriceIdMonthly!,
        userId: webUser!.user.$id,
        userEmail: webUser!.user.email,
        planId: plan.$id,
      };
      if (currentSub?.stripeSubscriptionId) {
        body.previousStripeSubscriptionId = currentSub.stripeSubscriptionId;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to start checkout");
      }
    } catch (err) {
      setModal({
        type: "error",
        title: "Error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
      setActionLoading(null);
    }
  };

  // ——— Cancel subscription via Appwrite Function ———
  const handleCancel = () => {
    if (!currentSub) return;
    setModal({
      type: "confirm",
      title: "Cancel Subscription",
      message: "Are you sure? You'll keep access until the end of your billing period, then revert to Free.",
      confirmLabel: "Yes, Cancel",
      destructive: true,
      onConfirm: executeCancel,
    });
  };

  const executeCancel = async () => {
    if (!currentSub) return;
    setModal(null);
    setActionLoading("cancel");
    try {
      const response = await functions.createExecution(
        FUNCTION_ID,
        JSON.stringify({ subscriptionId: currentSub.$id }),
        false,
        "/cancel-subscription",
        ExecutionMethod.POST,
        { "Content-Type": "application/json" }
      );
      const result = JSON.parse(response.responseBody);
      if (result.error) throw new Error(result.error);

      const rawDate = result.cancelAtDate || result.cancelAt;
      const cancelDate = rawDate
        ? new Date(rawDate).toLocaleDateString()
        : "end of billing period";
      setModal({
        type: "success",
        title: "Subscription Cancelled",
        message: `Your plan stays active until ${cancelDate}. After that, you'll revert to Free.`,
      });
      await fetchSubscription();
    } catch (err) {
      setModal({
        type: "error",
        title: "Error",
        message: err instanceof Error ? err.message : "Failed to cancel.",
      });
    } finally { setActionLoading(null); }
  };

  // ——— Determine button state for each plan ———
  const currentPlanId = getCurrentPlanId();
  const currentPrice = getCurrentPrice();

  const getButtonProps = (plan: Plan) => {
    const isFree = plan.priceMonthly === 0;
    const isCurrentPlan = currentPlanId === plan.$id || (isFree && !currentSub && !!webUser);
    const isUpgrade = currentSub && plan.priceMonthly > currentPrice;
    const isDowngrade = currentSub && plan.priceMonthly < currentPrice && plan.priceMonthly > 0;
    const isDowngradeToFree = currentSub && isFree;

    if (isCurrentPlan) return { label: "Current Plan", disabled: true, action: () => {} };
    if (!webUser) return { label: "Sign in to Subscribe", disabled: false, action: () => router.push("/login?redirect=/pricing") };
    if (!currentSub && !isFree) return { label: "Subscribe", disabled: false, action: () => handleSubscribe(plan) };
    if (isUpgrade) return { label: "Upgrade", disabled: false, action: () => handleSubscribe(plan), icon: <ArrowUp className="h-4 w-4" /> };
    if (isDowngrade) return { label: "Downgrade", disabled: false, action: () => handleSubscribe(plan), icon: <ArrowDown className="h-4 w-4" /> };
    if (isDowngradeToFree) return { label: "Cancel & Downgrade", disabled: false, action: () => handleSubscribe(plan) };
    return { label: "Subscribe", disabled: isFree, action: () => {} };
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Choose Your Plan
            </h1>
            <p className="mt-3 text-base text-[#6c727a]">
              Unlock more features, reach, and exposure for your community presence.
            </p>
            {!authLoading && !webUser && (
              <p className="mt-2 text-sm text-[#f5a623]">
                Please{" "}
                <a href="/login?redirect=/pricing" className="underline font-semibold">sign in</a>{" "}
                to manage your subscription.
              </p>
            )}
          </div>

          {/* VIP Membership Card — mirrors app's LinearGradient card */}
          {currentPlan && (
            <div
              className="mb-8 overflow-hidden rounded-2xl p-5 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${
                  PLAN_GRADIENTS[currentPlan.slug]?.[0] ?? PLAN_GRADIENTS.free[0]
                }, ${
                  PLAN_GRADIENTS[currentPlan.slug]?.[1] ?? PLAN_GRADIENTS.free[1]
                })`,
              }}
            >
              {/* Header Row */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Crown className="h-4 w-4" style={{ color: currentSub ? "#fbbf24" : "#94a3b8" }} />
                  <span className="text-xs font-semibold tracking-wide text-white/90">
                    {currentSub ? "VIP MEMBER" : "MEMBER"}
                  </span>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{
                    backgroundColor: !currentSub
                      ? "rgba(255,255,255,0.2)"
                      : currentSub.status === "active"
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(239,68,68,0.3)",
                  }}
                >
                  {!currentSub ? "FREE" : currentSub.status === "active" ? "ACTIVE" : "CANCELLED"}
                </span>
              </div>

              {/* Plan Name & Price */}
              <h2 className="text-[28px] font-extrabold leading-tight text-white">
                {currentPlan.name}
              </h2>
              <p className="mb-4 text-base text-white/80">
                {currentPlan.priceMonthly === 0 || !currentPlan.priceMonthly
                  ? "Free"
                  : `$${currentPlan.priceMonthly.toFixed(2)}/month`}
              </p>

              {/* Divider + Period info — only for paid subscribers */}
              {currentSub && (
                <>
                  <div className="mb-4 h-px bg-white/20" />

                  {/* Current Period */}
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-white/70">Current Period</span>
                    <span className="font-medium text-white">
                      {formatDate(currentSub.currentPeriodStart)} – {formatDate(currentSub.currentPeriodEnd)}
                    </span>
                  </div>

                  {/* Next Billing / Cancellation */}
                  {currentSub.cancelAtPeriodEnd === true ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-300">
                        Cancels On ({nextPlan?.name || "Free Plan"})
                      </span>
                      <span className="font-semibold text-red-300">
                        {formatDate(currentSub.cancelAt || currentSub.currentPeriodEnd)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">
                        Next Billing ({nextPlan?.name || currentPlan.name})
                      </span>
                      <span className="font-medium text-white">
                        {formatDate(currentSub.currentPeriodEnd)}
                      </span>
                    </div>
                  )}

                  {/* Cancel Button */}
                  {currentSub.stripeSubscriptionId && currentSub.status === "active" && !currentSub.cancelAtPeriodEnd && (
                    <button
                      type="button"
                      disabled={actionLoading === "cancel"}
                      onClick={handleCancel}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/15 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/25 disabled:opacity-50"
                    >
                      {actionLoading === "cancel" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Cancel Subscription
                    </button>
                  )}
                </>
              )}

              {/* Upgrade prompt for free users */}
              {!currentSub && (
                <p className="mt-1 text-center text-[13px] text-white/70">
                  Upgrade to unlock premium features!
                </p>
              )}
            </div>
          )}

          {loading || authLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#f5a623]" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const accent = ACCENT[plan.slug] || "#f5a623";
                const isFree = plan.priceMonthly === 0;
                const isPopular = plan.slug === "essential";
                const isCurrentPlan = currentPlanId === plan.$id || (isFree && !currentSub && !!webUser);
                const nextPlanId = currentSub?.nextPlanId
                  ? typeof currentSub.nextPlanId === "object" ? currentSub.nextPlanId.$id : currentSub.nextPlanId
                  : null;
                const isUpcomingPlan = !!(nextPlanId && nextPlanId === plan.$id && currentSub?.cancelAtPeriodEnd);
                const isUpcomingFree = isFree && currentSub?.cancelAtPeriodEnd && !nextPlanId;
                const isUpcoming = isUpcomingPlan || isUpcomingFree;
                const btn = getButtonProps(plan);

                return (
                  <div
                    key={plan.$id}
                    className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                      isCurrentPlan
                        ? "border-[#f5a623] ring-2 ring-[#f5a623]/30"
                        : isUpcoming
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : isPopular
                            ? "border-[#059669] ring-2 ring-[#059669]/20"
                            : "border-black/8"
                    }`}
                  >
                    {isCurrentPlan && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#f5a623] px-3 py-1 text-xs font-semibold text-white">
                        Your Plan
                      </div>
                    )}
                    {!isCurrentPlan && isUpcoming && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                        Upcoming Plan
                      </div>
                    )}
                    {!isCurrentPlan && !isUpcoming && isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#059669] px-3 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </div>
                    )}

                    <div className="mb-4 flex items-center gap-2">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${accent}15` }}
                      >
                        {isFree ? (
                          <Zap className="h-5 w-5" style={{ color: accent }} />
                        ) : (
                          <Crown className="h-5 w-5" style={{ color: accent }} />
                        )}
                      </div>
                      <h2 className="text-lg font-bold text-[#1d1d1f]">{plan.name}</h2>
                    </div>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-[#1d1d1f]">
                        {isFree ? "Free" : `$${plan.priceMonthly.toFixed(2)}`}
                      </span>
                      {!isFree && <span className="text-sm text-[#6c727a]">/month</span>}
                    </div>

                    <ul className="mb-6 flex-1 space-y-3">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                          <span className="text-sm text-[#40464d]">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.idealFor?.length > 0 && (
                      <p className="mb-4 text-xs text-[#6c727a]">
                        Ideal for: {plan.idealFor.join(", ")}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={btn.disabled || actionLoading === plan.$id}
                      onClick={btn.action}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0 ${
                        isCurrentPlan
                          ? "border-2 border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623]"
                          : isFree
                            ? "border border-black/10 bg-white text-[#1d1d1f]"
                            : "text-white"
                      }`}
                      style={isCurrentPlan || isFree ? undefined : { backgroundColor: accent }}
                    >
                      {actionLoading === plan.$id && <Loader2 className="h-4 w-4 animate-spin" />}
                      {"icon" in btn && btn.icon}
                      {btn.label}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-10 text-center text-sm text-[#6c727a]">
            All plans are billed monthly. You can cancel anytime.
          </p>
        </div>
      </main>
      <Footer />

      {/* Modal overlay */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 px-6 py-8">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  modal.type === "error"
                    ? "bg-red-50"
                    : modal.type === "success"
                      ? "bg-green-50"
                      : modal.destructive
                        ? "bg-amber-50"
                        : "bg-blue-50"
                }`}
              >
                {modal.type === "error" ? (
                  <AlertTriangle className="h-7 w-7 text-red-500" />
                ) : modal.type === "success" ? (
                  <Check className="h-7 w-7 text-green-500" />
                ) : (
                  <AlertTriangle className={`h-7 w-7 ${modal.destructive ? "text-amber-500" : "text-blue-500"}`} />
                )}
              </div>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-[#1d1d1f]">{modal.title}</h3>
            <p className="mb-6 text-center text-sm leading-relaxed text-[#6c727a]">{modal.message}</p>

            {modal.type === "confirm" ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={modal.onConfirm}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white ${
                    modal.destructive ? "bg-red-500 hover:bg-red-600" : "bg-[#059669] hover:bg-[#047857]"
                  }`}
                >
                  {modal.confirmLabel || "Confirm"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModal(null)}
                className="w-full rounded-xl bg-[#1d1d1f] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#333]"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}

    </>
  );
}
