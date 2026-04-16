import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/server/supabase';
import { event } from '$lib/config';

const MAX_GUESTS = 12;

export const actions: Actions = {
	submit: async ({ request }) => {
		const data = await request.formData();
		const attendingRaw = data.get('attending');
		const guestsRaw = data.get('guests_json');
		const noteRaw = data.get('note');

		if (Date.now() > new Date(event.rsvp.deadlineIso).getTime()) {
			return fail(400, { message: 'Replies are closed.' });
		}

		const attending = attendingRaw === 'yes';
		if (attendingRaw !== 'yes' && attendingRaw !== 'no') {
			return fail(400, { message: 'Please choose accept or decline.' });
		}

		let guests: { name: string; dietary: string }[] = [];
		try {
			const parsed = JSON.parse(typeof guestsRaw === 'string' ? guestsRaw : '[]');
			if (!Array.isArray(parsed)) throw new Error('not array');
			guests = parsed
				.map((g) => ({
					name: typeof g?.name === 'string' ? g.name.trim() : '',
					dietary: typeof g?.dietary === 'string' ? g.dietary.trim() : ''
				}))
				.filter((g) => g.name.length > 0);
		} catch {
			return fail(400, { message: 'Could not read your guest list. Please try again.' });
		}

		if (guests.length === 0) {
			return fail(400, { message: 'Please enter at least one name.' });
		}
		if (guests.length > MAX_GUESTS) {
			return fail(400, {
				message: `That's a generous party — please contact us directly for more than ${MAX_GUESTS} guests.`
			});
		}

		const note = typeof noteRaw === 'string' ? noteRaw.trim().slice(0, 1000) : '';

		const { data: rsvpRow, error: rsvpErr } = await supabase
			.from('rsvps')
			.insert({ attending, note })
			.select('id')
			.single();

		if (rsvpErr || !rsvpRow) {
			console.error('rsvp insert failed', rsvpErr);
			return fail(500, { message: 'Could not save your reply. Please try again.' });
		}

		const guestRows = guests.map((g, i) => ({
			rsvp_id: rsvpRow.id,
			name: g.name.slice(0, 120),
			dietary: g.dietary.slice(0, 240),
			is_primary: i === 0,
			sort_order: i
		}));

		const { error: guestsErr } = await supabase.from('rsvp_guests').insert(guestRows);

		if (guestsErr) {
			console.error('rsvp_guests insert failed', guestsErr);
			// Best-effort cleanup so we don't leave an orphaned rsvp row.
			await supabase.from('rsvps').delete().eq('id', rsvpRow.id);
			return fail(500, { message: 'Could not save your reply. Please try again.' });
		}

		return { success: true, attending, guestCount: guests.length };
	}
};
