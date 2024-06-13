const cards = [
    'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 
    'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'
];

let shuffledCards;
let gameBoard = document.getElementById('game-board');
let statusBox = document.getElementById('status-box');
let resetButton = document.getElementById('reset-button');
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false;
let matches = 0;

function initGame() {
    shuffledCards = [...cards].sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    matches = 0;

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.card = card;

        const content = document.createElement('div');
        content.classList.add('content');
        content.textContent = card;

        cardElement.appendChild(content);
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    statusBox.textContent = 'Pick a card';
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        statusBox.textContent = 'Pick another card';
        return;
    }

    secondCard = this;
    hasFlippedCard = false;

    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.card === secondCard.dataset.card) {
        statusBox.textContent = 'MATCH!';
        matches++;
        lockBoard = true;

        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        setTimeout(() => {
            flashMatchedCards();
        }, 500);  // Short delay before flashing matched cards
    } else {
        statusBox.textContent = 'No Match';
        flashUnmatchedCards();
    }
}

function flashMatchedCards() {
    const matchedCards = document.querySelectorAll('.card.matched');
    matchedCards.forEach(card => {
        card.classList.add('matched-flash');
    });

    setTimeout(() => {
        matchedCards.forEach(card => {
            card.classList.remove('matched-flash');
        });
        lockBoard = false;
        if (matches === cards.length / 2) {
            statusBox.textContent = 'YOU\'VE COMPLETED THE GAME!';
        } else {
            statusBox.textContent = 'Pick a card';
        }
    }, 500);  // Duration of the flashing animation (0.5s * 1)
}

function flashUnmatchedCards() {
    const unmatchedCards = document.querySelectorAll('.card:not(.matched):not(.flipped)');
    unmatchedCards.forEach(card => {
        card.classList.add('unmatched-flash');
    });

    setTimeout(() => {
        unmatchedCards.forEach(card => {
            card.classList.remove('unmatched-flash');
        });
        unflipCards();
    }, 500);  // Duration of the flashing animation (0.5s * 1)
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
        statusBox.textContent = 'Pick a card';
        lockBoard = false;
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() {
    initGame();
}

// Initialize the game when the page loads
initGame();
