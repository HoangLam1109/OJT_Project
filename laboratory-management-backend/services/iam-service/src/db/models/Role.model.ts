import { randomUUID, type UUID } from "crypto"
import mongoose, { Document } from "mongoose"
import { ROLE_CODES } from "../../constants/roles.constant.js"

export interface IRole extends Document {
  _id: UUID
  roleCode: string
  roleName: string
  description?: string
  isSystemRole?: boolean
  isActive?: boolean
  createdBy?: UUID
  updatedBy?: UUID
  createdAt?: Date
  updatedAt?: Date
  isDeleted?: boolean
  deletedAt?: Date
}

const roleSchema = new mongoose.Schema<IRole>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    roleCode: {
      type: String,
      required: [true, "Role code is required!"],
      unique: true,
      trim: true,
      uppercase: true,
      enum: {
        values: Object.values(ROLE_CODES),
        message: 'Role code must be one of: ' + Object.values(ROLE_CODES).join(', ')
      },
    },
    roleName: {
      type: String,
      required: [true, "Role name is required!"],
      trim: true,
      maxlength: [100, "Role name cannot exceed 100 characters!"],
    },
    description: {
      type: String,
      trim: true,
    },
    isSystemRole: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: false,
    },
    updatedBy: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "roles",
  }
)

roleSchema.index({ isSystemRole: 1 })

// Pre-save hook to set UUID if not present
roleSchema.pre("save", function(next) {
  if (!this._id) {
    this._id = randomUUID();
  }
  next();
});

const Role = mongoose.model<IRole>("Role", roleSchema)

export default Role