import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "services/iam-service/.env" });

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "internal-service-secret-key-2025";
const IAM_URL = "http://localhost:3000";
const PATIENT_URL = "http://localhost:5001";

async function debugUserPatientRelation() {
  console.log("\n🔍 DEBUG: User-Patient Creation & Population Issue\n");
  console.log("=" .repeat(70));
  
  const testUser = {
    email: `debug-${Date.now()}@test.com`,
    fullName: "Debug User",
    identityNumber: `DBG${Date.now().toString().slice(-8)}`,
    gender: "Male",
    age: 30,
    dateOfBirth: "1994-05-15",
    phoneNumber: "0912345678",
    address: "123 Debug Street",
    password: "DebugPass123",
    role: ["USER"],
  };

  try {
    // ===== STEP 1: Create User =====
    console.log("\n[STEP 1] Creating user in IAM service...");
    console.log("URL: POST", `${IAM_URL}/api/internal/user/create`);
    console.log("Payload:", JSON.stringify(testUser, null, 2));
    
    const createUserRes = await axios.post(
      `${IAM_URL}/api/internal/user/create`,
      testUser,
      {
        headers: {
          "x-internal-api-key": INTERNAL_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const createdUser = createUserRes.data.user || { _id: createUserRes.data.userId };
    console.log("✅ User created!");
    console.log("   _id:", createdUser._id);
    console.log("   Complete response:");
    console.log(JSON.stringify(createUserRes.data, null, 2));

    // ===== STEP 2: Get User from IAM =====
    console.log("\n[STEP 2] Verifying user in IAM service...");
    console.log("URL: GET", `${IAM_URL}/api/internal/${createdUser._id}`);
    
    const getUserRes = await axios.get(
      `${IAM_URL}/api/internal/${createdUser._id}`,
      {
        headers: { "x-internal-api-key": INTERNAL_API_KEY },
      }
    );

    console.log("✅ User retrieved from IAM:");
    console.log(JSON.stringify(getUserRes.data, null, 2));

    // ===== STEP 3: Get ALL Patients WITHOUT populate =====
    console.log("\n[STEP 3] Fetching all patients WITHOUT populateUser...");
    console.log("URL: GET", `${PATIENT_URL}/api/patients/getAll/?page=1&limit=100&populateUser=false`);
    
    const getPatientsNoPopRes = await axios.get(
      `${PATIENT_URL}/api/patients/getAll/?page=1&limit=100&populateUser=false`,
      {
        headers: { "x-internal-api-key": INTERNAL_API_KEY },
      }
    );

    console.log("Total patients:", getPatientsNoPopRes.data.total);
    const patientNoPopulate = getPatientsNoPopRes.data.patients.find(
      (p: any) => p.user_id === createdUser._id
    );

    if (patientNoPopulate) {
      console.log("✅ Patient found (without populate)!");
      console.log("   _id:", patientNoPopulate._id);
      console.log("   patient_code:", patientNoPopulate.patient_code);
      console.log("   user_id:", patientNoPopulate.user_id);
      console.log("   is_deleted:", patientNoPopulate.is_deleted);
      console.log("   user field:", patientNoPopulate.user);
      console.log("   Complete patient object:");
      console.log(JSON.stringify(patientNoPopulate, null, 2));
    } else {
      console.log("❌ Patient NOT found without populate!");
      console.log("\nAll patients in DB (first 5):");
      getPatientsNoPopRes.data.patients.slice(0, 5).forEach((p: any, idx: number) => {
        console.log(`   [${idx}] ID: ${p._id}, user_id: ${p.user_id}, code: ${p.patient_code}`);
      });
    }

    // ===== STEP 4: Get ALL Patients WITH populate =====
    console.log("\n[STEP 4] Fetching all patients WITH populateUser=true...");
    console.log("URL: GET", `${PATIENT_URL}/api/patients/getAll/?page=1&limit=100&populateUser=true`);
    
    const getPatientsPopRes = await axios.get(
      `${PATIENT_URL}/api/patients/getAll/?page=1&limit=100&populateUser=true`,
      {
        headers: { "x-internal-api-key": INTERNAL_API_KEY },
      }
    );

    const patientWithPopulate = getPatientsPopRes.data.patients.find(
      (p: any) => p.user_id === createdUser._id
    );

    if (patientWithPopulate) {
      console.log("✅ Patient found (with populate)!");
      console.log("   _id:", patientWithPopulate._id);
      console.log("   patient_code:", patientWithPopulate.patient_code);
      console.log("   user_id:", patientWithPopulate.user_id);
      console.log("   user field exists?", !!patientWithPopulate.user);
      
      if (patientWithPopulate.user) {
        console.log("   ✅ User data found!");
        console.log("   user._id:", patientWithPopulate.user._id);
        console.log("   user.email:", patientWithPopulate.user.email);
        console.log("   Complete user object in patient:");
        console.log(JSON.stringify(patientWithPopulate.user, null, 2));
      } else {
        console.log("   ❌ User field is NULL/undefined!");
        console.log("\n   DIAGNOSIS: Patient has user_id but user data not populated");
        console.log("   Possible causes:");
        console.log("   1. Patient service not calling populate() on query");
        console.log("   2. Patient model reference to User is broken");
        console.log("   3. Query using lean() which breaks populate");
      }
      
      console.log("\n   Complete patient object:");
      console.log(JSON.stringify(patientWithPopulate, null, 2));
    } else {
      console.log("❌ Patient NOT found with populate!");
    }

    // ===== STEP 5: Get Single Patient Detail =====
    if (patientNoPopulate) {
      console.log("\n[STEP 5] Fetching single patient detail WITH populateUser...");
      console.log("URL: GET", `${PATIENT_URL}/api/patients/viewDetail/${patientNoPopulate._id}?populateUser=true`);
      
      const getPatientDetailRes = await axios.get(
        `${PATIENT_URL}/api/patients/viewDetail/${patientNoPopulate._id}?populateUser=true`,
        {
          headers: { "x-internal-api-key": INTERNAL_API_KEY },
        }
      );

      const patientDetail = getPatientDetailRes.data.patient;
      console.log("✅ Patient detail retrieved!");
      console.log("   user field exists?", !!patientDetail.user);
      
      if (patientDetail.user) {
        console.log("   ✅ User data in detail view!");
        console.log(JSON.stringify(patientDetail.user, null, 2));
      } else {
        console.log("   ❌ User field is NULL in detail view too!");
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log("✅ DEBUG TEST COMPLETED\n");

  } catch (error: any) {
    console.error("\n❌ ERROR:");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`URL: ${error.config?.url}`);
      console.error(`Data:`, error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      console.error("❌ Cannot connect to service!");
      console.error("Make sure all services are running:");
      console.error("   - IAM Service: http://localhost:3000");
      console.error("   - Patient Service: http://localhost:5001");
      console.error("\nRun: npm run dev:all");
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

debugUserPatientRelation();
