import { randomBytes, randomUUID } from "crypto";
import { userSessionRepository } from "../repositories/index.js";
import { auditLogRepository } from "../repositories/index.js";
import type { IUserSession } from "../db/models/UserSession.model.js";

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
  /**
   * Create a new user session
   */
  async createSession(sessionData: CreateSessionData): Promise<IUserSession> {
    // Generate a secure session token
    const sessionToken = this._generateSessionToken();
    const refreshToken = this._generateRefreshToken();

    // Set default expiration (24 hours from now)
    const expiresAt = sessionData.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newSession = await userSessionRepository.create({
      ...sessionData,
      userId: sessionData.userId as any, // Cast to UUID type
      sessionToken,
      refreshToken,
      expiresAt,
      isActive: true
    });

    return newSession;
  }

  /**
   * Get session by token with caching support
   */
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

  /**
   * Invalidate a specific session
   */
  async invalidateSession(sessionId: string): Promise<boolean> {
    const session = await userSessionRepository.findById(sessionId);

    if (!session) {
      return false;
    }

    // Update session to inactive
    await userSessionRepository.updateById(sessionId, { isActive: false });
    return true;
  }

  /**
   * Invalidate all sessions for a specific user
   */
  async invalidateAllUserSessions(userId: string): Promise<number> {
    const invalidatedCount = await userSessionRepository.invalidateAllUserSessions(userId);
    return invalidatedCount;
  }

  /**
   * Refresh a session (extend expiration time)
   */
  async refreshSession(sessionId: string): Promise<IUserSession | null> {
    const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Extend by 24 hours

    const updatedSession = await userSessionRepository.updateById(sessionId, {
      expiresAt: newExpiresAt
    });

    return updatedSession;
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