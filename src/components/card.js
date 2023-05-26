import { cloneTemplate, disableButton } from "./utils";

export function createCard({ 
    data, 
    userId,
    cardTemplateId,
    cardImageQuery, 
    cardTitleQuery, 
    cardLikeBtn,
    cardLikeBtnActiveClass,
    cardDeleteBtn,
    onLikeHandler,
    onDeleteHandler,
    onViewHandler
}) {
    const card = cloneTemplate(cardTemplateId);
    const image = card.querySelector(cardImageQuery);
    const title = card.querySelector(cardTitleQuery);
    const likeButton = card.querySelector(cardLikeBtn);
    const deleteButton = card.querySelector(cardDeleteBtn);

    image.src = data.image;
    image.alt = data.title;
    title.textContent = data.title;
    likeButton.textContent = data.likes.length;

    if (data.likes.includes(userId)) {
        likeButton.classList.toggle(cardLikeBtnActiveClass);
    }

    if (!onDeleteHandler) {
        deleteButton.remove();
    } else {
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            onDeleteHandler({ event, card, data, button: deleteButton });
        });
    }

    if (!onLikeHandler) {
        disableButton(likeButton);
    } else {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            onLikeHandler({ 
                event, 
                card, 
                data, 
                button: likeButton, 
                hasLike: likeButton.className.includes(cardLikeBtnActiveClass),
                toggle: () => likeButton.classList.toggle(cardLikeBtnActiveClass) 
            });
        });
    }

    if (onViewHandler) {
        card.addEventListener('click', (event) => {
            onViewHandler({ event, card, data });
        });
    }

    return card;
}