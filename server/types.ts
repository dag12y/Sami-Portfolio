export interface AuthPayload {
  userId: string;
  username: string;
  role: 'admin' | 'editor';
}
