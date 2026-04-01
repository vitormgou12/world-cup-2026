import { createClient } from "@supabase/supabase-js";
import { createMockClient } from "./mock-supabase.js";

const useMock =
  import.meta.env.VITE_USE_MOCK === "true" ||
  !import.meta.env.VITE_SUPABASE_URL;

export const supabase = useMock
  ? createMockClient()
  : createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
