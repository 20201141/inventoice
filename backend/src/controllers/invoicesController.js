import { supabase } from "../db.js";

const INVOICE_SORT_FIELDS = ["invoice_date", "due_date", "amount", "created_at"];

export async function getInvoices(req, res) {
  try {
    let { status, page = 1, limit = 10, sort = "invoice_date", order = "desc", overdue } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!INVOICE_SORT_FIELDS.includes(sort)) sort = "invoice_date";

    let query = supabase.from("invoices").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);

    // optional flag: overdue=true -> unpaid && due_date < today
    if (overdue === "true") {
      const today = new Date().toISOString().slice(0, 10);
      query = query.eq("status", "unpaid").lt("due_date", today);
    }

    query = query.order(sort, { ascending: order === "asc" });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ total: count, page, limit, invoices: data });
  } catch (err) {
    console.error("getInvoices:", err);
    res.status(500).json({ error: err.message || "Unable to fetch invoices" });
  }
}

export async function getInvoice(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("invoices").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getInvoice:", err);
    res.status(404).json({ error: err.message || "Invoice not found" });
  }
}

export async function createInvoice(req, res) {
  try {
    const { data, error } = await supabase.from("invoices").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("createInvoice:", err);
    res.status(400).json({ error: err.message || "Could not create invoice" });
  }
}

export async function updateInvoice(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("invoices").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateInvoice:", err);
    res.status(400).json({ error: err.message || "Could not update invoice" });
  }
}

export async function deleteInvoice(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("deleteInvoice:", err);
    res.status(400).json({ error: err.message || "Could not delete invoice" });
  }
}
