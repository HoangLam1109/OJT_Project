import HttpClient from "../../utils/httpClient.util.js";

export interface Reagent {
  _id: string;
  reagent_code: string;
  reagent_name: string;
  reagent_type: string;
  quantity_received?: number;
  quantity_current: number;
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

class ReagentServiceClient {
  private baseUrl: string;
  private internalApiKey: string;

  constructor() {
    this.baseUrl = process.env.WAREHOUSE_API_BASE || "http://localhost:5003";
    this.internalApiKey = process.env.INTERNAL_API_KEY || "internal-service-secret-key-2025";
  }

  // Fetch a single reagent by ID
  async getReagentById(reagentId: string): Promise<Reagent | null> {
    try {
      const url = `${this.baseUrl}/api/warehouse/reagents/${reagentId}`;
      const headers = { "X-Internal-API-Key": this.internalApiKey };
      const res = await HttpClient.get<{ reagent: Reagent }>(url, { headers });
      return res.reagent;
    } catch (err: any) {
      console.error(`[ReagentService] Error fetching reagent ${reagentId}:`, err.message);
      return null;
    }
  }

  // Fetch multiple reagents by IDs → return Map<id, reagent>
  async getReagentsByIds(reagentIds: string[]): Promise<Map<string, Reagent>> {
    const map = new Map<string, Reagent>();
    if (!Array.isArray(reagentIds) || reagentIds.length === 0) return map;

    const promises = reagentIds.map((id) => this.getReagentById(id));
    const results = await Promise.all(promises);

    results.forEach((r) => {
      if (r) map.set(r._id, r);
    });

    return map;
  }
}

export default new ReagentServiceClient();
