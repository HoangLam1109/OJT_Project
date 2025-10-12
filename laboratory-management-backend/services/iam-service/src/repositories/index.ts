import User from "../db/models/User.model.js";
import { UserRepository } from "./user.repository.js";

// Repository factory
export class RepositoryFactory {
  private static userRepository: UserRepository;

  static getUserRepository(): UserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository(User);
    }
    return this.userRepository;
  }
}

// Export individual repositories for convenience
export const userRepository = RepositoryFactory.getUserRepository();
