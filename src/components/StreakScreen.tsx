import dayjs from "dayjs";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useBoundStore } from "~/hooks/useBoundStore";
import { Calendar, FreezeIceBadge } from "./Calendar";
import { ChevronLeftSvg, ChevronRightSvg } from "./Svgs";

// Orange checkmark circle icon for "Days practiced" card
export const PracticedCheckmarkIcon = () => (
  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff9600] shadow-sm">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// Large Flame silhouette / outline as seen in IMG_6308.PNG
export const HeroFlameIcon = ({ active }: { active: boolean }) => (
  <svg
    width="105"
    height="125"
    viewBox="0 0 105 125"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-all duration-300"
  >
    {active ? (
      <g filter="drop-shadow(0 4px 12px rgba(255, 150, 0, 0.4))">
        <path
          d="M62 4C58.5 0 52 0 48.5 4L32 21C26 27 18 36 12 47C3.5 62 0 78 5 95C10 112 24 122 42 124C65 126 87 114 97 93C106 73 103 52 92 37L62 4Z"
          fill="url(#fire_grad)"
        />
        <path
          d="M51 45C49 42 45 42 43 45L34 57C30 62 27 68 28 75C29 86 38 95 49 95C60 95 69 86 70 75C71 67 67 60 62 55L51 45Z"
          fill="#FFF275"
        />
        <defs>
          <linearGradient
            id="fire_grad"
            x1="52"
            y1="2"
            x2="52"
            y2="125"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF9600" />
            <stop offset="0.6" stopColor="#FF6600" />
            <stop offset="1" stopColor="#FF3300" />
          </linearGradient>
        </defs>
      </g>
    ) : (
      <path
        d="M60 12C57.5 9 53 9 50.5 12L37 26C31.5 31.5 24.5 39.5 19.5 49C12 62.5 9.5 76 13.5 90C17.5 104 29 112.5 44 114.5C63 116.5 81.5 106.5 90 89C97.5 72.5 95 54.5 86 42L60 12ZM49 50C50 48.5 53 48.5 54 50L62 61C66 66 68.5 71.5 67.5 78C66 86 59 93 50.5 93C42 93 35.5 86 35 78C34.5 71.5 37 66 41 61L49 50Z"
        fill="#fbe7be"
      />
    )}
  </svg>
);

