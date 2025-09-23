import { Router } from "express";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoicesController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Read endpoints: requireAuth (you can change to public if desired)
router.get("/", requireAuth, getInvoices);           // GET /api/invoices
router.get("/:id", requireAuth, getInvoice);     // GET /api/invoices/:id

// Create/ update / delete -> requireAdmin (only admin should create/delete invoices)
router.post("/", requireAuth, requireRole("admin"), createInvoice);        // POST /api/invoices
router.put("/:id", requireAuth, requireRole("admin"), updateInvoice);      // PUT /api/invoices/:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteInvoice);   // DELETE /api/invoices/:id

export default router;