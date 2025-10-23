// Entry point for testOrderService
import express from 'express';

const app = express();
app.get('/health', (req, res) => res.json({ status: 'testOrderService OK' }));

export default app;
