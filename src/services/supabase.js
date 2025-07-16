import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://wbxpolueboxhoigelstx.supabase.co'; // ✅ export this
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndieHBvbHVlYm94aG9pZ2Vsc3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzYyNDIsImV4cCI6MjA2ODE1MjI0Mn0.NAV9CmEgkI4Ac0rkzJ1cde3A_8R9yG0F5Il9ffJ51AQ';

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
