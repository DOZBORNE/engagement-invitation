import { createHmac, timingSafeEqual } from 'node:crypto';
import { ADMIN_COOKIE_SECRET, ADMIN_PASSCODE } from '$env/static/private';

const COOKIE_NAME = 'admin_session';

/** Returns the signed cookie value for an authenticated session. */
function sign(payload: string): string {
	const sig = createHmac('sha256', ADMIN_COOKIE_SECRET).update(payload).digest('hex');
	return `${payload}.${sig}`;
}

function verify(token: string): boolean {
	const lastDot = token.lastIndexOf('.');
	if (lastDot < 1) return false;
	const payload = token.slice(0, lastDot);
	const provided = token.slice(lastDot + 1);
	const expected = createHmac('sha256', ADMIN_COOKIE_SECRET).update(payload).digest('hex');
	const a = Buffer.from(provided, 'hex');
	const b = Buffer.from(expected, 'hex');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

export function checkPasscode(provided: string): boolean {
	const a = Buffer.from(provided);
	const b = Buffer.from(ADMIN_PASSCODE);
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

export function buildSessionCookie(): { name: string; value: string; maxAge: number } {
	const issued = Date.now().toString(36);
	return { name: COOKIE_NAME, value: sign(`v1.${issued}`), maxAge: 60 * 60 * 24 * 30 };
}

export function isAuthed(cookieValue: string | undefined): boolean {
	if (!cookieValue) return false;
	return verify(cookieValue);
}

export const COOKIE = COOKIE_NAME;
