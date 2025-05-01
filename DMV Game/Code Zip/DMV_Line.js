class DMVGame {
    constructor() {
        this.stats = {
            patience: 100,
            sanity: 100,
            battery: 100,
            money: 20,
            bladder: 50,
            position: 50  // 50 is back of line, 1 is at counter
        };

        this.inventory = [];
        this.events = [];
        this.currentNumber = 'B257';
        this.playerNumber = 'D412';
        this.gameOver = false;
        this.gameStarted = false;
        this.deathReason = '';

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => this.startGame());
        document.getElementById('playAgainButton').addEventListener('click', () => this.resetGame());
        document.getElementById('learnWhyButton').addEventListener('click', () => this.showDeathReason());
        
        document.getElementById('wait').addEventListener('click', () => this.handleAction('wait'));
        document.getElementById('complain').addEventListener('click', () => this.handleAction('complain'));
        document.getElementById('useBathroom').addEventListener('click', () => this.handleAction('useBathroom'));
        document.getElementById('usePhone').addEventListener('click', () => this.handleAction('usePhone'));
        document.getElementById('buySnack').addEventListener('click', () => this.handleAction('buySnack'));
        document.getElementById('bribe').addEventListener('click', () => this.handleAction('bribe'));
    }

    startGame() {
        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        this.gameStarted = true;
        this.startGameLoop();
    }

    resetGame() {
        this.stats = {
            patience: 100,
            sanity: 100,
            battery: 100,
            money: 20,
            bladder: 50,
            position: 50
        };
        this.gameOver = false;
        document.getElementById('winScreen').style.display = 'none';
        document.getElementById('deathScreen').style.display = 'none';
        document.getElementById('deathReason').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('gameContainer').classList.remove('fade-out');
        document.body.classList.remove('fade-to-black');
        this.updateUI();
    }

    showDeathReason() {
        document.getElementById('deathScreen').style.display = 'none';
        document.getElementById('deathReason').style.display = 'block';
        document.getElementById('deathReason').innerHTML = '<h1>YOU DIED</h1><p>The DMV is not a place. It is a trap. A self-contained realm of despair where time stands still and suffering is mandatory. You do not visit the DMV. You are sentenced to it. There are no windows. The clocks do not move. The air is dry and heavy, filled with sighs and fluorescent buzzing. Hope does not enter here. Every action kills you. Sitting too long drains your soul. Checking your phone kills your battery and your will. Talking to strangers spreads the disease of boredom. Trying to leave only resets your place in line. Even breathing feels like it costs something. There is no progress. There is no escape. The line does not move. The numbers are meaningless. The forms are always wrong. You are not there to complete a task. You are there to be broken.</p>';
    }

    handleAction(action) {
        if (this.gameOver || !this.gameStarted) return;

        switch (action) {
            case 'wait':
                this.stats.patience = Math.min(100, this.stats.patience + 5);
                this.stats.sanity = Math.max(0, this.stats.sanity - 2);
                this.stats.battery = Math.max(0, this.stats.battery - 1);
                this.stats.bladder = Math.min(100, this.stats.bladder + 5);
                this.addEvent("You wait patiently...");
                break;
            case 'complain':
                this.stats.patience = Math.min(100, this.stats.patience + 10);
                this.stats.sanity = Math.max(0, this.stats.sanity - 5);
                this.addEvent("You complain loudly. People stare.");
                break;
            case 'useBathroom':
                if (this.stats.bladder > 30) {
                    this.stats.bladder = 0;
                    this.stats.position = Math.min(50, this.stats.position + 5);
                    this.addEvent("You use the bathroom and lose your spot in line!");
                } else {
                    this.addEvent("You don't need to use the bathroom right now.");
                }
                break;
            case 'usePhone':
                this.stats.battery = Math.max(0, this.stats.battery - 10);
                this.stats.sanity = Math.min(100, this.stats.sanity + 5);
                this.addEvent("You scroll through social media to pass the time.");
                break;
            case 'buySnack':
                if (this.stats.money >= 5) {
                    this.stats.money -= 5;
                    this.stats.patience = Math.min(100, this.stats.patience + 15);
                    this.addEvent("You buy a snack from the vending machine.");
                } else {
                    this.addEvent("You don't have enough money for a snack.");
                }
                break;
            case 'bribe':
                if (this.stats.money >= 10) {
                    this.stats.money -= 10;
                    if (Math.random() < 0.5) {
                        this.stats.position = Math.max(1, this.stats.position - 5);
                        this.addEvent("Your bribe worked! You move up in line.");
                    } else {
                        this.addEvent("Your bribe attempt failed. The staff member looks offended.");
                    }
                } else {
                    this.addEvent("You don't have enough money for a bribe.");
                }
                break;
        }

        this.checkGameState();
        this.updateUI();
    }

    startGameLoop() {
        setInterval(() => {
            if (this.gameOver || !this.gameStarted) return;

            // Random events
            if (Math.random() < 0.2) {
                this.triggerRandomEvent();
            }

            // Passive changes
            this.stats.patience = Math.max(0, this.stats.patience - 1);
            this.stats.sanity = Math.max(0, this.stats.sanity - 1);
            this.stats.bladder = Math.min(100, this.stats.bladder + 1);

            // Line movement
            if (Math.random() < 0.3) {
                this.stats.position = Math.max(1, this.stats.position - 1);
                this.addEvent("The line moves forward slightly.");
            }

            this.checkGameState();
            this.updateUI();
        }, 5000); // Game tick every 5 seconds
    }

    triggerRandomEvent() {
        const events = [
            { message: "A child starts crying loudly.", effect: () => this.stats.sanity -= 10 },
            { message: "The Wi-Fi goes down!", effect: () => this.stats.battery -= 20 },
            { message: "Someone cuts in line!", effect: () => this.stats.patience -= 15 },
            { message: "The system crashes! Everyone has to take new numbers.", effect: () => this.stats.position = 50 },
            { message: "A kind stranger offers you a charger.", effect: () => this.stats.battery += 30 }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        this.addEvent(event.message);
    }

    checkGameState() {
        if (this.stats.sanity >= 100 || this.stats.patience >= 100 || this.stats.bladder >= 100) {
            this.gameOver = true;
            document.body.classList.add('fade-to-black');
            document.getElementById('gameContainer').classList.add('fade-out');
            
            setTimeout(() => {
                document.getElementById('gameContainer').style.display = 'none';
                document.getElementById('deathScreen').style.display = 'block';
            }, 2000);
        }

        if (this.stats.position <= 1) {
            this.gameOver = true;
            document.getElementById('gameContainer').style.display = 'none';
            document.getElementById('winScreen').style.display = 'block';
        }
    }

    addEvent(message) {
        const eventLog = document.querySelector('.log-content');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = message;
        eventLog.insertBefore(entry, eventLog.firstChild);
    }

    updateUI() {
        // Update stats
        Object.entries(this.stats).forEach(([stat, value]) => {
            const element = document.getElementById(stat);
            if (element) {
                if (stat === 'position') {
                    element.textContent = `Position: ${value}`;
                    // For position, we want the bar to fill from left to right as position decreases
                    element.style.setProperty('--value', value);
                } else {
                    element.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value}`;
                    element.style.setProperty('--value', `${value}%`);
                }
            }
        });

        // Update player position (1 is at counter, 50 is back of line)
        const player = document.getElementById('player');
        const positionPercentage = ((this.stats.position - 1) / 49) * 100; // Convert 1-50 to 0-100%
        player.style.left = `${positionPercentage}%`;

        // Update numbers
        document.getElementById('servingNumber').textContent = this.currentNumber;
        document.getElementById('playerNumber').textContent = this.playerNumber;

        // Disable buttons if game is over
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.id !== 'startButton' && button.id !== 'playAgainButton' && button.id !== 'learnWhyButton') {
                button.disabled = this.gameOver || !this.gameStarted;
            }
        });
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new DMVGame();
}); 