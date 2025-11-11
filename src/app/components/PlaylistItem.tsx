import { memo } from "react";
import Image from "next/image";
import { Button, ButtonTheme, ButtonSize } from "./Button";

interface PlaylistItemProps {
  playlist: any;
  isLoading: boolean;
  onSelect: (playlistId: string, playlistName: string) => void;
}

const PlaylistItem = memo(
  ({ playlist, onSelect, isLoading }: PlaylistItemProps) => (
    <li className="bg-gray-900 p-2 my-2 rounded flex items-center justify-between max-w-full overflow-hidden">
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

      <Button
        theme={ButtonTheme.PRIMARY}
        size={ButtonSize.M}
        onClick={() => onSelect(playlist.id, playlist.name)}
        disabled={isLoading}
      >
        {"Select"}
      </Button>
    </li>
  )
);
PlaylistItem.displayName = "PlaylistItem";

export default PlaylistItem;
