import {
  Dialog,
  DialogContent,
} from "@narzedziadlatworcow.pl/ui/components/ui/dialog";
import { cn } from "@narzedziadlatworcow.pl/ui/lib/utils";
import { Play } from "lucide-react";
import { useState } from "react";

interface VideoPreviewProps {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  mobileThumbnailUrl: string;
}

export function VideoPreview({
  videoId,
  title,
  thumbnailUrl,
  mobileThumbnailUrl,
}: VideoPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <>
      {/* Mobile Preview (16:9) */}
      <div
        className="block lg:hidden cursor-pointer"
        onClick={() => setIsFullscreen(true)}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          {/* Custom Thumbnail or Fallback */}
          <div
            className={cn(
              "absolute inset-0 bg-cover bg-center bg-no-repeat",
              "bg-gradient-to-br from-gray-900/90 to-gray-900/50"
            )}
            style={{ backgroundImage: `url(${mobileThumbnailUrl})` }}
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="group flex flex-col items-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                {/* Outer Circle */}
                <div className="absolute inset-0 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-110" />
                {/* Inner Circle */}
                <div className="relative h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="h-6 w-6 text-gray-900 transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-medium text-white">
                Obejrzyj lekcję
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Preview (9:16) */}
      <div className="hidden lg:block aspect-[9/16] w-full">
        {!isPlaying ? (
          <div
            className="relative w-full h-full cursor-pointer rounded-lg overflow-hidden"
            onClick={handlePlayClick}
          >
            {/* Thumbnail */}
            <div
              className={cn(
                "absolute inset-0 bg-cover bg-center bg-no-repeat",
                "bg-gradient-to-br from-gray-900/90 to-gray-900/50"
              )}
              style={{ backgroundImage: `url(${thumbnailUrl})` }}
            />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="group flex flex-col items-center">
                <div className="relative flex h-20 w-20 items-center justify-center">
                  {/* Outer Circle */}
                  <div className="absolute inset-0 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-110" />
                  {/* Inner Circle */}
                  <div className="relative h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-8 w-8 text-gray-900 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </div>
                <p className="mt-4 text-center text-base font-medium text-white">
                  Obejrzyj lekcję
                </p>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="w-full h-full rounded-lg shadow-md"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[450px] w-full p-0 bg-black !border-none [&>button]:hidden">
          <div className="flex flex-col h-full">
            <div className="aspect-[9/16] w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div
              className="p-6 text-center cursor-pointer text-white/70 hover:text-white transition-colors"
              onClick={() => setIsFullscreen(false)}
            >
              Wróć do lekcji
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
