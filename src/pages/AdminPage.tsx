import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clearAuthToken, createVideo, deleteVideo, fetchVideos, getApiBase, getAuthToken, loginAdmin, updateVideo } from '../lib/api';
import type { Video } from '../types';

function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(Boolean(getAuthToken()));
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [tools, setTools] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('');
  const [editTools, setEditTools] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editVideoFile, setEditVideoFile] = useState<File | null>(null);
  const [editThumbnailUrl, setEditThumbnailUrl] = useState('');
  const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const resolveVideoUrl = (url: string) => {
    if (url.startsWith('/uploads/')) {
      return `${getApiBase()}${url}`;
    }
    return url;
  };

  const loadVideos = async () => {
    setLoading(true);
    setMessage('');

    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Failed to load videos';
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadVideos();
  }, []);

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      await loginAdmin(username, password);
      setIsAuthed(true);
      setPassword('');
      setMessage('Logged in. You can now upload, edit, or delete videos.');
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Login failed';
      setMessage(text);
    }
  };

  const onUpload = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await createVideo({
        title,
        type,
        tools,
        videoUrl: videoUrl.trim() || undefined,
        videoFile: videoFile || undefined,
        thumbnailUrl: thumbnailUrl.trim() || undefined,
        thumbnailFile: thumbnailFile || undefined,
        onProgress: (percent) => setUploadProgress(percent),
      });

      setTitle('');
      setType('');
      setTools('');
      setVideoUrl('');
      setVideoFile(null);
      setThumbnailUrl('');
      setThumbnailFile(null);
      setUploadProgress(100);
      setMessage('Video uploaded successfully.');
      await loadVideos();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Upload failed';
      setMessage(text);
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    setMessage('');

    try {
      await deleteVideo(id);
      setMessage('Video deleted.');
      await loadVideos();
      if (editingId === id) {
        setEditingId(null);
      }
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Delete failed';
      setMessage(text);
    }
  };

  const startEdit = (video: Video) => {
    setEditingId(video.id);
    setEditTitle(video.title);
    setEditType(video.type);
    setEditTools(video.tools);
    setEditVideoUrl(resolveVideoUrl(video.videoUrl));
    setEditThumbnailUrl(video.thumbnailUrl || '');
    setEditVideoFile(null);
    setEditThumbnailFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditVideoFile(null);
    setEditThumbnailFile(null);
  };

  const onSaveEdit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingId) {
      return;
    }

    setMessage('');
    setIsUpdating(true);

    try {
      await updateVideo(editingId, {
        title: editTitle,
        type: editType,
        tools: editTools,
        videoUrl: editVideoUrl,
        videoFile: editVideoFile || undefined,
        thumbnailUrl: editThumbnailUrl,
        thumbnailFile: editThumbnailFile || undefined,
      });

      setMessage('Video updated successfully.');
      setEditingId(null);
      setEditVideoFile(null);
      setEditThumbnailFile(null);
      await loadVideos();
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Update failed';
      setMessage(text);
    } finally {
      setIsUpdating(false);
    }
  };

  const onLogout = () => {
    clearAuthToken();
    setIsAuthed(false);
    setMessage('Logged out.');
  };

  return (
    <main className="min-h-screen bg-cream text-text-dark py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
          <Link to="/" className="text-sm font-semibold underline">
            Back to Portfolio
          </Link>
        </div>

        {message && <p className="text-sm font-semibold text-taupe">{message}</p>}

        {!isAuthed ? (
          <form onSubmit={onLogin} className="bg-white rounded-xl shadow-elegant p-6 space-y-4">
            <h2 className="text-xl font-semibold">Admin Login</h2>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              required
            />
            <button className="px-4 py-2 bg-sage rounded-lg font-semibold">Login</button>
          </form>
        ) : (
          <>
            <div className="flex justify-end">
              <button onClick={onLogout} className="px-4 py-2 bg-slate-light rounded-lg text-sm font-semibold">
                Logout
              </button>
            </div>

            <form onSubmit={onUpload} className="bg-white rounded-xl shadow-elegant p-6 space-y-4">
              <h2 className="text-xl font-semibold">Upload New Video</h2>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
                className="w-full border border-slate-light rounded-lg px-3 py-2"
                required
                disabled={isUploading}
              />
              <input
                value={type}
                onChange={(event) => setType(event.target.value)}
                placeholder="Type (Promo/Tutorial/etc.)"
                className="w-full border border-slate-light rounded-lg px-3 py-2"
                required
                disabled={isUploading}
              />
              <input
                value={tools}
                onChange={(event) => setTools(event.target.value)}
                placeholder="Tools used"
                className="w-full border border-slate-light rounded-lg px-3 py-2"
                required
                disabled={isUploading}
              />
              <input
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="External video URL (optional if file uploaded)"
                className="w-full border border-slate-light rounded-lg px-3 py-2"
                disabled={isUploading}
              />
              <input
                value={thumbnailUrl}
                onChange={(event) => setThumbnailUrl(event.target.value)}
                placeholder="Thumbnail URL (optional if image uploaded)"
                className="w-full border border-slate-light rounded-lg px-3 py-2"
                disabled={isUploading}
              />
              <input
                type="file"
                accept="video/*"
                onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
                className="w-full"
                disabled={isUploading}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)}
                className="w-full"
                disabled={isUploading}
              />
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-text-dark/70">
                    <span>Uploading video...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-light rounded-full overflow-hidden">
                    <div className="h-full bg-sage transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
              <button className="px-4 py-2 bg-sage rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Save Video'}
              </button>
            </form>
          </>
        )}

        {isAuthed && editingId && (
          <form onSubmit={onSaveEdit} className="bg-white rounded-xl shadow-elegant p-6 space-y-4">
            <h2 className="text-xl font-semibold">Edit Video</h2>
            <input
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              placeholder="Title"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              required
              disabled={isUpdating}
            />
            <input
              value={editType}
              onChange={(event) => setEditType(event.target.value)}
              placeholder="Type"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              required
              disabled={isUpdating}
            />
            <input
              value={editTools}
              onChange={(event) => setEditTools(event.target.value)}
              placeholder="Tools"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              required
              disabled={isUpdating}
            />
            <input
              value={editVideoUrl}
              onChange={(event) => setEditVideoUrl(event.target.value)}
              placeholder="Video URL (leave as is to keep current URL)"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              disabled={isUpdating}
            />
            <input
              value={editThumbnailUrl}
              onChange={(event) => setEditThumbnailUrl(event.target.value)}
              placeholder="Thumbnail URL (empty to remove unless image file provided)"
              className="w-full border border-slate-light rounded-lg px-3 py-2"
              disabled={isUpdating}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(event) => setEditVideoFile(event.target.files?.[0] || null)}
              className="w-full"
              disabled={isUpdating}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setEditThumbnailFile(event.target.files?.[0] || null)}
              className="w-full"
              disabled={isUpdating}
            />
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-sage rounded-lg font-semibold disabled:opacity-60" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 bg-slate-light rounded-lg font-semibold"
                disabled={isUpdating}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="bg-white rounded-xl shadow-elegant p-6">
          <h2 className="text-xl font-semibold mb-4">Current Videos</h2>
          {loading ? (
            <p>Loading videos...</p>
          ) : videos.length === 0 ? (
            <p>No videos yet.</p>
          ) : (
            <div className="space-y-3">
              {videos.map((video) => (
                <div key={video.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-light rounded-lg px-3 py-2">
                  <div>
                    <p className="font-semibold">{video.title}</p>
                    <p className="text-sm text-text-dark/70">{video.type} | {video.tools}</p>
                    <p className="text-xs text-text-dark/60 break-all">{resolveVideoUrl(video.videoUrl)}</p>
                    {video.thumbnailUrl && (
                      <p className="text-xs text-text-dark/60 break-all">Thumb: {video.thumbnailUrl}</p>
                    )}
                  </div>
                  {isAuthed && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(video)}
                        className="px-3 py-2 text-sm rounded-lg bg-beige text-text-dark font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(video.id)}
                        className="px-3 py-2 text-sm rounded-lg bg-red-100 text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
