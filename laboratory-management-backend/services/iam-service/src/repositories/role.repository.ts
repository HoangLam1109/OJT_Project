/*

import { USER_ROLE_PRIVILEGES } from "../constants/privileges.constant.js";
import { SYSTEM_ROLES } from "../constants/roles.constant.js";

// Role repository interface
export interface IRoleRepository {
  findById(id: string, fields?: string): Promise<any>;
  findByRoleCode(roleCode: string): Promise<any>;
  findUserByRoleId(roleId: string): Promise<any>;
  create(userData: any): Promise<any>;
  updateById(id: string, userData: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  findAll(fields?: string): Promise<any[]>;
}

// Role repository implementation
export class RoleRepository implements IRoleRepository {
  constructor(
    private roleModel: any,
    private userRoleModel: any,
    private rolePrivilegeModel: any
  ) {}

  async findById(id: string, fields?: string): Promise<any> {
    return await this.roleModel.findById(
      id,
      fields || "_id roleCode roleName description isSystemRole isActive"
    );
  }

  async findByRoleCode(roleCode: string): Promise<any> {
    return await this.roleModel.findOne({ roleCode });
  }

  async findUserByRoleId(roleId: string): Promise<any> {
    return await this.userRoleModel.find({ roleId });
  }

  async create(userData: any, performedBy?: string): Promise<any> {
    if(SYSTEM_ROLES.includes(userData.roleCode)) {
      userData.isSystemRole = true;
    }
    const role = new this.roleModel(userData);
    const savedRole = await role.save();

    const privilegeIds = userData.privileges?.map(
      (privilege: any) => privilege._id
    ) || [USER_ROLE_PRIVILEGES.READ_ONLY.code];

    if (privilegeIds.length > 0) {
      for (const privilegeId of privilegeIds) {
        const rolePrivilege = new this.rolePrivilegeModel({
          roleId: savedRole._id,
          privilegeId: privilegeId,
          createdBy: performedBy,
        });
        await rolePrivilege.save();
      }
    }

    return savedRole;
  }

  async updateById(id: string, userData: any, performedBy?: string): Promise<any> {
    if(SYSTEM_ROLES.includes(userData.roleCode)) {
      userData.isSystemRole = true;
    }
    await this.rolePrivilegeModel.deleteMany({ roleId: id });

    const newPrivilegeIds = userData.privileges?.map(
      (privilege: any) => privilege._id
    ) || [USER_ROLE_PRIVILEGES.READ_ONLY.code];
    for (const privilegeId of newPrivilegeIds) {
      const rolePrivilege = new this.rolePrivilegeModel({
        roleId: id,
        privilegeId: privilegeId,
        createdBy: performedBy,
      });
      await rolePrivilege.save();
    }

    return await this.roleModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteById(id: string): Promise<any> {
    await this.rolePrivilegeModel.deleteMany({ roleId: id });
    return await this.roleModel.findByIdAndDelete(id);
  }

  async findAll(fields?: string): Promise<any[]> {
    return await this.roleModel.find({}, fields);
  }
}

*/