import WeatherWidget from "@/components/WeatherWidget";
import SuggestionPanel from "@/components/SuggestionPanel";
import StatusFilterTabs from "@/components/StatusFilterTabs";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-8 py-10">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          タスク管理システム
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          現在地の天候に応じて、今やるべきタスクを提案します。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-4">
          <TaskForm />
          <StatusFilterTabs />
          <TaskList />
        </section>
        <aside className="flex flex-col gap-4">
          <WeatherWidget />
          <SuggestionPanel />
        </aside>
      </div>
    </main>
  );
}
