import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from '../../database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { code } = req.query;
	const { data, error } = await supabase.from('users').select();
	if (error) {
		return res.json({ code: error.code, message: error.message });
	}

	data.forEach((user) => {
		if (user.code == code) {
			return res.json({ ...user });
		}
	});

	// If doesnt exist
	return res.json({
		message: `Hello ${code}!`,
	});
}
