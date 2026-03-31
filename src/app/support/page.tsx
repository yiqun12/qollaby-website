import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, Shield } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { supportFaqs } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Support | Qollaby",
  description:
    "Get help with Qollaby — FAQs, contact information, and support resources.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-black/6 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
            <Link
              href="/"
              className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-[#915400] hover:text-[#6a3d00]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
            <div className="mt-8 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#915400]">
                Help &amp; Support
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-5xl">
                How can we help?
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#5f6368]">
                Find answers to common questions below, or reach out to our team
                directly. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fcfbf7]">
          <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
            {/* Contact cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef3e2]">
                  <Mail className="h-6 w-6 text-[#915400]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#1d1d1f]">
                  Email support
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5f6368]">
                  Send us an email and we&apos;ll get back to you as soon as
                  possible.
                </p>
                <a
                  href="mailto:qollaby@gmail.com"
                  className="mt-4 inline-block text-sm font-semibold text-[#915400] hover:text-[#6a3d00]"
                >
                  qollaby@gmail.com
                </a>
              </div>

              <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef3e2]">
                  <MessageCircle className="h-6 w-6 text-[#915400]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#1d1d1f]">
                  Report an issue
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5f6368]">
                  Found a bug or something not working? Let us know what
                  happened and we&apos;ll investigate.
                </p>
                <a
                  href="mailto:qollaby@gmail.com?subject=Bug%20Report"
                  className="mt-4 inline-block text-sm font-semibold text-[#915400] hover:text-[#6a3d00]"
                >
                  Report a bug
                </a>
              </div>

              <div className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef3e2]">
                  <Shield className="h-6 w-6 text-[#915400]" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#1d1d1f]">
                  Account &amp; privacy
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5f6368]">
                  Questions about your data, account deletion, or privacy
                  rights? We&apos;re here to help.
                </p>
                <a
                  href="mailto:qollaby@gmail.com?subject=Account%20%26%20Privacy%20Request"
                  className="mt-4 inline-block text-sm font-semibold text-[#915400] hover:text-[#6a3d00]"
                >
                  Contact us
                </a>
              </div>
            </div>

            {/* FAQ section */}
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                Frequently asked questions
              </h2>
              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {supportFaqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-[#1d1d1f]">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#5f6368]">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Still need help? */}
            <div className="mt-16 rounded-[2rem] border border-black/6 bg-white p-9 text-center shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                Still need help?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-8 text-[#5f6368]">
                If you couldn&apos;t find the answer you were looking for, don&apos;t
                hesitate to reach out. Our team is happy to assist.
              </p>
              <a
                href="mailto:qollaby@gmail.com"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f5a623] px-8 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4" />
                Email us at qollaby@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
