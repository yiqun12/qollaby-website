import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { deleteAccountPageSections } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Account & Data Deletion | Qollaby",
  description:
    "How to delete your Qollaby account and what happens to your data. Required by Google Play.",
  alternates: {
    canonical: "https://www.qollaby.com/delete-account",
  },
};

export default function DeleteAccountPage() {
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
                Account
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-5xl">
                Account &amp; Data Deletion
              </h1>
              <p className="mt-6 text-lg leading-8 text-[#5f6368]">
                App: Qollaby (developer: Marcus). This page explains how to
                permanently delete your Qollaby account and what happens to the
                data associated with it.
              </p>
              <p className="mt-3 text-sm text-[#5f6368]">
                Last updated: April 16, 2026
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
                  {deleteAccountPageSections.map((section) => (
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
                id="in-app"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  How to delete your account
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  The fastest way to delete your account is directly inside the
                  Qollaby mobile app. Follow these steps:
                </p>
                <ol className="mt-6 list-decimal space-y-3 pl-6 text-base leading-8 text-[#5f6368]">
                  <li>Open the Qollaby app on your phone.</li>
                  <li>
                    Go to <strong>Profile</strong> and tap <strong>Edit profile</strong>.
                  </li>
                  <li>
                    Scroll to the bottom and tap <strong>Delete account</strong>.
                  </li>
                  <li>
                    Read the confirmation screen, then confirm to permanently
                    delete your account.
                  </li>
                </ol>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Once confirmed, the deletion cannot be undone. Your profile is
                  logged out on all devices immediately.
                </p>
              </section>

              <section
                id="by-email"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  Alternative: request by email
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  If you cannot access the app (for example you lost your
                  device), send us an email and we will process the deletion on
                  your behalf.
                </p>
                <ol className="mt-6 list-decimal space-y-3 pl-6 text-base leading-8 text-[#5f6368]">
                  <li>
                    Send an email to{" "}
                    <a
                      href="mailto:support@qollaby.com"
                      className="font-semibold text-[#915400] hover:text-[#6a3d00]"
                    >
                      support@qollaby.com
                    </a>{" "}
                    from the address linked to your account.
                  </li>
                  <li>
                    Use the subject line: <strong>Account deletion request</strong>.
                  </li>
                  <li>
                    We will action the request within <strong>30 days</strong>{" "}
                    and reply to confirm completion.
                  </li>
                </ol>
              </section>

              <section
                id="data-deleted"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  Data we delete
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  When your account is deleted, the following personal data is
                  permanently removed from our production systems:
                </p>
                <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-8 text-[#5f6368]">
                  <li>Profile information (name, email, avatar, bio, business profile).</li>
                  <li>Your posts, exchange listings, and event entries.</li>
                  <li>Messages you sent, and your participation in conversations.</li>
                  <li>Media uploads (images and videos).</li>
                  <li>Likes, comments, and follows tied to your account.</li>
                  <li>
                    Subscription records linked to your profile. Completed
                    billing transactions remain in our payment provider&apos;s
                    records where the law requires a reliable audit trail.
                  </li>
                </ul>
              </section>

              <section
                id="data-retained"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  Data we retain
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  A limited amount of data is kept after deletion to meet legal
                  requirements and protect the platform:
                </p>
                <ul className="mt-6 list-disc space-y-3 pl-6 text-base leading-8 text-[#5f6368]">
                  <li>
                    <strong>Legal and tax records (7 years):</strong> invoices,
                    payouts, and other financial records required by accounting
                    and tax law.
                  </li>
                  <li>
                    <strong>Fraud and abuse prevention logs (2 years):</strong>{" "}
                    signals we use to detect repeat abuse, spam, or policy
                    violations.
                  </li>
                  <li>
                    <strong>Anonymised analytics (retained indefinitely):</strong>{" "}
                    aggregated usage data that cannot be linked back to you as
                    an individual.
                  </li>
                </ul>
              </section>

              <section
                id="contact"
                className="rounded-[2rem] border border-black/6 bg-white p-7 shadow-sm sm:p-9"
              >
                <h2 className="text-2xl font-semibold text-[#1d1d1f]">
                  Contact us
                </h2>
                <p className="mt-4 text-base leading-8 text-[#5f6368]">
                  Questions about account deletion or your data? Email{" "}
                  <a
                    href="mailto:support@qollaby.com"
                    className="font-semibold text-[#915400] hover:text-[#6a3d00]"
                  >
                    support@qollaby.com
                  </a>
                  . For broader privacy questions, see our{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-[#915400] hover:text-[#6a3d00]"
                  >
                    Privacy Policy
                  </Link>
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
