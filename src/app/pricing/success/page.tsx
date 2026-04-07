"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const APP_DEEP_LINK = "qollaby://";
const REDIRECT_DELAY = 5;

export default function SubscriptionSuccessPage() {
  const [countdown, setCountdown] = useState(REDIRECT_DELAY);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = APP_DEEP_LINK;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-20">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#1d1d1f]">
            Payment Successful!
          </h1>
          <p className="mt-3 text-sm text-[#6c727a]">
            Thank you for subscribing. Your plan is now active.
            {countdown > 0 && (
              <> Redirecting to the app in {countdown}s...</>
            )}
          </p>
          <a
            href={APP_DEEP_LINK}
            className="mt-6 inline-block rounded-xl bg-[#1d1d1f] px-8 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Open Qollaby App
          </a>
          <Link
            href="/pricing"
            className="mt-4 block text-sm text-[#6c727a] underline underline-offset-2 hover:text-[#1d1d1f]"
          >
            Stay on website
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
