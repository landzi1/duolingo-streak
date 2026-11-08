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
} from "~/components/Svgs";
import { TopBar } from "~/components/TopBar";
import { BottomBar } from "~/components/BottomBar";
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

// Tile Icon handler matching IMG_6309.PNG
const TileIcon = ({
  tileType,
  status,
  isFirstDumbbell = false,
}: {
  tileType: TileType;
  status: TileStatus;
  isFirstDumbbell?: boolean;
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
      // In IMG_6309.PNG, node 1 dumbbell has dark green icon angled at 45 deg on green puck
      if (isFirstDumbbell) {
        return (
          <div className="relative flex h-9 w-9 items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              className="rotate-45"
            >
              <rect x="16" y="8" width="4" height="20" rx="1.5" fill="white" />
              {/* Upper weights */}
              <rect x="11" y="6" width="14" height="5" rx="2.5" fill="#3b8702" />
              <rect x="13" y="3" width="10" height="3" rx="1.5" fill="#46a302" />
              {/* Lower weights */}
              <rect x="11" y="25" width="14" height="5" rx="2.5" fill="#3b8702" />
              <rect x="13" y="30" width="10" height="3" rx="1.5" fill="#46a302" />
            </svg>
          </div>
        );
      }
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
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M15 8V5C15 3.9 14.1 3 13 3H3C1.9 3 1 3.9 1 5V19C1 20.1 1.9 21 3 21H13C14.1 21 15 20.1 15 19V16L21 21V3L15 8Z" />
        </svg>
      );
    case "headphones":
      return (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 18V12C3 7 7 3 12 3C17 3 21 7 21 12V18" />
          <path
            d="M1 18C1 16.5 2 15 3.5 15H5C5.5 15 6 15.5 6 16V20C6 20.5 5.5 21 5 21H3.5C2 21 1 19.5 1 18Z"
            fill="white"
          />
          <path
            d="M23 18C23 16.5 22 15 20.5 15H19C18.5 15 18 15.5 18 16V20C18 20.5 18.5 21 19 21H20.5C22 21 23 19.5 23 18Z"
            fill="white"
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

// Curve positions matching IMG_6309.PNG:
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
  <div className="relative flex flex-col items-center select-none">
    <svg width="115" height="115" viewBox="0 0 100 100" fill="none">
      {/* Light circular shadow */}
      <ellipse cx="50" cy="88" rx="36" ry="10" fill="#e8eaed" />
      {/* Green body */}
      <ellipse cx="50" cy="56" rx="32" ry="32" fill="#58cc02" />
      {/* Face mask / lighter green */}
      <ellipse cx="50" cy="56" rx="28" ry="24" fill="#69db04" opacity="0.6" />
      {/* Sleepy / smug eyes looking right */}
      <ellipse cx="38" cy="52" rx="7" ry="5.5" fill="white" />
      <ellipse cx="40" cy="52" rx="3.5" ry="4" fill="#3c3c3c" />
      <path d="M30 49H45" stroke="#46a302" strokeWidth="2.5" strokeLinecap="round" />

      <ellipse cx="60" cy="52" rx="7" ry="5.5" fill="white" />
      <ellipse cx="62" cy="52" rx="3.5" ry="4" fill="#3c3c3c" />
      <path d="M53 49H68" stroke="#46a302" strokeWidth="2.5" strokeLinecap="round" />

      {/* Orange beak */}
      <path d="M46 58C46 56 54 56 54 58L50 63L46 58Z" fill="#ff9600" />
      {/* Orange feet */}
      <ellipse cx="43" cy="85" rx="5" ry="2.5" fill="#ff9600" />
      <ellipse cx="57" cy="85" rx="5" ry="2.5" fill="#ff9600" />

      {/* Potion Flask in Right Wing */}
      <g transform="translate(10, 32)">
        {/* Flask neck & rim */}
        <rect x="11" y="2" width="7" height="9" rx="1.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
        <ellipse cx="14.5" cy="2" rx="5" ry="1.5" fill="#cbd5e1" />
        {/* Flask bulb */}
        <circle cx="14.5" cy="23" r="15" fill="#e2e8f0" />
        <circle cx="14.5" cy="23" r="13.5" fill="#c084fc" />
        {/* Purple potion level */}
        <path d="M2 23C2 21 8 20 14.5 20C21 20 27 21 27 23C27 29.9 21.4 35.5 14.5 35.5C7.6 35.5 2 29.9 2 23Z" fill="#a855f7" />
        {/* Highlight arc on bulb */}
        <path d="M5 18C7 13 12 10 16 10" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        {/* Wing holding neck */}
        <ellipse cx="16" cy="11" rx="4.5" ry="3.5" fill="#58cc02" />
      </g>
    </svg>
    {/* Three faint grey stars in an arc underneath Duo */}
    <div className="mt-1 flex items-center justify-center gap-2 opacity-30">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af" className="-translate-y-1">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af" className="translate-y-1">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#9ca3af" className="-translate-y-1">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </div>
  </div>
);

// Wooden chest matching IMG_6309.PNG 1:1
export const Unit7WoodenChestSvg = () => (
  <div className="relative flex items-center justify-center">
    {/* Light grey rounded rectangle shadow underneath */}
    <div className="absolute -bottom-1 h-14 w-20 rounded-2xl bg-black/5" />
    <svg width="86" height="78" viewBox="0 0 90 84" fill="none">
      {/* Wooden Chest Body */}
      <rect x="15" y="24" width="60" height="48" rx="6" fill="#9b561c" />
      {/* Front panel dark inset */}
      <rect x="20" y="28" width="50" height="28" rx="3" fill="#6d390f" />
      {/* Bottom wooden plank */}
      <rect x="20" y="58" width="50" height="12" rx="2" fill="#c47728" />
      {/* Beige / Light Wood Metal Reinforcements */}
      <rect x="12" y="16" width="66" height="14" rx="4" fill="#fad6a5" />
      <path d="M12 24H78V28H12V24Z" fill="#e6bd88" />
      <rect x="13" y="16" width="7" height="60" rx="3" fill="#fad6a5" />
      <rect x="70" y="16" width="7" height="60" rx="3" fill="#fad6a5" />
      <rect x="13" y="68" width="64" height="8" rx="3" fill="#fad6a5" />
      {/* Center White Lock latch disk */}
      <circle cx="45" cy="24" r="8" fill="#ffffff" stroke="#fad6a5" strokeWidth="2.5" />
    </svg>
  </div>
);

// Floating Rounded Rectangle Down Button matching IMG_6309.PNG 1:1
export const FloatingScrollDownButton = () => (
  <div className="fixed bottom-24 z-20 mx-auto flex w-full max-w-md pointer-events-none justify-end pr-5">
    <button
      type="button"
      onClick={() => {
        window.scrollBy({ top: 400, behavior: "smooth" });
      }}
      className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-b-4 border-[#e5e5e5] bg-white shadow-md transition hover:bg-gray-50 active:scale-95"
      aria-label="Scroll down"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1cb0f6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 4V20M19 13L12 20L5 13" />
      </svg>
    </button>
  </div>
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

      <div className="relative mb-8 mt-2 flex max-w-2xl flex-col items-center gap-5">
        {/* Duo Mascot for Unit 7 (matching IMG_6309.PNG) */}
        {unit.unitNumber === 7 && (
          <div className="pointer-events-none absolute right-3 top-[310px] z-20">
            <DuoWithPotionSvg />
          </div>
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
                            "absolute m-3 rounded-full border-b-[8px] p-4 transition-transform active:translate-y-1 shadow-sm",
                            getTileColors({
                              tileType: tile.type,
                              status,
                              defaultColors: "border-[#46a302] bg-[#58cc02]",
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
                          <TileIcon
                            tileType={tile.type}
                            status={status}
                            isFirstDumbbell={unit.unitNumber === 7 && i === 0}
                          />
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
                        {unit.unitNumber === 7 ? (
                          <Unit7WoodenChestSvg />
                        ) : (
                          <TileIcon tileType={tile.type} status={status} />
                        )}
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

const Learn: NextPage = () => {
  const { loginScreenState, setLoginScreenState } = useLoginScreen();

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-white text-[#3c3c3c] antialiased shadow-2xl">
      <TopBar />

      <main className="flex-1 px-4 pt-16 pb-24">
        {units.map((unit) => (
          <UnitSection unit={unit} key={unit.unitNumber} />
        ))}
      </main>

      {/* Floating Scroll Down button matching IMG_6309.PNG 1:1 */}
      <FloatingScrollDownButton />

      <BottomBar selectedTab="Learn" />
      <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      />
    </div>
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

// Unit Header Banner matching IMG_6309.PNG 1:1
const UnitHeader = ({
  unitNumber,
  description: _description,
  backgroundColor: _backgroundColor,
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
    <article className="mb-4 max-w-2xl rounded-[26px] border-b-[6px] border-[#46a302] bg-[#58cc02] text-white shadow-sm">
      <header className="flex items-center justify-between p-4 px-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-black uppercase tracking-wider text-[#a6f250]">
            {subtitle}
          </span>
          <h2 className="text-2xl font-black text-white">{title}</h2>
        </div>
        <Link
          href={`https://duolingo.com/guidebook/${language.code}/${unitNumber}`}
          className="flex items-center justify-center border-l-2 border-[#46a302] pl-4 transition hover:opacity-90 active:scale-95"
          aria-label="Guidebook"
        >
          {/* Guidebook notebook icon with 3 spiral rings on left and 3 lines */}
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <rect x="7" y="3" width="18" height="22" rx="4" fill="white" />
            <rect x="3" y="6" width="6" height="3" rx="1.5" fill="#46a302" />
            <rect x="3" y="12" width="6" height="3" rx="1.5" fill="#46a302" />
            <rect x="3" y="18" width="6" height="3" rx="1.5" fill="#46a302" />
            <rect x="11" y="8" width="10" height="2.5" rx="1.25" fill="#58cc02" />
            <rect x="11" y="13" width="10" height="2.5" rx="1.25" fill="#58cc02" />
            <rect x="11" y="18" width="7" height="2.5" rx="1.25" fill="#58cc02" />
          </svg>
        </Link>
      </header>
    </article>
  );
};
