import supabase from "../db.js";

/*
 * requireAuth
 * - Expects Authorization: Bearer <access_token> header.
 * - Uses supabase.auth.getUser(token) to validate the token and attach user to req.user.
 */
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "Missing Auth token" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: "Invalid token" });

    // attach auth user obj
    req.user = data.user;
    next();

  } catch (err) {
    console.error("requireAuth error:", err);
    res.status(500).json({ error: "Auth verification failed." });
  }
}

/*
 * requireRole
 * - Accepts a role string or array of strings.
 * - Checks the users table for a role mapping: users.id (auth.user.id) -> role.
 */
export function requireRole(role) {
  const allowed = Array.isArray(role) ? role : [role];

  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Not authenticated" });
      
      const { data, error } = await supabase.from("users").select("role").eq("id", req.user.id).single();
      if (error || !data) return res.status(403).json({ error: "Access denied: Role not found" });

      if (data.role !== role) return res.status(403).json({ error: "Insufficient permissions" });
      if (!allowed.includes(data.role)) return res.status(403).json({ error: "Insufficient permissions" });

      req.userRole = data.role;
      next();

    } catch (err) {
      console.error("requireRole error:", err);
      res.status(500).json({ error: "Role verification failed" });
    }
  };
}
