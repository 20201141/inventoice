import { Router } from "express";
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expensesController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// Read endpoints: requireAuth (you can change to public if desired)
router.get("/", requireAuth, getExpenses);           // GET /api/expenses
router.get("/:id", requireAuth, getExpense);     // GET /api/expenses/:id

// Create/ update / delete -> requireAdmin (only admin should create/delete expenses)
router.post("/", requireAuth, requireRole("admin"), createExpense);        // POST /api/expenses
router.put("/:id", requireAuth, requireRole("admin"), updateExpense);      // PUT /api/expenses/:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteExpense);   // DELETE /api/expenses/:id

export default router;