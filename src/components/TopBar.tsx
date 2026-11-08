import Link from "next/link";
import React, { useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { StreakScreen } from "./StreakScreen";
import { FireSvg } from "./Svgs";

// German flag matching IMG_6309.PNG 1:1
export const GermanFlagSvg = () => (
  <svg width="34" height="24" viewBox="0 0 34 24" fill="none" className="rounded-md shadow-sm">
    <rect width="34" height="8" fill="#262626" />
    <rect y="8" width="34" height="8" fill="#FF4B4B" />
    <rect y="16" width="34" height="8" fill="#FFC800" />
  </svg>
);

// Grey Flame matching IMG_6309.PNG (0 streak)
export const DuolingoGreyFlameSvg = () => (
  <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.5 2.5C13.8 1.5 12.2 1.5 11.5 2.5L7.5 7.8L5 6.5C4.2 6.1 3.2 6.7 3.2 7.7V17.5C3.2 23.3 7.8 28 13.5 28C19.2 28 23.8 23.3 23.8 17.5C23.8 15 22.8 12.7 21.2 11L14.5 2.5ZM12.2 13.2C12.6 12.7 13.4 12.7 13.8 13.2L16.5 17C17.2 17.8 17.6 18.9 17.6 20C17.6 22.2 15.8 24 13.5 24C11.2 24 9.4 22.2 9.4 20C9.4 18.9 9.8 17.8 10.5 17L12.2 13.2Z"
      fill="#A0A0A0"
    />
  </svg>
);

// Blue 3D Isometric Gem with red notification dot matching IMG_6309.PNG 1:1
export const Duolingo3DGem = () => (
  <div className="relative flex items-center justify-center">
    <svg width="28" height="30" viewBox="0 0 28 30" fill="none">
      {/* Gem body */}
      <path d="M14 2L26 8V20L14 28L2 20V8L14 2Z" fill="#1cb0f6" />
      {/* Top light facet */}
      <path d="M14 2L26 8L14 14L2 8L14 2Z" fill="#84d8ff" />
      {/* Left shaded facet */}
      <path d="M14 14V28L2 20V8L14 14Z" fill="#009fe3" />
      {/* Right darker facet */}
      <path d="M14 14V28L26 20V8L14 14Z" fill="#0083ba" />
    </svg>
    {/* Red notification dot */}
    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#ff4b4b]" />
  </div>
);

// Pink Battery with lightning bolt matching IMG_6309.PNG 1:1
export const DuolingoBatteryPill = () => (
  <div className="relative flex items-center">
    <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
      {/* Battery body */}
      <rect x="0" y="0" width="30" height="22" rx="7" fill="#FF70BA" />
      {/* Battery positive terminal nub */}
      <rect x="30" y="7" width="3" height="8" rx="1.5" fill="#FF70BA" />
      {/* Light shine on top left */}
      <path
        d="M5 3C2.5 3 2 4.5 2 7V15C2 7 6 3 14 3H5Z"
        fill="white"
        fillOpacity="0.3"
      />
      {/* White lightning bolt inside battery */}
      <path
        d="M16.5 3.5L10 12H15L14 18.5L21 9.5H16L16.5 3.5Z"
        fill="white"
      />
    </svg>
  </div>
);

export const TopBar = ({
  backgroundColor = "bg-white",
  borderColor = "border-transparent",
}: {
  backgroundColor?: `bg-${string}`;
  borderColor?: `border-${string}`;
}) => {
  const [showStreakModal, setShowStreakModal] = useState(false);
  const streak = useBoundStore((x) => x.streak);
  const lingots = useBoundStore((x) => x.lingots);

  const displayGems = lingots > 0 ? lingots : 1943;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 mx-auto h-[56px] w-full max-w-md ${backgroundColor} ${borderColor}`}
      >
        <div className="flex h-full w-full items-center justify-around px-4">
          {/* Flag + Level: German flag with 9 */}
          <Link
            href="/register"
            className="flex items-center gap-2 transition active:scale-95"
            title="Courses"
          >
            <GermanFlagSvg />
            <span className="text-xl font-extrabold text-[#4b4b4b]">9</span>
          </Link>

          {/* Streak Flame + Count -> OPENS STREAK MODAL (1:1 with IMG_6308) */}
          <button
            type="button"
            onClick={() => setShowStreakModal(true)}
            className="flex items-center gap-2 transition active:scale-95 focus:outline-none"
            aria-label="Open Streak view"
          >
            {streak > 0 ? (
              <FireSvg />
            ) : (
              <DuolingoGreyFlameSvg />
            )}
            <span
              className={[
                "text-xl font-extrabold",
                streak > 0 ? "text-[#ff9600]" : "text-[#4b4b4b]",
              ].join(" ")}
            >
              {streak}
            </span>
          </button>

          {/* Gems (Blue 3D Gem with red dot + 1943) */}
          <Link
            href="/shop"
            className="flex items-center gap-2 transition active:scale-95"
            title="Shop"
          >
            <Duolingo3DGem />
            <span className="text-xl font-extrabold text-[#1cb0f6]">
              {displayGems}
            </span>
          </Link>

          {/* Energy / Lightning Battery (Pink battery + 25) */}
          <Link
            href="/lesson"
            className="flex items-center gap-2 transition active:scale-95"
            title="Practice"
          >
            <DuolingoBatteryPill />
            <span className="text-xl font-extrabold text-[#ff70ba]">
              25
            </span>
          </Link>
        </div>
      </header>

      {/* Full-screen Streak Modal (Identical to IMG_6308.PNG) */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative h-full w-full max-w-md overflow-y-auto bg-white shadow-2xl">
            <StreakScreen onClose={() => setShowStreakModal(false)} />
          </div>
        </div>
      )}
    </>
  );
};
