// User repository interface
export interface IAuditLogRepository {
  findById(id: string, fields?: string): Promise<any>;
  findByUserId(userId: string): Promise<any>;
  findByRoleId(roleId: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// User repository implementation
export class UserRoleRepository implements IAuditLogRepository {
  constructor(private userRoleModel: any) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.userRoleModel.findById(id, fields || "_id roleId userId createdAt createdBy");
  }

  async findByUserId(userId: string): Promise<any> {
    return await this.userRoleModel.findOne({ userId });
  }

  async findByRoleId(roleId: string): Promise<any> {
    return await this.userRoleModel.findOne({ roleId });
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.userRoleModel.find({}, fields);
  }
}
