import { Router } from "express";
import itemsRoutes from "./items.js";
import companiesRoutes from "./companies.js";
import ordersRoutes from "./orders.js";
import orderItemsRoutes from "./orderItems.js";
import invoicesRoutes from "./invoices.js";
import expensesRoutes from "./expenses.js";
import stockOrdersRoutes from "./stockOrders.js";
import usersRoutes from "./users.js";

const router = Router();

router.use("/items", itemsRoutes);
router.use("/companies", companiesRoutes);
router.use("/orders", ordersRoutes);
router.use("/order-items", orderItemsRoutes);
router.use("/invoices", invoicesRoutes);
router.use("/expenses", expensesRoutes);
router.use("/stock-orders", stockOrdersRoutes);
router.use("/users", usersRoutes);

export default router;