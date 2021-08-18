//add sounds
class AudioController {
    constructor() {
        this.bgSound = new Audio('audio/sound.mp3');
        this.matchSound = new Audio('audio/match.mp3');
        this.winSound = new Audio('audio/victory.wav');
        this.gameOverSound = new Audio('audio/gameOver.mp3');
        this.bgSound.volume = 0.5;
        this.bgSound.loop = true;
    }

    //function to start sound
    startMusic() {
        this.bgSound.play();
    }
    //function to stop sound
    stopMusic() {
        this.bgSound.pause();
        this.bgSound.currentTime = 0; //restart from zero
    }

    //function sound played when 2 cards matched
    match() {
        this.matchSound.play();
    }

    //function sound player won the game
    win() {
        this.stopMusic();
        this.winSound.play();
    }

    //function the game is over, player lost
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
}


//set game, timer and flips rules
class Play {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

        //game is starting
        startGame() {
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null; //card is flipped and cannot be selected
        this.matchedCards = [];
        this.busy = true;

        //timeout, restart the game
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardsArray);
            this.countdown = this.startCountdown();
            this.busy = false;
        }, 500)
        this.hideCards(); //reset ticker and timer
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

        //timer starts from 100
        startCountdown() {
            return setInterval(() => {
                this.timeRemaining--;
                this.timer.innerText = this.timeRemaining;
                if(this.timeRemaining === 0)
                    this.gameOver();
            }, 1000);
        }

        //game over text popped up
        gameOver() {
            clearInterval(this.countdown);
            this.audioController.gameOver();
            document.getElementById('game-over-text').classList.add('visible');
        }

        //victory text popped up
        win() {
            clearInterval(this.countdown);
            this.audioController.win();
            document.getElementById('victory-text').classList.add('visible');
        }


        hideCards() {
            this.cardsArray.forEach(card => {
                card.classList.remove('visible');
            });
        }

    
        flipCard(card) {
            if(this.canFlipCard(card)) {
                this.totalClicks++; //as long as I can click
                this.ticker.innerText = this.totalClicks; //update flips count to current value
                card.classList.add('visible'); //show card clicked

                if(this.cardToCheck) {
                    this.checkForCardMatch(card);
                } else {
                    this.cardToCheck = card;
                }
            }
        }

        //check if the image of card cheched 1 is matched image of card checked 2
        checkForCardMatch(card) {
            if(this.getCardType(card) === this.getCardType(this.cardToCheck))
                this.cardMatch(card, this.cardToCheck);
            else 
                this.noMatch(card, this.cardToCheck);

            this.cardToCheck = null;
        }

        cardMatch(card1, card2) {
            this.matchedCards.push(card1);
            this.matchedCards.push(card2);
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.audioController.match();
            if(this.matchedCards.length === this.cardsArray.length)
                this.win();
        }

        //no match, cards flipped back after 1000ms, no click able in the meantime
        noMatch(card1, card2) {
            this.busy = true;
            setTimeout(() => {
                card1.classList.remove('visible');
                card2.classList.remove('visible');
                this.busy = false;
            }, 1000);
        }

    // Shuffle cards
    shuffleCards(cardsArray) {
        for (let i = cardsArray.length - 1; i > 0; i--) {
            const randIndex = Math.floor(Math.random() * (i + 1));
            [cardsArray[i], cardsArray[randIndex]] = [cardsArray[randIndex], cardsArray[i]];
        }
        cardsArray = cardsArray.map((card, index) => {
            card.style.order = index;
        });
    }

    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src; 
    }

    //return false, cards flipped back
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}


function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new Play(100, cards);

// on click visible class is removed to start the game
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

//cards flipped on click
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}