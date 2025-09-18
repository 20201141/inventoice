import { supabase } from "../db.js";

export async function getOrderItems(req, res) {
  try {
    const { order_id, item_id, page = 1, limit = 50 } = req.query;
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    let query = supabase.from("order_items").select("*", { count: "exact" });

    if (order_id) query = query.eq("order_id", order_id);
    if (item_id) query = query.eq("item_id", item_id);

    const from = (p - 1) * l;
    const to = from + l - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ total: count, page: p, limit: l, order_items: data });
  } catch (err) {
    console.error("getOrderItems:", err);
    res.status(500).json({ error: err.message || "Unable to fetch order items" });
  }
}

export async function getOrderItem(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("order_items").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getOrderItem:", err);
    res.status(404).json({ error: err.message || "Order item not found" });
  }
}

export async function createOrderItem(req, res) {
  try {
    const { data, error } = await supabase.from("order_items").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("createOrderItem:", err);
    res.status(400).json({ error: err.message || "Could not create order item" });
  }
}

export async function updateOrderItem(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("order_items").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateOrderItem:", err);
    res.status(400).json({ error: err.message || "Could not update order item" });
  }
}

export async function deleteOrderItem(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("order_items").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("deleteOrderItem:", err);
    res.status(400).json({ error: err.message || "Could not delete order item" });
  }
}
