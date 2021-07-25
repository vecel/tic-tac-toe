const GameController = (() => {
    let _gameMode;
    let _players = [];
    let _gameBoard = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];

    let _turn = 1;

    const _winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    

    const GameMode = {
        PVP: 1,
        BOT: 2,
        UNKNOWN: 3
    } 

    function _gameIsOver() {
        for (let i = 0; i < _winningLines.length; ++i) {
            if (_gameBoard[_winningLines[i][0]] === 0) continue;
            if (_gameBoard[_winningLines[i][0]] === _gameBoard[_winningLines[i][1]] && 
                _gameBoard[_winningLines[i][1]] === _gameBoard[_winningLines[i][2]]) {
                    GameBoard.animateWinner(_winningLines[i]);
                    return true;
                }
        }
        return false;
    }

    function toggleTurn() {
        _turn = 3 - _turn;
    }

    function setGameMode(mode) {
        if (mode === GameMode.PVP | mode === GameMode.BOT) _gameMode = mode;
        else _gameMode = GameMode.UNKNOWN;
    }

    function createPlayers(markup) {
        _players.push(PlayerFactory(markup));
        _players.push(PlayerFactory(markup === 'X' ? 'O' : 'X'));
    }

    function makeMove(tileNumber) {
        const playerMarkup = _players[_turn - 1].markup
        _gameBoard[tileNumber] = playerMarkup;
        console.log(_gameBoard[tileNumber]);
        GameBoard.drawMarkup(tileNumber, playerMarkup);
        if (_gameIsOver()) {
            console.log(`game is over, winner ${playerMarkup}`);
        }
        toggleTurn();
    }

    function startGame() {
        _gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    function getGameBoard() {
        return _gameBoard;
    }

    return {
        GameMode,
        setGameMode,
        createPlayers,
        makeMove,
        startGame,
        getGameBoard,
    }
})();

const GameBoard = (() => {
    function drawMarkup(position, markup) {
        gameBoardTiles[position].textContent = markup;
    }    

    function animateWinner(tiles) {
        console.log(tiles);
        for (let tileNumber of tiles) {
            gameBoardTiles[tileNumber].style.backgroundColor = 'green';
        }
    }

    return {
        drawMarkup,
        animateWinner,
    }
})();

const PlayerFactory = (markup) => ({markup, score: 0});

const pvpModeButton = document.querySelector('div#pvp-mode');
const botModeButton = document.querySelector('div#bot-mode');

const gameModeSelectionMenu = document.querySelector('section#game-mode-selection');
const markupSelectionMenu = document.querySelector('section#markup-selection');
const gameDisplay = document.querySelector('section#game-display');

const markupButtons = document.querySelectorAll('div.markup');
const gameBoardTiles = document.querySelectorAll('.game-board .tile');

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
        switchToGameDisplay();
    })
}

for (let i = 0; i < gameBoardTiles.length; ++i) {
    gameBoardTiles[i].addEventListener('click', GameController.makeMove.bind(this, i))
}






const switchToMarkupSelectionMenu = () => {
    gameModeSelectionMenu.classList.add('hidden');
    markupSelectionMenu.classList.remove('hidden');
}

const switchToGameDisplay = () => {
    markupSelectionMenu.classList.add('hidden');
    gameDisplay.classList.remove('hidden');
}
