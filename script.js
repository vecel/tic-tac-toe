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

pvpModeButton.addEventListener('click', GameController.setGameMode.bind(this, GameController.GameMode.PVP));
botModeButton.addEventListener('click', GameController.setGameMode.bind(this, GameController.GameMode.BOT));