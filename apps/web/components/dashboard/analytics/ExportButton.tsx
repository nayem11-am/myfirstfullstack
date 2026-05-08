"use client";

import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { Can } from "@/components/auth/Can";

export function ExportButton() {
  const { exportData, isLoading, data } = useAnalyticsStore();

  return (
    <Can roles="admin">
      <Button 
        variant="outline" 
        className="rounded-xl border-slate-200"
        onClick={() => exportData()}
        disabled={isLoading || !data}
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </Button>
    </Can>
  );
}
