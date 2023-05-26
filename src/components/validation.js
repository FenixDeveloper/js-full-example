
export function enableFormValidation({ formName, onSubmit }) {
    const form = document.forms[formName];
    const submit = form.querySelector("button[type=submit]");

    form.addEventListener('keyup', () => {
        submit.disabled = !form.checkValidity();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = [...formData.entries()].reduce((a, [key, value]) => Object.assign(a, {[key]: value}), {})
        onSubmit(data);
        return false;
    });

    if (!form.checkValidity()) {
        submit.disabled = true;
    }
}