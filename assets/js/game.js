let gameBoard = [];

const Player = (name, marker) => {
    let positions = [];
    const play = pos => {
        gameBoard[pos] = marker;
        positions.push(pos);
    };

    return { name, positions, play };
};

const Game = (p1, p2) => {
    const players = [Player(p1, "X"), Player(p2, "O")];
    let canPlay = false;

    const setup = () => {
        do {
            if (gameBoard.length < 9)
                gameBoard.push(" ");
            else
                break;
        } while (true);
        canPlay = true;
    }

    const display = () => {
        let k;
        let current = " ";
        for (var i = 0; i < 9; i++) {
            current += gameBoard[i];
            k = i + 1;
            if (k % 3 > 0) current += " | ";
            if (k % 3 == 0 && k < 9) current += "\n\n - * - * - \n\n ";
        }
        console.log(current);
    };

    const legalMove = pos => {return gameBoard[pos] === " "};
    const isPlayer = name => {return p1 === name || p2 === name};

    const hasWinningConfig = arr => {
        return (arr.includes(0) && arr.includes(1) && arr.includes(2)) || 
            (arr.includes(3) && arr.includes(4) && arr.includes(5)) ||
            (arr.includes(6) && arr.includes(7) && arr.includes(8)) || 
            (arr.includes(0) && arr.includes(3) && arr.includes(6)) || 
            (arr.includes(1) && arr.includes(4) && arr.includes(7)) || 
            (arr.includes(2) && arr.includes(5) && arr.includes(8)) || 
            (arr.includes(0) && arr.includes(4) && arr.includes(8)) || 
            (arr.includes(2) && arr.includes(4) && arr.includes(6));
    };

    const evaluate = () => {
        players.forEach(player => {
            if (hasWinningConfig(player.positions)) {
                canPlay = false;
                console.log(`* CONGRATULATIONS ${player.name} *`);
            }
        });
    };

    const play = (name, pos) => {
        if (canPlay) {
            if (legalMove(pos) && isPlayer(name)) {
                if (players[0].name === name) players[0].play(pos);
                else players[1].play(pos);
                evaluate();
                display();
            } else
                console.log(isPlayer(name) ? ` * ILLEGAL MOVE: POSITION OCCUPIED BY ${gameBoard[pos]} *` : ` * NO SUCH PLAYER AS ${name} *`);
        }
    };

    return { setup, play, display };
}

// const game = Game("kt", "me");
// game.setup();