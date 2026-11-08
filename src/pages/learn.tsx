import { type NextPage } from "next";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  ActiveBookSvg,
  LockedBookSvg,
  CheckmarkSvg,
  LockedDumbbellSvg,
  FastForwardSvg,
  GoldenBookSvg,
  GoldenDumbbellSvg,
  GoldenTreasureSvg,
  GoldenTrophySvg,
  GuidebookSvg,
  LessonCompletionSvg0,
  LessonCompletionSvg1,
  LessonCompletionSvg2,
  LessonCompletionSvg3,
  LockSvg,
  StarSvg,
  LockedTreasureSvg,
  LockedTrophySvg,
  ActiveTreasureSvg,
  ActiveTrophySvg,
  ActiveDumbbellSvg,
  PracticeExerciseSvg,
} from "~/components/Svgs";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";
import { RightBar } from "~/components/RightBar";
import { LeftBar } from "~/components/LeftBar";
import { useRouter } from "next/router";
import { LoginScreen, useLoginScreen } from "~/components/LoginScreen";
import { useBoundStore } from "~/hooks/useBoundStore";
import type { Tile, TileType, Unit } from "~/utils/units";
import { units } from "~/utils/units";

type TileStatus = "LOCKED" | "ACTIVE" | "COMPLETE";

const tileStatus = (tile: Tile, lessonsCompleted: number): TileStatus => {
  const lessonsPerTile = 4;
  const tilesCompleted = Math.floor(lessonsCompleted / lessonsPerTile);
  const tiles = units.flatMap((unit) => unit.tiles);
  const tileIndex = tiles.findIndex((t) => t === tile);

  if (tileIndex < tilesCompleted) {
    return "COMPLETE";
  }
  if (tileIndex > tilesCompleted) {
    return "LOCKED";
  }
  return "ACTIVE";
};

