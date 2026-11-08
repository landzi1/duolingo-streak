import dayjs from "dayjs";
import { z } from "zod";
import type { BoundStateCreator } from "~/hooks/useBoundStore";
import type { DateString } from "~/utils/dateString";
import { toDateString } from "~/utils/dateString";

export type DayStatus = "none" | "practiced" | "freeze";
export type ActiveDays = Set<DateString>;

export const STORAGE_KEY = "react_duolingo_streak_v2";
export const LEGACY_STORAGE_KEY = "react_duolingo_streak_v1";

const streakStorageSchema = z.object({
  practicedDays: z.array(z.string()).optional(),
  freezeDays: z.array(z.string()).optional(),
  activeDays: z.array(z.string()).optional(),
  customStreak: z.number().nullable().optional(),
});

// Seed data from IMG_6308.PNG (January 2026: 22 practiced days, 2 freezes)
export const SCREENSHOT_JAN_2026_DATA = {
  practiced: [
    "2026-01-08",
    "2026-01-09",
    "2026-01-11",
    "2026-01-12",
    "2026-01-13",
    "2026-01-14",
    "2026-01-15",
    "2026-01-16",
    "2026-01-17",
    "2026-01-18",
    "2026-01-19",
    "2026-01-20",
    "2026-01-21",
    "2026-01-22",
    "2026-01-23",
    "2026-01-24",
    "2026-01-26",
    "2026-01-27",
    "2026-01-28",
    "2026-01-29",
    "2026-01-30",
    "2026-01-31",
  ] as DateString[],
  freeze: ["2026-01-10", "2026-01-25"] as DateString[],
};

export const getDayStatusFromSets = (
  practicedDays: Set<DateString>,
  freezeDays: Set<DateString>,
  day: dayjs.Dayjs | DateString,
): DayStatus => {
  const dateStr = typeof day === "string" ? day : toDateString(day);
  if (freezeDays.has(dateStr)) return "freeze";
  if (practicedDays.has(dateStr)) return "practiced";
  return "none";
};

export const isActiveDay = (
  activeDays: ActiveDays,
  day: dayjs.Dayjs,
): boolean => {
  return activeDays.has(toDateString(day));
};

export const getMonthStreakFromSets = (
  monthDate: dayjs.Dayjs,
  practicedDays: Set<DateString>,
  freezeDays: Set<DateString>,
): number => {
  const allActive = new Set<DateString>([...practicedDays, ...freezeDays]);
  let maxStreak = 0;
  let currentStreak = 0;
  const daysInMonth = monthDate.daysInMonth();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = toDateString(monthDate.date(d));
    if (allActive.has(dateStr)) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

export const calculateStreak = (
  practicedDays: Set<DateString>,
  freezeDays: Set<DateString>,
  customStreak: number | null = null,
): number => {
  if (customStreak !== null && customStreak >= 0) {
    return customStreak;
  }

  const allActive = new Set<DateString>([...practicedDays, ...freezeDays]);
  if (allActive.size === 0) return 0;

  const today = dayjs();
  const yesterday = today.add(-1, "day");

  const isDayProtected = (d: dayjs.Dayjs) => allActive.has(toDateString(d));

  let startDay: dayjs.Dayjs | null = null;
  if (isDayProtected(today)) {
    startDay = today;
  } else if (isDayProtected(yesterday)) {
    startDay = yesterday;
  }

  if (startDay) {
    let daysBack = 1;
    let day = startDay.add(-1, "day");
    while (isDayProtected(day)) {
      day = day.add(-1, "day");
      daysBack += 1;
    }
    return daysBack;
  }

  // If neither today nor yesterday is active, calculate streak of latest period
  const sorted = Array.from(allActive).sort((a, b) => b.localeCompare(a));
  const latestStr = sorted[0];
  if (!latestStr) return 0;

  const latestDay = dayjs(latestStr);
  let daysBack = 1;
  let day = latestDay.add(-1, "day");
  while (isDayProtected(day)) {
    day = day.add(-1, "day");
    daysBack += 1;
  }
  return daysBack;
};

export const loadStoredStreak = (): {
  practicedDays: Set<DateString>;
  freezeDays: Set<DateString>;
  customStreak: number | null;
} | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsedJson: unknown = JSON.parse(raw);
      const parsed = streakStorageSchema.safeParse(parsedJson);
      if (parsed.success) {
        const practicedDays = new Set<DateString>(
          (parsed.data.practicedDays ?? parsed.data.activeDays ?? []) as DateString[],
        );
        const freezeDays = new Set<DateString>(
          (parsed.data.freezeDays ?? []) as DateString[],
        );
        const customStreak =
          typeof parsed.data.customStreak === "number"
            ? parsed.data.customStreak
            : null;
        return { practicedDays, freezeDays, customStreak };
      }
    }

    // Check legacy storage
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const parsedJson: unknown = JSON.parse(legacyRaw);
      const parsed = streakStorageSchema.safeParse(parsedJson);
      if (parsed.success) {
        const practicedDays = new Set<DateString>(
          (parsed.data.activeDays ?? []) as DateString[],
        );
        return {
          practicedDays,
          freezeDays: new Set<DateString>(),
          customStreak: parsed.data.customStreak ?? null,
        };
      }
    }

    // Default seed to match IMG_6308.PNG
    return {
      practicedDays: new Set<DateString>(SCREENSHOT_JAN_2026_DATA.practiced),
      freezeDays: new Set<DateString>(SCREENSHOT_JAN_2026_DATA.freeze),
      customStreak: 0,
    };
  } catch (e) {
    console.error("Failed to load streak from localStorage", e);
    return null;
  }
};

