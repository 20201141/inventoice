import supabase from "../db.js";

export async function getStockOrders(req, res) {
  try {
    const { status, item_id, page = 1, limit = 20 } = req.query;
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);

    let query = supabase.from("stock_orders").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (item_id) query = query.eq("item_id", item_id);

    const from = (p - 1) * l;
    const to = from + l - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ total: count, page: p, limit: l, stock_orders: data });
  } catch (err) {
    console.error("getStockOrders:", err);
    res.status(500).json({ error: err.message || "Unable to fetch stock orders" });
  }
}

export async function getStockOrder(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("stock_orders").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getStockOrder:", err);
    res.status(404).json({ error: err.message || "Stock order not found" });
  }
}

export async function createStockOrder(req, res) {
  try {
    const { data, error } = await supabase.from("stock_orders").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("createStockOrder:", err);
    res.status(400).json({ error: err.message || "Could not create stock order" });
  }
}

export async function updateStockOrder(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("stock_orders").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateStockOrder:", err);
    res.status(400).json({ error: err.message || "Could not update stock order" });
  }
}

export async function deleteStockOrder(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("stock_orders").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("deleteStockOrder:", err);
    res.status(400).json({ error: err.message || "Could not delete stock order" });
  }
}
