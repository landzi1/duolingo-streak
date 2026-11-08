import dayjs from "dayjs";
import React, { useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { ChevronLeftSvg, ChevronRightSvg } from "./Svgs";
import { range } from "~/utils/array-utils";

const getCalendarDays = (now: dayjs.Dayjs): (number | null)[][] => {
  const startOfMonth = now.startOf("month");
  const calendarDays: (number | null)[][] = [];
  const firstWeekEndDate = 8 - startOfMonth.day();
  const firstWeek = [
    ...range(0, startOfMonth.day()).map(() => null),
    ...range(1, firstWeekEndDate),
  ];
  calendarDays.push(firstWeek);
  for (
    let weekStartDate = firstWeekEndDate;
    weekStartDate <= now.daysInMonth();
    weekStartDate += 7
  ) {
    calendarDays.push(
      range(weekStartDate, weekStartDate + 7).map((date) =>
        date <= now.daysInMonth() ? date : null,
      ),
    );
  }
  return calendarDays;
};

export const Calendar = ({
  now,
  setNow,
  interactive = true,
  onDayClick,
}: {
  now: dayjs.Dayjs;
  setNow: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  interactive?: boolean;
  onDayClick?: (day: dayjs.Dayjs) => void;
}) => {
  const isActiveDay = useBoundStore((x) => x.isActiveDay);
  const toggleDay = useBoundStore((x) => x.toggleDay);
  const setDayActive = useBoundStore((x) => x.setDayActive);
  const fillMonth = useBoundStore((x) => x.fillMonth);

  const [lastClickedDate, setLastClickedDate] = useState<dayjs.Dayjs | null>(
    null,
  );

  const formattedNowMonth = now.format("MMMM YYYY");
  const staticNow = dayjs();
  const calendarDays = getCalendarDays(now);

  const handleDayClick = (date: number, e: React.MouseEvent) => {
    if (!interactive) return;
    const clickedDay = now.date(date);
    if (onDayClick) {
      onDayClick(clickedDay);
      return;
    }

    if (e.shiftKey && lastClickedDate) {
      const start = lastClickedDate.isBefore(clickedDay)
        ? lastClickedDate
        : clickedDay;
      const end = lastClickedDate.isBefore(clickedDay)
        ? clickedDay
        : lastClickedDate;
      let curr = start;
      while (curr.isBefore(end) || curr.isSame(end, "day")) {
        setDayActive(curr, true);
        curr = curr.add(1, "day");
      }
    } else {
      toggleDay(clickedDay);
      setLastClickedDate(clickedDay);
    }
  };

  const handleToggleMonth = () => {
    if (!interactive) return;
    const daysInMonth = now.daysInMonth();
    let allActive = true;
    for (let d = 1; d <= daysInMonth; d++) {
      if (!isActiveDay(now.date(d))) {
        allActive = false;
        break;
      }
    }
    fillMonth(now, !allActive);
  };

  return (
    <article className="flex flex-col rounded-xl border-2 border-gray-300 p-3 text-gray-400 select-none">
      <header className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-gray-400 transition hover:text-gray-600"
          onClick={() => setNow((now) => now.add(-1, "month"))}
          aria-label="Go to previous month"
        >
          <ChevronLeftSvg />
          <span className="sr-only">Go to previous month</span>
        </button>
        <h3
          className="text-lg font-bold uppercase text-gray-500 cursor-pointer transition hover:text-gray-700"
          onClick={handleToggleMonth}
          title="Click to toggle month streak"
        >
          {formattedNowMonth}
        </h3>
        <button
          type="button"
          className="text-gray-400 transition hover:text-gray-600"
          onClick={() => setNow((now) => now.add(1, "month"))}
          aria-label="Go to next month"
        >
          <ChevronRightSvg />
          <span className="sr-only">Go to next month</span>
        </button>
      </header>
      <div className="grid grid-cols-7 justify-items-center px-1 py-2">
        {"SMTWTFS".split("").map((day, i) => {
          return (
            <div
              key={i}
              className="flex h-9 w-9 items-center justify-center font-bold text-xs"
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2 px-1 py-2">
        {calendarDays.map((week, i) => {
          return (
            <div key={i} className="grid grid-cols-7 h-9">
              {week.map((date, j) => {
                if (date === null) {
                  return <div key={j} className="h-9 w-full" />;
                }
                const dayDate = now.date(date);
                const isActiveDate = isActiveDay(dayDate);
                const isCurrentDate =
                  date === staticNow.date() &&
                  now.month() === staticNow.month() &&
                  now.year() === staticNow.year();

                const prevDate = j > 0 ? (week[j - 1] ?? null) : null;
                const isPrevActive =
                  typeof prevDate === "number" &&
                  isActiveDay(now.date(prevDate));

                const nextDate = j < 6 ? (week[j + 1] ?? null) : null;
                const isNextActive =
                  typeof nextDate === "number" &&
                  isActiveDay(now.date(nextDate));

                return (
                  <div
                    key={j}
                    className="relative flex h-9 w-full items-center justify-center"
                  >
                    {/* Continuous streak connector bar to the left */}
                    {isActiveDate && isPrevActive && (
                      <div className="pointer-events-none absolute bottom-0 left-0 right-1/2 top-0 bg-orange-400" />
                    )}
                    {/* Continuous streak connector bar to the right */}
                    {isActiveDate && isNextActive && (
                      <div className="pointer-events-none absolute bottom-0 left-1/2 right-0 top-0 bg-orange-400" />
                    )}

                    <button
                      type="button"
                      disabled={!interactive}
                      onClick={(e) => handleDayClick(date, e)}
                      className={[
                        "relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-transform",
                        isActiveDate
                          ? "bg-orange-400 text-white"
                          : isCurrentDate
                            ? "bg-gray-300 text-gray-600"
                            : "text-gray-400 hover:text-gray-600",
                        interactive ? "cursor-pointer active:scale-95" : "",
                      ].join(" ")}
                    >
                      {date}
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </article>
  );
};
