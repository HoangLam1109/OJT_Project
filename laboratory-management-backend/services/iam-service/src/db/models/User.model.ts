import { randomUUID, type UUID } from "crypto"
import mongoose, { Document } from "mongoose"
import type { RoleCode } from "../../constants/roles.constant.js"

export interface IUser extends Document {
  _id: UUID
  email: string
  fullName: string
  identityNumber: string
  gender: string
  age: number
  dateOfBirth: Date
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  isActive?: boolean
  isDeleted?: boolean
  role?: RoleCode

  // Future fields (commented out for now)

  // phoneNumber?: string
  // address?: string
  // lastLogin?: Date
  // lastPasswordChange?: Date
  // failedLoginAttempts?: number
  // isLocked?: boolean
  // lockedUntil?: Date
  // lastActivity?: Date
  // createdBy?: string
  // updatedBy?: string
  // deletedAt?: Date
  // deletedBy?: string
}

const userSchema = new mongoose.Schema<IUser>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string): boolean {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(value)
        },
        message: "Invalid email format!",
      },
    },
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters long!"],
      maxlength: [100, "Full name cannot exceed 100 characters!"],
    },
    identityNumber: {
      type: String,
      required: [true, "Identity number is required!"],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      trim: true,
      default: 'USER'
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["male", "female"],
    },
    age: {
      type: Number,
      required: [true, "Age is required!"],
      min: [1, "Age must be at least 1!"],
      max: [150, "Age cannot exceed 150!"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required!"],
      format: "MM/DD/YYYY",
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required!"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
    timestamps: true,
    collection: "users",
  }
)

userSchema.index({ isActive: 1 })
userSchema.index({ isDeleted: 1 })


userSchema.pre("save", function(next) {
  if (!this._id) {
    this._id = randomUUID();
  }
  next();
});

const User = mongoose.model<IUser>("User", userSchema)

export default User