import axios from "axios";

interface CreatePatientRequest {
  user_id: string;
  emergency_contact?: {
    name: string;
    phone: string;
  };
}

class PatientServiceClient {
  private baseUrl: string | null = null;
  private internalApiKey: string | null = null;

  private initialize() {
    const resolvedBaseUrl = process.env.PATIENT_SERVICE_URL || "http://localhost:5001";
    const resolvedApiKey = process.env.INTERNAL_API_KEY || "";

    const configChanged = resolvedBaseUrl !== this.baseUrl || resolvedApiKey !== this.internalApiKey;

    this.baseUrl = resolvedBaseUrl;
    this.internalApiKey = resolvedApiKey;

    if (!this.internalApiKey) {
      console.warn('[PatientServiceClient] INTERNAL_API_KEY is empty. Patient APIs requiring internal auth will fail.');
    }

    if (configChanged) {
      console.log('[PatientServiceClient] Configured baseUrl:', this.baseUrl);
      console.log('[PatientServiceClient] INTERNAL_API_KEY:', this.internalApiKey ? '***' + this.internalApiKey.slice(-4) : 'NOT SET');
    }
  }

  async createPatientForUser(userId: string): Promise<void> {
    this.initialize();
    try {
      if (!this.baseUrl) {
        console.error(`[IAM] PatientServiceClient missing baseUrl; check PATIENT_SERVICE_URL`);
        return;
      }

      const url = `${this.baseUrl}/api/patients/create/`;
      const headers = {
        "Content-Type": "application/json",
        "X-Internal-API-Key": this.internalApiKey || "",
      } as Record<string, string>;

      const response = await axios.post(url, {
        user_id: userId,
        emergency_contact: { name: "N/A", phone: "N/A" },
      } as CreatePatientRequest, { headers });

      console.log(`[IAM] ✅ Created patient ${response.data?.patient?.patient_code ?? "(unknown)"} for user ${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`📛 [IAM] Failed to create patient for user ${userId}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return;
      }

      console.error(`[IAM] Error creating patient:`, error);
    }
  }

  async softDeletePatientByUserId(userId: string): Promise<void> {
    this.initialize();

    try {
      if (!this.baseUrl) {
        console.error(`[IAM] PatientServiceClient missing baseUrl; cannot delete patient for user ${userId}`);
        return;
      }

      const url = `${this.baseUrl}/api/patients/soft-delete-by-user/${userId}`;
      const headers = {
        "Content-Type": "application/json",
        "X-Internal-API-Key": this.internalApiKey || "",
      } as Record<string, string>;

      await axios.delete(url, { headers });
      console.log(`[IAM] ✅ Soft deleted patient for user ${userId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`📛 [IAM] Failed to soft delete patient for user ${userId}:`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        return;
      }

      console.error(`[IAM] Error soft deleting patient:`, error);
    }
  }
}

const patientServiceClient = new PatientServiceClient();
export default patientServiceClient;
