const submitContactForm = async () => {
    const form = document.getElementById("contact-form");
    const flash = document.getElementById("contact-flash");

    const values = new FormData();
    document.querySelectorAll("#contact-form .input").forEach(element =>
        values.append(element.id, element.value));
    values.append('h-captcha-response', hcaptcha.getResponse());

    const response = await fetch(form.action, {
        method: form.method,
        body: values
    }).then((response) => response.json());

    if (response.status === 200) {
        flash.classList.add('is-primary');
        flash.innerText('Message successfully sent!');
    } else {
        flash.classList.add('is-danger');
        flash.innerText('An error occurred sending message! Please try again later.');
    }

    flash.classList.remove('is-hidden');
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        submitContactForm();
    });
});
