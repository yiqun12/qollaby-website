import Image from "next/image";
import Link from "next/link";
import { Apple, Play } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="download"
      className="border-t border-black/6 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr_1fr]">
          <div>
            <Link href="/" className="inline-flex cursor-pointer items-center gap-3">
              <Image
                src="/images/logo-app-icon.png"
                alt="Qollaby logo"
                width={44}
                height={44}
                className="rounded-xl"
              />
              <div>
                <p className="text-lg font-semibold text-[#1d1d1f]">Qollaby</p>
                <p className="text-sm text-[#6c727a]">Community-led platform</p>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#5f6368]">
              Built for local discovery, direct connection, events, exchange, and
              sponsor visibility inside one shared community experience.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d1d1f]">
              Navigate
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]">
              <Link href="/" className="cursor-pointer hover:text-[#1d1d1f]">Home</Link>
              <Link href="/rules" className="cursor-pointer hover:text-[#1d1d1f]">Rules of Engagement</Link>
              <Link href="/terms" className="cursor-pointer hover:text-[#1d1d1f]">Terms of Use</Link>
              <Link href="/privacy" className="cursor-pointer hover:text-[#1d1d1f]">Privacy Policy</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#1d1d1f]">
              Download
            </h3>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#download"
                className="group cursor-pointer flex items-center gap-3 rounded-2xl border border-black/10 bg-[#1d1d1f] px-5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Apple className="h-7 w-7 text-white" />
                <div>
                  <p className="text-[10px] font-medium leading-tight text-white/60">Download on the</p>
                  <p className="text-sm font-semibold leading-tight text-white">App Store</p>
                </div>
              </Link>
              <Link
                href="#download"
                className="group cursor-pointer flex items-center gap-3 rounded-2xl border border-black/10 bg-[#1d1d1f] px-5 py-3 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Play className="h-6 w-6 text-white" fill="white" />
                <div>
                  <p className="text-[10px] font-medium leading-tight text-white/60">Get it on</p>
                  <p className="text-sm font-semibold leading-tight text-white">Google Play</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-black/6 px-6 py-5 text-center text-sm text-[#6c727a] sm:px-8 lg:px-12">
        © 2026 Qollaby. Community-first discovery and connection.
      </div>
    </footer>
  );
}
