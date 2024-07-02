import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from '../../database.types';
import { createClient } from '@supabase/supabase-js';
import { generateCode } from './gencode';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);
const allowCors = (fn) => async (req, res) => {
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	// another common pattern
	// res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
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
		let { code, data } = req.query;

		if (!data) {
			data = '{}';
		}

		if (!code) {
			code = generateCode();
		}

		const { data: users, error: selectError } = await supabase
			.from('users')
			.select();

		if (selectError) {
			throw selectError;
		}

		let valid = false;
		for (const user of users) {
			if (user.code === code) {
				valid = true;
				break;
			}
		}

		if (valid) {
			return res
				.status(404)
				.json({ message: `User with code ${code} already exists!` });
		}

		const insert = {
			...JSON.parse(Array.isArray(data) ? data.toString() : data),
			code,
		};

		const { error: insertError } = await supabase.from('users').insert(insert);

		if (insertError) {
			throw insertError;
		}

		return res.status(200).json({
			message: `User with code ${code} has been created successfully`,
			code: code,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'An error occurred while processing the request',
			error: error.message,
		});
	}
}

module.exports = allowCors(handler);
