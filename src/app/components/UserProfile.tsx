"use client";
import { useSaveSpotifyUserMutation } from "@/quizApi";
import { useGetCurrentUserQuery } from "@/spotifyApi";
import { useEffect } from "react";
import Image from "next/image";

export default function Profile(accessToken: string) {
  const { data, error, isLoading } = useGetCurrentUserQuery();

  const [
    saveSpotifyUser,
    { data: saveData, isLoading: saveLoading, error: saveError },
  ] = useSaveSpotifyUserMutation();

  useEffect(() => {
    saveSpotifyUser({ accessToken });
  }, [accessToken, saveSpotifyUser]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>User is not logged in</p>;

  console.log("Saved user data:", saveData);

  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <div>
          <Image
            src={data.images?.[0]?.url || ""}
            alt={data.display_name || "User profile image"}
            width={100}
            height={100}
          />
        </div>
        <div>
          <div className="flex flex-row gap-2">
            <h1>{data.display_name}</h1>
            {saveData?.user.pro ? (
              <h1 className="bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Quiz App Pro
              </h1>
            ) : (
              <h1>Free user</h1>
            )}
          </div>
          <p>{data.email}</p>
          <p>{saveData?.user.spotify_id}</p>
        </div>
      </div>
    </div>
  );
}
