import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database } from '../../database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);

export default function handler(req: VercelRequest, res: VercelResponse) {
	const { code } = req.query;
	return res.json({
		message: `Hello ${code}!`,
	});
}
