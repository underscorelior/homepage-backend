import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
	// const {} = req.query;
	return res.json({
		message: `Random code`,
	});
}
