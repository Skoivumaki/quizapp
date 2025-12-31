import Image from "next/image";

// move to types
interface SelectedPlaylistInfoProps {
  playlistId: string;
  playlistName: string;
  owner: string;
  description: string;
  totalTracks: number;
  imageUrl: string | null;
}

export default function SelectedPlaylistInfo({
  playlistId,
  playlistName,
  owner,
  description,
  totalTracks,
  imageUrl,
}: SelectedPlaylistInfoProps) {
  return (
    <div className="bg-gray-800 rounded p-4 flex items-start gap-4 text-white max-w-full overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={playlistName}
          width={120}
          height={120}
          className="rounded flex-shrink-0"
        />
      ) : (
        <div className="bg-gray-700 rounded w-[120px] h-[120px] flex items-center justify-center text-gray-400 flex-shrink-0">
          No image
        </div>
      )}

      <div className="flex flex-col overflow-hidden min-w-0">
        <h2 className="text-xl font-bold truncate bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {playlistName}
        </h2>
        <p className="text-sm text-gray-400 mb-2 truncate">by {owner}</p>

        {description && (
          <p className="text-gray-300 text-sm mb-3 line-clamp-3">
            {description}
          </p>
        )}

        <span className="text-gray-400 text-sm">
          Total tracks:{" "}
          <span className="font-semibold text-gray-200">{totalTracks}</span>
        </span>
        <span className="text-xs text-gray-500 mt-2">
          Playlist ID: {playlistId}
        </span>
      </div>
    </div>
  );
}
