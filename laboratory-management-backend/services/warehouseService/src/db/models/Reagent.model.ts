import { randomUUID } from "crypto";
import { Schema, model, type Document } from "mongoose";

export interface IReagent extends Document {
  _id: string;
  reagent_code: string;
  reagent_name: string;
  reagent_type: string;
  quantity_received?: number;
  quantity_current: number;
  quantity_usage: number | 0;
  unit_of_measure: string;
  usage_per_run: number;
  expiration_date: Date;
  received_date: Date;
  status: "Available" | "InUse" | "LowStock" | "Expired" | "Depleted";
  low_stock_threshold?: number;
  storage_location?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: string;
}

const ReagentSchema = new Schema<IReagent>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    reagent_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    reagent_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    reagent_type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    quantity_received: {
      type: Number,
      required: true,
    },
    quantity_current: {
      type: Number,
      required: true,
    },
    quantity_usage: {
      type: Number,
      required: true,
    },
    unit_of_measure: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    usage_per_run: {
      type: Number,
      required: true,
    },
    expiration_date: {
      type: Date,
      required: true,
    },
    received_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Available", "InUse", "LowStock", "Expired", "Depleted"],
      default: "Available",
    },
    low_stock_threshold: {
      type: Number,
    },
    storage_location: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    created_at: {
      type: Date,
      default: Date.now,
      required: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    created_by: {
      type: String,
    },
    updated_by: {
      type: String,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
    },
    deleted_by: {
      type: String,
    },
  },
  {
    collection: "Reagents",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

ReagentSchema.index({ reagent_code: 1 }, { unique: true });
ReagentSchema.index({ reagent_type: 1 });
ReagentSchema.index({ expiration_date: 1 });
ReagentSchema.index({ status: 1 });
ReagentSchema.index({ instrument_id: 1 });
ReagentSchema.index({ status: 1, expiration_date: 1 });

const Reagent = model<IReagent>("Reagent", ReagentSchema, "reagents");

export default Reagent;
