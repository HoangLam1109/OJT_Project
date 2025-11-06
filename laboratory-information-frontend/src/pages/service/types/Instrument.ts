export interface Instrument {
  _id: string;
  instrument_code: string;
  instrument_name: string;
  instrument_type: string;
  manufacturer?: string;
  status: "Ready" | "Processing" | "Maintenance" | "Error" | "Inactive";
  is_active: boolean;
  location?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: string;
}