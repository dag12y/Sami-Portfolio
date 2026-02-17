export interface PlaybackInfo {
  kind: 'embed' | 'file';
  src: string;
}

export function getPlaybackInfo(url: string): PlaybackInfo {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return { kind: 'embed', src: `https://www.youtube.com/embed/${videoId}` };
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return { kind: 'embed', src: `https://www.youtube.com/embed/${videoId}` };
  }

  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return { kind: 'embed', src: `https://player.vimeo.com/video/${videoId}` };
  }

  if (url.includes('drive.google.com/file/d/')) {
    const videoId = url.split('/file/d/')[1]?.split('/')[0];
    return {
      kind: 'embed',
      src: videoId ? `https://drive.google.com/file/d/${videoId}/preview` : url,
    };
  }

  return { kind: 'file', src: url };
}

export function getVideoThumbnail(url: string) {
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  }

  return null;
}
