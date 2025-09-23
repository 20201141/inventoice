import supabase from "../db.js";

const COMPANIES_SORT_FIELDS = ["name", "created_at", "type"];

export async function getCompanies(req, res) {
  try {
    let { type, page = 1, limit = 10, sort = "name", order = "asc", search = "" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (!COMPANIES_SORT_FIELDS.includes(sort)) sort = "name";

    let query = supabase.from("companies").select("*", { count: "exact" });

    if (type) query = query.eq("type", type);
    if (search) query = query.ilike("name", `%${search}%`); // search name

    query = query.order(sort, { ascending: order === "asc" });
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ total: count, page, limit, companies: data });
  } catch (err) {
    console.error("getCompanies:", err);
    res.status(500).json({ error: err.message || "Unable to fetch companies" });
  }
}

export async function getCompany(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("companies").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getCompany:", err);
    res.status(404).json({ error: err.message || "Company not found" });
  }
}

export async function createCompany(req, res) {
  try {
    const { data, error } = await supabase.from("companies").insert([req.body]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error("createCompany:", err);
    res.status(400).json({ error: err.message || "Could not create company" });
  }
}

export async function updateCompany(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("companies").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateCompany:", err);
    res.status(400).json({ error: err.message || "Could not update company" });
  }
}

export async function deleteCompany(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error("deleteCompany:", err);
    res.status(400).json({ error: err.message || "Could not delete company" });
  }
}
