import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

/**
 * Server-only Supabase client using the service-role key.
 * Living under `src/lib/server/` ensures SvelteKit will fail the build
 * if anything client-side accidentally imports this module.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		persistSession: false,
		autoRefreshToken: false
	}
});
