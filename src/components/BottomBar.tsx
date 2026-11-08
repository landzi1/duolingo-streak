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

// 1. Home Birdhouse (Active tab style matching IMG_6309.PNG)
export const HomeIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    {/* Yellow House Base */}
    <path
      d="M26.5 27.5C26.2 29.2 24.8 30.5 23 30.5H11C9.2 30.5 7.8 29.2 7.5 27.5L5 13.5L17 4.5L29 13.5L26.5 27.5Z"
      fill="#FFC800"
    />
    <circle cx="17" cy="18" r="4" fill="#8B4513" />
    <circle cx="17" cy="25" r="1.5" fill="#8B4513" opacity="0.6" />
    {/* Red Roof */}
    <path
      d="M17 2.5C17.5 2.5 18 2.7 18.5 3L31.5 13C32.5 13.8 32.7 15.3 32 16.3C31.2 17.3 29.7 17.5 28.7 16.7L17 7.5L5.3 16.7C4.3 17.5 2.8 17.3 2 16.3C1.2 15.3 1.4 13.8 2.5 13L15.5 3C16 2.7 16.5 2.5 17 2.5Z"
      fill="#FF4B4B"
    />
  </svg>
);

// 2. Gold Shield / Leaderboards
export const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M5 6C5 4.89543 5.89543 4 7 4H25C26.1046 4 27 4.89543 27 6V16C27 22.5 21.5 28 16 29.5C10.5 28 5 22.5 5 16V6Z"
      fill="#FFC800"
    />
    <path
      opacity="0.3"
      d="M27 9V6C27 4.89543 26.1046 4 25 4H21L6 21C7 24.5 9.5 27 16 29.5L27 9Z"
      fill="white"
    />
    <path
      d="M7 6H25V16C25 21.5 20.5 26.5 16 28C11.5 26.5 7 21.5 7 16V6Z"
      stroke="#E5A500"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

// 3. Wooden / Bronze Chest (Shop / Quests)
export const ChestIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <rect x="5" y="13" width="24" height="15" rx="3" fill="#A56644" />
    <path d="M5 16H29V19H5V16Z" fill="#784428" />
    <path
      d="M5 13C5 9.5 8 7 17 7C26 7 29 9.5 29 13H5Z"
      fill="#C68058"
    />
    <rect x="9" y="7" width="3" height="21" fill="#FFC800" />
    <rect x="22" y="7" width="3" height="21" fill="#FFC800" />
    <circle cx="17" cy="15" r="3.5" fill="#FFE066" />
    <circle cx="17" cy="15" r="1.5" fill="#A56644" />
  </svg>
);

// 4. Pink Heart (Practice)
export const HeartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path
      d="M16 28C16 28 3 20 3 10.5C3 6.35786 6.35786 3 10.5 3C13.0645 3 15.3359 4.28589 16 6.27306C16.6641 4.28589 18.9355 3 21.5 3C25.6421 3 29 6.35786 29 10.5C29 20 16 28 16 28Z"
      fill="#FF66B2"
    />
    <path
      d="M10 6C8 6 6.5 7.5 6.5 9.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

// 5. Blue Bird / Duo Head (Profile)
export const DuoAvatarIcon = () => (
  <div className="relative flex h-8 w-8 items-center justify-center">
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14" fill="#20b7f8" />
      <circle cx="12" cy="15" r="4" fill="white" />
      <circle cx="22" cy="15" r="4" fill="white" />
      <circle cx="13" cy="15" r="2" fill="#1b4965" />
      <circle cx="21" cy="15" r="2" fill="#1b4965" />
      <path d="M14 18L17 22L20 18H14Z" fill="#FFA500" />
      <path d="M15 3C16 1 18 1 19 3L17 5L15 3Z" fill="#58cc02" />
    </svg>
  </div>
);

// 6. Purple More Ellipsis (...)
export const MoreCircleIcon = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a855f7] shadow-sm">
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
      name: "Leaderboards",
      href: "/leaderboard",
      icon: <ShieldIcon />,
    },
    {
      name: "Shop",
      href: "/shop",
      icon: <ChestIcon />,
    },
    {
      name: "Practice",
      href: "/lesson",
      icon: <HeartIcon />,
    },
    {
      name: "Profile",
      href: loggedIn ? "/profile" : "/learn?sign-up",
      icon: <DuoAvatarIcon />,
    },
    {
      name: "More",
      href: "/settings/account",
      icon: <MoreCircleIcon />,
    },
  ];

  return items;
};

export const BottomBar = ({ selectedTab }: { selectedTab: Tab | null }) => {
  const bottomBarItems = useBottomBarItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-[#e5e5e5] bg-white md:hidden">
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
                    : "p-1.5 opacity-80 hover:opacity-100",
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
