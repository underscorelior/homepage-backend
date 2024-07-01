interface Countdown {
	name: string;
	timestamp: number;
}

interface CountdownSync {
	countdowns: Countdown[];
	enabled: boolean;
}

interface SpotifySync {
	enabled: boolean;
}

interface WeatherSync {
	enabled: boolean;
	temp: 't' | 'f';
}

export interface UserData {
	code: string;
	countdown: CountdownSync;
	created_at: number;
	id: string;
	spotify: SpotifySync;
	updated_at: string | null;
	weather: WeatherSync;
}
