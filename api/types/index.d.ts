import "@hcaptcha/types";

type CaptchaResponse = {
    status: number,
    message: string,
    error_codes?: string[],
    hostname?: string,
};
