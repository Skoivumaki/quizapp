import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";

export const spotifyApi = createApi({
  reducerPath: "spotifyApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    SearchPlaylists: builder.query<
      any,
      { query: string; limit?: number; offset?: number }
    >({
      query: ({ query, limit = 5, offset = 0 }) => {
        const safeLimit = Math.min(Math.max(limit, 1), 10);

        return `search?q=${encodeURIComponent(
          query,
        )}&type=playlist&limit=${safeLimit}&offset=${offset}`;
      },
    }),

    getCurrentUser: builder.query<any, void>({
      query: () => "me",
    }),

    getUserPlaylists: builder.query<any, { limit?: number; offset?: number }>({
      query: ({ limit = 20, offset = 0 }) =>
        `me/playlists?limit=${limit}&offset=${offset}`,
    }),

    getTrack: builder.query<any, string>({
      query: (id) => `tracks/${id}`,
    }),

    getPlaylist: builder.query<any, string>({
      query: (id) => `playlists/${id}`,
    }),

    playPlaylist: builder.mutation<void, string>({
      query: (id) => ({
        url: "me/player/play",
        method: "PUT",
        body: {
          context_uri: `spotify:playlist:${id}`,
        },
      }),
    }),

    playTrack: builder.mutation<
      void,
      { id: string; position_ms?: number; device_id?: string }
    >({
      query: ({ id, position_ms, device_id }) => ({
        url: `me/player/play${
          device_id ? `?device_id=${encodeURIComponent(device_id)}` : ""
        }`,
        method: "PUT",
        body: {
          uris: [`spotify:track:${id}`],
          ...(position_ms !== undefined ? { position_ms } : {}),
        },
      }),
    }),

    pausePlayback: builder.mutation<void, { device_id?: string }>({
      query: ({ device_id }) => ({
        url: "me/player/pause",
        method: "PUT",
        params: device_id ? { device_id } : undefined,
      }),
    }),

    resumePlayback: builder.mutation<void, { device_id?: string }>({
      query: ({ device_id }) => ({
        url: "me/player/play",
        method: "PUT",
        params: device_id ? { device_id } : undefined,
      }),
    }),
  }),
});

export const {
  useSearchPlaylistsQuery,
  useGetCurrentUserQuery,
  useGetUserPlaylistsQuery,
  useGetTrackQuery,
  useGetPlaylistQuery,
  usePlayPlaylistMutation,
  usePlayTrackMutation,
  usePausePlaybackMutation,
  useResumePlaybackMutation,
} = spotifyApi;
