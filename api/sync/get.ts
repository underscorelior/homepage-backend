import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from '../../database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const { code } = req.query;

		if (!code) {
			return res
				.status(400)
				.json({ message: 'Missing code in query parameters' });
		}

		const { data: users, error: selectError } = await supabase
			.from('users')
			.select();

		if (selectError) {
			throw selectError;
		}

		for (const user of users) {
			if (user.code == code) {
				return res.json({ ...user });
			}
		}
		return res
			.status(404)
			.json({ message: `User with code ${code} not found` });
	} catch (error) {
		return res.status(500).json({
			message: 'An error occurred while processing the request',
			error: error.message,
		});
	}
}
