import supabase from "../db.js";

/**
 * GET /api/users/me
 * - requireAuth middleware should run before this
 * - returns auth user info (from Supabase) and role mapping from users table
 */
export async function getMe(req, res) {
  try {
    const authUser = req.user; // set by requireAuth
    if (!authUser) return res.status(401).json({ error: "Not authenticated" });

    const { data, error } = await supabase.from("users").select("role").eq("id", authUser.id).single();
    if (error && error.code !== "PGRST116") {
      // if error and not "no rows", return error
      return res.status(500).json({ error: error.message });
    }

    const role = data?.role || "regular";
    res.json({ user: { id: authUser.id, email: authUser.email }, role });
  } catch (err) {
    console.error("getMe:", err);
    res.status(500).json({ error: "Could not fetch user info" });
  }
}

/**
 * POST /api/users/register
 * - Called after a user signs up with Supabase Auth (frontend should call this).
 * - Creates a row in `users` table mapping auth.user.id -> role (defaults to 'regular').
 * - requireAuth is optional here, but it's safer to require the token so you can trust the id.
 */
export async function registerUser(req, res) {
  try {
    const authUser = req.user;
    if (!authUser) return res.status(401).json({ error: "Not authenticated" });

    const role = req.body.role || "regular"; // admins should not use this endpoint to set admin role
    const { data, error } = await supabase.from("users").insert([{ id: authUser.id, role }]).select().single();

    if (error) {
      // if uniqueness violation (row exists), return existing mapping
      if (error?.details && error.details.includes("already exists")) {
        const existing = await supabase.from("users").select("role").eq("id", authUser.id).single();
        return res.status(200).json({ role: existing.data.role });
      }
      throw error;
    }

    res.status(201).json({ id: data.id, role: data.role });
  } catch (err) {
    console.error("registerUser:", err);
    res.status(400).json({ error: err.message || "Could not register user mapping" });
  }
}

/**
 * GET /api/users
 * - Admin-only: list all mappings (id, role).
 */
export async function listUsers(req, res) {
  try {
    const { data, error } = await supabase.from("users").select("id, role");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("listUsers:", err);
    res.status(500).json({ error: err.message || "Unable to fetch users" });
  }
}

/**
 * PUT /api/users/:id/role
 * - Admin-only: change another user's role (e.g., make admin).
 */
export async function setUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["admin", "regular"].includes(role)) return res.status(400).json({ error: "Invalid role" });

    const { data, error } = await supabase.from("users").upsert([{ id, role }], { onConflict: "id" }).select().single();
    if (error) throw error;
    res.json({ id: data.id, role: data.role });
  } catch (err) {
    console.error("setUserRole:", err);
    res.status(400).json({ error: err.message || "Could not set user role" });
  }
}
