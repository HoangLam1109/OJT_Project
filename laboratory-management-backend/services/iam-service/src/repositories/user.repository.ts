// User repository interface
export interface IUserRepository {
  findById(id: string, fields?: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  findByIdentityNumber(identityNumber: string): Promise<any>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// User repository implementation
export class UserRepository implements IUserRepository {
  constructor(private userModel: any) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.userModel.findById(
      id,
      fields ||
        "_id email fullName phoneNumber identityNumber gender age dateOfBirth address"
    );
  }

  async findByEmail(email: string): Promise<any> {
    return await this.userModel.findOne({ email });
  }

  async findByIdentityNumber(identityNumber: string): Promise<any> {
    return await this.userModel.findOne({ identityNumber });
  }

  async create(userData: any): Promise<any> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  async updateById(id: string, userData: any): Promise<any> {
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    return await this.userModel.findByIdAndDelete(id);
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.userModel.find({}, fields);
  }
}
