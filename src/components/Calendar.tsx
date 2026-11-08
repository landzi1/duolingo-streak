import type dayjs from "dayjs";
import React, { useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { ChevronLeftSvg, ChevronRightSvg } from "./Svgs";
import { range } from "~/utils/array-utils";
import type { DayStatus } from "~/stores/createStreakStore";

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

// Sparkle star icon as seen on day 15 and day 20 in IMG_6308.PNG
export const SparkleSvg = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className ?? "h-3.5 w-3.5 text-white"}
    aria-hidden="true"
  >
    <path d="M8 0L9.8 5.6L16 8L9.8 10.4L8 16L6.2 10.4L0 8L6.2 5.6L8 0Z" />
  </svg>
);

// Freeze droplet speech-bubble badge as seen on day 10 & 25 in IMG_6308.PNG
export const FreezeDropletBadge = ({
  dayNumber,
  size = 36,
  className,
}: {
  dayNumber: number;
  size?: number;
  className?: string;
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 38 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full drop-shadow-sm"
      >
        {/* Main circular droplet body with tail on bottom left */}
        <path
          d="M19 1C28.9411 1 37 9.05887 37 19C37 28.9411 28.9411 37 19 37C16.4853 37 14.1039 36.4839 11.9442 35.5562L5 41L7.54512 32.7486C3.51869 29.3514 1 24.4716 1 19C1 9.05887 9.05887 1 19 1Z"
          fill="#20b7f8"
        />
        {/* Subtle inner highlight */}
        <path
          d="M19 3C27.8366 3 35 10.1634 35 19C35 21.5 34.4 23.8 33.3 25.8C31.5 14.5 22 5.5 10.2 4.1C12.9 3.4 15.8 3 19 3Z"
          fill="white"
          fillOpacity="0.22"
        />
      </svg>
      <span className="relative z-10 text-sm font-extrabold text-white">
        {dayNumber}
      </span>
    </div>
  );
};

