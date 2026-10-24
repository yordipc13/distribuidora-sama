const supabaseUrl = "https://kwzrenncmarkbmuzgitv.supabase.co";
const supabasePublishableKey = "sb_publishable_zvvciFyzgNqAO7QUFSZb9Q_ptM_qX4Y";

if (!window.supabase || typeof window.supabase.createClient !== "function") {
  window.supabaseClient = null;
  console.error("No se pudo cargar el SDK de Supabase.");
} else {
  window.supabaseClient = window.supabase.createClient(supabaseUrl, supabasePublishableKey);
}
