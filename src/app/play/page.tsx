"use client";

import SpotifyPlayer from "../components/SpotifyPlayer";
import Playlists from "../components/Playlists";
import Link from "next/link";
import { useAccessToken } from "../providers";
import { useState } from "react";
import SearchPlaylist from "../components/SearchPlaylist";
import ManualPlaylist from "../components/ManualPlaylist";
import SelectedPlaylistInfo from "../components/SelectedPlaylistInfo";
import GameSettings from "../components/GameSettings";
import { Container } from "../components/Container";
import { Button, ButtonSize, ButtonTheme } from "../components/Button";
import { SwitchBox } from "../components/SwitchBox";

export default function PlayerPage() {
  const accessToken = useAccessToken();
  const [playlistSource, setPlaylistSource] = useState<
    "myPlaylist" | "searchPlaylist"
  >("myPlaylist");
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
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
  const [random, setRandom] = useState<boolean>(false);
  const [internalPlayer, setInternalPlayer] = useState<boolean>(true);

  function handlePlaylistSelect(
    playlistId: string,
    playlistName: string,
    owner: string,
    description: string,
    totalTracks: number,
    imageUrl: string | null
  ) {
    setSelectedPlaylistId(playlistId);
    setSelectedPlaylistName(playlistName);
    setSelectedPlaylistOwner(owner);
    setSelectedPlaylistDescription(description);
    setSelectedPlaylistTotalTracks(totalTracks);
    setSelectedPlaylistImageUrl(imageUrl);
  }

  const playHref = selectedPlaylistId
    ? `/play/${selectedPlaylistId}?limit=${limit}&seek=${seek}&random=${random}&internalPlayer=${internalPlayer}`
    : "#";

  return (
    <div className="w-screen p-4 flex flex-col items-center gap-4">
      <h1 className="text-center font-bold text-2xl">Quiz Setup</h1>

      <Container
        direction="row"
        justify="between"
        align="center"
        gap="4"
        className="w-full bg-gray-800 p-4 rounded"
      >
        GAMEMODE SELECTION
      </Container>

      <Container
        direction="col"
        justify="between"
        align="center"
        gap="4"
        className="w-full bg-gray-800 p-4 rounded"
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

      {selectedPlaylistId ? (
        <>
          <h1 className="text-center font-bold text-2xl">Game Settings</h1>
          <Container
            direction="col"
            justify="between"
            align="center"
            gap="4"
            className="w-full bg-gray-800 p-4 rounded"
          >
            <GameSettings
              limit={limit}
              setLimit={setLimit}
              seek={seek}
              setSeek={setSeek}
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
            className="w-full bg-gray-800 p-4 rounded"
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
        <p className="text-green-400">No Playlist Selected</p>
      )}
    </div>
  );
}
