import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Database, Json } from '../../database.types';
import { createClient } from '@supabase/supabase-js';
import { CountdownSync, SpotifySync, UserData, WeatherSync } from '../../types';

const supabase = createClient<Database>(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_KEY,
);

type User = Database['public']['Tables']['users']['Row'];

function mergeData(data: UserData, newData: UserData): UserData {
	const output = data;
	output.updated_at = new Date().toISOString();
	return { ...output, ...newData };
}

function convertData(data: UserData): User {
	const output: User = {
		...data,
		countdown: data.countdown as unknown as Json,
		spotify: data.spotify as unknown as Json,
		weather: data.weather as unknown as Json,
	};

	return output;
}

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

		let userData: UserData | null = null;

		for (const user of users) {
			if (user.code === code) {
				userData = {
					...user,
					countdown: user.countdown as unknown as CountdownSync,
					spotify: user.spotify as unknown as SpotifySync,
					weather: user.weather as unknown as WeatherSync,
				};
				break;
			}
		}

		if (!userData) {
			return res
				.status(404)
				.json({ message: `User with code ${code} not found` });
		}

		const parsedData = JSON.parse(data.toString()) as UserData;
		const updatedUserData = mergeData(userData, parsedData);

		const { error: updateError } = await supabase
			.from('users')
			.update(convertData(updatedUserData))
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
