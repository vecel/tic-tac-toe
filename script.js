const GameController = (() => {
    let _gameMode;

    const GameMode = {
        PVP: 1,
        BOT: 2,
        UNKNOWN: 3
    } 

    function setGameMode(mode) {
        if (mode === GameMode.PVP | mode === GameMode.BOT) _gameMode = mode;
        else _gameMode = GameMode.UNKNOWN;
    }

    return {
        _gameMode,
        GameMode,
        setGameMode,
    }
})();



const pvpModeButton = document.querySelector('div#pvp-mode');
const botModeButton = document.querySelector('div#bot-mode');

const markupSelectionMenu = document.querySelector('section#markup-selection');
const gameModeSelectionMenu = document.querySelector('section#game-mode-selection');

pvpModeButton.addEventListener('click', () => {
    GameController.setGameMode(GameController.GameMode.PVP);
    switchToMarkupSelectionMenu();
})

botModeButton.addEventListener('click', () => {
    GameController.setGameMode(GameController.GameMode.BOT);
    switchToMarkupSelectionMenu();
});

function switchToMarkupSelectionMenu() {
    gameModeSelectionMenu.classList.add('hidden');
    markupSelectionMenu.classList.remove('hidden');
}