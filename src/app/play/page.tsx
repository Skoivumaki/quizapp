"use client";

import SpotifyPlayer from "../components/SpotifyPlayer";
import UserProfile from "../components/UserProfile";
import Playlists from "../components/Playlists";
import Link from "next/link";
import { useAccessToken } from "../providers";
import { useState } from "react";
import SearchPlaylist from "../components/SearchPlaylist";
import ManualPlaylist from "../components/ManualPlaylist";
import SelectedPlaylistInfo from "../components/SelectedPlaylistInfo";
import GameSettings from "../components/GameSettings";

export default function PlayerPage() {
  const accessToken = useAccessToken();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );
  const [selectedPlaylistName, setSelectedPlaylistName] = useState<
    string | null
  >("");
  const [selectedPlaylistOwner, setSelectedPlaylistOwner] = useState<
    string | null
  >("");
  const [selectedPlaylistDescription, setSelectedPlaylistDescription] =
    useState<string | null>("");
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
      <SpotifyPlayer access_token={accessToken ?? ""} />
      <UserProfile />
      <Playlists onSelect={handlePlaylistSelect} />
      <SearchPlaylist onSelect={handlePlaylistSelect} />
      <ManualPlaylist onSelect={handlePlaylistSelect} />

      {selectedPlaylistId ? (
        <>
          <SelectedPlaylistInfo
            playlistId={selectedPlaylistId}
            playlistName={selectedPlaylistName}
            owner={selectedPlaylistOwner}
            description={selectedPlaylistDescription}
            totalTracks={selectedPlaylistTotalTracks}
            imageUrl={selectedPlaylistImageUrl}
          />
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
          <Link
            href={playHref}
            style={{
              background: "#1ed760",
              color: "#000",
              textDecoration: "none",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            Play
          </Link>
        </>
      ) : (
        <p>No Playlist Selected</p>
      )}
    </div>
  );
}
