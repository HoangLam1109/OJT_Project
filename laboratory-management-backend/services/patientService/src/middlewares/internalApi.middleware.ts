import type { Request, Response, NextFunction } from "express";

const authenticateInternalApi = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-internal-api-key'];
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!expectedKey) {
    res.status(500).json({ message: 'Internal API not configured' });
    return;
  }

  if (!apiKey || apiKey !== expectedKey) {
    res.status(401).json({ message: 'Invalid or missing internal API key' });
    return;
  }

  next();
};

export default authenticateInternalApi;
