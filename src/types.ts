export interface Video {
  id: string;
  title: string;
  type: string;
  tools: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  source: 'uploaded' | 'external';
  createdAt: string;
}
