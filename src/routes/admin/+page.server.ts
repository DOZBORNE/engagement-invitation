import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { supabase } from '$lib/server/supabase';
import { COOKIE, buildSessionCookie, checkPasscode, isAuthed } from '$lib/server/auth';
import type { RsvpWithGuests } from '$lib/types';

export const load: PageServerLoad = async ({ cookies }) => {
	const authed = isAuthed(cookies.get(COOKIE));
	if (!authed) return { authed: false as const };

	const { data: rsvps, error } = await supabase
		.from('rsvps')
		.select('id, attending, note, created_at, rsvp_guests(id, name, dietary, is_primary, sort_order)')
		.order('created_at', { ascending: false });

	if (error) {
		console.error('admin load failed', error);
		return { authed: true as const, rsvps: [], loadError: error.message };
	}

	const normalized: RsvpWithGuests[] = (rsvps ?? []).map((r) => ({
		id: r.id,
		attending: r.attending,
		note: r.note,
		created_at: r.created_at,
		guests: ((r as unknown as { rsvp_guests: RsvpWithGuests['guests'] }).rsvp_guests ?? [])
			.slice()
			.sort((a, b) => a.sort_order - b.sort_order)
			.map((g) => ({
				id: g.id,
				rsvp_id: r.id,
				name: g.name,
				dietary: g.dietary,
				is_primary: g.is_primary,
				sort_order: g.sort_order
			}))
	}));

	return { authed: true as const, rsvps: normalized, loadError: null };
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const data = await request.formData();
		const passcode = String(data.get('passcode') ?? '');
		if (!passcode || !checkPasscode(passcode)) {
			return fail(401, { message: 'Incorrect passcode.' });
		}
		const { name, value, maxAge } = buildSessionCookie();
		cookies.set(name, value, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge
		});
		throw redirect(303, '/admin');
	},
	logout: async ({ cookies }) => {
		cookies.delete(COOKIE, { path: '/' });
		throw redirect(303, '/admin');
	}
};
