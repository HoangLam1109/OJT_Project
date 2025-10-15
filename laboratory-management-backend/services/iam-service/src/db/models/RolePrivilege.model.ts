import { randomUUID, type UUID } from "crypto"
import mongoose, { Document } from "mongoose"

export interface IRolePrivilege extends Document {
  _id: UUID
  roleId: UUID
  privilegeId: UUID
  createdAt?: Date
  createdBy?: UUID
}

const rolePrivilegeSchema = new mongoose.Schema<IRolePrivilege>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    roleId: {
      type: String,
      required: [true, "Role code is required!"],
      ref: "Role",
    },
    privilegeId: {
      type: String,
      required: [true, "Privilege name is required!"],
      ref: "Privilege",
    },
    createdBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "role_privileges",
  }
)

rolePrivilegeSchema.index({ roleId: 1, privilegeId: 1 }, { unique: true })

// Pre-save hook to set UUID if not present
rolePrivilegeSchema.pre("save", function(next) {
  if (!this._id) {
    this._id = randomUUID();
  }
  next();
});

const RolePrivilege = mongoose.model<IRolePrivilege>("RolePrivilege", rolePrivilegeSchema)

export default RolePrivilege