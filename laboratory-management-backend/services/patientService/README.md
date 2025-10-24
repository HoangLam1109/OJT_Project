# Patient Service

Patient Management Microservice for Laboratory Information Management System.

## Features

- ✅ CRUD operations for patient records
- ✅ Patient search and filtering
- ✅ Pagination support
- ✅ Soft delete functionality
- ✅ Medical history tracking
- ✅ Emergency contact management
- ✅ Insurance information
- ✅ JWT authentication
- ✅ Input validation with Joi
- ✅ MongoDB + Mongoose
- ✅ Redis caching support

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Cache:** Redis
- **Authentication:** JWT (shared with IAM Service)
- **Validation:** Joi

## Project Structure

```
src/
├── config/              # Database and Redis configuration
├── constants/           # Patient constants (blood types, gender, etc.)
├── controllers/         # Request handlers
├── db/
│   ├── models/         # Mongoose models
│   └── seeds/          # Seed data
├── middlewares/        # Authentication, validation
├── repositories/       # Data access layer
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Helper functions
├── validators/         # Joi validation schemas
└── index.ts            # Entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PATIENT_SERVICE_PORT=5001

# MongoDB
MONGO_URI=mongodb://localhost:27017/lab_patient_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT (must match IAM Service)
JWT_SECRET=your-secret-key

# CORS
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Patient Management

- `POST /api/patients` - Create new patient (requires authentication)
- `GET /api/patients` - Get all patients with pagination and search
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Soft delete patient

### Query Parameters (GET /api/patients)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name, identity number, email, or phone
- `isActive` - Filter by active status (true/false)

## Patient Model

```typescript
{
  _id: UUID,
  fullName: string,
  identityNumber: string (unique),
  email?: string,
  phoneNumber?: string,
  gender: 'male' | 'female' | 'other',
  age: number,
  dateOfBirth: Date,
  address?: string,
  city?: string,
  country?: string,
  emergencyContact?: {
    name: string,
    relationship: string,
    phoneNumber: string
  },
  medicalHistory?: string,
  allergies?: string[],
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
  insurance?: {
    provider: string,
    policyNumber: string,
    expiryDate: Date
  },
  isActive: boolean,
  isDeleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Installation

```bash
# Install dependencies (from root backend folder)
npm install

# Run in development mode
npm run dev:patient
```

## Notes

- This service shares JWT authentication with IAM Service
- Requires MongoDB and Redis to be running
- Port 5001 by default (configurable via env)
