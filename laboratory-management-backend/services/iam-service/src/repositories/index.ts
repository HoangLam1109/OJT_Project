import User from "../db/models/User.model.js";
import AuditLog from "../db/models/AuditLog.model.js";
import UserSession from "../db/models/UserSession.model.js";
import PasswordHistory from "../db/models/PasswordHistory.model.js";

import { UserRepository } from "./user.repository.js";
import { AuditLogRepository } from "./auditLog.repository.js";
import { UserSessionRepository } from "./session.repository.js";
import { PasswordHistoryRepository } from "./passwordHistory.repository.js";


// Repository factory
export class RepositoryFactory {
  private static userRepository: UserRepository;

  private static auditLogRepository: AuditLogRepository;
  private static userSessionRepository: UserSessionRepository;
  private static passwordHistoryRepository: PasswordHistoryRepository;

  static async initializeRepositories(): Promise<void> {
    // Redis is disabled - using mock client, no initialization needed
    console.log('Redis disabled - using mock client');
  }

  static getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository(User);
    }
    return this.userRepository;
  }

  static getAuditLogRepository(): AuditLogRepository {
    if (!this.auditLogRepository) {
      this.auditLogRepository = new AuditLogRepository(AuditLog);
    }
    return this.auditLogRepository;
  }

  static getUserSessionRepository(): UserSessionRepository {
    if (!this.userSessionRepository) {
      // Pass null for Redis client since we're using mock
      this.userSessionRepository = new UserSessionRepository(UserSession, null);
    }
    return this.userSessionRepository;
  }

  static getPasswordHistoryRepository(): PasswordHistoryRepository {
    if (!this.passwordHistoryRepository) {
      this.passwordHistoryRepository = new PasswordHistoryRepository(PasswordHistory);
    }
    return this.passwordHistoryRepository;
  }
}

// Export individual repositories for convenience
export const userRepository = RepositoryFactory.getUserRepository();
export const auditLogRepository = RepositoryFactory.getAuditLogRepository();

export const userSessionRepository = RepositoryFactory.getUserSessionRepository();
export const passwordHistoryRepository = RepositoryFactory.getPasswordHistoryRepository();
