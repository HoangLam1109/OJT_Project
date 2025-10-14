import User from "../db/models/User.model.js";
import Role from "../db/models/Role.model.js";
import AuditLog from "../db/models/AuditLog.model.js";
import UserSession from "../db/models/UserSession.model.js";

import { UserRepository } from "./user.repository.js";
import { AuditLogRepository } from "./auditLog.repository.js";
import { RoleRepository } from "./role.repository.js";
import { UserSessionRepository } from "./session.repository.js";

// Repository factory
export class RepositoryFactory {
  private static userRepository: UserRepository;
  private static auditLogRepository: AuditLogRepository;
  private static roleRepository: RoleRepository;
  private static userSessionRepository: UserSessionRepository;

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

  static getRoleRepository(): RoleRepository {
    if (!this.roleRepository) {
      this.roleRepository = new RoleRepository(Role);
    }
    return this.roleRepository;
  }

  static getUserSessionRepository(): UserSessionRepository {
    if (!this.userSessionRepository) {
      // Pass null for Redis client since we're using mock
      this.userSessionRepository = new UserSessionRepository(UserSession, null);
    }
    return this.userSessionRepository;
  }
}

// Export individual repositories for convenience
export const userRepository = RepositoryFactory.getUserRepository();
export const auditLogRepository = RepositoryFactory.getAuditLogRepository();
export const roleRepository = RepositoryFactory.getRoleRepository();
export const userSessionRepository = RepositoryFactory.getUserSessionRepository();
