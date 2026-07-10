"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import { fetchSuggestions, updateTask } from "@/lib/api";
import type { Task } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  outdoor: "屋外向け",
  indoor: "屋内向け",
  any: "どこでも",
};

export default function SuggestionPanel() {
  const { coords, geoStatus } = useUIStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["suggestions", coords?.lat, coords?.lon],
    queryFn: () => fetchSuggestions(coords?.lat, coords?.lon),
    enabled: geoStatus !== "loading",
    refetchInterval: 10 * 60 * 1000,
  });

  const startMutation = useMutation({
    mutationFn: (task: Task) => updateTask(task.id, { status: "in_progress" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        天候に基づくおすすめタスク
      </h2>
      {isLoading && <p className="text-sm text-slate-400">読み込み中...</p>}
      {data && data.suggestions.length === 0 && (
        <p className="text-sm text-slate-400">提案できるタスクがありません</p>
      )}
      <ul className="space-y-2">
        {data?.suggestions.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800 dark:text-slate-100">
                {task.title}
              </p>
              <p className="text-xs text-slate-400">{categoryLabel[task.category]}</p>
            </div>
            <button
              onClick={() => startMutation.mutate(task)}
              disabled={startMutation.isPending}
              className="shrink-0 rounded-full bg-sky-600 px-3 py-1 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-50"
            >
              着手する
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
