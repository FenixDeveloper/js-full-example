
const baseURL = "";
const headers = {
    'Content-Type': 'application/json'
};

const cards = new Map([
    [1, {
        id: 1,
        image: 'https://placehold.co/250?text=1',
        title: 'Test 1',
        author: 1,
        likes: [2, 3, 4]
    }],
    [2, {
        id: 2,
        image: 'https://placehold.co/250?text=2',
        title: 'Test 2',
        author: 2,
        likes: [1, 3, 4]
    }],
    [3, {
        id: 3,
        image: 'https://placehold.co/250?text=3',
        title: 'Test 3',
        author: 1,
        likes: [3, 4, 5, 6, 7]
    }],
    [4, {
        id: 4,
        image: 'https://placehold.co/250?text=4',
        title: 'Test 4',
        author: 3,
        likes: [2, 3, 5, 7]
    }]
]);
let cardsCounter = cards.size;

const mocks = {
    'GET:/user/me': () => ({
        id: 1,
        name: 'Super Puper Student'
    }),
    'GET:/cards': () => [...cards.values()],
    'POST:/cards/\\d+/likes': ({ cardId, from }) => {
        const card = cards.get(cardId);
        const likes = new Set(card.likes);
        likes.add(from);
        card.likes = [...likes.values()];
        cards.set(cardId, card);
        return card;
    },
    'DELETE:/cards/\\d+/likes': ({ cardId, from }) => {
        const card = cards.get(cardId);
        card.likes = card.likes.filter(u => u !== from);
        cards.set(cardId, card);
        return card;
    },
    'POST:/cards': ({ image, title, author }) => {
        const newCard = {
            id: ++cardsCounter,
            image,
            title,
            author,
            likes: []
        };
        cards.set(newCard.id, newCard);
        return newCard;
    },
    'DELETE:/cards/\\d+': ({ cardId }) => {
        cards.delete(cardId);
        return true;
    }
};

const mockedFetch = true ? (url, { method, body }) => {
    return new Promise(resolve => {
        const req = `${method}:${url}`;
        const mockName = Object.keys(mocks).filter(m => (new RegExp(m, 'ig')).test(req)).shift();
        resolve({
            ok: true,
            json: async () => mocks[mockName](body ? JSON.parse(body) : {})
        });
    });
} : fetch;

function checkResponse(response) {
    if (response.ok) return response.json();
    else Promise.reject(`Ошибка ${response.status}`);
}

function get(url) {
    return mockedFetch(url, {
        method: 'GET',
        headers
    }).then(checkResponse);
}

function post(url, data, method = 'POST') {
    return mockedFetch(url, {
        method,
        headers,
        body: JSON.stringify(data)
    }).then(checkResponse);
}

export function getUser() {
    return get('/user/me');
}

export function getCards() {
    return get('/cards');
}

export function toggleLike(cardId, user, hasLike) {
    return post(`/cards/${cardId}/likes`, {
        cardId: cardId,
        from: user
    }, hasLike ? 'DELETE' : 'POST');
}

export function addNewCard(data) {
    return post('/cards', data);
}

export function deleteCard(cardId) {
    return post(`/cards/${cardId}`, { cardId }, 'DELETE');
}


window.__api = {
    getUser,
    getCards,
    toggleLike,
    addNewCard,
    deleteCard
};
window.__cards = cards;