'use client';

/**
 * Responsive video player for embedded YouTube/Vimeo content
 * Maintains 16:9 aspect ratio on all screen sizes
 */
export function VideoPlayer({ embedUrl }: { embedUrl: string }) {
  // Extract video ID from various URL formats
  const getEmbedUrl = (url: string): string => {
    // YouTube URL formats
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match =
        url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/) ||
        url.match(/youtube\.com\/embed\/([\w-]+)/);
      if (match?.[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    // Vimeo URL formats
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      if (match?.[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }

    // Already embed URL
    return url;
  };

  const finalEmbedUrl = getEmbedUrl(embedUrl);

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={finalEmbedUrl}
          title="Video Player"
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
