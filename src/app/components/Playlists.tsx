"use client";

import React, { useState, useEffect } from "react";
import { useGetCurrentUserQuery, useGetUserPlaylistsQuery } from "@/quizApi";
import PlaylistItem from "./PlaylistItem";
import { Button } from "./Button";

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
      {playlistsLoading && offset === 0 && <p>Loading playlists…</p>}
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
