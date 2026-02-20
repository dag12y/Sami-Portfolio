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
      className="group w-full text-left bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-elegant transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-sage border border-transparent dark:border-slate-700"
    >
      <div className="relative aspect-video bg-gradient-to-br from-taupe/20 via-sage/20 to-beige dark:from-slate-800 dark:via-slate-700 dark:to-slate-900">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-light via-beige to-cream dark:from-slate-800 dark:via-slate-700 dark:to-slate-900"></div>
        )}
        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 text-text-dark dark:text-slate-100 px-4 py-2 rounded-full font-semibold shadow-elegant">
            <Play size={16} fill="currentColor" />
            Watch
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-dark dark:text-slate-100 mb-3 group-hover:text-sage transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-3 py-1 text-sm font-medium text-taupe dark:text-slate-200 bg-beige dark:bg-slate-800 rounded-full">
            {type}
          </span>
        </div>
        <p className="text-text-dark/70 dark:text-slate-300 text-sm">
          <span className="font-semibold text-text-dark dark:text-slate-100">Tools:</span> {tools}
        </p>
      </div>
    </button>
  );
}

export default VideoCard;
