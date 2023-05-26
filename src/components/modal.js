import { openModal, closeModal } from "./utils";

export function initModal(button, modal, { modalCloseQuery, ...settings }) {
    const modalRoot = document.querySelector(modal);
    const trigger = document.querySelector(button);
    const closeButtons = document.querySelectorAll(modalCloseQuery);

    const open = () => {
        openModal(modalRoot, settings);
        document.addEventListener('keyup', escHandler);
    };
    const close = () => {
        closeModal(modalRoot, settings);
        document.removeEventListener('keyup', escHandler);
    };
    const escHandler = (event) => {
        if (event.key === 'Escape') close();
    };

    closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', close);
    });

    trigger.addEventListener('click', () => {
        open();
    });

    modalRoot.addEventListener('click', (event) => {
        if (event.target === modalRoot) close();
    });

    return { open, close };
}