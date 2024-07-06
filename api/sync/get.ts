import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from '../../database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);

const allowCors = (fn) => async (req, res) => {
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,OPTIONS,PATCH,DELETE,POST,PUT',
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
	);
	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}
	return await fn(req, res);
};

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
module.exports = allowCors(handler);
