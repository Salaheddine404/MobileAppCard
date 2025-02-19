
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://gfyigjrdriifxtluqtyh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmeWlnanJkcmlpZnh0bHVxdHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NzUxODksImV4cCI6MjA1NTQ1MTE4OX0.1cerCU30Bby_mz26XSWWYAAsSu_ylGAhQoMIEdAM86M";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
