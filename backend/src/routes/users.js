import { Router } from "express";
import { getMe, registerUser, listUsers, setUserRole } from "../controllers/usersController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.post("/register", requireAuth, registerUser); // called after client signs up
router.get("/", requireAuth, requireRole("admin"), listUsers);
router.put("/:id/role", requireAuth, requireRole("admin"), setUserRole);

export default router;
