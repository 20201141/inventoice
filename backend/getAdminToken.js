import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updatePassword() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    "b6e9b782-1fb7-4968-8111-3aa37f9e77ba",
    { password: "testing1!" }
  );

  if (error) console.error(error);
  else console.log("Password updated:", data);
}

async function signInAdmin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "bomyrhee@gmail.com",
    password: "testing1!"
  });

  if (error) {
    console.error("Sign in failed:", error);
    return;
  }

  console.log("Access token:", data.session.access_token);
}

signInAdmin();
