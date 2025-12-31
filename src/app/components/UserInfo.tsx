import { useGetUserProfileQuery } from "@/spotifyApi";
import Image from "next/image";

export default function UserInfo({ id }: { id: string }) {
  const { data, error, isLoading } = useGetUserProfileQuery(id);
  if (isLoading) return <p>Loading user info...</p>;
  if (error) return <p>Error loading user info</p>;
  if (!data) return <p>No user info available</p>;

  return isLoading ? (
    <div className="flex flex-row gap-2 items-center animate-pulse w-50 p-2">
      <div className="rounded-full overflow-hidden p-3">
        <div className="size-10 rounded-full bg-gray-600"></div>
      </div>
      <div className="w-full">
        <div className="">
          <div className="grid grid-cols-3">
            <div className="col-span-5 h-2 rounded bg-gray-600"></div>{" "}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-row gap-2 items-center">
      <div className="rounded-full overflow-hidden">
        <Image
          src={data.images?.[0]?.url || ""}
          alt={data.display_name || "User profile image"}
          width={30}
          height={30}
        />
      </div>
      <div>
        <div className="flex flex-row gap-2">
          <h1>{data.display_name}</h1>
        </div>
      </div>
    </div>
  );
}
