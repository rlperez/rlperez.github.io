import type {VercelRequest, VercelResponse}from '@vercel/node';

export default function handler(request : VercelRequest, response : VercelResponse,) {
	const hcaptcha_site_key = process.env.HCAPTCHA_SITE_KEY;

    return response.end(`Hello ${hcaptcha_site_key}!`);
}