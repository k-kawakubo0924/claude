"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import { fetchWeather } from "@/lib/api";

export default function WeatherWidget() {
  const { coords, geoStatus, requestLocation } = useUIStore();

  useEffect(() => {
    if (geoStatus === "idle") {
      requestLocation();
    }
  }, [geoStatus, requestLocation]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["weather", coords?.lat, coords?.lon],
    queryFn: () => fetchWeather(coords?.lat, coords?.lon),
    enabled: geoStatus !== "loading",
    refetchInterval: 10 * 60 * 1000,
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        現在の天候
      </h2>
      {isLoading && <p className="text-sm text-slate-400">取得中...</p>}
      {isError && (
        <p className="text-sm text-red-500">天気情報を取得できませんでした</p>
      )}
      {data && (
        <div className="flex items-center gap-4">
          <span className="text-5xl leading-none">{data.emoji}</span>
          <div>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {data.label}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              気温 {data.temperature}°C ・ 風速 {data.wind_speed} m/s
            </p>
          </div>
        </div>
      )}
      {geoStatus === "denied" && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
          位置情報が許可されなかったため、東京の天気を表示しています。
        </p>
      )}
      {geoStatus === "unsupported" && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
          このブラウザは位置情報に対応していないため、東京の天気を表示しています。
        </p>
      )}
      {geoStatus !== "loading" && (
        <button
          onClick={requestLocation}
          className="mt-3 text-xs text-sky-600 underline underline-offset-2 dark:text-sky-400"
        >
          現在地を再取得する
        </button>
      )}
    </div>
  );
}
