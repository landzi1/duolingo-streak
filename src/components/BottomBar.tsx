import Link from "next/link";
import { useBoundStore } from "~/hooks/useBoundStore";

export type Tab =
  | "Learn"
  | "Shop"
  | "Profile"
  | "Leaderboards"
  | "Quests"
  | "Practice"
  | "More";

export type BottomBarItem = {
  name: Tab;
  href: string;
  icon: JSX.Element;
};

// 1. Home Birdhouse (Active tab style matching IMG_6309.PNG 1:1)
export const HomeIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    {/* Yellow House Base */}
    <path
      d="M26.5 27.5C26.2 29.2 24.8 30.5 23 30.5H11C9.2 30.5 7.8 29.2 7.5 27.5L5 13.5L17 4.5L29 13.5L26.5 27.5Z"
      fill="#FFC800"
    />
    {/* Round entrance hole */}
    <circle cx="17" cy="18" r="4.5" fill="#8B4513" />
    {/* Small horizontal slit below hole */}
    <rect x="13.5" y="24" width="7" height="2" rx="1" fill="#8B4513" />
    {/* Red Roof */}
    <path
      d="M17 2.5C17.5 2.5 18 2.7 18.5 3L31.5 13C32.5 13.8 32.7 15.3 32 16.3C31.2 17.3 29.7 17.5 28.7 16.7L17 7.5L5.3 16.7C4.3 17.5 2.8 17.3 2 16.3C1.2 15.3 1.4 13.8 2.5 13L15.5 3C16 2.7 16.5 2.5 17 2.5Z"
      fill="#FF4B4B"
    />
  </svg>
);

// 2. Wooden Chest (Icon 2 on IMG_6309.PNG)
export const WoodenChestBarIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    {/* Brown chest body */}
    <rect x="7" y="9" width="20" height="17" rx="3" fill="#A0522D" />
    <rect x="7" y="15" width="20" height="2" fill="#6B3410" />
    {/* Yellow side brackets/handles */}
    <rect x="5" y="7" width="3.5" height="21" rx="1.5" fill="#FFC800" />
    <rect x="25.5" y="7" width="3.5" height="21" rx="1.5" fill="#FFC800" />
    {/* Gold lock latch */}
    <rect x="14" y="12" width="6" height="7" rx="1.5" fill="#FFC800" />
    <circle cx="17" cy="15" r="1.5" fill="#8B4513" />
    <rect x="16.2" y="15" width="1.6" height="2.5" fill="#8B4513" />
  </svg>
);

// 3. Brown Trophy / Pedestal (Icon 3 on IMG_6309.PNG)
export const BrownTrophyBarIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    {/* Base pedestal */}
    <rect x="12" y="27" width="10" height="3" rx="1.5" fill="#A0522D" />
    <path d="M14.5 24L15.5 27H18.5L19.5 24H14.5Z" fill="#A0522D" />
    {/* Three-lobed scallop cup */}
    <path
      d="M7 11C7 8.5 9 6.5 11.5 6.5C13.5 6.5 15.2 7.8 15.8 9.5C16.4 7.8 18 6.5 20 6.5C22.5 6.5 24.5 8.5 24.5 11C24.5 12 24.2 13 23.5 13.8C25.5 14.5 27 16.5 27 19C27 22.5 24 24.5 19 24.5H15C10 24.5 7 22.5 7 19C7 16.5 8.5 14.5 10.5 13.8C9.8 13 7 12 7 11Z"
      fill="#A0522D"
    />
  </svg>
);

// 4. Pink Speech Bubble with Heart (Icon 4 on IMG_6309.PNG)
export const PinkHeartSpeechBubbleIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    {/* Pink speech bubble body with bottom tail */}
    <path
      d="M5 8C5 5.2 7.2 3 10 3H24C26.8 3 29 5.2 29 8V22C29 24.8 26.8 27 24 27H19L17 31L15 27H10C7.2 27 5 24.8 5 22V8Z"
      fill="#FF70BA"
    />
    {/* White heart in center */}
    <path
      d="M17 21.5C17 21.5 11 17.5 11 12.5C11 10.5 12.5 9 14.5 9C15.8 9 16.6 9.7 17 10.5C17.4 9.7 18.2 9 19.5 9C21.5 9 23 10.5 23 12.5C23 17.5 17 21.5 17 21.5Z"
      fill="white"
    />
  </svg>
);

// 5. Flying Gradient Duo Bird (Icon 5 on IMG_6309.PNG)
export const FlyingBirdIcon = () => (
  <div className="relative flex h-8 w-8 items-center justify-center">
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <defs>
        <linearGradient id="bird_grad" x1="17" y1="4" x2="17" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00E676" />
          <stop offset="0.5" stopColor="#1CB0F6" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      {/* Bird body shape */}
      <path
        d="M24 10C24 6 18 4 12 7C8 9 6 13 8 18C9.5 21 14 25 18 24C22 23 25 19 25 15L27 16L28 14L24 10Z"
        fill="url(#bird_grad)"
      />
      {/* Floating wing feathers */}
      <circle cx="6" cy="18" r="2" fill="#7C3AED" />
      <circle cx="21" cy="26" r="2" fill="#7C3AED" />
      {/* Eye */}
      <circle cx="22" cy="14" r="3.5" fill="white" />
      <circle cx="23" cy="14" r="1.8" fill="#1B4965" />
      {/* Orange Beak */}
      <path d="M25 15L28 17L25 18V15Z" fill="#FFA500" />
    </svg>
  </div>
);

// 6. Purple Ellipsis Circle (Icon 6 on IMG_6309.PNG)
export const PurpleMoreCircleIcon = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C084FC] shadow-sm">
    <svg width="18" height="6" viewBox="0 0 18 6" fill="white">
      <circle cx="3" cy="3" r="2" />
      <circle cx="9" cy="3" r="2" />
      <circle cx="15" cy="3" r="2" />
    </svg>
  </div>
);

export const useBottomBarItems = (): BottomBarItem[] => {
  const loggedIn = useBoundStore((x) => x.loggedIn);

  const items: BottomBarItem[] = [
    {
      name: "Learn",
      href: "/learn",
      icon: <HomeIcon />,
    },
    {
      name: "Shop",
      href: "/shop",
      icon: <WoodenChestBarIcon />,
    },
    {
      name: "Leaderboards",
      href: "/leaderboard",
      icon: <BrownTrophyBarIcon />,
    },
    {
      name: "Practice",
      href: "/lesson",
      icon: <PinkHeartSpeechBubbleIcon />,
    },
    {
      name: "Profile",
      href: loggedIn ? "/profile" : "/learn?sign-up",
      icon: <FlyingBirdIcon />,
    },
    {
      name: "More",
      href: "/settings/account",
      icon: <PurpleMoreCircleIcon />,
    },
  ];

  return items;
};

export const BottomBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const bottomBarItems = useBottomBarItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto w-full max-w-md border-t border-[#e5e5e5] bg-white">
      <ul className="flex h-[72px] items-center justify-around px-2">
        {bottomBarItems.map((item) => {
          const isActive = item.name === selectedTab;
          return (
            <li key={item.name} className="flex items-center justify-center">
              <Link
                href={item.href}
                className={[
                  "flex items-center justify-center transition-transform active:scale-90",
                  isActive
                    ? "rounded-2xl border-2 border-[#84d8ff] bg-[#ddf4ff] p-1.5 shadow-sm"
                    : "p-1.5 opacity-90 hover:opacity-100",
                ].join(" ")}
                aria-label={item.name}
              >
                {item.icon}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
