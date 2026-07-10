"use client";

import clsx from "clsx";
import { useUIStore, type StatusFilter } from "@/store/uiStore";

const tabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "todo", label: "未着手" },
  { key: "in_progress", label: "進行中" },
  { key: "done", label: "完了" },
];

export default function StatusFilterTabs() {
  const { statusFilter, setStatusFilter } = useUIStore();
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setStatusFilter(tab.key)}
          className={clsx(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            statusFilter === tab.key
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
