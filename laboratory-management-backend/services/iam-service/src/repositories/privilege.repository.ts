// Role repository interface
export interface IPrivilegeRepository {
  findById(id: string, fields?: string): Promise<any>;
  findByPrivilegeName(privilegeName: string): Promise<any>;
  findByPrivilegeCode(privilegeCode: string): Promise<any>;
  findRoleByPrivilegeId(privilegeId: string): Promise<any>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// Role repository implementation
export class PrivilegeRepository implements IPrivilegeRepository {
  constructor(private privilegeModel: any, private rolePrivilegeModel: any) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.privilegeModel.findById(id, fields || "_id privilegeCode privilegeName description isSystemPrivilege isActive");
  }

  async findByPrivilegeName(privilegeName: string): Promise<any> {
    return await this.privilegeModel.findOne({ privilegeName });
  }

  async findByPrivilegeCode(privilegeCode: string): Promise<any> {
    return await this.privilegeModel.findOne({ privilegeCode });
  }

  async findRoleByPrivilegeId(privilegeId: string): Promise<any> {
    return await this.rolePrivilegeModel.find({ privilegeId });
  }

  async create(userData: any): Promise<any> {
    const privilege = new this.privilegeModel(userData);
    return await privilege.save();
  }

  async updateById(id: string, userData: any): Promise<any> {
    return await this.privilegeModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    return await this.privilegeModel.findByIdAndDelete(id);
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.privilegeModel.find({}, fields);
  }
}
