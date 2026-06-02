import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-mist-100/40">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/"><Logo /></Link>
            <p className="mt-4 max-w-md text-sm text-ink-700/70 leading-relaxed">
              <span className="font-medium text-ink-900">Valo Thakun</span> (ভালো থাকুন · stay well) —
              compassionate, evidence-based care across cardiology, pediatrics, dermatology
              and more — in Dhaka and online.
            </p>
            <div className="mt-6 max-w-sm">
              <NewsletterForm />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Practice</h3>
            <ul className="space-y-2 text-sm text-ink-700/75">
              <li><Link href="/about" className="hover:text-iris-700">About</Link></li>
              <li><Link href="/services" className="hover:text-iris-700">Services</Link></li>
              <li><Link href="/doctors" className="hover:text-iris-700">Doctors</Link></li>
              <li><Link href="/blog" className="hover:text-iris-700">Journal</Link></li>
              <li><Link href="/contact" className="hover:text-iris-700">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink-900">Visit us</h3>
            <ul className="space-y-3 text-sm text-ink-700/75">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 shrink-0 text-iris-600" />
                <span>House 42, Road 11, Banani, Dhaka 1213</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-iris-600" />
                <a href="tel:+8801711000001" className="hover:text-iris-700">+880 1711-000001</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-iris-600" />
                <a href="mailto:hello@valothakun.health" className="hover:text-iris-700">hello@valothakun.health</a>
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-3 text-ink-700/60">
              <a href="#" aria-label="Facebook" className="hover:text-iris-700"><Facebook className="size-4" /></a>
              <a href="#" aria-label="Instagram" className="hover:text-iris-700"><Instagram className="size-4" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-iris-700"><Youtube className="size-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-100 pt-6 text-xs text-ink-700/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Valo Thakun Practice. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/privacy" className="hover:text-iris-700">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-iris-700">Terms</Link>
            <Link href="/legal/disclaimer" className="hover:text-iris-700">Medical disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
