// Extend the Express Request interface globally to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Using any for now to avoid type conflicts
    }
  }
}
