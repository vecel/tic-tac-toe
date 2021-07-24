const GameController = (() => {
    let _gameMode;
    let _players = [];

    const GameMode = {
        PVP: 1,
        BOT: 2,
        UNKNOWN: 3
    } 

    function setGameMode(mode) {
        if (mode === GameMode.PVP | mode === GameMode.BOT) _gameMode = mode;
        else _gameMode = GameMode.UNKNOWN;
    }

    function createPlayers(markup) {
        _players.push(PlayerFactory(markup));
        _players.push(PlayerFactory(markup === 'X' ? 'O' : 'X'));
    }

    return {
        GameMode,
        setGameMode,
        createPlayers,
    }
})();

const PlayerFactory = (markup) => ({markup});

const pvpModeButton = document.querySelector('div#pvp-mode');
const botModeButton = document.querySelector('div#bot-mode');

const gameModeSelectionMenu = document.querySelector('section#game-mode-selection');
const markupSelectionMenu = document.querySelector('section#markup-selection');
const gameDisplay = document.querySelector('section#game-display');

const markupButtons = document.querySelectorAll('div.markup');

pvpModeButton.addEventListener('click', () => {
    GameController.setGameMode(GameController.GameMode.PVP);
    switchToMarkupSelectionMenu();
})

botModeButton.addEventListener('click', () => {
    GameController.setGameMode(GameController.GameMode.BOT);
    switchToMarkupSelectionMenu();
});

for (let markup of markupButtons) {
    markup.addEventListener('click', () => {
        GameController.createPlayers(markup.textContent);
        console.log(markup.textContent);
        switchToGameDisplay();
    })
}



const switchToMarkupSelectionMenu = () => {
    gameModeSelectionMenu.classList.add('hidden');
    markupSelectionMenu.classList.remove('hidden');
}

const switchToGameDisplay = () => {
    markupSelectionMenu.classList.add('hidden');
    gameDisplay.classList.remove('hidden');
}
