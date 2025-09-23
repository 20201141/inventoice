import supabase from "../db.js";

/**
 * Allowed sort fields for items (whitelist).
 */
const ITEMS_SORT_FIELDS = ["name", "item_number", "sell_price", "cost_price", "created_at", "boxes_in_stock"];

// Get all items (with filtering, sorting, pagination)
export async function getItems(req, res) {
  try {
    let { page = 1, limit = 10, sort = "created_at", order = "name", search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (!ITEMS_SORT_FIELDS.includes(sort)) sort = "created_at";

    // build query
    let query = supabase.from("items").select("*", { count: "exact" });

    // Filtering (search by name or item_number)
    if (search) {
      // or() searches multiple columns
      query = query.or(`name.ilike.%${search}%,item_number.ilike.%${search}%`);
    }

    // Sorting
    query = query.order(sort, { ascending: order === "asc" });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      total: count,
      page,
      limit,
      items: data,
    });
  } catch (err) {
    console.error("getItems:", err);
    res.status(500).json({ error: err.message || "Unable to fetch items" });
  }
}

// Get single item
export async function getItemById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("items").select("*").eq("id", id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("getItemById:", err);
    res.status(404).json({ error: err.message });
  }
}

// Create item
export async function createItem(req, res) {
  try {
    const { item_number, name, cost_price, sell_price, units_per_box, boxes_in_stock } = req.body;
    const { data, error } = await supabase
      .from("items")
      .insert([{ item_number, name, cost_price, sell_price, units_per_box, boxes_in_stock }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message || "Could not create item" });
  }
}

// Update item
export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("items").update(req.body).eq("id", id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("updateItem:", err);
    res.status(400).json({ error: err.message || "Could not update item" });
  }
}

// Delete item
export async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) throw error;
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error("deleteItem:", err);
    res.status(400).json({ error: err.message || "Could not delete item" });
  }
}
