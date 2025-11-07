import { roleRepository } from "../repositories/index.js";
import { auditLogRepository } from "../repositories/index.js";

import type { IRole } from "../db/models/Role.model.js";
import { PaginationResponse, PaginationOptions } from "../types/pagination.type.js";
import { PaginationUtils } from "../utils/pagination.util.js";
import { isValidPrivilegeCode } from "../constants/privileges.constant.js";

export interface CreateRoleData {
  roleCode: string;
  roleName: string;
  description?: string;
  isSystemRole: boolean;
  isActive: boolean;
  privileges?: string[];
}

export interface UpdateRoleData {
  roleCode?: string;
  roleName?: string;
  description?: string;
  isSystemRole?: boolean;
  isActive?: boolean;
  privileges?: string[];
}

export class RoleService {
  async getRole(roleId: string): Promise<IRole | null> {
    return await roleRepository.findById(
      roleId,
      "_id roleCode roleName description isSystemRole isActive privileges"
    );
  }

  async createRole(
    roleData: CreateRoleData,
    performedBy?: string
  ): Promise<IRole> {
    // Check for duplicate role code
    const existingRole = await roleRepository.findOne({ roleCode: roleData.roleCode });
    if (existingRole) {
      throw new Error('Role with this code already exists');
    }

    // Validate privileges if provided
    if (roleData.privileges && roleData.privileges.length > 0) {
      const invalidPrivileges = roleData.privileges.filter(
        priv => !isValidPrivilegeCode(priv)
      );
      if (invalidPrivileges.length > 0) {
        throw new Error(`Invalid privilege codes: ${invalidPrivileges.join(', ')}`);
      }
    }

    const newRole = await roleRepository.create(roleData);

    await this._logEvent(
      "E_00001",
      "CREATE",
      `Role ${newRole.roleCode} created successfully!`,
      performedBy || "Unknown"
    );
    return newRole;
  }

  async updateRole(
    roleId: string,
    roleData: UpdateRoleData,
    performedBy?: string
  ): Promise<IRole | null> {
    // Check if role exists
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Prevent modification of system roles
    if (role.isSystemRole && (roleData.roleCode || roleData.isSystemRole === false)) {
      throw new Error('Cannot modify system role code or system role status');
    }

    if (roleData.roleCode && roleData.roleCode !== role.roleCode) {
      const existingRole = await roleRepository.findOne({ roleCode: roleData.roleCode });
      if (existingRole) {
        throw new Error('Role with this code already exists');
      }
    }

    // Validate privileges if being updated
    if (roleData.privileges && roleData.privileges.length > 0) {
      const invalidPrivileges = roleData.privileges.filter(
        priv => !isValidPrivilegeCode(priv)
      );
      if (invalidPrivileges.length > 0) {
        throw new Error(`Invalid privilege codes: ${invalidPrivileges.join(', ')}`);
      }
    }

    const updatedRole = await roleRepository.updateById(roleId, roleData);

    await this._logEvent(
      "E_00002",
      "UPDATE",
      `Role ${updatedRole?.roleCode} updated successfully!`,
      performedBy || "Unknown"
    );

    return updatedRole;
  }

  async deleteRole(
    roleId: string,
    performedBy?: string
  ): Promise<IRole | null> {
    // Check if role exists
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Prevent deletion of system roles
    if (role.isSystemRole) {
      throw new Error('Cannot delete system roles');
    }

    const deletedRole = await roleRepository.deleteById(roleId);
    await this._logEvent(
      "E_00003",
      "DELETE",
      `Role ${deletedRole?.roleCode} deleted successfully!`,
      performedBy || "Unknown"
    );
    return deletedRole;
  }

  async assignPrivilegesToRole(roleId: string, privileges: string[], performedBy: string = 'system'): Promise<IRole | null> {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Validate privileges
    const invalidPrivileges = privileges.filter(priv => !isValidPrivilegeCode(priv));
    if (invalidPrivileges.length > 0) {
      throw new Error(`Invalid privilege codes: ${invalidPrivileges.join(', ')}`);
    }

    const updatedPrivileges = [...new Set([...role.privileges, ...privileges])];
    return this.updateRole(
      role._id,
      { privileges: updatedPrivileges },
      performedBy
    );
  }

  async removePrivilegesFromRole(roleId: string, privileges: string[], performedBy: string = 'system'): Promise<IRole | null> {
    const role = await roleRepository.findById(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    const updatedPrivileges = role.privileges.filter(
      (priv: string) => !privileges.includes(priv)
    );
    return this.updateRole(
      role._id,
      { privileges: updatedPrivileges },
      performedBy
    );
  }

  async roleExists(roleId: string): Promise<boolean> {
    const role = await roleRepository.findById(roleId, '_id');
    return !!role;
  }

  async getRoleByCode(roleCode: string): Promise<IRole | null> {
    return await roleRepository.findOne({ roleCode });
  }

  async getRolesWithPagination(
    options: PaginationOptions
  ): Promise<PaginationResponse<IRole>> {
    const result = await roleRepository.findWithPagination(options);
    return PaginationUtils.formatResponse(result.data, result.hasNextPage, options, result.totalCount);
  }

  private async _logEvent(
    eventCode: string,
    action: string,
    eventMessage: string,
    perfomedBy: string
  ): Promise<void> {
    await auditLogRepository.create({
      eventCode,
      action,
      eventMessage,
      userId: perfomedBy,
      performedAt: new Date(),
      serviceName: "Role Service",
    });
  }
}
