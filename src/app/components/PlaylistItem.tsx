import { memo } from "react";
import Image from "next/image";

interface PlaylistItemProps {
  playlist: any;
  isLoading: boolean;
  onSelect: (playlistId: string, playlistName: string) => void;
}

const PlaylistItem = memo(
  ({ playlist, onSelect, isLoading }: PlaylistItemProps) => (
    <li className="bg-gray-800 p-2 my-2 rounded flex items-center justify-between max-w-full overflow-hidden">
      <div className="flex items-center min-w-0 flex-1 overflow-hidden">
        {playlist.images?.length > 0 && (
          <Image
            src={playlist.images[0].url}
            alt={playlist.name}
            width={50}
            height={50}
            className="inline-block mr-2 rounded flex-shrink-0"
          />
        )}
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-white">{playlist.name}</span>
          <small className="truncate text-gray-400">
            {playlist.owner.display_name}
          </small>
        </div>
      </div>

      <button
        className="ml-2 px-3 py-1 rounded bg-green-500 text-black font-semibold
                 focus:outline-none hover:bg-green-400 active:bg-green-600 flex-shrink-0"
        onClick={() => onSelect(playlist.id, playlist.name)}
        disabled={isLoading}
      >
        Select
      </button>
    </li>
  )
);
PlaylistItem.displayName = "PlaylistItem";

export default PlaylistItem;
