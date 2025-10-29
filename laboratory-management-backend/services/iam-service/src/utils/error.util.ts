import type { Response } from "express";

export const errorHandler = (res: Response, error: any) => {
  const status = typeof error?.status === "number" ? error.status : 500;
  const message = error?.message ?? "Server Error!";

  console.error('Error details:', error);

  res.status(status).json({
    message,
    error: error?.error ?? message
  });
};