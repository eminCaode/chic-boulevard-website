import { createClient } from "@supabase/supabase-js";

// Çevre değişkenlerini kontrol et
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Yine de devam et, ancak hata ayıklama bilgisi ekle
const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export default supabase;
