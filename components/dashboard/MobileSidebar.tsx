"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MobileSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[280px] bg-[#08090b] z-50 shadow-2xl flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <Sidebar isMobile onSelect={() => setIsOpen(false)} />
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 z-50"
            >
              <X size={20} />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
