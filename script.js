const GameController = (() => {
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

    
    const _GameResult = {
        WIN: 1,
        DRAW: 2,
        CONTINUE: 3
    }

    let _gameMode;
    let _players = [];
    let _gameBoard = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];

    let _turn = 1;
    let _gameEnded = false;
    let _playerScoreLabel;
    let _opponentScoreLabel;
    
    const GameMode = {
        PVP: 1,
        BOT: 2,
        UNKNOWN: 3
    } 
    
    let firstPlayer = 1;
    
    function _gameIsOver() {
        for (let i = 0; i < _winningLines.length; ++i) {
            if (_gameBoard[_winningLines[i][0]] === 0) continue;
            if (_gameBoard[_winningLines[i][0]] === _gameBoard[_winningLines[i][1]] && 
                _gameBoard[_winningLines[i][1]] === _gameBoard[_winningLines[i][2]]) {
                    if (!_gameEnded) GameBoard.animateWinner(_winningLines[i]);
                    return _GameResult.WIN;
            }
        }
        if (!_gameBoard.includes(0)) return _GameResult.DRAW;
        return _GameResult.CONTINUE;
    }
        
        
    function _isTileEmpty(tileNumber) {
        return gameBoardTiles[tileNumber].textContent === '';
    }

    function _toggleTurn() {
        _turn = 3 - _turn;
    }

    function _toggleFirstPlayer() {
        firstPlayer = 3 - firstPlayer;
    }
        
    function _makeBotMove() {
        let tileNumber;
        do {
            tileNumber = Math.floor(Math.random() * 9);
        } while (_gameBoard[tileNumber] !== 0)

        if (_gameIsOver() === _GameResult.CONTINUE) {
            _gameBoard[tileNumber] = _players[1].markup;
            GameBoard.drawMarkup(tileNumber, _players[1].markup);        
        }
        if (_gameIsOver() === _GameResult.WIN) {
            if (!_gameEnded) {
                _updateScore(_players[1]);
                _gameEnded = true;
            }
            return;
        }
        if (_gameIsOver() === _GameResult.DRAW) console.log('draw');
    }

    function _checkGameResult() {
        switch (_gameIsOver()) {
            case _GameResult.CONTINUE: 
                break;
            case _GameResult.WIN:
                if (!_gameEnded) {
                    _updateScore(_players[_turn - 1]);
                    _gameEnded = true;
                }
                break;
            case _GameResult.DRAW:
                _gameEnded = true;
                break;
            default:
                break;
        }

        if (_gameEnded) _activateNextRoundButton();
    }

    function _activateNextRoundButton() {
        playNextRoundButton.disabled = false;
    }

    function _disableNextRoundButton() {
        playNextRoundButton.disabled = true;
    }

    function _updateScore(winner) {
        switch (winner) {
            case _players[0]:
                _players[0].score++;
                playerOneScoreDisplay.textContent = `${_playerScoreLabel} ${_players[0].score}`;
                break;
            case _players[1]:
                _players[1].score++;
                opponentScoreDisplay.textContent = `${_opponentScoreLabel} ${_players[1].score}`;
                break;
            default:
               break;
        }
    }

    function _resetGameBoard() {
        _gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
        
    function setGameMode(mode) {
        _gameMode = mode;
        _playerScoreLabel = mode === GameMode.PVP ? 'Player 1: ' : 'Player: ';
        _opponentScoreLabel = mode === GameMode.PVP ? 'Player 2: ' : 'Bot: ';
        opponentScoreDisplay.textContent = _opponentScoreLabel + '0';
    }
        
    function createPlayers(markup) {
        _players.push(PlayerFactory(markup));
        _players.push(PlayerFactory(markup === 'X' ? 'O' : 'X'));
    }

    function makeMove(tileNumber) {
        if (_gameEnded) return;

        if (!_isTileEmpty(tileNumber)) {
            console.log('tile is not empty')
            return;
        } 

        const currentPlayer = _players[_turn - 1];
        
        
        _gameBoard[tileNumber] = currentPlayer.markup;
        GameBoard.drawMarkup(tileNumber, currentPlayer.markup);    
        
        _checkGameResult();

        if (!_gameEnded) {
            if (_gameMode === GameMode.BOT) _makeBotMove();
            if (_gameMode === GameMode.PVP) _toggleTurn();
        }

        _checkGameResult();
    }

    function playNextRound() {
        GameBoard.clearBoard();
        _resetGameBoard();
        _disableNextRoundButton();
        _gameEnded = false;
        _toggleFirstPlayer();
        if (firstPlayer === 2) {
            if (_gameMode === GameMode.BOT) _makeBotMove();
            if (_gameMode === GameMode.PVP) _toggleTurn();
        }

    }

    function backToMenu() {
        GameBoard.clearBoard();
        _resetGameBoard();
        _gameEnded = false;
        _players.pop();
        _players.pop();
        switchToMainMenu();
        _turn = 1;
    }
    // function startGame() {
    //     _gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    // }

    function getGameBoard() {
        return _gameBoard;
    }

    return {
        GameMode,
        firstPlayer,
        setGameMode,
        createPlayers,
        makeMove,
        // startGame,
        getGameBoard,
        playNextRound,
        backToMenu,
    }
})();

const GameBoard = (() => {
    function drawMarkup(position, markup) {
        gameBoardTiles[position].textContent = markup;
    }    

    function animateWinner(tiles) {
        console.log(tiles);
        let timeDelay = 0;
        for (let tileNumber of tiles) {
            timeDelay += 200;
            setTimeout(() => {
                gameBoardTiles[tileNumber].style.backgroundColor = 'green';
                gameBoardTiles[tileNumber].style.scale = '1.1';
            }, timeDelay);
            setTimeout(() => {
                gameBoardTiles[tileNumber].style.scale = '1';
            }, timeDelay + 350);
        }
    }

    function clearBoard() {
        for (let tile of gameBoardTiles) {
            tile.textContent = '';
            tile.style.backgroundColor = '#ccc';
        }
    }

    return {
        drawMarkup,
        animateWinner,
        clearBoard,
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

const playerOneScoreDisplay = document.querySelector('div.player-score');
const opponentScoreDisplay = document.querySelector('div.opponent-score');

const backToMenuButton = document.querySelector('button.back-to-menu');
const playNextRoundButton = document.querySelector('button.next-round');

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

backToMenuButton.addEventListener('click', GameController.backToMenu.bind());

playNextRoundButton.addEventListener('click', GameController.playNextRound.bind());



// GameController.firstPlayer = 1;




const switchToMarkupSelectionMenu = () => {
    gameModeSelectionMenu.classList.add('hidden');
    markupSelectionMenu.classList.remove('hidden');
}

const switchToGameDisplay = () => {
    markupSelectionMenu.classList.add('hidden');
    gameDisplay.classList.remove('hidden');
}

const switchToMainMenu = () => {
    gameDisplay.classList.add('hidden');
    gameModeSelectionMenu.classList.remove('hidden');

}