import { randomUUID, type UUID } from "crypto"
import mongoose, { Document } from "mongoose"
import { ALL_PRIVILEGES, PRIVILEGE_CATEGORIES, type PrivilegeCode, type PrivilegeCategory } from "../../constants/privileges.constant.js"

export interface IPrivilege extends Document {
  _id: UUID
  privilegeCode: PrivilegeCode
  privilegeName: string
  description?: string
  category?: PrivilegeCategory
  createdAt?: Date
}

const privilegeSchema = new mongoose.Schema<IPrivilege>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    privilegeCode: {
      type: String,
      required: [true, "Privilege code is required!"],
      trim: true,
      enum: Object.values(ALL_PRIVILEGES).map((privilege) => privilege.code),
    },
    privilegeName: {
      type: String,
      required: [true, "Privilege name is required!"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: false,
    },
    category: {
      type: String,
      required: false,
      trim: true,
      enum: PRIVILEGE_CATEGORIES,
    },
  },
  {
    timestamps: true,
    collection: "privileges",
  }
)

privilegeSchema.index({ privilegeCode: 1 })

// Pre-save hook to set UUID if not present
privilegeSchema.pre("save", function(next) {
  if (!this._id) {
    this._id = randomUUID();
  }
  next();
});

const Privilege = mongoose.model<IPrivilege>("Privilege", privilegeSchema)

export default Privilege