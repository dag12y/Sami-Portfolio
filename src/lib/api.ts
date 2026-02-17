import type { Video } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const TOKEN_KEY = 've_admin_token';

export function getApiBase() {
  return API_BASE;
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function withBase(url: string) {
  return `${API_BASE}${url}`;
}

export async function fetchVideos(): Promise<Video[]> {
  const response = await fetch(withBase('/api/videos'));

  if (!response.ok) {
    throw new Error('Failed to load videos');
  }

  return response.json();
}

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  message: string;
}) {
  const response = await fetch(withBase('/api/contact'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to send message' }));
    throw new Error(error.message || 'Failed to send message');
  }
}

export async function loginAdmin(username: string, password: string) {
  const response = await fetch(withBase('/api/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const data = (await response.json()) as { token: string };
  setAuthToken(data.token);
}

export async function createVideo(payload: {
  title: string;
  type: string;
  tools: string;
  videoUrl?: string;
  videoFile?: File;
  thumbnailUrl?: string;
  thumbnailFile?: File;
  onProgress?: (percent: number) => void;
}) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const form = new FormData();
  form.append('title', payload.title);
  form.append('type', payload.type);
  form.append('tools', payload.tools);

  if (payload.videoUrl) {
    form.append('videoUrl', payload.videoUrl);
  }

  if (payload.videoFile) {
    form.append('videoFile', payload.videoFile);
  }
  if (payload.thumbnailUrl !== undefined) {
    form.append('thumbnailUrl', payload.thumbnailUrl);
  }
  if (payload.thumbnailFile) {
    form.append('thumbnailFile', payload.thumbnailFile);
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', withBase('/api/videos'));
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (!payload.onProgress || !event.lengthComputable) {
        return;
      }

      const percent = Math.round((event.loaded / event.total) * 100);
      payload.onProgress(percent);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        payload.onProgress?.(100);
        resolve();
        return;
      }

      try {
        const parsed = JSON.parse(xhr.responseText) as { message?: string };
        reject(new Error(parsed.message || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error(xhr.responseText || `Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error while uploading'));
    };

    xhr.send(form);
  });
}

export async function updateVideo(
  videoId: string,
  payload: {
    title: string;
    type: string;
    tools: string;
    videoUrl?: string;
    videoFile?: File;
    thumbnailUrl?: string;
    thumbnailFile?: File;
  }
) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const form = new FormData();
  form.append('title', payload.title);
  form.append('type', payload.type);
  form.append('tools', payload.tools);
  form.append('videoUrl', payload.videoUrl || '');
  form.append('thumbnailUrl', payload.thumbnailUrl || '');

  if (payload.videoFile) {
    form.append('videoFile', payload.videoFile);
  }
  if (payload.thumbnailFile) {
    form.append('thumbnailFile', payload.thumbnailFile);
  }

  const response = await fetch(withBase(`/api/videos/${videoId}`), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Update failed' }));
    throw new Error(error.message || 'Update failed');
  }
}

export async function deleteVideo(videoId: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(withBase(`/api/videos/${videoId}`), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Delete failed' }));
    throw new Error(error.message || 'Delete failed');
  }
}
