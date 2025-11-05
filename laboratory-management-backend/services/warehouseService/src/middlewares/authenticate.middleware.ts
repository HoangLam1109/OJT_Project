import type { Request, Response, NextFunction } from "express";

const authenticateUser = (_req: Request, _res: Response, next: NextFunction): void => {
  next();
};

export default { authenticateUser };
