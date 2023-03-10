import type { VercelRequest, VercelResponse } from '@vercel/node';
import { address } from 'ip';
import { verify } from 'hcaptcha';
import { CaptchaResponse } from './types';
import nodemailer from "nodemailer";

async function verifyCaptcha(hcaptcha_response: string | undefined): Promise<CaptchaResponse> {
	const hcaptcha_site_key = process.env.HCAPTCHA_SITE_KEY;
	const hcaptcha_secret = process.env.HCAPTCHA_SECRET;

	if (!hcaptcha_secret) {
		console.error('hCaptcha secret missing!');
		return { status: 500, message: 'hCaptcha secret key missing!' };
	}

	if (!hcaptcha_site_key) {
		console.error('hCaptcha site key missing!');
		return { status: 500, message: 'hCaptcha site key missing!' };
	}

	if (hcaptcha_response) {
		const verify_response = await verify(hcaptcha_secret, hcaptcha_response, address(), hcaptcha_site_key);
		if (verify_response?.success) {
			return {
				status: 200,
				message: 'hCaptcha verified user',
			};
		} else {
			console.warn({ verify_response });
			return {
				status: 429,
				message: 'hCaptcha verification failed',
				error_codes: verify_response['error-codes'],
				hostname: verify_response.hostname
			};
		}
	} else {
		return { status: 400, message: 'Missing h-captcha-response' };
	}
}

export default async function handler(request: VercelRequest, response: VercelResponse,) {
	const a = JSON.parse(request.body);
	console.log({ a })
	const hcaptcha_response = request?.body['h-captcha-response'];
	const verify_response = await verifyCaptcha(hcaptcha_response);

	if (verify_response.status === 200) {

		const transport = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: 2525,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
			}
		});

		const message = {
			from: request?.body['contact-email'],
			to: process.env.CONTACT_EMAIL,
			subject: `[KABLAMO.ME] CONTACT PAGE FROM ${request?.body['contact-name']}`,
			body: `NAME: ${request?.body['contact-name']}\n` +
				`PHONE: ${request?.body['contact-phone']}\n\n` +
				`${request?.body['contact-body']}`
		}

		transport.sendMail(message, (err, info) => {
			if (err) {
				console.error({ err });
				return response.json({ status: 500, message: err }).end();
			} else {
				console.log({ info });
				return response.json({ status: 200, message: "Email successfull sent" }).end();
			}
		});
	} else {
		response.json(verify_response).end();
	}
}