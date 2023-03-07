---
---
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
	request: VercelRequest,
	response: VercelResponse,
) {
	const { name } = request.query;
	return response.end(`Hello {{ site.env.HCAPTCHA_SITE_KEY }}!`);
}
