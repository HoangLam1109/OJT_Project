interface CreatePatientRequest {
  user_id: string;
  emergency_contact?: {
    name: string;
    phone: string;
  };
}

class PatientServiceClient {
  private baseUrl: string;
  private internalApiKey: string;

  constructor() {
    this.baseUrl = process.env.PATIENT_SERVICE_URL || 'http://localhost:5001';
    this.internalApiKey = process.env.INTERNAL_API_KEY || '';
  }

  async createPatientForUser(userId: string): Promise<void> {
    try {
      const url = `${this.baseUrl}/api/patients`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-API-Key': this.internalApiKey,
        },
        body: JSON.stringify({
          user_id: userId,
          emergency_contact: { name: '', phone: '' },
        } as CreatePatientRequest),
      });

      if (!response.ok) {
        console.error(`[IAM] Failed to create patient for user ${userId}`);
        return;
      }

      const data = await response.json() as any;
      console.log(`[IAM] ✅ Created patient ${data.patient?.patient_code} for user ${userId}`);
    } catch (error) {
      console.error(`[IAM] Error creating patient:`, error);
    }
  }
}

const patientServiceClient = new PatientServiceClient();
export default patientServiceClient;
