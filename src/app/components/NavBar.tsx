"use client";

import Image from "next/image";
import profile from "@/shared/assets/icons/profile.svg";
import menu from "@/shared/assets/icons/menu.svg";
import back from "@/shared/assets/icons/back.svg";
import cog from "@/shared/assets/icons/cog.svg";
import { Button } from "./Button";
import Link from "next/link";
import NavSettings from "./NavSettings";
import { useState } from "react";

enum NavBarVariant {
  DEFAULT = "default",
  GAME = "game",
  PLAY = "play",
}

type NavBarProps = {
  variant?: NavBarVariant | string;
};

export default function NavBar({
  variant = NavBarVariant.DEFAULT,
}: NavBarProps) {
  switch (variant) {
    case NavBarVariant.GAME:
      return <GameNavBar />;

    case NavBarVariant.GAME:
      return <PlayNavBar />;

    case NavBarVariant.DEFAULT:
    default:
      return <DefaultNavBar />;
  }
}

function DefaultNavBar() {
  return (
    <div className="flex flex-row fixed w-full top-0 bg-gray-950 text-center justify-between items-center h-10 z-10">
      <div className="p-2 text-center justify-between items-center flex flex-row fixed w-full bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        <span>
          <Image src={menu.src} width={24} height={24} alt="Open Menu" />
        </span>
        <Link href="/">
          <h1 className="font-bold text-lg">Quiz App</h1>
        </Link>
        <span>
          <Image src={profile.src} width={24} height={24} alt="Open Profile" />
        </span>
      </div>
    </div>
  );
}

function PlayNavBar() {
  return (
    <div className="flex flex-row fixed w-full top-0 bg-gray-950 text-center justify-between items-center h-10 z-10">
      <div className="p-2 text-center justify-between items-center flex flex-row fixed w-full bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        <span>
          <Image src={back.src} width={24} height={24} alt="Go back" />
        </span>
        <Link href="/">
          <h1 className="font-bold text-lg">Quiz App</h1>
        </Link>
        <span>
          <Image src={profile.src} width={24} height={24} alt="Open Profile" />
        </span>
      </div>
    </div>
  );
}

function GameNavBar() {
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <>
      <div className="flex flex-row fixed w-full top-0 bg-gray-950 text-center justify-between items-center h-10 z-10">
        <div className="p-2 text-center justify-between items-center flex flex-row fixed w-full bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          <span className={"flex items-center"}>
            <Button theme="clear" size="s" onClick={toggleSettings}>
              <Image src={back.src} width={24} height={24} alt="Go back" />
            </Button>
          </span>

          <Link href="/">
            <h1 className="font-bold text-lg">Quiz App</h1>
          </Link>

          <span className={"flex items-center"}>
            <Button theme="clear" size="s" onClick={toggleSettings}>
              <Image
                src={cog.src}
                width={24}
                height={24}
                alt="Toggle settings"
              />
            </Button>
          </span>
        </div>
      </div>
      <NavSettings showSettings={showSettings} />
    </>
  );
}
