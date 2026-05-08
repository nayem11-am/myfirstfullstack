import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("🔐 AUTH LAYOUT RENDERING");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  );
}
