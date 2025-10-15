import type { IUserSession } from '../db/models/UserSession.model.js';

export interface IUserSessionRepository {
  create(sessionData: Partial<IUserSession>): Promise<IUserSession>;
  findBySessionToken(token: string): Promise<IUserSession | null>;
  findById(id: string, fields?: string): Promise<IUserSession | null>;
  findByUserId(userId: string): Promise<IUserSession[]>;
  updateById(id: string, sessionData: Partial<IUserSession>): Promise<IUserSession | null>;
  invalidateAllUserSessions(userId: string): Promise<number>;
  findAll(fields?: string): Promise<any[]>;
  cacheSession(sessionId: string, sessionData: any): Promise<void>;
  getCachedSession(token: string): Promise<IUserSession | null>;
}

export class UserSessionRepository implements IUserSessionRepository {
  constructor(
    private userSessionModel: any,
    private redisClient: any
  ) {}

  async create(sessionData: Partial<IUserSession>): Promise<IUserSession> {
    const session = new this.userSessionModel(sessionData);
    const savedSession = await session.save();
    
    // Also cache in Redis for fast access (if Redis is available)
    if (this.redisClient) {
      await this.cacheSession(savedSession._id, {
        userId: savedSession.userId,
        isActive: savedSession.isActive,
        expiresAt: savedSession.expiresAt
      });
    } else {
      console.log(`[SESSION REPO] Redis disabled - skipping cache for new session ${savedSession._id}`);
    }
    
    return savedSession;
  }

  async findBySessionToken(token: string): Promise<IUserSession | null> {
    // Check Redis cache first for performance (if Redis is available)
    const cached = await this.getCachedSession(token);
    if (cached) return cached;
    
    // Fallback to database
    return await this.userSessionModel.findOne({ sessionToken: token })
      .populate('userId');
  }

  async invalidateAllUserSessions(userId: string): Promise<number> {
    // Invalidate in database
    const result = await this.userSessionModel.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
    // Remove from Redis cache (if Redis is available)
    if (this.redisClient) {
      console.log(`[SESSION REPO] Redis disabled - skipping cache invalidation for user ${userId}`);
    }
    
    return result.modifiedCount;
  }

  async findById(id: string, fields?: string): Promise<IUserSession | null> {
    return await this.userSessionModel.findById(id, fields)
      .populate('userId');
  }

  async findByUserId(userId: string): Promise<IUserSession[]> {
    return await this.userSessionModel.find({ userId })
      .populate('userId');
  }

  async updateById(id: string, sessionData: Partial<IUserSession>): Promise<IUserSession | null> {
    return await this.userSessionModel.findByIdAndUpdate(id, sessionData, { new: true })
      .populate('userId');
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.userSessionModel.find({})
      .select(fields)
      .populate('userId');
  }

  async cacheSession(sessionId: string, sessionData: any): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.set(sessionId, JSON.stringify(sessionData));
    } else {
      console.log(`[SESSION REPO] Redis disabled - skipping cache for session ${sessionId}`);
    }
  }

  async getCachedSession(token: string): Promise<IUserSession | null> {
    if (this.redisClient) {
      const cached = await this.redisClient.get(token);
      if (cached) return JSON.parse(cached);
    } else {
      console.log(`[SESSION REPO] Redis disabled - cache miss for token ${token}`);
    }
    return null;
  }
}