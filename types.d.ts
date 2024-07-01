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
	unit: 'c' | 'f';
	enabled: boolean;
}

export interface UserData {
	code: string;
	countdown: CountdownSync;
	created_at: string;
	id: string;
	spotify: SpotifySync;
	updated_at: string;
	weather: WeatherSync;
}
