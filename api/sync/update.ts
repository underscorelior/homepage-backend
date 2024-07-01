import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from '../../database.types';
import { createClient } from '@supabase/supabase-js';
import { UserData } from '../../types.d.ts';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		const { code, data } = req.query;

		if (!code || !data) {
			return res
				.status(400)
				.json({ message: 'Missing code or data in query parameters' });
		}

		const { data: users, error: selectError } = await supabase
			.from('users')
			.select();

		if (selectError) {
			throw selectError;
		}

		const user = users.find((user: UserData) => user.code === code);
		if (!user) {
			return res
				.status(404)
				.json({ message: `User with code ${code} not found` });
		}

		const { error: updateError } = await supabase
			.from('users')
			.update(data)
			.eq('code', code);

		if (updateError) {
			throw updateError;
		}

		return res.status(200).json({
			message: `User with code ${code} has been updated successfully`,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'An error occurred while processing the request',
			error: error.message,
		});
	}
}
