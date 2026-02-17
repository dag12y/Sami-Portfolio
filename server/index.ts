import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { createToken, requireAdmin, requireAuth, type AuthedRequest, verifyAdminCredentials } from './auth.js';
import { prisma } from './db.js';
import { deleteCloudinaryImage, deleteCloudinaryVideo, isCloudinaryConfigured, uploadImageBuffer, uploadVideoBuffer } from './cloudinary.js';
import { isMailConfigured, sendContactEmail } from './mail.js';

const app = express();

const port = Number(process.env.PORT || 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 300 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
      return;
    }

    cb(new Error('Only video uploads are allowed'));
  },
});

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({
      ok: true,
      db: 'connected',
      cloudinary: isCloudinaryConfigured() ? 'configured' : 'missing',
      mail: isMailConfigured() ? 'configured' : 'missing',
    });
  } catch {
    return res.status(500).json({ ok: false, db: 'disconnected' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = await verifyAdminCredentials(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createToken({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
});

app.get('/api/auth/me', requireAuth, async (req: AuthedRequest, res) => {
  const auth = req.auth;

  if (!auth) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'User no longer exists' });
  }

  return res.json(user);
});

app.get('/api/users', requireAuth, requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json(users);
});

app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const { username, password, role } = req.body as {
    username?: string;
    password?: string;
    role?: 'admin' | 'editor';
  };

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        passwordHash,
        role: role === 'admin' ? 'admin' : 'editor',
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  } catch {
    return res.status(409).json({ message: 'Username already exists' });
  }
});

app.get('/api/videos', async (_req, res) => {
  const videos = await prisma.video.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return res.json(videos);
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body as {
    name?: string;
    email?: string;
    message?: string;
  };

  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  const trimmedMessage = (message || '').trim();

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ message: 'name, email and message are required' });
  }

  if (trimmedName.length > 120 || trimmedEmail.length > 200 || trimmedMessage.length > 3000) {
    return res.status(400).json({ message: 'Message is too long' });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  const created = await prisma.contactMessage.create({
    data: {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
    },
  });

  try {
    await sendContactEmail({
      name: created.name,
      email: created.email,
      message: created.message,
      messageId: created.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return res.status(500).json({
      message: `Message saved but email notification failed: ${message}`,
    });
  }

  return res.status(201).json({ id: created.id });
});

app.post('/api/videos', requireAuth, upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 },
]), async (req: AuthedRequest, res) => {
  try {
    const { title, type, tools, videoUrl } = req.body as {
      title?: string;
      type?: string;
      tools?: string;
      videoUrl?: string;
      thumbnailUrl?: string;
    };

    if (!title || !type || !tools) {
      return res.status(400).json({ message: 'title, type, and tools are required' });
    }

    let uploadedCloudinary:
      | {
          secureUrl: string;
          publicId: string;
        }
      | null = null;
    let uploadedThumbnail:
      | {
          secureUrl: string;
          publicId: string;
        }
      | null = null;

    const files = (req.files || {}) as Record<string, Express.Multer.File[]>;
    const videoFile = files.videoFile?.[0];
    const thumbnailFile = files.thumbnailFile?.[0];

    if (videoFile) {
      uploadedCloudinary = await uploadVideoBuffer(videoFile.buffer, videoFile.originalname || 'video');
    }

    if (thumbnailFile) {
      uploadedThumbnail = await uploadImageBuffer(thumbnailFile.buffer, thumbnailFile.originalname || 'thumbnail');
    }

    const finalVideoUrl = uploadedCloudinary?.secureUrl || (videoUrl || '').trim();
    const finalThumbnailUrl = uploadedThumbnail?.secureUrl || (thumbnailUrl || '').trim() || null;

    if (!finalVideoUrl) {
      return res.status(400).json({ message: 'Provide either a video file or an external video URL' });
    }

    const video = await prisma.video.create({
      data: {
        title: title.trim(),
        type: type.trim(),
        tools: tools.trim(),
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl,
        cloudinaryPublicId: uploadedCloudinary?.publicId || null,
        cloudinaryThumbnailPublicId: uploadedThumbnail?.publicId || null,
        source: videoFile ? 'uploaded' : 'external',
        uploadedById: req.auth?.userId || null,
      },
    });

    return res.status(201).json(video);
  } catch (error) {
    const unknownError = error as { message?: string; error?: { message?: string } };
    const message = error instanceof Error ? error.message : unknownError?.message || unknownError?.error?.message || 'Upload failed';
    return res.status(400).json({ message });
  }
});

