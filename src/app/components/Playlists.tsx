"use client";

import React, { useState, useEffect } from "react";
import { useGetCurrentUserQuery, useGetUserPlaylistsQuery } from "@/spotifyApi";
import PlaylistItem from "./PlaylistItem";
import { Button } from "./Button";
import LoginPrompt from "./LoginPrompt";

export default function Playlist({
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
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useGetCurrentUserQuery();

  const [offset, setOffset] = useState(0);
  const [allPlaylists, setAllPlaylists] = useState<any[]>([]);

  const {
    data: playlistsData,
    error: playlistsError,
    isLoading: playlistsLoading,
    isFetching,
  } = useGetUserPlaylistsQuery(
    { userId: user?.id, offset },
    { skip: !user?.id }
  );

  useEffect(() => {
    if (playlistsData?.items) {
      setAllPlaylists((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = playlistsData.items.filter(
          (p: any) => !existingIds.has(p.id)
        );
        return offset === 0 ? playlistsData.items : [...prev, ...newItems];
      });
    }
  }, [playlistsData, offset]);

  if (userError) return <p>Error loading user</p>;
  if (userLoading) return <p>Loading user…</p>;

  const handleLoadMore = () => {
    if (playlistsData?.next && !isFetching) {
      setOffset((prev) => prev + playlistsData.limit);
    }
  };

  const hasMore = Boolean(playlistsData?.next);

  return (
    <div className="w-full">
      {/* Show login prompt if refresh fails */}
      {typeof userError === "object" &&
        userError !== null &&
        "status" in userError &&
        (userError as any).status === 401 && <LoginPrompt />}
      {playlistsLoading && offset === 0 && (
        <>
          <li className="bg-gray-900 p-2 my-2 rounded flex items-center justify-between max-w-full overflow-hidden animate-pulse">
            <div className="flex items-center min-w-0 flex-1 overflow-hidden">
              <div className="w-[50px] h-[50px] bg-gray-700 rounded mr-2 flex-shrink-0" />
              <div className="flex flex-col gap-2 overflow-hidden w-full">
                <div className="h-4 bg-gray-700 rounded w-1/4" />
                <div className="h-3 bg-gray-700 rounded w-1/5" />
              </div>
            </div>
            <div className="h-9 w-18 bg-gray-700 rounded-4xl ml-4" />
          </li>
        </>
      )}
      {playlistsError && <p>Error loading playlists</p>}

      {allPlaylists.length > 0 ? (
        <>
          <ul>
            {allPlaylists.map((pl: any) => (
              <PlaylistItem
                key={pl.id}
                playlist={pl}
                onSelect={() => {
                  onSelect(
                    pl.id,
                    pl.name,
                    pl.owner?.display_name,
                    pl.description,
                    pl.tracks.total,
                    pl.images.length > 0 ? pl.images[0].url : null
                  );
                }}
                isLoading={userLoading || playlistsLoading}
              />
            ))}
          </ul>

          <div className="mt-4 text-center">
            {hasMore ? (
              <Button onClick={handleLoadMore} disabled={isFetching}>
                {isFetching ? "Loading more…" : "Load More"}
              </Button>
            ) : (
              !isFetching && (
                <p className="text-green-400 mt-2">No more playlists found.</p>
              )
            )}
          </div>
        </>
      ) : (
        !playlistsLoading && <p>No playlists found.</p>
      )}
    </div>
  );
}
