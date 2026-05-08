import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | SaaS Platform",
};

export default function TermsPage() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-8 max-w-2xl w-full shadow-2xl">
      <Link href="/register" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" />
        Back to Registration
      </Link>
      <h1 className="text-3xl font-black text-slate-900 mb-6">Terms of Service</h1>
      <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
        <p>
          Welcome to our SaaS platform. By accessing or using our service, you agree to be bound by these Terms of Service.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Acceptance of Terms</h3>
        <p>
          By creating an account, you agree to abide by all applicable laws and regulations. You are solely responsible for all acts or omissions that occur under your account.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. User Conduct</h3>
        <p>
          You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">3. Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account at any time, with or without cause, and with or without notice.
        </p>
        <p className="pt-8 text-xs font-bold uppercase tracking-widest text-slate-400">Last updated: May 2026</p>
      </div>
    </div>
  );
}