// Tile Icon handler with Video and Headphones icons from IMG_6309.PNG
const TileIcon = ({
  tileType,
  status,
}: {
  tileType: TileType;
  status: TileStatus;
}): JSX.Element => {
  switch (tileType) {
    case "star":
      return status === "COMPLETE" ? (
        <CheckmarkSvg />
      ) : status === "ACTIVE" ? (
        <StarSvg />
      ) : (
        <LockSvg />
      );
    case "book":
      return status === "COMPLETE" ? (
        <GoldenBookSvg />
      ) : status === "ACTIVE" ? (
        <ActiveBookSvg />
      ) : (
        <LockedBookSvg />
      );
    case "dumbbell":
      return status === "COMPLETE" ? (
        <GoldenDumbbellSvg />
      ) : status === "ACTIVE" ? (
        <ActiveDumbbellSvg />
      ) : (
        <LockedDumbbellSvg />
      );
    case "fast-forward":
      return status === "COMPLETE" ? (
        <CheckmarkSvg />
      ) : status === "ACTIVE" ? (
        <StarSvg />
      ) : (
        <FastForwardSvg />
      );
    case "video":
      return (
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill={status === "LOCKED" ? "#afafaf" : "white"}
        >
          <path d="M15 8V5C15 3.9 14.1 3 13 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H13C14.1 21 15 20.1 15 19V16L21 21V3L15 8Z" />
        </svg>
      );
    case "headphones":
      return (
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke={status === "LOCKED" ? "#afafaf" : "white"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 18V12C3 7 7 3 12 3C17 3 21 7 21 12V18" />
          <path
            d="M1 18C1 16.5 2 15 3.5 15H5C5.5 15 6 15.5 6 16V20C6 20.5 5.5 21 5 21H3.5C2 21 1 19.5 1 18Z"
            fill={status === "LOCKED" ? "#afafaf" : "white"}
          />
          <path
            d="M23 18C23 16.5 22 15 20.5 15H19C18.5 15 18 15.5 18 16V20C18 20.5 18.5 21 19 21H20.5C22 21 23 19.5 23 18Z"
            fill={status === "LOCKED" ? "#afafaf" : "white"}
          />
        </svg>
      );
    case "treasure":
      return status === "COMPLETE" ? (
        <GoldenTreasureSvg />
      ) : status === "ACTIVE" ? (
        <ActiveTreasureSvg />
      ) : (
        <LockedTreasureSvg />
      );
    case "trophy":
      return status === "COMPLETE" ? (
        <GoldenTrophySvg />
      ) : status === "ACTIVE" ? (
        <ActiveTrophySvg />
      ) : (
        <LockedTrophySvg />
      );
  }
};

// Curve offsets matching IMG_6309.PNG:
// Node 0: right (55px), Node 1: right (30px), Node 2: center (0px),
// Node 3: left (-35px), Node 4: left (-60px), Node 5: left (-35px), Node 6: center (0px)
const unit7Offsets = [
  "left-[55px]",
  "left-[30px]",
  "left-0",
  "left-[-35px]",
  "left-[-60px]",
  "left-[-35px]",
  "left-0",
] as const;

const tileLeftClassNames = [
  "left-0",
  "left-[-45px]",
  "left-[-70px]",
  "left-[-45px]",
  "left-0",
  "left-[45px]",
  "left-[70px]",
  "left-[45px]",
] as const;

type TileLeftClassName = (typeof tileLeftClassNames)[number] | (typeof unit7Offsets)[number];

const getTileLeftClassName = ({
  index,
  unitNumber,
  tilesLength,
}: {
  index: number;
  unitNumber: number;
  tilesLength: number;
}): TileLeftClassName => {
  if (unitNumber === 7) {
    return unit7Offsets[index % unit7Offsets.length] ?? "left-0";
  }

  if (index >= tilesLength - 1) {
    return "left-0";
  }

  const classNames =
    unitNumber % 2 === 1
      ? tileLeftClassNames
      : [...tileLeftClassNames.slice(4), ...tileLeftClassNames.slice(0, 4)];

  return classNames[index % classNames.length] ?? "left-0";
};

const tileTooltipLeftOffsets = [140, 95, 70, 95, 140, 185, 210, 185] as const;

type TileTooltipLeftOffset = (typeof tileTooltipLeftOffsets)[number];

const getTileTooltipLeftOffset = ({
  index,
  unitNumber,
  tilesLength,
}: {
  index: number;
  unitNumber: number;
  tilesLength: number;
}): TileTooltipLeftOffset => {
  if (index >= tilesLength - 1) {
    return tileTooltipLeftOffsets[0];
  }

  const offsets =
    unitNumber % 2 === 1
      ? tileTooltipLeftOffsets
      : [
          ...tileTooltipLeftOffsets.slice(4),
          ...tileTooltipLeftOffsets.slice(0, 4),
        ];

  return offsets[index % offsets.length] ?? tileTooltipLeftOffsets[0];
};

const getTileColors = ({
  tileType,
  status,
  defaultColors,
}: {
  tileType: TileType;
  status: TileStatus;
  defaultColors: `border-${string} bg-${string}`;
}): `border-${string} bg-${string}` => {
  switch (status) {
    case "LOCKED":
      if (tileType === "fast-forward") return defaultColors;
      return "border-[#b7b7b7] bg-[#e5e5e5]";
    case "COMPLETE":
      return "border-yellow-500 bg-yellow-400";
    case "ACTIVE":
      return defaultColors;
  }
};

// Duo the Owl holding purple potion beaker next to active node
export const DuoWithPotionSvg = () => (
  <svg width="84" height="84" viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="90" rx="36" ry="7" fill="#e5e5e5" />
    <ellipse cx="52" cy="52" rx="30" ry="34" fill="#58cc02" />
    <path
      d="M28 24C28 24 35 18 45 22C45 22 55 16 65 22C75 18 82 24 82 24C82 24 84 38 80 48C76 58 70 65 70 65H35C35 65 29 58 25 48C21 38 28 24 28 24Z"
      fill="#58cc02"
    />
    <circle cx="42" cy="48" r="9" fill="white" />
    <circle cx="44" cy="48" r="4.5" fill="#1b4965" />
    <circle cx="62" cy="48" r="9" fill="white" />
    <circle cx="60" cy="48" r="4.5" fill="#1b4965" />
    <path
      d="M36 38L47 41"
      stroke="#46a302"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M68 38L57 41"
      stroke="#46a302"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path d="M48 51L52 57L56 51H48Z" fill="#FF9600" />
    <g transform="translate(14, 52)">
      <rect
        x="18"
        y="2"
        width="6"
        height="8"
        rx="1"
        fill="#e0e7ff"
        stroke="#a5b4fc"
        strokeWidth="1.5"
      />
      <circle
        cx="21"
        cy="19"
        r="13"
        fill="#c084fc"
        stroke="#a855f7"
        strokeWidth="1.5"
      />
      <path
        d="M12 17C14 15 18 16 21 16C24 16 28 15 30 17C29 26 25 30 21 30C17 30 13 26 12 17Z"
        fill="#9333ea"
      />
      <circle cx="17" cy="18" r="1.5" fill="white" opacity="0.6" />
      <circle cx="24" cy="22" r="2" fill="white" opacity="0.7" />
    </g>
    <ellipse cx="28" cy="62" rx="7" ry="5" fill="#46a302" />
    <ellipse cx="72" cy="62" rx="7" ry="5" fill="#46a302" />
  </svg>
);

// Witch Event Badge on left
export const WitchEventBadge = () => (
  <div className="flex flex-col items-center">
    <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#6d4bb5] bg-[#4b3382] shadow-md">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="24" r="10" fill="#fed7aa" />
        <circle cx="17" cy="24" r="1.5" fill="#3c3c3c" />
        <circle cx="23" cy="24" r="1.5" fill="#3c3c3c" />
        <path
          d="M10 24C10 30 14 34 20 34C26 34 30 30 30 24"
          stroke="#a855f7"
          strokeWidth="3"
          fill="none"
        />
        <path d="M20 4L28 18H12L20 4Z" fill="#311e5c" />
        <ellipse cx="20" cy="18" rx="14" ry="4" fill="#311e5c" />
        <path
          d="M14 17C14 17 17 19 20 19C23 19 26 17 26 17"
          stroke="#fbbf24"
          strokeWidth="2"
        />
        <circle cx="20" cy="17" r="2" fill="white" />
      </svg>
    </div>
    <div className="-mt-2 z-10 rounded-lg bg-[#2b1c4e] px-2 py-0.5 text-[10px] font-black uppercase text-white shadow">
      16 days
    </div>
  </div>
);

// Claim Purple Chest Badge on left
export const ClaimChestBadge = () => (
  <div className="flex flex-col items-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#a78bfa] bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-md">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <rect x="6" y="14" width="22" height="13" rx="2" fill="#5b21b6" />
        <path d="M6 14C6 11 9 9 17 9C25 9 28 11 28 14H6Z" fill="#7c3aed" />
        <rect x="9" y="9" width="3" height="18" fill="#fbbf24" />
        <rect x="22" y="9" width="3" height="18" fill="#fbbf24" />
        <circle cx="17" cy="16" r="3" fill="#fde047" />
      </svg>
    </div>
    <div className="-mt-2 z-10 rounded-lg bg-[#6d28d9] px-2 py-0.5 text-[10px] font-black uppercase text-white shadow">
      Claim
    </div>
  </div>
);

// Three grey stars underneath the wooden chest
export const ThreeGreyStars = () => (
  <div className="flex items-center justify-center gap-1.5 pt-1">
    {[0, 1, 2].map((i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#d1d5db">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ))}
  </div>
);

// Floating Blue Down Arrow Button
export const FloatingScrollDownButton = () => (
  <button
    type="button"
    onClick={() => {
      window.scrollBy({ top: 400, behavior: "smooth" });
    }}
    className="fixed bottom-24 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#e5e5e5] bg-white shadow-xl transition hover:bg-gray-50 active:scale-95"
    aria-label="Scroll down"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1cb0f6"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4V20M19 13L12 20L5 13" />
    </svg>
  </button>
);

const TileTooltip = ({
  selectedTile,
  index,
  unitNumber,
  tilesLength,
  description,
  status,
  closeTooltip,
}: {
  selectedTile: number | null;
  index: number;
  unitNumber: number;
  tilesLength: number;
  description: string;
  status: TileStatus;
  closeTooltip: () => void;
}) => {
  const tileTooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const containsTileTooltip = (event: MouseEvent) => {
      if (selectedTile !== index) return;
      const clickIsInsideTooltip = tileTooltipRef.current?.contains(
        event.target as Node,
      );
      if (clickIsInsideTooltip) return;
      closeTooltip();
    };

    window.addEventListener("click", containsTileTooltip, true);
    return () => window.removeEventListener("click", containsTileTooltip, true);
  }, [selectedTile, tileTooltipRef, closeTooltip, index]);

  const unit = units.find((unit) => unit.unitNumber === unitNumber);
  const activeBackgroundColor = unit?.backgroundColor ?? "bg-green-500";
  const activeTextColor = unit?.textColor ?? "text-green-500";

  return (
    <div
      className={[
        "relative h-0 w-full",
        index === selectedTile ? "" : "invisible",
      ].join(" ")}
      ref={tileTooltipRef}
    >
      <div
        className={[
          "absolute z-30 flex w-[300px] flex-col gap-4 rounded-xl p-4 font-bold transition-all duration-300",
          status === "ACTIVE"
            ? activeBackgroundColor
            : status === "LOCKED"
              ? "border-2 border-gray-200 bg-gray-100"
              : "bg-yellow-400",
          index === selectedTile ? "top-4 scale-100" : "-top-14 scale-0",
        ].join(" ")}
        style={{ left: `calc(50% - ${getTileTooltipLeftOffset({ index, unitNumber, tilesLength })}px)` }}
      >
        <div
          className={[
            "text-lg font-bold",
            status === "ACTIVE"
              ? "text-white"
              : status === "LOCKED"
                ? "text-gray-400"
                : "text-yellow-600",
          ].join(" ")}
        >
          {description}
        </div>
        {status === "ACTIVE" ? (
          <Link
            href="/lesson"
            className={[
              "flex w-full items-center justify-center rounded-xl border-b-4 border-gray-200 bg-white p-3 uppercase",
              activeTextColor,
            ].join(" ")}
          >
            Start +10 XP
          </Link>
        ) : status === "LOCKED" ? (
          <button
            className="w-full rounded-xl bg-gray-200 p-3 uppercase text-gray-400"
            disabled
          >
            Locked
          </button>
        ) : (
          <Link
            href="/lesson"
            className="flex w-full items-center justify-center rounded-xl border-b-4 border-yellow-200 bg-white p-3 uppercase text-yellow-400"
          >
            Practice +5 XP
          </Link>
        )}
      </div>
    </div>
  );
};

const UnitSection = ({ unit }: { unit: Unit }): JSX.Element => {
  const router = useRouter();

  const [selectedTile, setSelectedTile] = useState<null | number>(null);

  useEffect(() => {
    const unselectTile = () => setSelectedTile(null);
    window.addEventListener("scroll", unselectTile);
    return () => window.removeEventListener("scroll", unselectTile);
  }, []);

  const closeTooltip = useCallback(() => setSelectedTile(null), []);

  const lessonsCompleted = useBoundStore((x) => x.lessonsCompleted);
  const increaseLessonsCompleted = useBoundStore(
    (x) => x.increaseLessonsCompleted,
  );
  const increaseLingots = useBoundStore((x) => x.increaseLingots);

  return (
    <>
      <UnitHeader
        unitNumber={unit.unitNumber}
        description={unit.description}
        backgroundColor={unit.backgroundColor}
        borderColor={unit.borderColor}
      />

      <div className="relative mb-8 mt-4 flex max-w-2xl flex-col items-center gap-4">
        {/* Floating Badges & Mascot for Unit 7 (matching IMG_6309.PNG) */}
        {unit.unitNumber === 7 && (
          <>
            {/* Left side event badges */}
            <div className="absolute left-2 top-8 z-20 flex flex-col gap-4 sm:left-8">
              <WitchEventBadge />
              <ClaimChestBadge />
            </div>

            {/* Duo Mascot holding purple potion flask next to Node 4 (Star) */}
            <div className="pointer-events-none absolute left-[55%] top-[290px] z-20">
              <DuoWithPotionSvg />
            </div>
          </>
        )}

        {unit.tiles.map((tile, i): JSX.Element => {
          const status = tileStatus(tile, lessonsCompleted);
          return (
            <Fragment key={i}>
              {(() => {
                switch (tile.type) {
                  case "star":
                  case "book":
                  case "dumbbell":
                  case "trophy":
                  case "fast-forward":
                  case "video":
                  case "headphones":
                    if (tile.type === "trophy" && status === "COMPLETE") {
                      return (
                        <div className="relative">
                          <TileIcon tileType={tile.type} status={status} />
                          <div className="absolute left-0 right-0 top-6 flex justify-center text-lg font-bold text-yellow-700">
                            {unit.unitNumber}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        className={[
                          "relative -mb-4 h-[93px] w-[98px]",
                          getTileLeftClassName({
                            index: i,
                            unitNumber: unit.unitNumber,
                            tilesLength: unit.tiles.length,
                          }),
                        ].join(" ")}
                      >
                        {tile.type === "fast-forward" && status === "LOCKED" ? (
                          <HoverLabel
                            text="Jump here?"
                            textColor={unit.textColor}
                          />
                        ) : selectedTile !== i && status === "ACTIVE" ? (
                          <HoverLabel text="Start" textColor={unit.textColor} />
                        ) : null}
                        <LessonCompletionSvg
                          lessonsCompleted={lessonsCompleted}
                          status={status}
                        />
                        <button
                          className={[
                            "absolute m-3 rounded-full border-b-8 p-4 transition-transform active:translate-y-1",
                            getTileColors({
                              tileType: tile.type,
                              status,
                              defaultColors: `${unit.borderColor} ${unit.backgroundColor}`,
                            }),
                          ].join(" ")}
                          onClick={() => {
                            if (
                              tile.type === "fast-forward" &&
                              status === "LOCKED"
                            ) {
                              void router.push(
                                `/lesson?fast-forward=${unit.unitNumber}`,
                              );
                              return;
                            }
                            setSelectedTile(i);
                          }}
                        >
                          <TileIcon tileType={tile.type} status={status} />
                          <span className="sr-only">Show lesson</span>
                        </button>
                      </div>
                    );
                  case "treasure":
                    return (
                      <div
                        className={[
                          "relative -mb-4 flex flex-col items-center",
                          getTileLeftClassName({
                            index: i,
                            unitNumber: unit.unitNumber,
                            tilesLength: unit.tiles.length,
                          }),
                        ].join(" ")}
                        onClick={() => {
                          if (status === "ACTIVE") {
                            increaseLessonsCompleted(4);
                            increaseLingots(1);
                          }
                        }}
                        role="button"
                        tabIndex={status === "ACTIVE" ? 0 : undefined}
                        aria-hidden={status !== "ACTIVE"}
                        aria-label={status === "ACTIVE" ? "Collect reward" : ""}
                      >
                        {status === "ACTIVE" && (
                          <HoverLabel text="Open" textColor="text-yellow-400" />
                        )}
                        <TileIcon tileType={tile.type} status={status} />
                        {/* 3 grey stars underneath chest as in IMG_6309 */}
                        <ThreeGreyStars />
                      </div>
                    );
                }
              })()}
              <TileTooltip
                selectedTile={selectedTile}
                index={i}
                unitNumber={unit.unitNumber}
                tilesLength={unit.tiles.length}
                description={(() => {
                  switch (tile.type) {
                    case "book":
                    case "dumbbell":
                    case "star":
                    case "video":
                    case "headphones":
                      return tile.description;
                    case "fast-forward":
                      return status === "LOCKED"
                        ? "Jump here?"
                        : tile.description;
                    default:
                      return "";
                  }
                })()}
                status={status}
                closeTooltip={closeTooltip}
              />
            </Fragment>
          );
        })}
      </div>
    </>
  );
};

const getTopBarColors = (
  _scrollY: number,
): {
  backgroundColor: `bg-${string}`;
  borderColor: `border-${string}`;
} => {
  const defaultColors = {
    backgroundColor: "bg-white",
    borderColor: "border-[#e5e5e5]",
  } as const;

  return defaultColors;
};

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const updateScrollY = () => setScrollY(globalThis.scrollY ?? scrollY);
    updateScrollY();
    document.addEventListener("scroll", updateScrollY);
    return () => document.removeEventListener("scroll", updateScrollY);
  }, [scrollY]);

  const topBarColors = getTopBarColors(scrollY);

  return (
    <>
      <TopBar
        backgroundColor={topBarColors.backgroundColor}
        borderColor={topBarColors.borderColor}
      />
      <LeftBar selectedTab="Learn" />

      <div className="flex justify-center gap-3 pt-14 sm:p-6 sm:pt-10 md:ml-24 lg:ml-64 lg:gap-12">
        <div className="flex max-w-2xl grow flex-col">
          {units.map((unit) => (
            <UnitSection unit={unit} key={unit.unitNumber} />
          ))}
          <div className="sticky bottom-28 left-0 right-0 flex items-end justify-between">
            <Link
              href="/lesson?practice"
              className="absolute left-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:left-0"
            >
              <span className="sr-only">Practice exercise</span>
              <PracticeExerciseSvg className="h-8 w-8" />
            </Link>
            {scrollY > 100 && (
              <button
                className="absolute right-4 flex h-14 w-14 items-center justify-center self-end rounded-2xl border-2 border-b-4 border-gray-200 bg-white transition hover:bg-gray-50 hover:brightness-90 md:right-0"
                onClick={() => scrollTo(0, 0)}
              >
                <span className="sr-only">Jump to top</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1cb0f6"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20V4M5 11L12 4L19 11" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <RightBar />
      </div>

      {/* Floating Scroll Down button matching IMG_6309.PNG */}
      <FloatingScrollDownButton />

      <div className="pt-[90px]"></div>

      <BottomBar selectedTab="Learn" />
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </>
  );
};

export default Learn;

const LessonCompletionSvg = ({
  lessonsCompleted,
  status,
  style = {},
}: {
  lessonsCompleted: number;
  status: TileStatus;
  style?: React.HTMLAttributes<SVGElement>["style"];
}) => {
  if (status !== "ACTIVE") {
    return null;
  }
  switch (lessonsCompleted % 4) {
    case 0:
      return <LessonCompletionSvg0 style={style} />;
    case 1:
      return <LessonCompletionSvg1 style={style} />;
    case 2:
      return <LessonCompletionSvg2 style={style} />;
    case 3:
      return <LessonCompletionSvg3 style={style} />;
    default:
      return null;
  }
};

const HoverLabel = ({
  text,
  textColor,
}: {
  text: string;
  textColor: `text-${string}`;
}) => {
  const hoverElement = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(72);

  useEffect(() => {
    setWidth(hoverElement.current?.clientWidth ?? width);
  }, [hoverElement.current?.clientWidth, width]);

  return (
    <div
      className={`absolute z-10 w-max animate-bounce rounded-lg border-2 border-gray-200 bg-white px-3 py-2 font-bold uppercase ${textColor}`}
      style={{
        top: "-25%",
        left: `calc(50% - ${width / 2}px)`,
      }}
      ref={hoverElement}
    >
      {text}
      <div
        className="absolute h-3 w-3 rotate-45 border-b-2 border-r-2 border-gray-200 bg-white"
        style={{ left: "calc(50% - 8px)", bottom: "-8px" }}
      ></div>
    </div>
  );
};

// Unit Header Banner matching IMG_6309.PNG
const UnitHeader = ({
  unitNumber,
  description: _description,
  backgroundColor,
  borderColor: _borderColor,
}: {
  unitNumber: number;
  description: string;
  backgroundColor: `bg-${string}`;
  borderColor: `border-${string}`;
}) => {
  const language = useBoundStore((x) => x.language);
  const unit = units.find((u) => u.unitNumber === unitNumber);
  const subtitle = unit?.description ?? `SECTION 1, UNIT ${unitNumber}`;
  const title = unit?.title ?? `Unit ${unitNumber}`;

  return (
    <article
      className={[
        "max-w-2xl text-white rounded-2xl shadow-sm mb-4",
        backgroundColor,
      ].join(" ")}
    >
      <header className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#bbf276]">
            {subtitle}
          </span>
          <h2 className="text-xl font-black text-white">{title}</h2>
        </div>
        <Link
          href={`https://duolingo.com/guidebook/${language.code}/${unitNumber}`}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-b-4 border-[#46a302] bg-[#58cc02] text-white transition hover:brightness-105 active:border-b-2 shadow-sm"
          aria-label="Guidebook"
        >
          <GuidebookSvg />
        </Link>
      </header>
    </article>
  );
};
