import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Read endpoints: requireAuth (you can change to public if desired)
router.get("/", requireAuth, getItems);           // GET /api/items
router.get("/:id", requireAuth, getItemById);     // GET /api/items/:id

// Create/ update / delete -> requireAdmin (only admin should create/delete items)
router.post("/", requireAuth, requireRole("admin"), createItem);        // POST /api/items
router.put("/:id", requireAuth, requireRole("admin"), updateItem);      // PUT /api/items/:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteItem);   // DELETE /api/items/:id

export default router;