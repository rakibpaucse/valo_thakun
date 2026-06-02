"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
type ToastItem = { id: number; title: string; description?: string; kind: ToastKind };

let listeners: ((t: ToastItem) => void)[] = [];
let counter = 0;

export const toast = {
  success: (title: string, description?: string) => emit({ id: ++counter, title, description, kind: "success" }),
  error: (title: string, description?: string) => emit({ id: ++counter, title, description, kind: "error" }),
  info: (title: string, description?: string) => emit({ id: ++counter, title, description, kind: "info" }),
};

function emit(item: ToastItem) {
  listeners.forEach((l) => l(item));
}

const iconMap = {
  success: <CheckCircle2 className="size-5 text-emerald-500" />,
  error: <XCircle className="size-5 text-red-500" />,
  info: <Info className="size-5 text-blue-500" />,
};

export function Toaster() {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  React.useEffect(() => {
    const fn = (item: ToastItem) => {
      setItems((s) => [...s, item]);
      setTimeout(() => setItems((s) => s.filter((i) => i.id !== item.id)), 4000);
    };
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-4 shadow-lg",
            "animate-in slide-in-from-bottom-4 fade-in duration-300",
          )}
        >
          {iconMap[item.kind]}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{item.title}</p>
            {item.description && <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>}
          </div>
          <button
            onClick={() => setItems((s) => s.filter((i) => i.id !== item.id))}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
