import { Router } from "express";
import {
  getOrderItems,
  getOrderItem,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../controllers/orderItemsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Read endpoints: requireAuth (you can change to public if desired)
router.get("/", requireAuth, getOrderItems);           // GET /api/orderItems
router.get("/:id", requireAuth, getOrderItem);     // GET /api/orderItems:id

// Create/ update / delete -> requireAdmin (only admin should create/delete items)
router.post("/", requireAuth, requireRole("admin"), createOrderItem);        // POST /api/items
router.put("/:id", requireAuth, requireRole("admin"), updateOrderItem);      // PUT /api/orderItems:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteOrderItem);   // DELETE /api/orderItems:id

export default router;