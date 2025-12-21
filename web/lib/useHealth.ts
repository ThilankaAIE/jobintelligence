"use client";

import { useEffect, useState } from "react";
import { health } from "@/lib/api";

export function useHealth() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await health();
        if (!cancelled) setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
