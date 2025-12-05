"use client";

import { useMemo } from "react";
import { useGetPlaylistQuery } from "@/spotifyApi";
import { useFormattedTracks } from "@/hooks/useFormatTracks";

interface UseMixedPlaylistsOptions {
  shuffle?: boolean;
  limit?: number;
}

export function useMixedPlaylists(
  playlistId1: string,
  playlistId2: string | null,
  { shuffle = false, limit }: UseMixedPlaylistsOptions = {}
) {
  // Always call hooks in same order
  const { data: data1, isLoading: loading1 } = useGetPlaylistQuery(
    playlistId1,
    {
      skip: !playlistId1,
    }
  );

  const { data: data2, isLoading: loading2 } = useGetPlaylistQuery(
    playlistId2 as string,
    {
      skip: !playlistId2,
    }
  );

  // ✅ Call useFormattedTracks hooks at top level
  const formattedTracks1 = useFormattedTracks(data1?.tracks.items, {
    shuffle,
    limit,
  });
  const formattedTracks2 = useFormattedTracks(data2?.tracks.items, {
    shuffle,
    limit,
  });

  // ✅ Now safe to use useMemo for combining
  const mixedTracks = useMemo(() => {
    if (!playlistId2 || !formattedTracks2.length) {
      // Only one playlist active
      return formattedTracks1;
    }

    const totalLimit =
      limit && limit > 0
        ? limit
        : formattedTracks1.length + formattedTracks2.length;

    const half = Math.floor(totalLimit / 2);
    const part1 = formattedTracks1.slice(0, half);
    const part2 = formattedTracks2.slice(0, half);

    const mixed = [...part1, ...part2];
    return shuffle ? mixed.sort(() => Math.random() - 0.5) : mixed;
  }, [playlistId2, formattedTracks1, formattedTracks2, shuffle, limit]);

  return {
    tracks: mixedTracks,
    isLoading: loading1 || (playlistId2 ? loading2 : false),
  };
}
