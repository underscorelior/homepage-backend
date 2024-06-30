import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
	const { code } = req.query;
	return res.json({
		message: `Hello ${code}!`,
	});
}
