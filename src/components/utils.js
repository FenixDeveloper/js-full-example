

export function cloneTemplate(id) {
    const template = document.getElementById(id);
    return template.content.cloneNode(true).firstElementChild;
}

export function disableButton(btn) {
    btn.disabled = true;
}

export function enableButton(btn) {
    btn.disabled = false;
}

export function openModal(modal, { modalActiveClass }) {
    modal.classList.add(modalActiveClass);
}

export function closeModal(modal, { modalActiveClass }) {
    modal.classList.remove(modalActiveClass);
}