export const StreakScreen = ({
  onClose,
  initialMonth = dayjs("2026-01-01"),
}: {
  onClose?: () => void;
  initialMonth?: dayjs.Dayjs;
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"PERSONAL" | "FRIENDS">("PERSONAL");
  const [now, setNow] = useState(initialMonth);

  const streak = useBoundStore((x) => x.streak);
  const customStreak = useBoundStore((x) => x.customStreak);
  const setCustomStreak = useBoundStore((x) => x.setCustomStreak);
  const getDaysPracticedInMonth = useBoundStore(
    (x) => x.getDaysPracticedInMonth,
  );
  const getFreezesUsedInMonth = useBoundStore((x) => x.getFreezesUsedInMonth);
  const getMonthStreak = useBoundStore((x) => x.getMonthStreak);

  const daysPracticed = getDaysPracticedInMonth(now);
  const freezesUsed = getFreezesUsedInMonth(now);

  const isJan2026 = now.format("YYYY-MM") === "2026-01";
  const displayedStreak =
    customStreak !== null
      ? customStreak
      : isJan2026 && streak === 0
        ? 0
        : getMonthStreak(now);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      void router.push("/learn");
    }
  };

  const handleStreakNumberClick = () => {
    const val = prompt(
      "Set streak number (or leave empty for automatic Duolingo calculation):",
      customStreak !== null ? String(customStreak) : "",
    );
    if (val === null) return;
    if (val.trim() === "") setCustomStreak(null);
    else {
      const num = parseInt(val, 10);
      if (!isNaN(num)) setCustomStreak(num);
    }
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white text-[#3c3c3c] antialiased shadow-xl">
      {/* Top Header Bar */}
      <header className="relative flex items-center justify-between bg-[#fef6ea] px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#3c3c3c] transition hover:bg-black/5 active:scale-90"
          aria-label="Close streak modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="stroke-current"
            strokeWidth="2.8"
            strokeLinecap="round"
          >
            <path d="M4 4L16 16M16 4L4 16" />
          </svg>
        </button>

        <h1 className="text-xl font-extrabold tracking-tight text-[#3c3c3c]">
          Streak
        </h1>

        <div className="w-10" />
      </header>

      {/* Tabs Row: PERSONAL / FRIENDS */}
      <nav className="flex w-full border-b border-[#e5e5e5] bg-[#fef6ea]">
        <button
          type="button"
          onClick={() => setActiveTab("PERSONAL")}
          className="relative flex-1 py-3 text-center text-sm font-extrabold tracking-wider transition"
        >
          <span
            className={
              activeTab === "PERSONAL" ? "text-[#1cb0f6]" : "text-[#777777]"
            }
          >
            PERSONAL
          </span>
          {activeTab === "PERSONAL" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#1cb0f6]" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("FRIENDS")}
          className="relative flex-1 py-3 text-center text-sm font-extrabold tracking-wider transition"
        >
          <span
            className={
              activeTab === "FRIENDS" ? "text-[#1cb0f6]" : "text-[#777777]"
            }
          >
            FRIENDS
          </span>
          {activeTab === "FRIENDS" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#1cb0f6]" />
          )}
        </button>
      </nav>

      {activeTab === "PERSONAL" ? (
        <div className="flex flex-1 flex-col">
          {/* Cream / Beige Hero Section with Big Streak Number & Flame */}
          <div className="flex items-center justify-between bg-[#fef6ea] px-6 py-8">
            <button
              type="button"
              onClick={handleStreakNumberClick}
              className="flex flex-col text-left transition hover:opacity-80 active:scale-95 focus:outline-none"
              title="Click to change streak number"
            >
              <span
                className={[
                  "text-6xl font-extrabold tracking-tight sm:text-7xl",
                  displayedStreak > 0 ? "text-[#ff9600]" : "text-[#e5ba64]",
                ].join(" ")}
              >
                {displayedStreak}
              </span>
              <span
                className={[
                  "mt-1 text-lg font-extrabold",
                  displayedStreak > 0 ? "text-[#ff9600]" : "text-[#e5ba64]",
                ].join(" ")}
              >
                day streak!
              </span>
            </button>

            <div className="pr-4">
              <HeroFlameIcon active={displayedStreak > 0} />
            </div>
          </div>

          {/* White Bottom Content Section */}
          <div className="flex flex-1 flex-col bg-white px-4 pt-5 pb-10">
            {/* Month & Chevrons Navigation */}
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-2xl font-extrabold text-[#3c3c3c]">
                {now.format("MMMM YYYY")}
              </h2>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setNow((prev) => prev.add(-1, "month"))}
                  className="p-1 text-gray-400 transition hover:text-gray-600 active:scale-90"
                  aria-label="Previous month"
                >
                  <ChevronLeftSvg />
                </button>
                <button
                  type="button"
                  onClick={() => setNow((prev) => prev.add(1, "month"))}
                  className="p-1 text-gray-400 transition hover:text-gray-600 active:scale-90"
                  aria-label="Next month"
                >
                  <ChevronRightSvg />
                </button>
              </div>
            </div>

            {/* Two Statistics Cards (Days practiced & Freezes used) */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              {/* Card 1: Days practiced */}
              <div className="flex flex-col justify-between rounded-2xl border-2 border-[#e5e5e5] bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <PracticedCheckmarkIcon />
                  <span className="text-xl font-extrabold text-[#3c3c3c]">
                    {daysPracticed}
                  </span>
                </div>
                <span className="mt-2 text-xs font-semibold text-[#777777]">
                  Days practiced
                </span>
              </div>

              {/* Card 2: Freezes used (1:1 matching IMG_6308) */}
              <div className="flex flex-col justify-between rounded-2xl border-2 border-[#e5e5e5] bg-white p-3.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <FreezeIceBadge size={28} />
                  <span className="text-xl font-extrabold text-[#3c3c3c]">
                    {freezesUsed}
                  </span>
                </div>
                <span className="mt-2 text-xs font-semibold text-[#777777]">
                  Freezes used
                </span>
              </div>
            </div>

            {/* The Calendar Card */}
            <Calendar now={now} />

            {/* Streak Society Section */}
            <div className="mt-6 flex flex-col">
              <h3 className="mb-3 text-xl font-extrabold text-[#3c3c3c]">
                Streak Society
              </h3>
              <div className="flex items-center gap-4 rounded-3xl border-2 border-[#e5e5e5] bg-white p-4 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff9600] to-[#ff4b4b] text-white shadow-md">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-base font-extrabold text-[#3c3c3c]">
                    Join at 7 days!
                  </span>
                  <span className="text-xs font-semibold text-[#777777]">
                    Keep your streak alive to unlock exclusive VIP rewards, app
                    icons and extra freezes.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* FRIENDS TAB */
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fef6ea]">
            <HeroFlameIcon active={false} />
          </div>
          <h3 className="text-xl font-extrabold text-[#3c3c3c]">
            Friends Streaks
          </h3>
          <p className="mt-2 max-w-xs text-sm font-semibold text-[#777777]">
            Add friends on Duolingo to celebrate streak milestones together!
          </p>
          <button
            type="button"
            onClick={() => void router.push("/leaderboard")}
            className="mt-6 rounded-2xl border-b-4 border-blue-600 bg-[#1cb0f6] px-6 py-3 font-extrabold uppercase text-white transition hover:brightness-110 active:scale-95"
          >
            Find Friends
          </button>
        </div>
      )}
    </div>
  );
};
