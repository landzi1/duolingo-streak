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

// Freeze Ice Badge 1:1 copy from IMG_6308.PNG (day 10, day 25 & Freezes card)
export const FreezeIceBadge = ({
  dayNumber,
  size = 40,
  className,
}: {
  dayNumber?: number;
  size?: number;
  className?: string;
}) => {
  const height = size * 1.06;
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className ?? ""}`}
      style={{ width: size, height }}
    >
      <svg
        viewBox="0 0 100 106"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-sm"
      >
        {/* Outer Ice Body with two dripping icicle tails */}
        <path
          d="M50 4C74.85 4 95 24.15 95 49C95 62.5 89 74.5 79.5 83L83.5 91C84.2 92.5 82.8 94 81.2 93.2L74.5 89.8C67.5 93.6 59 95 50 95C46.5 95 43 94.6 39.8 93.8L32.2 103.5C30.8 105.2 28.2 104.5 27.8 102.2L26 90.5C14.5 81.5 6 66.5 6 49C6 24.15 25.7 4 50 4Z"
          fill="#5dc5f8"
        />
        {/* Inner Circle with two-tone diagonal gloss */}
        <g clipPath="url(#freeze_inner_circle_clip)">
          <circle cx="50" cy="49" r="36" fill="#1cb0f6" />
          {/* Diagonal highlight (top-left lighter blue) */}
          <path
            d="M14 49C14 29 30 13 50 13C60 13 69 17 76 23.5L24 75C17.8 68 14 59 14 49Z"
            fill="#52bcf8"
          />
          {/* Specular highlight rim on top-left */}
          <path
            d="M26 26C33 19 41 16 50 16"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>
        <defs>
          <clipPath id="freeze_inner_circle_clip">
            <circle cx="50" cy="49" r="36" />
          </clipPath>
        </defs>
        {/* Date number if provided */}
        {dayNumber !== undefined && (
          <text
            x="50"
            y="49"
            dominantBaseline="central"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontWeight="900"
            fontSize="32"
            fill="white"
          >
            {dayNumber}
          </text>
        )}
      </svg>
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
              className="p-1 text-gray-400 transition hover:text-gray-600 active:scale-90"
              onClick={() => setNow((prev) => prev.add(-1, "month"))}
              aria-label="Previous month"
            >
              <ChevronLeftSvg />
            </button>
            <button
              type="button"
              className="p-1 text-gray-400 transition hover:text-gray-600 active:scale-90"
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
          // Identify statuses of days in this week
          const dayStatuses = week.map((date) =>
            date !== null ? getDayStatus(now.date(date)) : "none",
          );

          // Find consecutive active streak segments (both 'practiced' and 'freeze')
          // As seen in IMG_6308.PNG, freezes connect seamlessly into the streak pill!
          const streakSpans: {
            start: number;
            end: number;
            count: number;
            hasFreeze: boolean;
            hasPracticed: boolean;
          }[] = [];

          let currentStart: number | null = null;
          let currentHasFreeze = false;
          let currentHasPracticed = false;

          for (let col = 0; col < 7; col++) {
            const st = dayStatuses[col];
            if (st === "practiced" || st === "freeze") {
              if (currentStart === null) {
                currentStart = col;
                currentHasFreeze = st === "freeze";
                currentHasPracticed = st === "practiced";
              } else {
                if (st === "freeze") currentHasFreeze = true;
                if (st === "practiced") currentHasPracticed = true;
              }
            } else {
              if (currentStart !== null) {
                streakSpans.push({
                  start: currentStart,
                  end: col - 1,
                  count: col - currentStart,
                  hasFreeze: currentHasFreeze,
                  hasPracticed: currentHasPracticed,
                });
                currentStart = null;
                currentHasFreeze = false;
                currentHasPracticed = false;
              }
            }
          }
          if (currentStart !== null) {
            streakSpans.push({
              start: currentStart,
              end: 6,
              count: 7 - currentStart,
              hasFreeze: currentHasFreeze,
              hasPracticed: currentHasPracticed,
            });
          }

          return (
            <div key={weekIdx} className="relative grid grid-cols-7 h-10 items-center">
              {/* Connected streak pill backgrounds */}
              {streakSpans.map((span, sIdx) => {
                const isFullWeek = span.count === 7;
                const isMultiDay = span.count > 1;

                const leftPercent = (span.start / 7) * 100;
                const widthPercent = ((span.end - span.start + 1) / 7) * 100;

                // When a streak span contains a freeze (or is broken/past streak like Jan rows 2 & 5),
                // it renders with that soft warm yellowish background (#fff4cc) stretching across all days in the span!
                const isSoftPill =
                  span.hasFreeze ||
                  (!isFullWeek && span.start > 0 && span.end === 6);

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
                      <div className="h-full w-full rounded-full bg-[#fff4cc]" />
                    ) : isMultiDay ? (
                      <div className="relative h-full w-full rounded-full p-[2px] bg-[#ffd84d] shadow-[0_2px_8px_rgba(255,150,0,0.35)]">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-[#ff9600] via-[#ff7800] to-[#ff4b4b]" />
                      </div>
                    ) : (
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

                const insideSpan = streakSpans.find(
                  (s) => col >= s.start && col <= s.end,
                );
                const isSoftSpan =
                  insideSpan &&
                  (insideSpan.hasFreeze ||
                    (!insideSpan.hasFreeze &&
                      insideSpan.count < 7 &&
                      insideSpan.end === 6));
                const isGradientSpan =
                  insideSpan &&
                  !insideSpan.hasFreeze &&
                  insideSpan.count >= 2;

                const hasSparkle = date === 15 || date === 20;

                return (
                  <div
                    key={col}
                    className="relative flex h-10 w-full items-center justify-center"
                  >
                    {hasSparkle && isGradientSpan && (
                      <div className="pointer-events-none absolute -top-1 -right-1 z-20">
                        <SparkleSvg className="h-3.5 w-3.5 text-white animate-pulse" />
                      </div>
                    )}

                    {status === "freeze" ? (
                      // FREEZE ICE BADGE (1:1 with IMG_6308 - sitting right on top of streak pill)
                      <button
                        type="button"
                        disabled={!interactive}
                        onClick={(e) => handleDayClick(date, e)}
                        className="relative z-10 transition-transform active:scale-95 focus:outline-none"
                        title="Streak Freeze (Click to cycle)"
                      >
                        <FreezeIceBadge dayNumber={date} size={38} />
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
    </article>
  );
};