export const saveStoredStreak = (
  practicedDays: Set<DateString>,
  freezeDays: Set<DateString>,
  customStreak: number | null,
) => {
  if (typeof window === "undefined") return;
  try {
    const data = {
      practicedDays: Array.from(practicedDays),
      freezeDays: Array.from(freezeDays),
      activeDays: Array.from(new Set([...practicedDays, ...freezeDays])),
      customStreak,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save streak to localStorage", e);
  }
};

export type StreakSlice = {
  practicedDays: Set<DateString>;
  freezeDays: Set<DateString>;
  activeDays: ActiveDays;
  streak: number;
  customStreak: number | null;
  getDayStatus: (day: dayjs.Dayjs | DateString) => DayStatus;
  isActiveDay: (day: dayjs.Dayjs) => boolean;
  cycleDayStatus: (day: dayjs.Dayjs | DateString) => DayStatus;
  setDayStatus: (day: dayjs.Dayjs | DateString, status: DayStatus) => void;
  addToday: () => void;
  addFreezeToday: () => void;
  toggleDay: (day: dayjs.Dayjs | DateString) => void;
  setDayActive: (day: dayjs.Dayjs | DateString, active: boolean) => void;
  fillMonth: (monthDate: dayjs.Dayjs, active: boolean) => void;
  fillMonthWithStatus: (monthDate: dayjs.Dayjs, status: DayStatus) => void;
  fillStreakDays: (daysBack: number) => void;
  extendStreakToToday: () => void;
  clearAllActiveDays: () => void;
  seedScreenshotPreset: () => void;
  getDaysPracticedInMonth: (monthDate: dayjs.Dayjs) => number;
  getFreezesUsedInMonth: (monthDate: dayjs.Dayjs) => number;
  getMonthStreak: (monthDate: dayjs.Dayjs) => number;
  setCustomStreak: (streak: number | null) => void;
  initFromStorage: () => void;
  saveToStorage: () => void;
};

export const createStreakSlice: BoundStateCreator<StreakSlice> = (
  set,
  get,
) => ({
  practicedDays: new Set(SCREENSHOT_JAN_2026_DATA.practiced),
  freezeDays: new Set(SCREENSHOT_JAN_2026_DATA.freeze),
  activeDays: new Set([
    ...SCREENSHOT_JAN_2026_DATA.practiced,
    ...SCREENSHOT_JAN_2026_DATA.freeze,
  ]),
  streak: 0,
  customStreak: 0,

  getDayStatus: (day) =>
    getDayStatusFromSets(get().practicedDays, get().freezeDays, day),

  isActiveDay: (day) => get().activeDays.has(toDateString(day)),

  cycleDayStatus: (dayInput) => {
    const dateStr =
      typeof dayInput === "string" ? dayInput : toDateString(dayInput);
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);

    let nextStatus: DayStatus = "none";
    if (practiced.has(dateStr)) {
      practiced.delete(dateStr);
      freeze.add(dateStr);
      nextStatus = "freeze";
    } else if (freeze.has(dateStr)) {
      freeze.delete(dateStr);
      nextStatus = "none";
    } else {
      practiced.add(dateStr);
      nextStatus = "practiced";
    }

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
    return nextStatus;
  },

  setDayStatus: (dayInput, status) => {
    const dateStr =
      typeof dayInput === "string" ? dayInput : toDateString(dayInput);
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);

    practiced.delete(dateStr);
    freeze.delete(dateStr);

    if (status === "practiced") {
      practiced.add(dateStr);
    } else if (status === "freeze") {
      freeze.add(dateStr);
    }

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  addToday: () => {
    const today = toDateString(dayjs());
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);
    freeze.delete(today);
    practiced.add(today);

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  addFreezeToday: () => {
    const today = toDateString(dayjs());
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);
    practiced.delete(today);
    freeze.add(today);

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  toggleDay: (dayInput) => {
    get().cycleDayStatus(dayInput);
  },

  setDayActive: (dayInput, active) => {
    get().setDayStatus(dayInput, active ? "practiced" : "none");
  },

  fillMonth: (monthDate, active) => {
    get().fillMonthWithStatus(monthDate, active ? "practiced" : "none");
  },

  fillMonthWithStatus: (monthDate, status) => {
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);
    const daysInMonth = monthDate.daysInMonth();

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateString(monthDate.date(d));
      practiced.delete(dateStr);
      freeze.delete(dateStr);
      if (status === "practiced") {
        practiced.add(dateStr);
      } else if (status === "freeze") {
        freeze.add(dateStr);
      }
    }

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  fillStreakDays: (daysBack) => {
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);
    const today = dayjs();

    for (let i = 0; i < daysBack; i++) {
      const d = today.add(-i, "day");
      const dateStr = toDateString(d);
      freeze.delete(dateStr);
      practiced.add(dateStr);
    }

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  extendStreakToToday: () => {
    const practiced = new Set(get().practicedDays);
    const freeze = new Set(get().freezeDays);
    const all = new Set([...practiced, ...freeze]);
    const today = dayjs();

    if (all.size === 0) {
      practiced.add(toDateString(today));
    } else {
      const sorted = Array.from(all).sort((a, b) => b.localeCompare(a));
      const latestDateStr = sorted[0];
      if (latestDateStr) {
        let cursor = dayjs(latestDateStr).add(1, "day");
        const todayStr = toDateString(today);
        while (toDateString(cursor) <= todayStr) {
          practiced.add(toDateString(cursor));
          cursor = cursor.add(1, "day");
        }
      }
    }

    const active = new Set([...practiced, ...freeze]);
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  clearAllActiveDays: () => {
    const practiced = new Set<DateString>();
    const freeze = new Set<DateString>();
    const active = new Set<DateString>();
    let customStreak = get().customStreak;
    // Clear locked 0 preset on user interaction so streak calculates dynamically
    if (customStreak === 0) {
      customStreak = null;
    }
    const streak = calculateStreak(practiced, freeze, customStreak);

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      customStreak,
      streak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  seedScreenshotPreset: () => {
    const practiced = new Set<DateString>(SCREENSHOT_JAN_2026_DATA.practiced);
    const freeze = new Set<DateString>(SCREENSHOT_JAN_2026_DATA.freeze);
    const active = new Set([...practiced, ...freeze]);
    const customStreak = 0;
    const streak = 0;

    set({
      practicedDays: practiced,
      freezeDays: freeze,
      activeDays: active,
      streak,
      customStreak,
    });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  getDaysPracticedInMonth: (monthDate) => {
    const practiced = get().practicedDays;
    const startStr = monthDate.startOf("month").format("YYYY-MM-DD");
    const endStr = monthDate.endOf("month").format("YYYY-MM-DD");
    let count = 0;
    practiced.forEach((d) => {
      if (d >= startStr && d <= endStr) {
        count++;
      }
    });
    return count;
  },

  getFreezesUsedInMonth: (monthDate) => {
    const freeze = get().freezeDays;
    const startStr = monthDate.startOf("month").format("YYYY-MM-DD");
    const endStr = monthDate.endOf("month").format("YYYY-MM-DD");
    let count = 0;
    freeze.forEach((d) => {
      if (d >= startStr && d <= endStr) {
        count++;
      }
    });
    return count;
  },

  getMonthStreak: (monthDate) => {
    return getMonthStreakFromSets(
      monthDate,
      get().practicedDays,
      get().freezeDays,
    );
  },

  setCustomStreak: (customStreak) => {
    const practiced = get().practicedDays;
    const freeze = get().freezeDays;
    const streak = calculateStreak(practiced, freeze, customStreak);
    set({ customStreak, streak });
    saveStoredStreak(practiced, freeze, customStreak);
  },

  initFromStorage: () => {
    const stored = loadStoredStreak();
    if (stored) {
      const active = new Set([...stored.practicedDays, ...stored.freezeDays]);
      const streak = calculateStreak(
        stored.practicedDays,
        stored.freezeDays,
        stored.customStreak,
      );
      set({
        practicedDays: stored.practicedDays,
        freezeDays: stored.freezeDays,
        activeDays: active,
        customStreak: stored.customStreak,
        streak,
      });
    }
  },

  saveToStorage: () => {
    saveStoredStreak(
      get().practicedDays,
      get().freezeDays,
      get().customStreak,
    );
  },
});
