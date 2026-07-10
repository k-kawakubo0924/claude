import { create } from "zustand";

export type StatusFilter = "all" | "todo" | "in_progress" | "done";
type GeoStatus = "idle" | "loading" | "granted" | "denied" | "unsupported";

interface Coords {
  lat: number;
  lon: number;
}

interface UIState {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
  coords: Coords | null;
  geoStatus: GeoStatus;
  requestLocation: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  statusFilter: "all",
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  coords: null,
  geoStatus: "idle",
  requestLocation: () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      set({ geoStatus: "unsupported" });
      return;
    }
    set({ geoStatus: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set({
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          geoStatus: "granted",
        });
      },
      () => {
        set({ geoStatus: "denied" });
      },
      { timeout: 8000 },
    );
  },
}));
