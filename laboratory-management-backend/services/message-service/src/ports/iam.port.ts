// IamUserPort.ts
export interface User {
  _id: string;
  email: string;
  fullName: string;
  avatar: string;
  phoneNumber: string;
  isActive: boolean;
  role?: string[];
}

export interface IIamServiceClient {
  getUserById(userId: string): Promise<User | null>;
  validateUser(userId: string): Promise<boolean>;
}