export const Calendar = ({
  now,
  setNow,
  interactive = true,
  onDayClick,
}: {
  now: dayjs.Dayjs;
  setNow?: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  interactive?: boolean;
  onDayClick?: (day: dayjs.Dayjs) => void;
}) => {
  const getDayStatus = useBoundStore((x) => x.getDayStatus);
  const cycleDayStatus = useBoundStore((x) => x.cycleDayStatus);
  const setDayStatus = useBoundStore((x) => x.setDayStatus);

  const [lastClickedDate, setLastClickedDate] = useState<dayjs.Dayjs | null>(
    null,
  );

  const formattedNowMonth = now.format("MMMM YYYY");
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
        setDayStatus(curr, "practiced");
        curr = curr.add(1, "day");
      }
    } else {
      cycleDayStatus(clickedDay);
      setLastClickedDate(clickedDay);
    }
  };

  return (
    <article className="flex flex-col rounded-3xl border-2 border-[#e5e5e5] bg-white p-4 shadow-sm select-none">
      {/* Month Header with navigation */}
      {setNow && (
        <header className="mb-3 flex items-center justify-between px-1">
          <h3 className="text-xl font-extrabold text-[#3c3c3c]">
            {formattedNowMonth}
          </h3>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="p-1 text-gray-400 transition hover:text-gray-600 active:scale-95"
              onClick={() => setNow((prev) => prev.add(-1, "month"))}
              aria-label="Previous month"
            >
              <ChevronLeftSvg />
            </button>
            <button
              type="button"
              className="p-1 text-gray-400 transition hover:text-gray-600 active:scale-95"
              onClick={() => setNow((prev) => prev.add(1, "month"))}
              aria-label="Next month"
            >
              <ChevronRightSvg />
            </button>
          </div>
        </header>
      )}

      {/* Week days labels (Su, Mo, Tu, We, Th, Fr, Sa) */}
      <div className="grid grid-cols-7 justify-items-center py-2 text-center">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
          <div
            key={i}
            className="flex h-8 w-8 items-center justify-center text-sm font-bold text-[#afafaf]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Weeks Grid */}
      <div className="flex flex-col gap-2.5 py-1">
        {calendarDays.map((week, weekIdx) => {
          // Identify contiguous spans of 'practiced' days in this week
          const dayStatuses = week.map((date) =>
            date !== null ? getDayStatus(now.date(date)) : "none",
          );

          // Find consecutive practiced segments
          const practicedSpans: { start: number; end: number; count: number }[] = [];
          let currentStart: number | null = null;

          for (let col = 0; col < 7; col++) {
            if (dayStatuses[col] === "practiced") {
              if (currentStart === null) currentStart = col;
            } else {
              if (currentStart !== null) {
                practicedSpans.push({
                  start: currentStart,
                  end: col - 1,
                  count: col - currentStart,
                });
                currentStart = null;
              }
            }
          }
          if (currentStart !== null) {
            practicedSpans.push({
              start: currentStart,
              end: 6,
              count: 7 - currentStart,
            });
          }

          return (
            <div key={weekIdx} className="relative grid grid-cols-7 h-10 items-center">
              {/* Connected streak pill backgrounds */}
              {practicedSpans.map((span, sIdx) => {
                const isFullWeek = span.count === 7;
                const isMultiDay = span.count > 1;

                // Left & right percentage positions
                const leftPercent = (span.start / 7) * 100;
                const widthPercent = ((span.end - span.start + 1) / 7) * 100;

                // Style matching IMG_6308.PNG
                // Row 11-17 & 18-24: Full gradient pill with yellow border
                // Row 26-31: Warm yellow/amber pill
                const isSoftPill =
                  !isFullWeek && span.start > 0 && span.end === 6;

                return (
                  <div
                    key={sIdx}
                    className="pointer-events-none absolute h-10 transition-all"
                    style={{
                      left: `calc(${leftPercent}% + 2px)`,
                      width: `calc(${widthPercent}% - 4px)`,
                    }}
                  >
                    {isSoftPill ? (
                      // Soft amber pill for end of month (e.g., days 26-31)
                      <div className="h-full w-full rounded-full bg-[#fff0b3]" />
                    ) : isMultiDay ? (
                      // Vibrant orange-to-red gradient pill with gold border
                      <div className="relative h-full w-full rounded-full p-[2px] bg-[#ffd84d] shadow-[0_2px_8px_rgba(255,150,0,0.35)]">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-[#ff9600] via-[#ff7800] to-[#ff4b4b]" />
                      </div>
                    ) : (
                      // Single day practiced circle
                      <div className="mx-auto h-9 w-9 rounded-full bg-gradient-to-br from-[#ff9600] to-[#ff4b4b] shadow-sm" />
                    )}
                  </div>
                );
              })}

              {/* Day cells */}
              {week.map((date, col) => {
                if (date === null) {
                  return <div key={col} className="h-10 w-full" />;
                }

                const status = dayStatuses[col] as DayStatus;

                // Check if this cell is inside a multi-day span
                const insideSpan = practicedSpans.find(
                  (s) => col >= s.start && col <= s.end,
                );
                const isSoftSpan =
                  insideSpan &&
                  insideSpan.count > 1 &&
                  insideSpan.count < 7 &&
                  insideSpan.end === 6;
                const isGradientSpan =
                  insideSpan &&
                  (insideSpan.count >= 2 && !isSoftSpan);

                // Sparkle on day 15 or 20 (as on IMG_6308.PNG)
                const hasSparkle = date === 15 || date === 20;

                return (
                  <div
                    key={col}
                    className="relative flex h-10 w-full items-center justify-center"
                  >
                    {/* Sparkle star decorator */}
                    {hasSparkle && isGradientSpan && (
                      <div className="pointer-events-none absolute -top-1 -right-1 z-20">
                        <SparkleSvg className="h-3.5 w-3.5 text-white animate-pulse" />
                      </div>
                    )}

                    {status === "freeze" ? (
                      // FREEZE DROPLET BADGE (1:1 with IMG_6308)
                      <button
                        type="button"
                        disabled={!interactive}
                        onClick={(e) => handleDayClick(date, e)}
                        className="relative z-10 transition-transform active:scale-95 focus:outline-none"
                        title="Streak Freeze (Click to cycle)"
                      >
                        <FreezeDropletBadge dayNumber={date} size={38} />
                      </button>
                    ) : status === "practiced" ? (
                      // PRACTICED STREAK DAY
                      <button
                        type="button"
                        disabled={!interactive}
                        onClick={(e) => handleDayClick(date, e)}
                        className={[
                          "relative z-10 flex h-9 w-9 items-center justify-center font-extrabold text-base transition-transform active:scale-95 focus:outline-none",
                          isSoftSpan
                            ? "text-[#ff9600]"
                            : isGradientSpan || insideSpan
                              ? "text-white"
                              : "rounded-full bg-gradient-to-r from-[#ff9600] to-[#ff4b4b] text-white shadow-sm",
                        ].join(" ")}
                        title="Practiced streak (Click to cycle)"
                      >
                        {date}
                      </button>
                    ) : (
                      // NORMAL / UNPRACTICED DAY
                      <button
                        type="button"
                        disabled={!interactive}
                        onClick={(e) => handleDayClick(date, e)}
                        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-base font-bold text-[#777777] transition-all hover:bg-gray-100 hover:text-black active:scale-95 focus:outline-none"
                        title="Click to mark as Streak or Freeze"
                      >
                        {date}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {interactive && (
        <div className="mt-3 flex items-center justify-center gap-3 border-t border-gray-100 pt-3 text-[11px] font-semibold text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#ff9600] to-[#ff4b4b]" />
            Streak
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#20b7f8]" />
            Freeze
          </span>
          <span className="text-gray-300">•</span>
          <span>Click day to toggle</span>
        </div>
      )}
    </article>
  );
};
