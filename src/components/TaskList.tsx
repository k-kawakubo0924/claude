"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";
import { useUIStore } from "@/store/uiStore";
import TaskItem from "./TaskItem";

export default function TaskList() {
  const { statusFilter } = useUIStore();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks", statusFilter],
    queryFn: () => fetchTasks(statusFilter === "all" ? undefined : statusFilter),
  });

  if (isLoading) return <p className="text-sm text-slate-400">読み込み中...</p>;
  if (isError) return <p className="text-sm text-red-500">タスクの取得に失敗しました</p>;
  if (!data || data.length === 0) {
    return <p className="text-sm text-slate-400">タスクがありません</p>;
  }

  return (
    <ul className="space-y-2">
      {data.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
