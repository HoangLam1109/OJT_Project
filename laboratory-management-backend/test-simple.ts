import axios from "axios";

const INTERNAL_API_KEY = "internal-service-secret-key-2025";

async function testCreateUser() {
  console.log("\n=== TEST: Create User via Internal API ===\n");

  const testUser = {
    email: `testuser-${Date.now()}@test.com`,
    fullName: "Test User",
    identityNumber: `ID${Date.now()}`,
    gender: "male",
    age: 30,
    dateOfBirth: "1994-05-15",
    phoneNumber: "0912345678",
    address: "123 Test Street",
    password: "TestPassword123",
    role: "USER",
  };

  console.log("Test user:", testUser);
  console.log("\nAttempting to create user via: POST /api/internal/user/create\n");

  try {
    const response = await axios.post(
      "http://localhost:3000/api/internal/user/create",
      testUser,
      {
        headers: {
          "x-internal-api-key": INTERNAL_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 5000,
      }
    );

    console.log("✅ SUCCESS!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    
    const userId = response.data.user._id;
    console.log("\n✅ User created with ID:", userId);
    
    // Now try to get patient
    console.log("\n=== Checking if patient was auto-created ===\n");
    
    const patientsResponse = await axios.get(
      "http://localhost:5001/api/patients/getAll/?populateUser=true&page=1&limit=100",
      {
        headers: {
          "x-internal-api-key": INTERNAL_API_KEY,
        },
        timeout: 5000,
      }
    );
    
    const patient = patientsResponse.data.patients.find((p: any) => p.user_id === userId);
    
    if (patient) {
      console.log("✅ Patient found!");
      console.log("Patient ID:", patient._id);
      console.log("Patient Code:", patient.patient_code);
      console.log("Patient full data:", JSON.stringify(patient, null, 2));
    } else {
      console.log("❌ Patient NOT found for this user!");
      console.log("\nAll patients in DB:");
      patientsResponse.data.patients.forEach((p: any, idx: number) => {
        console.log(`[${idx}] User ID: ${p.user_id}, Patient Code: ${p.patient_code}`);
      });
    }

  } catch (error: any) {
    console.error("❌ ERROR:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error("Cannot connect to service. Is it running on port 3000?");
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

testCreateUser();
