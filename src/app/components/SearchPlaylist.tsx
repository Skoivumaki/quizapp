"use client";
import { useSearchPlaylistsQuery } from "@/spotifyApi";
import PlaylistItem from "./PlaylistItem";
import { useState } from "react";

export default function SearchPlaylist({
  onSelect,
}: {
  onSelect: (
    playlistId: string,
    playlistName: string,
    owner: string,
    description: string,
    totalTracks: number,
    imageUrl: string | null
  ) => void;
}) {
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, isFetching, error } = useSearchPlaylistsQuery(
    { query: submitted, limit, offset },
    { skip: !submitted }
  );

  const currentItems = data?.playlists?.items ?? [];
  const validItems = currentItems?.filter((pl: any) => pl && pl.id) ?? [];
  const total = data?.playlists?.total ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    setSubmitted(search.trim());
  };

  const handleLoadMore = () => {
    if (validItems.length + offset < total) {
      setOffset((prev) => prev + limit);
    }
  };

  return (
    <div className="text-white flex flex-col items-center w-full">
      <h1 className="text-xl font-bold mb-4">Search Playlists from Spotify</h1>

      <form onSubmit={handleSubmit} className="mb-4 w-full flex justify-center">
        <input
          type="text"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 mr-2 rounded border border-gray-600 bg-gray-800 text-white w-full focus:outline-none focus:border-green-500 focus:border-2"
        />
        <button
          type="submit"
          style={{
            background: "#1ed760",
            color: "#000",
            fontWeight: 600,
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </form>

      {isFetching && !offset && <p>Loading…</p>}
      {error && <p>Something went wrong. Try again.</p>}

      {validItems.length > 0 && (
        <ul className="w-full">
          {validItems.map((pl: any) => (
            <PlaylistItem
              key={pl.id}
              playlist={pl}
              onSelect={(
                id,
                name,
                owner,
                description,
                totalTracks,
                imageUrl
              ) => {
                onSelect(
                  pl.id,
                  pl.name,
                  pl.owner?.display_name,
                  pl.description,
                  pl.tracks.total,
                  pl.images.length > 0 ? pl.images[0].url : null
                );
              }}
              isLoading={isFetching}
            />
          ))}
        </ul>
      )}

      {submitted &&
        total > validItems.length + offset &&
        validItems.length >= limit && (
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="mt-2 p-3 py-1 w-80 rounded bg-green-500 text-black font-semibold
                 focus:outline-none hover:bg-green-400 active:bg-green-600"
          >
            {isFetching ? "Loading…" : "Load More"}
          </button>
        )}

      {submitted && !isFetching && validItems.length === 0 && (
        <p>No playlists found.</p>
      )}
    </div>
  );
}
