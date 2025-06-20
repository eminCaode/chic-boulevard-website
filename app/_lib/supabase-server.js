import { createClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error("supabase-server.js cannot be used on the client");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase çevre değişkenleri eksik:", {
    url: !!supabaseUrl,
    key: !!supabaseKey,
  });
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
