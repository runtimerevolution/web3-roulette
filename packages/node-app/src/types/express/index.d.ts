declare global {
  declare module 'express' {
    interface Request {
      user: User;
    }
  }
}
