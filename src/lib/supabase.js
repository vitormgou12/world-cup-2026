import { createClient } from "@supabase/supabase-js";
import { createMockClient } from "./mock-supabase.js";

export const isMock =
  import.meta.env.VITE_USE_MOCK === "true" ||
  !import.meta.env.VITE_SUPABASE_URL;

export const supabase = isMock
  ? createMockClient()
  : createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