app.put('/api/videos/:id', requireAuth, upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnailFile', maxCount: 1 },
]), async (req: AuthedRequest, res) => {
  const { id } = req.params;
  const existing = await prisma.video.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({ message: 'Video not found' });
  }

  try {
    const { title, type, tools, videoUrl, thumbnailUrl } = req.body as {
      title?: string;
      type?: string;
      tools?: string;
      videoUrl?: string;
      thumbnailUrl?: string;
    };

    const files = (req.files || {}) as Record<string, Express.Multer.File[]>;
    const videoFile = files.videoFile?.[0];
    const thumbnailFile = files.thumbnailFile?.[0];

    let nextVideoUrl = existing.videoUrl;
    let nextSource = existing.source;
    let nextCloudinaryPublicId = existing.cloudinaryPublicId;

    if (videoFile) {
      const uploadedVideo = await uploadVideoBuffer(videoFile.buffer, videoFile.originalname || 'video');
      nextVideoUrl = uploadedVideo.secureUrl;
      nextSource = 'uploaded';
      nextCloudinaryPublicId = uploadedVideo.publicId;

      if (existing.cloudinaryPublicId) {
        await deleteCloudinaryVideo(existing.cloudinaryPublicId);
      }
    } else if (typeof videoUrl === 'string' && videoUrl.trim()) {
      nextVideoUrl = videoUrl.trim();
      nextSource = 'external';
      if (existing.cloudinaryPublicId) {
        await deleteCloudinaryVideo(existing.cloudinaryPublicId);
      }
      nextCloudinaryPublicId = null;
    }

    let nextThumbnailUrl = existing.thumbnailUrl;
    let nextCloudinaryThumbnailPublicId = existing.cloudinaryThumbnailPublicId;

    if (thumbnailFile) {
      const uploadedThumbnail = await uploadImageBuffer(thumbnailFile.buffer, thumbnailFile.originalname || 'thumbnail');
      nextThumbnailUrl = uploadedThumbnail.secureUrl;
      nextCloudinaryThumbnailPublicId = uploadedThumbnail.publicId;

      if (existing.cloudinaryThumbnailPublicId) {
        await deleteCloudinaryImage(existing.cloudinaryThumbnailPublicId);
      }
    } else if (typeof thumbnailUrl === 'string') {
      const trimmed = thumbnailUrl.trim();
      if (trimmed) {
        nextThumbnailUrl = trimmed;
        if (existing.cloudinaryThumbnailPublicId) {
          await deleteCloudinaryImage(existing.cloudinaryThumbnailPublicId);
        }
        nextCloudinaryThumbnailPublicId = null;
      } else {
        nextThumbnailUrl = null;
        if (existing.cloudinaryThumbnailPublicId) {
          await deleteCloudinaryImage(existing.cloudinaryThumbnailPublicId);
        }
        nextCloudinaryThumbnailPublicId = null;
      }
    }

    const updated = await prisma.video.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        type: type?.trim() || existing.type,
        tools: tools?.trim() || existing.tools,
        videoUrl: nextVideoUrl,
        source: nextSource,
        thumbnailUrl: nextThumbnailUrl,
        cloudinaryPublicId: nextCloudinaryPublicId,
        cloudinaryThumbnailPublicId: nextCloudinaryThumbnailPublicId,
      },
    });

    return res.json(updated);
  } catch (error) {
    const unknownError = error as { message?: string; error?: { message?: string } };
    const message = error instanceof Error ? error.message : unknownError?.message || unknownError?.error?.message || 'Update failed';
    return res.status(400).json({ message });
  }
});

app.delete('/api/videos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    return res.status(404).json({ message: 'Video not found' });
  }

  await prisma.video.delete({
    where: { id },
  });

  if (video.source === 'uploaded' && video.cloudinaryPublicId) {
    await deleteCloudinaryVideo(video.cloudinaryPublicId);
  }
  if (video.cloudinaryThumbnailPublicId) {
    await deleteCloudinaryImage(video.cloudinaryThumbnailPublicId);
  }

  return res.status(204).send();
});

app.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  void next;
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large. Max allowed size is 300MB.' });
  }

  return res.status(400).json({ message: error.message || 'Request failed' });
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log('DB connected');
  } catch (error) {
    console.error('DB connection failed', error);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

void startServer();
