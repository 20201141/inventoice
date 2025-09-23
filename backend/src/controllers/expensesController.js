import supabase from "../db.js";

export async function getExpenses(req, res) {
  try {
    const { company_id, start_date, end_date, page = 1, limit = 20 } = req.query;
    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);

    let query = supabase.from("expenses").select("*", { count: "exact" });

    if (company_id) query = query.eq("company_id", company_id);

    if (start_date) query = query.gte("expense_date", start_date);
    if (end_date) query = query.lte("expense_date", end_date);

    const from = (p - 1) * l;
    const to = from + l - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ total: count, page: p, limit: l, expenses: data });
  } catch (err) {
    console.error("getExpenses:", err);
    res.status(500).json({ error: err.message || "Unable to fetch expenses" });
  }
}

export async function getExpense(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("expenses").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getExpense:", err);
    res.status(404).json({ error: err.message || "Expense not found" });
  }
}

export async function createExpense(req, res) {
  try {
    const { data, error } = await supabase.from("expenses").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("createExpense:", err);
    res.status(400).json({ error: err.message || "Could not create expense" });
  }
}

export async function updateExpense(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("expenses").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateExpense:", err);
    res.status(400).json({ error: err.message || "Could not update expense" });
  }
}

export async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("deleteExpense:", err);
    res.status(400).json({ error: err.message || "Could not delete expense" });
  }
}
