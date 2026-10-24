# Traducciones del catálogo

La web genera traducciones al inglés cuando un producto se muestra con el idioma EN. El Worker guarda las traducciones por SKU en Supabase y las reutiliza; si cambia el texto original, genera una nueva traducción. La caché es opcional: si la tabla no está disponible, el Worker aún devuelve la traducción generada, pero no podrá reutilizarla en solicitudes posteriores. Si Gemini tampoco está disponible, el catálogo conserva el texto original.

## Activación

1. Ejecuta `supabase-product-translations.sql` una vez en el SQL Editor del proyecto Supabase.
2. Desde esta carpeta, configura la clave privada del proyecto en Cloudflare. Pega el valor directamente en la terminal cuando Wrangler lo solicite; no la agregues a archivos ni al chat:

   ```powershell
   npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```

3. Confirma que `GEMINI_API_KEY` ya está configurada como secreto del Worker. Si no, configúrala con `npx wrangler secret put GEMINI_API_KEY`.
4. Publica la nueva versión del Worker:

   ```powershell
   npx wrangler deploy
   ```

La URL de Supabase está configurada como variable pública en `wrangler.toml`. La clave `service_role` permanece como secreto en Cloudflare; no debe exponerse al sitio web.
