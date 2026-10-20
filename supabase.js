const supabaseUrl = "https://kwzrenncmarkbmuzgitv.supabase.co";
const supabasePublishableKey = "sb_publishable_zvvciFyzgNqAO7QUFSZb9Q_ptM_qX4Y";

window.supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabasePublishableKey,
);