import type { Request, Response, NextFunction } from "express";

export const isInternalApiKeyValid = (req: Request): boolean => {
  const apiKey = req.headers["x-internal-api-key"];
  const expectedKey = process.env.INTERNAL_API_KEY || "internal-service-secret-key";
  return typeof apiKey === "string" && apiKey === expectedKey;
};

export const authenticateInternalApi = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!isInternalApiKeyValid(req)) {
    res.status(403).json({ message: "Forbidden: Invalid or missing internal API key" });
    return;
  }
  next();
};
