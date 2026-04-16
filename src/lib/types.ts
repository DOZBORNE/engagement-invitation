export type Guest = {
	id: string;
	rsvp_id: string;
	name: string;
	dietary: string;
	is_primary: boolean;
	sort_order: number;
};

export type Rsvp = {
	id: string;
	attending: boolean;
	note: string;
	created_at: string;
};

export type RsvpWithGuests = Rsvp & {
	guests: Guest[];
};

/** Submitted form payload (after parsing the JSON guest array). */
export type RsvpSubmission = {
	attending: boolean;
	note: string;
	guests: { name: string; dietary: string }[];
};
