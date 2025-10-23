import express from "express";
import cors from "cors";
import testOrdersRoutes from "./routes/testOrders";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/test_orders", testOrdersRoutes);

export default app;
