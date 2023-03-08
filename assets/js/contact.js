const enableContactSubmit = (resp) => {
    const btn = document.getElementById("contact-submit-btn");
    if (resp) {
        btn.disabled = false;
    } else {
        btn.disabled = true
    }
};

const submitContactForm = async () => {
    const btn = document.getElementById("contact-submit-btn");
    const form = document.getElementById("contact-form");
    const flash = document.getElementById("contact-flash");

    btn.disabled = true;

    const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then((response) => response.json());

    if (response.status === 200) {
        flash.classList.add('is-primary');
        flash.innerText('Message successfully sent!');
    } else {
        flash.classList.add('is-danger');
        flash.innerText('An error occurred sending message! Please try again later.');
        btn.disabled = false;
    }

    flash.classList.remove('is-hidden');
};

const form = document.getElementById("contact-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitContactForm();
});