// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://amixnbtaexuzbkylsdqc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaXhuYnRhZXh1emJreWxzZHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNjE2ODQsImV4cCI6MjA2NDczNzY4NH0.4pOp04asyrogf0WRaZ49kjU3t63Hu1tk4in0330eXVE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);