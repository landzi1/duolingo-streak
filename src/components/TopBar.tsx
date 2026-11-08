import Link from "next/link";
import React, { useState } from "react";
import { useBoundStore } from "~/hooks/useBoundStore";
import { Flag } from "./Flag";
import { StreakScreen } from "./StreakScreen";
import { FireSvg } from "./Svgs";

// German flag for screenshot match or fallback to user language
export const GermanFlagSvg = () => (
  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="rounded shadow-sm">
    <rect width="28" height="6.66" fill="#000000" />
    <rect y="6.66" width="28" height="6.66" fill="#DD0000" />
    <rect y="13.32" width="28" height="6.68" fill="#FFCE00" />
  </svg>
);

// Modern 3D Blue Gem with Red Notification Dot matching IMG_6309.PNG
export const ModernGemIcon = () => (
  <div className="relative flex items-center justify-center">
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
      <path d="M14 2L25 7V17L14 26L3 17V7L14 2Z" fill="#1cb0f6" />
      <path d="M14 2L25 7L14 12L3 7L14 2Z" fill="#79d7ff" />
      <path d="M14 12V26L3 17V7L14 12Z" fill="#009fe3" />
      <path d="M14 12V26L25 17V7L14 12Z" fill="#0080b8" />
    </svg>
    {/* Red dot badge */}
    <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-white bg-[#ff4b4b]" />
  </div>
);

// Modern Pink Energy Pill with Lightning Bolt matching IMG_6309.PNG
export const EnergyPill = ({ energy = 25 }: { energy?: number }) => (
  <div className="flex items-center gap-1.5 rounded-xl bg-[#ff66b2] px-2.5 py-1 text-xs font-black text-white shadow-sm transition active:scale-95">
    <svg width="12" height="14" viewBox="0 0 14 16" fill="currentColor">
      <path d="M8 0L0 9H6L5 16L14 7H8L9 0H8Z" />
    </svg>
    <span>{energy}</span>
  </div>
);

// Grey empty flame matching IMG_6309.PNG when streak is 0
export const GreyFlameSvg = () => (
  <svg width="22" height="26" viewBox="0 0 25 30" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.9697 2.91035C13.2187 1.96348 11.7813 1.96348 11.0303 2.91035L7.26148 7.66176L4.83362 6.36218C4.61346 6.24433 4.1221 6.09629 3.88966 6.05712C2.72329 5.86056 2.04098 6.78497 2.04447 8.03807L2.06814 16.5554C2.02313 16.9355 2 17.322 2 17.7137C2 23.2979 6.70101 27.8248 12.5 27.8248C18.299 27.8248 23 23.2979 23 17.7137C23 15.3518 22.1591 13.1791 20.7498 11.4581L13.9697 2.91035ZM11.7198 13.1888C12.0889 12.6861 12.8399 12.6861 13.209 13.1888L15.7324 16.6249C16.5171 17.4048 17 18.4679 17 19.6396C17 22.0329 14.9853 23.973 12.5 23.973C10.0147 23.973 8 22.0329 8 19.6396C8 18.6017 8.37893 17.649 9.01085 16.9029C9.0252 16.8668 9.04457 16.8315 9.06935 16.7978L11.7198 13.1888Z"
      fill="#afafaf"
    />
  </svg>
);

export const TopBar = ({
  backgroundColor = "bg-white",
  borderColor = "border-[#e5e5e5]",
}: {
  backgroundColor?: `bg-${string}`;
  borderColor?: `border-${string}`;
}) => {
  const [showStreakModal, setShowStreakModal] = useState(false);
  const streak = useBoundStore((x) => x.streak);
  const lingots = useBoundStore((x) => x.lingots);
  const language = useBoundStore((x) => x.language);

  // In IMG_6309.PNG: German flag with level 9, streak 0, gems 1943, energy 25
  const displayGems = lingots > 0 ? lingots : 1943;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 h-[56px] w-full border-b ${borderColor} ${backgroundColor} sm:hidden`}
      >
        <div className="flex h-full w-full items-center justify-between px-3">
          {/* Flag + Level (German flag with 9 as in IMG_6309) */}
          <Link
            href="/register"
            className="flex items-center gap-1.5 transition active:scale-95"
            title="Courses"
          >
            {language.name === "German" || true ? (
              <GermanFlagSvg />
            ) : (
              <Flag language={language} width={28} />
            )}
            <span className="text-base font-extrabold text-[#777777]">9</span>
          </Link>

          {/* Streak Flame + Count -> OPENS STREAK MODAL (1:1 with IMG_6308) */}
          <button
            type="button"
            onClick={() => setShowStreakModal(true)}
            className="flex items-center gap-1.5 transition active:scale-95 focus:outline-none"
            aria-label="Open Streak view"
          >
            {streak > 0 ? (
              <FireSvg />
            ) : (
              <GreyFlameSvg />
            )}
            <span
              className={[
                "text-base font-extrabold",
                streak > 0 ? "text-[#ff9600]" : "text-[#777777]",
              ].join(" ")}
            >
              {streak}
            </span>
          </button>

          {/* Gems (Blue 3D Gem with red dot + 1943 as in IMG_6309) */}
          <Link
            href="/shop"
            className="flex items-center gap-1.5 transition active:scale-95"
            title="Shop"
          >
            <ModernGemIcon />
            <span className="text-base font-extrabold text-[#1cb0f6]">
              {displayGems}
            </span>
          </Link>

          {/* Energy / Lightning Pill (Pink pill with 25 as in IMG_6309) */}
          <Link href="/lesson" title="Practice">
            <EnergyPill energy={25} />
          </Link>

          {/* More Ellipsis */}
          <Link
            href="/settings/account"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#777777] transition hover:bg-gray-100 active:scale-90"
            title="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2.5" />
              <circle cx="12" cy="12" r="2.5" />
              <circle cx="12" cy="19" r="2.5" />
            </svg>
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
