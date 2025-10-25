"use client";

import React, { memo } from "react";
import { useGetCurrentUserQuery, useGetUserPlaylistsQuery } from "@/quizApi";
import PlaylistItem from "./PlaylistItem";

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

  const {
    data: playlistsData,
    error: playlistsError,
    isLoading: playlistsLoading,
  } = useGetUserPlaylistsQuery(user?.id, { skip: !user?.id });

  if (userError) return <p>Error loading user</p>;
  if (userLoading) return <p>Loading user…</p>;

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold mb-2">Playlists</h1>

      {playlistsLoading && <p>Loading playlists…</p>}
      {playlistsError && <p>Error loading playlists</p>}

      {playlistsData?.items?.length ? (
        <ul>
          {playlistsData.items.map((pl: any) => (
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
              isLoading={userLoading || playlistsLoading}
            />
          ))}
        </ul>
      ) : (
        !playlistsLoading && <p>No playlists found.</p>
      )}
    </div>
  );
}

// Thing to play instead
// "use client";
// import { useGetCurrentUserQuery, useGetUserPlaylistsQuery, usePlayPlaylistMutation } from "@/quizApi";

// export default function Profile() {
//   const { data, error, isLoading } = useGetCurrentUserQuery();
//   console.log("User ID:", data?.id);
//   const { data: playlistsData, error: playlistsError, isLoading: playlistsLoading } = useGetUserPlaylistsQuery(data?.id);
//   console.log("User Data:", playlistsData);

//   const [playPlaylist] = usePlayPlaylistMutation();

//   if (error) return <p>Error loading profile</p>;

//   return (
//     <div>
//       <h1>Playlists</h1>
//       {playlistsLoading && <p>Loading playlists...</p>}
//       {playlistsError && <p>Error loading playlists</p>}
//       {playlistsData && (
//         <ul>
//           {playlistsData.items.map((playlist) => (
//             <li key={playlist.id}>
//               {playlist.name}
//               {playlist.id}
//                     <button onClick={() => playPlaylist(playlist.id)} disabled={isLoading}>
//                 ▶️ Play
//             </button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
