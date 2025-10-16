import { randomBytes, randomUUID } from "crypto";
import { userSessionRepository } from "../repositories/index.js";
import { auditLogRepository } from "../repositories/index.js";
import type { IUserSession } from "../db/models/UserSession.model.js";
import { SESSION_DURATION } from "../config/env.config.js";

export interface CreateSessionData {
  userId: string;
  expiresAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionValidationResult {
  isValid: boolean;
  session?: IUserSession;
  error?: string;
}

export class SessionService {
  async createSession(sessionData: CreateSessionData): Promise<IUserSession> {
    const sessionToken = this._generateSessionToken();
    const refreshToken = this._generateRefreshToken();

    const expiresAt = sessionData.expiresAt || new Date(Date.now() + SESSION_DURATION);

    const existingSessions = await this.getUserSessions(sessionData.userId);
    const activeSessions = existingSessions.filter(s => s.isActive);
    
    if (activeSessions.length >= 5) {
      await this.invalidateSession(activeSessions[0]?._id as string);
    }
    
    const newSession = await userSessionRepository.create({
      ...sessionData,
      userId: sessionData.userId as any,
      sessionToken,
      refreshToken,
      expiresAt,
      isActive: true
    });

    return newSession;
  }

  async getSessionByToken(token: string): Promise<IUserSession | null> {
    return await userSessionRepository.findBySessionToken(token);
  }

  async getSessionById(sessionId: string): Promise<IUserSession | null> {
    return await userSessionRepository.findById(sessionId);
  }

  async validateSession(token: string): Promise<SessionValidationResult> {
    const session = await this.getSessionByToken(token);
    console.log(session);

    if (!session) {
      return { isValid: false, error: "Session not found" };
    }

    if (!session.isActive) {
      return { isValid: false, error: "Session is inactive", session };
    }

    if (new Date() > session.expiresAt) {
      // Mark session as inactive when expired
      await this.invalidateSession(session._id);
      return { isValid: false, error: "Session expired", session };
    }

    return { isValid: true, session };
  }

  async invalidateSession(sessionId: string): Promise<boolean> {
    const session = await userSessionRepository.findById(sessionId);

    if (!session) {
      return false;
    }

    await userSessionRepository.updateById(sessionId, { isActive: false });
    return true;
  }

  async invalidateAllUserSessions(userId: string): Promise<number> {
    const invalidatedCount = await userSessionRepository.invalidateAllUserSessions(userId);
    return invalidatedCount;
  }

  async refreshSession(sessionId: string): Promise<IUserSession | null> {
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const updatedSession = await userSessionRepository.updateById(sessionId, {
      expiresAt: newExpiresAt
    });

    return updatedSession;
  }

  async validateRefreshToken(sessionId: string, refreshToken: string): Promise<boolean> {
    const session = await userSessionRepository.findById(sessionId);
    if (!session || !session.refreshToken || session.refreshToken !== refreshToken) {
      return false;
    }
    return true;
  }

  async refreshSessionWithToken(sessionId: string, providedRefreshToken: string): Promise<{ newSessionToken: string; newRefreshToken: string } | null> {
    const isValid = await this.validateRefreshToken(sessionId, providedRefreshToken);
    if (!isValid) {
      await this.invalidateSession(sessionId); 
      return null;
    }

    const session = await userSessionRepository.findById(sessionId);
    if (!session) return null;

    const newSessionToken = this._generateSessionToken();
    const newRefreshToken = this._generateRefreshToken();
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const updatedSession = await userSessionRepository.updateById(sessionId, {
      sessionToken: newSessionToken,
      refreshToken: newRefreshToken,
      expiresAt: newExpiresAt
    });

    if (updatedSession) {
      return { newSessionToken, newRefreshToken };
    }
    return null;
  }

  async getUserSessions(userId: string): Promise<IUserSession[]> {
    return await userSessionRepository.findByUserId(userId) as IUserSession[];
  }

  async cleanupExpiredSessions(): Promise<number> {
    const expiredSessions = await userSessionRepository.findAll();
    let cleanedCount = 0;

    for (const session of expiredSessions) {
      if (new Date() > session.expiresAt) {
        await userSessionRepository.updateById(session._id, { isActive: false });
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  private _generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }

  private _generateRefreshToken(): string {
    return randomBytes(64).toString('hex');
  }
}