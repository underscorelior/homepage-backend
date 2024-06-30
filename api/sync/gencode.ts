import type { VercelRequest, VercelResponse } from '@vercel/node';
import words from '../../words.json';

function generateRandomWord() {
	return words[Math.floor(Math.random() * words.length)];
}

function generateCode() {
	const output = [];
	for (let i = 0; i <= 10; i++) {
		output.push(generateRandomWord());
	}
	return output.join(' ');
}

export default function handler(req: VercelRequest, res: VercelResponse) {
	return res.json({
		message: `Random code: ${generateCode()}`,
	});
}
