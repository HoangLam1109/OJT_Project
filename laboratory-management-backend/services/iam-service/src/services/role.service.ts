import bcrypt from "bcryptjs";
import { roleRepository } from "../repositories/index.js";
import { auditLogRepository } from "../repositories/index.js";
import type { IRole } from "../db/models/Role.model.js";

export interface CreateRoleData {
  roleCode: string;
  roleName: string;
  description?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
}

export interface UpdateRoleData {
  roleCode?: string;
  roleName?: string;
  description?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
}

export class RoleService {
  async getRole(roleId: string): Promise<IRole | null> {
    return await roleRepository.findById(roleId, "_id roleCode roleName description isSystemRole isActive");
  }

  async createRole(roleData: CreateRoleData, performedBy?: string): Promise<IRole> {
    const newRole = await roleRepository.create(roleData);

    await this._logEvent("E_00001", "CREATE", "Role created successfully!", performedBy || newRole._id);
    return newRole;
  }

  async updateRole(roleId: string, roleData: UpdateRoleData, performedBy?: string): Promise<IRole | null> {
    const updatedRole = await roleRepository.updateById(roleId, roleData);

    await this._logEvent("E_00002", "UPDATE", "Role updated successfully!", performedBy || roleId);
    return updatedRole;
  }

  async deleteRole(roleId: string, performedBy?: string): Promise<IRole | null> {
    const deletedRole = await roleRepository.deleteById(roleId);
    await this._logEvent("E_00003", "DELETE", "Role deleted successfully!", performedBy || roleId);
    return deletedRole;
  }

  async getRoleByRoleCode(roleCode: string): Promise<IRole | null> {
    return await roleRepository.findByRoleCode(roleCode);
  }

  async getAllRoles(): Promise<IRole[]> {
    return await roleRepository.findAll("_id roleCode roleName description isSystemRole isActive");
  }

  // Private helper method to hash passwords
  private async _logEvent(eventCode: string, action: string, eventMessage: string, performedBy: string): Promise<void> {

    await auditLogRepository.create({
      eventCode,
      action,
      eventMessage,
      userId: performedBy,
      performedAt: new Date(),
      serviceName: "Role Service"
    });
  }
}