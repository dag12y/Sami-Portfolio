import { Play } from 'lucide-react';
import { getVideoThumbnail } from '../lib/video';

interface VideoCardProps {
  title: string;
  type: string;
  tools: string;
  previewUrl: string;
  thumbnailUrl?: string | null;
  onOpen: () => void;
}

function VideoCard({ title, type, tools, previewUrl, thumbnailUrl, onOpen }: VideoCardProps) {
  const thumbnail = thumbnailUrl || getVideoThumbnail(previewUrl);

  return (
    <button
      onClick={onOpen}
      className="group w-full text-left bg-white rounded-2xl overflow-hidden shadow-elegant transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sage"
    >
      <div className="relative aspect-video bg-gradient-to-br from-taupe/20 via-sage/20 to-beige">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-light via-beige to-cream"></div>
        )}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 bg-white/95 text-text-dark px-4 py-2 rounded-full font-semibold shadow-elegant">
            <Play size={16} fill="currentColor" />
            Watch
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-dark mb-3 group-hover:text-sage transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 text-sm font-medium text-taupe bg-beige rounded-full">
            {type}
          </span>
        </div>
        <p className="text-text-dark/70 text-sm">
          <span className="font-semibold text-text-dark">Tools:</span> {tools}
        </p>
      </div>
    </button>
  );
}

export default VideoCard;
