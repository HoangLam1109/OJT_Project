// Entry point for patientService
import express from 'express';

const app = express();
app.get('/health', (req, res) => res.json({ status: 'patientService OK' }));

export default app;
