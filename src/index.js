import "./index.css";
import { settings } from "./constants";
import { createCard } from "./components/card";
import { initModal } from "./components/modal";
import { getUser, getCards, addNewCard, deleteCard, toggleLike } from "./components/api";
import { enableFormValidation } from "./components/validation";

const profileName = document.querySelector(settings.profileNameQuery);
const gallery = document.querySelector(settings.galleryQuery);

const addCardModal = initModal(
    settings.addCardButtonQuery,
    settings.addCardModalQuery,
    settings
);

window.__addCardModal = addCardModal;

Promise.all([
    getUser(),
    getCards()
]).then(([user, cards]) => {
    profileName.textContent = user.name;

    const appendCard = data => {
        gallery.append(createCard({
         data,
         userId: user.id,
         ...settings,
         onLikeHandler: (data.author !== user.id) ? ({ button, hasLike, toggle }) => {
             toggleLike(data.id, user.id, hasLike).then((result) => {
                 button.textContent = result.likes.length;
                 toggle();
             });
         } : null,
         onDeleteHandler: (data.author === user.id) ? ({ card }) => {
             deleteCard(data.id).then(result => {
                card.remove();
             });
         } : null
        })); 
     };

    cards.forEach(appendCard);

    enableFormValidation({
        formName: settings.addCardFormName,
        onSubmit: (data) => {
            console.log(data);
            addNewCard({
                ...data,
                author: user.id
            }).then(result => {
                appendCard(result);
            })
            addCardModal.close();
        }
    });
});