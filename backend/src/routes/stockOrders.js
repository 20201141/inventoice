import { Router } from "express";
import {
  getStockOrders,
  getStockOrder,
  createStockOrder,
  updateStockOrder,
  deleteStockOrder,
} from "../controllers/stockOrdersController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Read endpoints: requireAuth (you can change to public if desired)
router.get("/", requireAuth, getStockOrders);           // GET /api/stockOrders
router.get("/:id", requireAuth, getStockOrder);     // GET /api/stockOrders/:id

// Create/ update / delete -> requireAdmin (only admin should create/delete stock orders)
router.post("/", requireAuth, requireRole("admin"), createStockOrder);        // POST /api/stockOrders
router.put("/:id", requireAuth, requireRole("admin"), updateStockOrder);      // PUT /api/stockOrders/:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteStockOrder);   // DELETE /api/stockOrders/:id

export default router;