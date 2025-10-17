import { randomUUID, type UUID } from "crypto";
import mongoose, { Document } from "mongoose";

export interface IUserRole extends Document {
  _id: UUID;
  roleId: UUID;
  userId: UUID;
  assignedAt?: Date;
  assignedBy?: UUID;
}

const userRoleSchema = new mongoose.Schema<IUserRole>(
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
    userId: {
      type: String,
      required: [true, "User name is required!"],
      ref: "User",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
      required: false,
    },
    assignedBy: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "user_roles",
  }
);

userRoleSchema.index({ roleId: 1, userId: 1 }, { unique: true });

userRoleSchema.pre("save", function (next) {
  if (!this._id) {
    this._id = randomUUID();
  }
  next();
});

const UserRole = mongoose.model<IUserRole>("UserRole", userRoleSchema);

export default UserRole;
