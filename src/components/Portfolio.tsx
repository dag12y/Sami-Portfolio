import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import VideoCard from './VideoCard';
import { fetchVideos, getApiBase } from '../lib/api';
import type { Video } from '../types';
import { getPlaybackInfo } from '../lib/video';

function Portfolio() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchVideos();
        setVideos(data);
      } catch {
        setError('Unable to load videos right now.');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!activeVideo) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [activeVideo]);

  const resolveVideoUrl = (url: string) => {
    if (url.startsWith('/uploads/')) {
      return `${getApiBase()}${url}`;
    }

    return url;
  };

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-text-dark dark:text-slate-100 mb-4">
            My Work
          </h2>
          <div className="w-16 h-1 bg-sage mx-auto rounded-full mb-6"></div>
          <p className="text-text-dark/70 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            A collection of my recent video editing projects across promotional, tutorial, and self-improvement content.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-text-dark/70 dark:text-slate-300">Loading videos...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-text-dark/70 dark:text-slate-300">No videos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => {
              const resolvedUrl = resolveVideoUrl(video.videoUrl);
              return (
              <VideoCard
                key={video.id}
                title={video.title}
                type={video.type}
                tools={video.tools}
                previewUrl={resolvedUrl}
                thumbnailUrl={video.thumbnailUrl}
                onOpen={() => setActiveVideo({ ...video, videoUrl: resolvedUrl })}
              />
              );
            })}
          </div>
        )}
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center px-4 py-8"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-fade-in border border-transparent dark:border-slate-700"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 py-4 border-b border-slate-light dark:border-slate-700">
              <div>
                <h3 className="text-xl font-display font-bold text-text-dark dark:text-slate-100">{activeVideo.title}</h3>
                <p className="text-sm text-text-dark/70 dark:text-slate-300">{activeVideo.type} | {activeVideo.tools}</p>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="rounded-full p-2 text-text-dark/70 dark:text-slate-300 hover:text-text-dark dark:hover:text-slate-100 hover:bg-slate-light dark:hover:bg-slate-700 transition-colors"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>
            <div className="bg-black">
              {(() => {
                const playback = getPlaybackInfo(activeVideo.videoUrl);

                if (playback.kind === 'embed') {
                  return (
                    <iframe
                      src={playback.src}
                      title={activeVideo.title}
                      className="w-full aspect-video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  );
                }

                return <video src={playback.src} className="w-full aspect-video bg-black" controls autoPlay preload="metadata" />;
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Portfolio;
