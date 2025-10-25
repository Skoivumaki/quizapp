"use client";

import { useMemo } from "react";

// move to types
type SpotifyTrackItem = {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
    uri: string;
    duration_ms: number;
  };
};

interface UseFormattedTracksOptions {
  shuffle?: boolean;
  limit?: number;
}

export function useFormattedTracks(
  items: SpotifyTrackItem[] = [],
  { shuffle = false, limit }: UseFormattedTracksOptions = {}
) {
  const formattedTracks = useMemo(() => {
    if (!items?.length) return [];

    let tracks = items.map((item) => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(", "),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      uri: item.track.uri,
      duration_ms: item.track.duration_ms,
    }));

    if (shuffle) {
      tracks = [...tracks].sort(() => Math.random() - 0.5);
    }

    if (limit && limit > 0) {
      tracks = tracks.slice(0, limit);
    }

    return tracks;
  }, [items, shuffle, limit]);

  return formattedTracks;
}
