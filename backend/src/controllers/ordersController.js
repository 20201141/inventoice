// controllers/ordersController.js
import { supabase } from "../db.js";

const ORDERS_SORT_FIELDS = ["created_at", "due_date", "total_cost", "status"];

export async function getOrders(req, res) {
  try {
    let { status, company_id, page = 1, limit = 10, sort = "created_at", order = "desc", search = "" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!ORDERS_SORT_FIELDS.includes(sort)) sort = "created_at";

    let query = supabase.from("orders").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (company_id) query = query.eq("company_id", company_id);
    if (search) {
      // search by PO or invoice number
      query = query.or(`po_number.ilike.%${search}%,invoice_number.ilike.%${search}%`);
    }

    query = query.order(sort, { ascending: order === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ total: count, page, limit, orders: data });
  } catch (err) {
    console.error("getOrders:", err);
    res.status(500).json({ error: err.message || "Unable to fetch orders" });
  }
}

export async function getOrder(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getOrder:", err);
    res.status(404).json({ error: err.message || "Order not found" });
  }
}

export async function createOrder(req, res) {
  try {
    const { data, error } = await supabase.from("orders").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("createOrder:", err);
    res.status(400).json({ error: err.message || "Could not create order" });
  }
}

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("orders").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateOrder:", err);
    res.status(400).json({ error: err.message || "Could not update order" });
  }
}

export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("deleteOrder:", err);
    res.status(400).json({ error: err.message || "Could not delete order" });
  }
}
