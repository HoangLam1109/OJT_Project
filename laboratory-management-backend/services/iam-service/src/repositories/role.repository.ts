// Role repository interface
export interface IRoleRepository {
  findById(id: string, fields?: string): Promise<any>;
  findByRoleCode(roleCode: string): Promise<any>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// Role repository implementation
export class RoleRepository implements IRoleRepository {
  constructor(private roleModel: any) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.roleModel.findById(id, fields || "_id roleCode roleName description isSystemRole isActive");
  }

  async findByRoleCode(roleCode: string): Promise<any> {
    return await this.roleModel.findOne({ roleCode });
  }

  async create(userData: any): Promise<any> {
    const role = new this.roleModel(userData);
    return await role.save();
  }

  async updateById(id: string, userData: any): Promise<any> {
    return await this.roleModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    return await this.roleModel.findByIdAndDelete(id);
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.roleModel.find({}, fields);
  }
}
