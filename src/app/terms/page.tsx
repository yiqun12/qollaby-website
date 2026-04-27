import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Terms of Use | Qollaby",
  description:
    "Qollaby Terms of Use (EULA) — the agreement governing your use of the Qollaby app, including subscription, content, and moderation rules.",
};

const sections = [
  { id: "acceptance", label: "1. Acceptance of these terms" },
  { id: "account", label: "2. Your account" },
  { id: "subscriptions", label: "3. Subscriptions and billing" },
  { id: "content", label: "4. User-generated content" },
  { id: "objectionable", label: "5. Zero tolerance for abuse" },
  { id: "block-report", label: "6. Blocking and reporting" },
  { id: "termination", label: "7. Termination" },
  { id: "disclaimers", label: "8. Disclaimers" },
  { id: "contact", label: "9. Contact" },
];

export default function TermsPage() {
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
                Legal
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-5xl">
                Terms of Use (EULA)
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#5f6368]">
                Effective date: April 27, 2026. By downloading, installing, or
                using Qollaby, you agree to these Terms of Use, together with
                our{" "}
                <Link href="/privacy" className="text-[#915400] underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/rules" className="text-[#915400] underline">
                  Rules of Engagement
                </Link>
                . If you do not agree, do not use the app.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fcfbf7]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-12 lg:py-16">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#915400]">
                  On this page
                </p>
                <nav className="mt-5 flex flex-col gap-3">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="cursor-pointer text-sm font-medium text-[#40464d] transition-colors hover:text-[#111111]"
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="space-y-10">
              <section
                id="acceptance"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  1. Acceptance of these terms
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  These Terms of Use form a binding agreement between you and
                  Qollaby. By creating an account, completing a purchase, or
                  otherwise using the app, you confirm that you are at least 13
                  years old, have read these Terms, and accept them. We may
                  update these Terms from time to time; continued use after an
                  update means you accept the updated version.
                </p>
              </section>

              <section
                id="account"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  2. Your account
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  You are responsible for the activity on your account. Provide
                  accurate information, keep your credentials secure, and notify
                  us if you suspect unauthorized access. You may not use Qollaby
                  to impersonate another person or misrepresent your identity.
                </p>
              </section>

              <section
                id="subscriptions"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  3. Subscriptions and billing
                </h2>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-8 text-[#5f6368]">
                  <li>
                    Qollaby offers auto-renewable subscriptions. Pricing,
                    benefits, and renewal period are shown on the in-app pricing
                    page before purchase.
                  </li>
                  <li>
                    Payment is charged to your Apple ID at confirmation of
                    purchase. The subscription auto-renews at the same price for
                    the same period unless you cancel at least 24 hours before
                    the end of the current period.
                  </li>
                  <li>
                    You can manage or cancel auto-renewal at any time in your
                    Apple ID account settings. Cancellation takes effect at the
                    end of the current paid period; refunds are handled by
                    Apple per their standard policy.
                  </li>
                  <li>
                    On Android and the web, subscriptions are managed through
                    your account on qollaby.com using the cancel option in
                    Settings.
                  </li>
                </ul>
              </section>

              <section
                id="content"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  4. User-generated content
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  You retain ownership of the posts, listings, messages, and
                  media that you submit through Qollaby (your "Content"). By
                  submitting Content you grant Qollaby a worldwide, royalty-free
                  license to host, display, distribute, and moderate it inside
                  the service. You are solely responsible for your Content and
                  for ensuring you have the rights to share it.
                </p>
              </section>

              <section
                id="objectionable"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  5. Zero tolerance for objectionable content or abusive users
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Qollaby has zero tolerance for objectionable content and
                  abusive behavior. You agree not to post, upload, send, or
                  share Content that:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-8 text-[#5f6368]">
                  <li>
                    is sexually explicit, pornographic, or sexualizes minors in
                    any form;
                  </li>
                  <li>
                    promotes hate, harassment, threats, bullying, doxxing, or
                    targeted abuse against any person or group;
                  </li>
                  <li>
                    contains violence, gore, self-harm content, or incites
                    violence;
                  </li>
                  <li>
                    advertises illegal goods or services, fraud, scams, or other
                    unlawful activity;
                  </li>
                  <li>
                    infringes another person's intellectual-property, privacy,
                    or contract rights;
                  </li>
                  <li>
                    contains malware, spam, or attempts to compromise the
                    service.
                  </li>
                </ul>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Violations are removed and may result in account suspension or
                  termination, as outlined below.
                </p>
              </section>

              <section
                id="block-report"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  6. Blocking and reporting
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Every Qollaby user can block another user directly from a post
                  or profile. Blocking is bidirectional and immediate: you and
                  the blocked user no longer see each other's posts, listings,
                  or messages, and the blocked user's content is removed from
                  your feed instantly.
                </p>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Every block also creates a moderation report that goes
                  straight to our admin team for human review. You can also use
                  the in-app Caution / Report flow on any post to flag content
                  without blocking. We aim to review actionable reports within
                  24 hours and remove violating content from the platform.
                </p>
              </section>

              <section
                id="termination"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  7. Termination
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Qollaby may suspend or terminate your account at any time if
                  you violate these Terms, the Rules of Engagement, or
                  applicable law. You may close your account at any time from
                  in-app Settings. Termination does not entitle you to a refund
                  of subscription fees already paid for the current period.
                </p>
              </section>

              <section
                id="disclaimers"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  8. Disclaimers and limitation of liability
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  The Qollaby service is provided on an "as is" and "as
                  available" basis, without warranties of any kind. To the
                  maximum extent permitted by law, Qollaby is not liable for
                  indirect, incidental, special, consequential, or punitive
                  damages, or for any loss of profits, data, goodwill, or other
                  intangible losses resulting from your use of the service.
                </p>
              </section>

              <section
                id="contact"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  9. Contact
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Questions about these Terms or to report a violation? Reach
                  out at{" "}
                  <a
                    href="mailto:support@qollaby.com"
                    className="text-[#915400] underline"
                  >
                    support@qollaby.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
