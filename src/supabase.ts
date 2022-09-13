import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zwzqwvlcrlemukociavh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3enF3dmxjcmxlbXVrb2NpYXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjMwNDQzMjgsImV4cCI6MTk3ODYyMDMyOH0.oXpTJcp0HdZ5LfTaeWC2Vb6Ow22qSLbdj4p5cNDy7rg"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)