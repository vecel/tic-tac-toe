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
        
    function _makeBotMove() {
        let tileNumber;
        do {
            tileNumber = Math.floor(Math.random() * 9);
        } while (_gameBoard[tileNumber] !== 0)
        _gameBoard[tileNumber] = _players[1].markup;
        GameBoard.drawMarkup(tileNumber, _players[1].markup);        
    }

    function _updateScore(winner) {
        switch (winner) {
            case _players[0]:
                _players[0].score++;
                playerOneScoreDisplay.textContent = `Player 1: ${_players[0].score}`;
                break;
            case _players[1]:
                _players[1].score++;
                playerOneScoreDisplay.textContent = `Player 2: ${_players[1].score}`;
                break;
            default:
               break;
        }
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
        if (!_isTileEmpty(tileNumber)) {
            console.log('tile is not empty')
            return;
        } 

        const currentPlayer = _players[_turn - 1];
        
        if (_gameIsOver() === _GameResult.CONTINUE) {
            _gameBoard[tileNumber] = currentPlayer.markup;
            GameBoard.drawMarkup(tileNumber, currentPlayer.markup);    
        }

        if (_gameIsOver() === _GameResult.WIN) {
            // disable tile events
            console.log(`game is over, winner ${currentPlayer.markup}`);
            if (!gameEdnded) {
                _updateScore(currentPlayer);
                _gameEnded = true;
            }
            return;
        }

        if (_gameIsOver() === _GameResult.DRAW) {
            console.log(`draw`);
            return;
        }

        if (_gameMode === GameMode.BOT) _makeBotMove();
        if (_gameMode === GameMode.PVP) _toggleTurn();
    }

    
    // function startGame() {
    //     _gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    // }

    function getGameBoard() {
        return _gameBoard;
    }

    return {
        GameMode,
        setGameMode,
        createPlayers,
        makeMove,
        // startGame,
        getGameBoard,
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
const opponentOneScoreDisplay = document.querySelector('div.opponent-score');

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
