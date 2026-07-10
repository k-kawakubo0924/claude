"use client";

import clsx from "clsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "@/lib/api";
import type { Task, TaskStatus } from "@/lib/types";

const statusLabel: Record<TaskStatus, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};

const categoryLabel: Record<string, string> = {
  outdoor: "屋外向け",
  indoor: "屋内向け",
  any: "どこでも",
};

const priorityColor: Record<string, string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const priorityLabel: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export default function TaskItem({ task }: { task: Task }) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["suggestions"] });
  };

  const statusMutation = useMutation({
    mutationFn: (status: TaskStatus) => updateTask(task.id, { status }),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: invalidate,
  });

  const nextStatus: TaskStatus | null =
    task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : null;

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={clsx(
              "truncate font-medium text-slate-800 dark:text-slate-100",
              task.status === "done" && "text-slate-400 line-through dark:text-slate-500",
            )}
          >
            {task.title}
          </p>
          <span className={clsx("rounded-full px-2 py-0.5 text-xs font-medium", priorityColor[task.priority])}>
            {priorityLabel[task.priority]}
          </span>
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
            {categoryLabel[task.category]}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
            {task.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-slate-400">{statusLabel[task.status]}</span>
        {nextStatus && (
          <button
            onClick={() => statusMutation.mutate(nextStatus)}
            disabled={statusMutation.isPending}
            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900"
          >
            {nextStatus === "in_progress" ? "着手" : "完了にする"}
          </button>
        )}
        <button
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 dark:hover:bg-rose-900/30"
        >
          削除
        </button>
      </div>
    </li>
  );
}
