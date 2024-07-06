import type { VercelRequest, VercelResponse } from '@vercel/node';

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
		const { lon, lat } = req.query;

		const result = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}
            &lon=${lon}&units=metric
            &appid=${process.env.WEATHER_KEY}`,
		);
		const response = await result.json();
		console.log(response);

		return res.status(200).json({ response });
	} catch (error) {
		return res.status(500).json({
			message: 'An error occurred while processing the request',
			error: error.message,
		});
	}
}
module.exports = allowCors(handler);
