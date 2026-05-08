"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
} from "@/components/ui/Dialog";
import { Sidebar } from "./Sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MobileSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="fixed inset-y-0 left-0 w-[280px] h-full p-0 border-none rounded-none bg-[#0b0e14] z-[150] sm:max-w-none">
        <div className="flex flex-col h-full relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-[-50px] text-white hover:bg-white/10"
          >
            <X size={24} />
          </Button>
          
          <div className="flex-1 overflow-y-auto">
            <Sidebar isMobile onSelect={() => setIsOpen(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
