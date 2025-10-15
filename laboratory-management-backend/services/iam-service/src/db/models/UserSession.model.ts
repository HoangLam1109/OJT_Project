import { randomUUID, type UUID } from "crypto"
import mongoose, { Document } from "mongoose"

export interface IUserSession extends Document {
  _id: UUID
  userId: UUID
  sessionToken: string
  refreshToken?: string
  expiresAt: Date
  createdAt?: Date
  ipAddress?: string
  userAgent?: string
  isActive?: boolean
}

const userSessionSchema = new mongoose.Schema<IUserSession>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    userId: {
      type: String,
      required: [true, "User ID is required!"],
      ref: "User",
    },
    sessionToken: {
      type: String,
      required: [true, "Session token is required!"],
      unique: true,
      maxlength: [500, "Session token cannot exceed 500 characters!"],
    },
    refreshToken: {
      type: String,
      unique: true,
      sparse: true,
      maxlength: [500, "Refresh token cannot exceed 500 characters!"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration date is required!"],
    },
    ipAddress: {
      type: String,
      maxlength: [50, "IP address cannot exceed 50 characters!"],
    },
    userAgent: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "user_sessions",
  }
)

userSessionSchema.index({ userId: 1 })
userSessionSchema.index({ expiresAt: 1 })

userSessionSchema.pre("save", function(next) {
  if (!this._id) {
    this._id = randomUUID();
  }
  next();
});

const UserSession = mongoose.model<IUserSession>("UserSession", userSessionSchema)

export default UserSession