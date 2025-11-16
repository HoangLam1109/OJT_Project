import axios from "axios";
import type { User, IIamServiceClient } from "../ports/iam.port.js";

class IamServiceClient implements IIamServiceClient {
  private baseUrl: string;
  private internalKey: string;

  constructor() {
    this.baseUrl = process.env.IAM_SERVICE_URL ?? "http://localhost:3000";
    this.internalKey =
      process.env.INTERNAL_API_KEY ?? "internal-service-secret-key-2025";
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const res = await axios.get<{ user: User }>(
        `${this.baseUrl}/api/internal/${userId}`,
        {
          headers: { "X-Internal-API-Key": this.internalKey },
        }
      );
      return res.data.user;
    } catch {
      return null;
    }
  }

  async validateUser(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user?.isActive ?? false;
  }
}

export default new IamServiceClient();