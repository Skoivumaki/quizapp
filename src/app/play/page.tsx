"use client";

import Playlists from "../components/Playlists";
import Link from "next/link";
import { useState } from "react";
import SearchPlaylist from "../components/SearchPlaylist";
import ManualPlaylist from "../components/ManualPlaylist";
import SelectedPlaylistInfo from "../components/SelectedPlaylistInfo";
import GameSettings from "../components/GameSettings";
import { Container } from "../components/Container";
import { Button, ButtonSize, ButtonTheme } from "../components/Button";
import { SwitchBox } from "../components/SwitchBox";
import GamemodeSelector from "../components/GamemodeSelector";
import NavBar from "../components/NavBar";

export default function PlayerPage() {
  const [playlistSource, setPlaylistSource] = useState<
    "myPlaylist" | "searchPlaylist"
  >("myPlaylist");
  const [playlistSource2, setPlaylistSource2] = useState<
    "myPlaylist2" | "searchPlaylist2"
  >("myPlaylist2");
  const [gamemode, setGamemode] = useState<"classic" | "duo">("classic");
  const [manualMode2, setManualMode2] = useState<boolean>(false);
  const [selectedPlaylistId2, setSelectedPlaylistId2] = useState<string | null>(
    null,
  );
  const [selectedPlaylistName2, setSelectedPlaylistName2] =
    useState<string>("");
  const [selectedPlaylistOwner2, setSelectedPlaylistOwner2] =
    useState<string>("");
  const [selectedPlaylistDescription2, setSelectedPlaylistDescription2] =
    useState<string>("");
  const [selectedPlaylistTotalTracks2, setSelectedPlaylistTotalTracks2] =
    useState<number | null>(null);
  const [selectedPlaylistImageUrl2, setSelectedPlaylistImageUrl2] = useState<
    string | null
  >(null);

  const [manualMode, setManualMode] = useState<boolean>(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [selectedPlaylistName, setSelectedPlaylistName] = useState<string>("");
  const [selectedPlaylistOwner, setSelectedPlaylistOwner] =
    useState<string>("");
  const [selectedPlaylistDescription, setSelectedPlaylistDescription] =
    useState<string>("");
  const [selectedPlaylistTotalTracks, setSelectedPlaylistTotalTracks] =
    useState<number | null>(null);
  const [selectedPlaylistImageUrl, setSelectedPlaylistImageUrl] = useState<
    string | null
  >(null);

  const [limit, setLimit] = useState<number>(20);
  const [seek, setSeek] = useState<number>(0);
  const [length, setLength] = useState<number>(600000);
  const [random, setRandom] = useState<boolean>(false);
  const [internalPlayer, setInternalPlayer] = useState<boolean>(true);

  function handlePlaylistSelect(
    playlistId: string,
    playlistName: string,
    owner: string,
    description: string,
    totalTracks: number,
    imageUrl: string | null,
  ) {
    setSelectedPlaylistId(playlistId);
    setSelectedPlaylistName(playlistName);
    setSelectedPlaylistOwner(owner);
    setSelectedPlaylistDescription(description);
    setSelectedPlaylistTotalTracks(totalTracks);
    setSelectedPlaylistImageUrl(imageUrl);
  }
  function handlePlaylistSelect2(
    playlistId2: string,
    playlistName2: string,
    owner2: string,
    description2: string,
    totalTracks2: number,
    imageUrl2: string | null,
  ) {
    setSelectedPlaylistId2(playlistId2);
    setSelectedPlaylistName2(playlistName2);
    setSelectedPlaylistOwner2(owner2);
    setSelectedPlaylistDescription2(description2);
    setSelectedPlaylistTotalTracks2(totalTracks2);
    setSelectedPlaylistImageUrl2(imageUrl2);
  }

  const playHref = selectedPlaylistId
    ? `/play/${selectedPlaylistId}?limit=${limit}&seek=${seek}&random=${random}&internalPlayer=${internalPlayer}&gm=${gamemode}` +
      (selectedPlaylistId2 ? `&playlist2=${selectedPlaylistId2}` : "")
    : "#";

  const hasSelection = selectedPlaylistId !== null;

  // Shared playlist selection component
  const DuoPlaylistSelection = (
    <Container
      direction="col"
      justify="between"
      align="center"
      gap="4"
      className="w-full p-4 rounded"
    >
      <SwitchBox
        theme={ButtonTheme.PRIMARY}
        options={[
          { label: "My Playlists", value: "myPlaylist2" },
          { label: "Search Playlists", value: "searchPlaylist2" },
        ]}
        onChange={(val) =>
          setPlaylistSource2(val as "myPlaylist2" | "searchPlaylist2")
        }
        currentValue={playlistSource2}
      />
      {playlistSource2 === "myPlaylist2" ? (
        <Playlists onSelect={handlePlaylistSelect2} />
      ) : (
        <SearchPlaylist onSelect={handlePlaylistSelect2} />
      )}
      {manualMode2 ? (
        <ManualPlaylist onSelect={handlePlaylistSelect2} />
      ) : (
        <button onClick={() => setManualMode2(true)}>
          <small className="underline">
            {"Can't find what you are looking for? Try manual entry."}
          </small>
        </button>
      )}
    </Container>
  );

  const MainPlaylistSelection = (
    <Container
      direction="col"
      justify="between"
      align="center"
      gap="4"
      className="w-full p-4 rounded"
    >
      <SwitchBox
        theme={ButtonTheme.PRIMARY}
        options={[
          { label: "My Playlists", value: "myPlaylist" },
          { label: "Search Playlists", value: "searchPlaylist" },
        ]}
        onChange={(val) =>
          setPlaylistSource(val as "myPlaylist" | "searchPlaylist")
        }
        currentValue={playlistSource}
      />
      {playlistSource === "myPlaylist" ? (
        <Playlists onSelect={handlePlaylistSelect} />
      ) : (
        <SearchPlaylist onSelect={handlePlaylistSelect} />
      )}
      {manualMode ? (
        <ManualPlaylist onSelect={handlePlaylistSelect} />
      ) : (
        <button onClick={() => setManualMode(true)}>
          <small className="underline">
            {"Can't find what you are looking for? Try manual entry."}
          </small>
        </button>
      )}
    </Container>
  );

  return (
    <>
      <NavBar variant="play" />
      <div className="w-full max-w-7xl mx-auto p-4 mt-8 flex flex-col items-center gap-4">
        <GamemodeSelector value={gamemode} onChange={setGamemode} />

        <div className="flex flex-col md:flex-row gap-6 w-full transition-all duration-700 ease-in-out">
          {/* LEFT COLUMN – Playlist selection(s) */}
          <div
            className={`flex flex-col gap-4 transition-all duration-700 ease-in-out ${
              hasSelection
                ? "w-full md:w-2/5 lg:w-1/3"
                : "w-full md:w-full lg:w-full"
            }`}
          >
            {gamemode === "duo" && (
              <div className="transition-all duration-700 ease-in-out">
                {DuoPlaylistSelection}
              </div>
            )}
            <div className="transition-all duration-700 ease-in-out">
              {MainPlaylistSelection}
            </div>
          </div>

          {/* RIGHT COLUMN – Overview & Game Settings */}
          <div
            className={`flex flex-col gap-4 transition-all duration-700 ease-in-out overflow-hidden ${
              hasSelection
                ? "w-full md:w-3/5 lg:w-2/3 opacity-100 max-h-[2000px] translate-x-0"
                : "w-0 md:w-0 lg:w-0 opacity-0 max-h-0 translate-x-8"
            }`}
          >
            {/* Duo playlist info (if selected) */}
            {selectedPlaylistId2 && (
              <div className="transition-all duration-500 ease-in-out delay-200">
                <h2 className="text-center font-bold text-2xl">
                  Blending {selectedPlaylistName2}
                </h2>
                <Container
                  direction="col"
                  justify="between"
                  align="center"
                  gap="4"
                  className="w-full p-4 rounded"
                >
                  <SelectedPlaylistInfo
                    playlistId={selectedPlaylistId2}
                    playlistName={selectedPlaylistName2}
                    owner={selectedPlaylistOwner2}
                    description={selectedPlaylistDescription2}
                    totalTracks={selectedPlaylistTotalTracks2}
                    imageUrl={selectedPlaylistImageUrl2}
                  />
                </Container>
              </div>
            )}

            {selectedPlaylistId && (
              <>
                {/* Main playlist overview */}
                <div className="transition-all duration-500 ease-in-out delay-100">
                  <h2 className="text-center font-bold text-2xl">Overview</h2>
                  <Container
                    direction="col"
                    justify="between"
                    align="center"
                    gap="4"
                    className="w-full p-4 rounded"
                  >
                    <SelectedPlaylistInfo
                      playlistId={selectedPlaylistId}
                      playlistName={selectedPlaylistName}
                      owner={selectedPlaylistOwner}
                      description={selectedPlaylistDescription}
                      totalTracks={selectedPlaylistTotalTracks}
                      imageUrl={selectedPlaylistImageUrl}
                    />
                    <Button theme={ButtonTheme.PRIMARY} size={ButtonSize.XL}>
                      <Link href={playHref}>Start Game</Link>
                    </Button>
                  </Container>
                </div>

                {/* Game Settings under the overview */}
                <div className="transition-all duration-500 ease-in-out delay-300">
                  <h2 className="text-center font-bold text-2xl">
                    Game Settings
                  </h2>
                  <Container
                    direction="col"
                    justify="between"
                    align="center"
                    gap="4"
                    className="w-full p-4 rounded"
                  >
                    <GameSettings
                      limit={limit}
                      setLimit={setLimit}
                      seek={seek}
                      setSeek={setSeek}
                      setLength={setLength}
                      length={length}
                      random={random}
                      setRandom={setRandom}
                      internalPlayer={internalPlayer}
                      setInternalPlayer={setInternalPlayer}
                    />
                  </Container>
                </div>
              </>
            )}
          </div>
        </div>

        {/* No selection message – only visible on mobile when nothing is selected */}
        {!hasSelection && (
          <div className="md:hidden flex items-center justify-center">
            <p className="text-purple-400">No Playlist Selected</p>
          </div>
        )}
      </div>
    </>
  );
}
