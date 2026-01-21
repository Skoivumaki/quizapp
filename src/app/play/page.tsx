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

  return (
    <>
      <NavBar variant="play" />
      <div className="w-screen p-4 mt-8 flex flex-col items-center gap-4">
        <GamemodeSelector value={gamemode} onChange={setGamemode} />

        {gamemode === "duo" && (
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full p-4 rounded"
          >
            <>
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
              {manualMode ? (
                <ManualPlaylist onSelect={handlePlaylistSelect2} />
              ) : (
                <button onClick={() => setManualMode2(true)}>
                  <small className="underline">
                    {"Can't find what you are looking for? Try manual entry."}
                  </small>
                </button>
              )}
            </>
          </Container>
        )}

        {/* FIRST PLAYER PLAYLIST SELECTION */}
        <Container
          direction="col"
          justify="between"
          align="center"
          gap="4"
          className="w-full p-4 rounded"
        >
          <>
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
          </>
        </Container>

        {selectedPlaylistId2 && (
          <>
            <h1 className="text-center font-bold text-2xl">
              Blending {selectedPlaylistName2}
            </h1>
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
          </>
        )}

        {selectedPlaylistId ? (
          <>
            <h1 className="text-center font-bold text-2xl">Game Settings</h1>
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
            <h1 className="text-center font-bold text-2xl">Overview</h1>
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
          </>
        ) : (
          <p className="text-purple-400">No Playlist Selected</p>
        )}
      </div>
    </>
  );
}
