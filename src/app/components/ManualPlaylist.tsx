"use client";
import { useState, useEffect } from "react";
import { useGetPlaylistQuery } from "@/spotifyApi";

interface ManualPlaylistInputProps {
  onSelect: (
    playlistId: string,
    playlistName: string,
    owner: string,
    description: string,
    totalTracks: number,
    imageUrl: string | null
  ) => void;
}

export default function ManualPlaylistInput({
  onSelect,
}: ManualPlaylistInputProps) {
  const [playlistIdInput, setPlaylistIdInput] = useState("");
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const extractPlaylistId = (input: string): string | null => {
    if (!input) return null;
    const match = input.match(/playlist\/([a-zA-Z0-9]+)/);
    if (match) return match[1];
    return input.trim();
  };

  const {
    data,
    isFetching,
    isError,
    error: fetchError,
  } = useGetPlaylistQuery(playlistId!, {
    skip: !playlistId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const extractedId = extractPlaylistId(playlistIdInput);
    if (!extractedId) {
      setError("Please enter a valid playlist URL or ID.");
      return;
    }

    setError("");
    setPlaylistId(extractedId);
  };

  useEffect(() => {
    if (!data) return;

    const playlistId = data.id;
    const playlistName = data.name;
    const owner = data.owner?.display_name || "Unknown";
    const description = data.description || "";
    const totalTracks = data.tracks?.total || 0;
    const imageUrl = data.images?.[0]?.url || null;

    onSelect(
      playlistId,
      playlistName,
      owner,
      description,
      totalTracks,
      imageUrl
    );
  }, [data, onSelect]);

  return (
    <div className="bg-gray-900 p-4 rounded text-white max-w-md">
      <h1 className="text-xl font-bold mb-2">Manual Playlist Entry</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Playlist URL or ID
          </label>
          <input
            type="text"
            value={playlistIdInput}
            onChange={(e) => setPlaylistIdInput(e.target.value)}
            placeholder="Paste Spotify playlist URL or ID"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {isError && (
          <p className="text-red-500 text-sm">
            Could not fetch playlist:{" "}
            {typeof fetchError === "string"
              ? fetchError
              : "Check access token or playlist ID"}
          </p>
        )}

        <button
          type="submit"
          disabled={isFetching}
          className={`${
            isFetching
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          } text-black font-semibold py-2 rounded active:bg-green-700 transition-colors`}
        >
          {isFetching ? "Loading..." : "Fetch Playlist"}
        </button>
      </form>
    </div>
  );
}
