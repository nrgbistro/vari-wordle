const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = "https://zwzqwvlcrlemukociavh.supabase.co";
const supabaseSecret = process.env.REACT_APP_SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseSecret);

module.exports = supabase;
