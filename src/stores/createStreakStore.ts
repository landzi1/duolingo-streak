import dayjs from "dayjs";
import { z } from "zod";
import type { BoundStateCreator } from "~/hooks/useBoundStore";
import type { DateString } from "~/utils/dateString";
import { toDateString } from "~/utils/dateString";

export type ActiveDays = Set<DateString>;

export const STORAGE_KEY = "react_duolingo_streak_v1";

const streakStorageSchema = z.object({
  activeDays: z.array(z.string()),
  customStreak: z.number().nullable().optional(),
});

export const isActiveDay = (activeDays: ActiveDays, day: dayjs.Dayjs): boolean => {
  return activeDays.has(toDateString(day));
};

export const calculateStreak = (
  activeDays: ActiveDays,
  customStreak: number | null = null,
): number => {
  if (customStreak !== null && customStreak >= 0) {
    return customStreak;
  }
  if (!activeDays || activeDays.size === 0) {
    return 0;
  }

  const today = dayjs();
  const yesterday = today.add(-1, "day");

  // 1. Sprawdzamy czy dzisiaj jest aktywne
  if (isActiveDay(activeDays, today)) {
    let daysBack = 1;
    let day = today.add(-1, "day");
    while (isActiveDay(activeDays, day)) {
      day = day.add(-1, "day");
      daysBack += 1;
    }
    return daysBack;
  }

  // 2. Jeśli dzisiaj jeszcze nie zrobione, ale wczoraj było:
  if (isActiveDay(activeDays, yesterday)) {
    let daysBack = 1;
    let day = yesterday.add(-1, "day");
    while (isActiveDay(activeDays, day)) {
      day = day.add(-1, "day");
      daysBack += 1;
    }
    return daysBack;
  }

  // 3. Jeśli ani dzisiaj, ani wczoraj nie było aktywne, liczymy długość ostatniego aktywnego okresu:
  const sortedDates = Array.from(activeDays).sort((a, b) => b.localeCompare(a));
  const latestDateStr = sortedDates[0];
  if (!latestDateStr) return 0;

  const latestDay = dayjs(latestDateStr);
  let daysBack = 1;
  let day = latestDay.add(-1, "day");
  while (isActiveDay(activeDays, day)) {
    day = day.add(-1, "day");
    daysBack += 1;
  }
  return daysBack;
};

export const loadStoredStreak = (): {
  activeDays: ActiveDays;
  customStreak: number | null;
} | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsedJson: unknown = JSON.parse(raw);
    const parsed = streakStorageSchema.safeParse(parsedJson);
    if (!parsed.success) return null;
    const activeDays = new Set<DateString>(
      parsed.data.activeDays as DateString[],
    );
    const customStreak =
      typeof parsed.data.customStreak === "number"
        ? parsed.data.customStreak
        : null;
    return { activeDays, customStreak };
  } catch (e) {
    console.error("Failed to load streak from localStorage", e);
    return null;
  }
};

export const saveStoredStreak = (
  activeDays: ActiveDays,
  customStreak: number | null,
) => {
  if (typeof window === "undefined") return;
  try {
    const data = {
      activeDays: Array.from(activeDays),
      customStreak,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save streak to localStorage", e);
  }
};

export type StreakSlice = {
  activeDays: ActiveDays;
  streak: number;
  customStreak: number | null;
  isActiveDay: (day: dayjs.Dayjs) => boolean;
  addToday: () => void;
  toggleDay: (day: dayjs.Dayjs | DateString) => void;
  setDayActive: (day: dayjs.Dayjs | DateString, active: boolean) => void;
  fillMonth: (monthDate: dayjs.Dayjs, active: boolean) => void;
  fillStreakDays: (daysBack: number) => void;
  extendStreakToToday: () => void;
  clearAllActiveDays: () => void;
  setCustomStreak: (streak: number | null) => void;
  initFromStorage: () => void;
  saveToStorage: () => void;
};

export const createStreakSlice: BoundStateCreator<StreakSlice> = (
  set,
  get,
) => ({
  activeDays: new Set(),
  streak: 0,
  customStreak: null,
  isActiveDay: (day: dayjs.Dayjs) => isActiveDay(get().activeDays, day),
  addToday: () => {
    const activeDays = new Set(get().activeDays);
    activeDays.add(toDateString(dayjs()));
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  toggleDay: (dayInput) => {
    const dateStr =
      typeof dayInput === "string" ? dayInput : toDateString(dayInput);
    const activeDays = new Set(get().activeDays);
    if (activeDays.has(dateStr)) {
      activeDays.delete(dateStr);
    } else {
      activeDays.add(dateStr);
    }
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  setDayActive: (dayInput, active) => {
    const dateStr =
      typeof dayInput === "string" ? dayInput : toDateString(dayInput);
    const activeDays = new Set(get().activeDays);
    if (active) {
      activeDays.add(dateStr);
    } else {
      activeDays.delete(dateStr);
    }
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  fillMonth: (monthDate, active) => {
    const activeDays = new Set(get().activeDays);
    const daysInMonth = monthDate.daysInMonth();
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateString(monthDate.date(d));
      if (active) {
        activeDays.add(dateStr);
      } else {
        activeDays.delete(dateStr);
      }
    }
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  fillStreakDays: (daysBack) => {
    const activeDays = new Set(get().activeDays);
    const today = dayjs();
    for (let i = 0; i < daysBack; i++) {
      const d = today.add(-i, "day");
      activeDays.add(toDateString(d));
    }
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  extendStreakToToday: () => {
    const activeDays = new Set(get().activeDays);
    const today = dayjs();
    if (activeDays.size === 0) {
      activeDays.add(toDateString(today));
    } else {
      const sortedDates = Array.from(activeDays).sort((a, b) =>
        b.localeCompare(a),
      );
      const latestDateStr = sortedDates[0];
      if (latestDateStr) {
        let cursor = dayjs(latestDateStr).add(1, "day");
        const todayStr = toDateString(today);
        while (toDateString(cursor) <= todayStr) {
          activeDays.add(toDateString(cursor));
          cursor = cursor.add(1, "day");
        }
      }
    }
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  clearAllActiveDays: () => {
    const activeDays = new Set<DateString>();
    const customStreak = get().customStreak;
    const streak = calculateStreak(activeDays, customStreak);
    set({ activeDays, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  setCustomStreak: (customStreak) => {
    const activeDays = get().activeDays;
    const streak = calculateStreak(activeDays, customStreak);
    set({ customStreak, streak });
    saveStoredStreak(activeDays, customStreak);
  },
  initFromStorage: () => {
    const stored = loadStoredStreak();
    if (stored) {
      const streak = calculateStreak(stored.activeDays, stored.customStreak);
      set({
        activeDays: stored.activeDays,
        customStreak: stored.customStreak,
        streak,
      });
    }
  },
  saveToStorage: () => {
    saveStoredStreak(get().activeDays, get().customStreak);
  },
});
