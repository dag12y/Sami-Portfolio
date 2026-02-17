import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload } from './types.js';
import { prisma } from './db.js';
import bcrypt from 'bcryptjs';

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'change-me-jwt-secret';
}

export function createToken(payload: AuthPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export async function verifyAdminCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);

  if (!matches) {
    return null;
  }

  return user;
}

export interface AuthedRequest extends Request {
  auth?: AuthPayload;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing auth token' });
  }

  const token = auth.slice(7);

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AuthPayload;
    req.auth = payload;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.auth || req.auth.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  return next();
}
