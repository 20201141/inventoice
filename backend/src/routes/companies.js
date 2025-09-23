import { Router } from "express";
import {
  getCompanies, 
  getCompany, 
  createCompany, 
  updateCompany, 
  deleteCompany
} from "../controllers/companiesController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, getCompanies);     // GET /api/companies
router.get("/:id", requireAuth, getCompany);    // GET /api/companies/:id

router.post("/", requireAuth, requireRole("admin"), createCompany);   // POST /api/companies
router.put("/:id", requireAuth, requireRole("admin"), updateCompany);   // PUT /api/companies/:id
router.delete("/:id", requireAuth, requireRole("admin"), deleteCompany);  // DELETE /api/companies/:id

export default router;
