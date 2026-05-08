import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | SaaS Platform",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-[32px] p-8 max-w-2xl w-full shadow-2xl">
      <Link href="/register" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" />
        Back to Registration
      </Link>
      <h1 className="text-3xl font-black text-slate-900 mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">1. Information Collection</h3>
        <p>
          We collect information you provide directly to us, such as when you create or modify your account, or contact customer support.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">2. Data Usage</h3>
        <p>
          We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about updates and offers.
        </p>
        <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">3. Data Protection</h3>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.
        </p>
        <p className="pt-8 text-xs font-bold uppercase tracking-widest text-slate-400">Last updated: May 2026</p>
      </div>
    </div>
  );
}
