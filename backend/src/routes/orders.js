import { Router } from "express";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/ordersController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Read endpoints: requireAuth (you can change to public if desired)
router.get("/", requireAuth, getOrders);           // GET /api/order
router.get("/:id", requireAuth, getOrder);     // GET /api/order/:id

// Create/ update / delete -> requireAdmin (only admin should create/delete order)
router.post("/", requireAuth, requireRole("admin"), createOrder);        // POST /api/order
router.put("/:id", requireAuth, requireRole("admin"), updateOrder);      // PUT /api/order/:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteOrder);   // DELETE /api/order/:id

export default router;