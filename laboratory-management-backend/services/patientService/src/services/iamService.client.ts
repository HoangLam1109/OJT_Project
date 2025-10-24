import HttpClient from "../utils/httpClient.util.js";

// IAM Service User Interface
export interface IamUser {
  _id: string;
  email: string;
  fullName: string;
  identityNumber: string;
  gender: string;
  age: number;
  dateOfBirth: string;
  isActive: boolean;
  role: string;
}

export class IamServiceClient {
  private baseUrl: string;
  private internalApiKey: string;

  constructor() {
    // IAM Service URL from environment or default
    this.baseUrl = process.env.IAM_SERVICE_URL || "http://localhost:3000";
    this.internalApiKey = process.env.INTERNAL_API_KEY || "internal-service-secret-key";
  }

  /**
   * Get user by ID from IAM Service
   */
  async getUserById(userId: string): Promise<IamUser | null> {
    try {
      const url = `${this.baseUrl}/api/user/${userId}`;
      const headers = {
        'X-Internal-API-Key': this.internalApiKey, // Internal service authentication
      };

      const response = await HttpClient.get<{ user: IamUser }>(url, headers);
      return response.user;
    } catch (error: any) {
      console.error(`[IAM Service] Error fetching user ${userId}:`, error.message);
      return null; // Return null if user not found or service unavailable
    }
  }

  /**
   * Get all users from IAM Service
   */
  async getAllUsers(): Promise<IamUser[]> {
    try {
      const url = `${this.baseUrl}/api/user/all`;
      const headers = {
        'X-Internal-API-Key': this.internalApiKey,
      };

      const response = await HttpClient.get<IamUser[]>(url, headers);
      return response;
    } catch (error: any) {
      console.error('[IAM Service] Error fetching all users:', error.message);
      return [];
    }
  }

  /**
   * Get multiple users by IDs (batch request)
   */
  async getUsersByIds(userIds: string[]): Promise<Map<string, IamUser>> {
    const userMap = new Map<string, IamUser>();

    if (userIds.length === 0) return userMap;

    try {
      // Use Promise.all to fetch users in parallel
      const userPromises = userIds.map((id) => this.getUserById(id));
      const users = await Promise.all(userPromises);

      users.forEach((user, index) => {
        if (user) {
          userMap.set(userIds[index], user);
        }
      });

      return userMap;
    } catch (error: any) {
      console.error('[IAM Service] Error fetching multiple users:', error.message);
      return userMap;
    }
  }

  /**
   * Validate if user exists and is active
   */
  async validateUser(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user !== null && user.isActive === true;
  }
}

export default new IamServiceClient();
