import User from "../db/models/User.model.js";
import { UserRepository } from "./user.repository.js";
import AuditLog from "../db/models/AuditLog.model.js";
import { AuditLogRepository } from "./auditLog.repository.js";

// Repository factory
export class RepositoryFactory {
  private static userRepository: UserRepository;
  private static auditLogRepository: AuditLogRepository;

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
}

// Export individual repositories for convenience
export const userRepository = RepositoryFactory.getUserRepository();
export const auditLogRepository = RepositoryFactory.getAuditLogRepository();
