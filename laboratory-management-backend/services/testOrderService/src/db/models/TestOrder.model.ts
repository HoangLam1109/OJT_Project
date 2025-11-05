import mongoose, { Schema, Document } from "mongoose";
import { z } from 'zod';

export interface ITestOrder extends Document {
  patient_id: string;
  patient_name?: string;   
  barcode: string;
  test_type: string;       
  status: string;
  processing?: number;       
  created_at: Date;
  created_by: string;
  due_date?: Date;
  updated_at?: Date;
  updated_by?: string;
  is_deleted?: boolean;
  deleted_at?: Date;
  deleted_by?: string;
  notes?: string | 'have no comment';
}


export interface ITestOrderInput {
  patient_id: string;
  patient_name?:string,
  barcode: string;
  test_type?: string;
  status?: string;
  processing?: number;
  created_by: string;
  due_date?: Date | null;
  updated_by?: string | null;
  is_deleted?: boolean;
  deleted_at?: Date | null;
  deleted_by?: string | null;
  notes?: string |'have no comment';
}


export interface UpdateTestOrderDto {
  patient_id?: string;
  patient_name?: string;
  barcode?: string;
  test_type?: string;
  status?: 'Pending' | 'Processing' | 'Completed';
  processing?: number;
  created_by?: string;
  due_date?: Date | null;
  updated_by?: string | null;
  is_deleted?: boolean;
  deleted_at?: Date | null;
  deleted_by?: string | null;
  notes?: string | 'have no comment' ;
}

const TestOrderSchema: Schema = new Schema(
  {
    patient_id: { type: String, required: true },
    patient_name: { type: String, default: '' },
    barcode: { type: String, required: true, unique: true },
    test_type: { type: String,   required: true  },
    status: { type: String, required: true, default: 'Pending' },
    processing: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String, required: true },

    due_date: { type: Date, default: null },
    updated_at: { type: Date, default: Date.now },
    updated_by: { type: String, default: null },

    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
    notes: {type: String, default: 'Have no comment'}
  },
  {
    timestamps: false, // We're handling created_at/updated_at manually
  }
);

// Auto-update updated_at on save
TestOrderSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// Optional: also update on findOneAndUpdate
TestOrderSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: new Date() });
  next();
});


export const UpdateTestOrderSchema = z.object({
  patient_id: z.string().optional(),
  patient_name: z.string().optional(),
  barcode: z.string().optional(),
  test_type: z.string().optional(),
  status: z.enum(['Pending', 'Processing', 'Completed']).optional(),
  processing: z.number().min(0).max(100).optional(),
  due_date: z.string().datetime().optional().nullable(),
  isDeleted: z.boolean().optional(),
  notes: z.string().optional()
});

export default mongoose.model<ITestOrder>("TestOrder", TestOrderSchema,"testOrders" );