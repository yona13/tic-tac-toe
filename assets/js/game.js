/**
 * Player Factory Function
 * 
 * Generates a Player Object
 * @param {string} name player name
 * @param {string} marker player marker
 * @returns player object
 */
const Player = (name, marker) => {
    let scores = [
        0, // first column score
        0, // second column score
        0, // third column score
        0, // first row score
        0, // second row score
        0, // third row score
        0, // positive diagonal score
        0, // negative diagonal score
    ];
    let win = false;

    /**
     * Play Function
     * 
     * Updates the scores arrary
     * @param {int} pos position on the board
     */
    const play = pos => {
        // Handle columns
        scores[pos % 3] += 1;

        // Handle Rows
        if (pos < 3) 
            scores[3] += 1;
        else if 
            (pos < 6) scores[4] += 1;
        else 
            scores[5] += 1;
        
        // Handle Diagonals
        if (pos % 4 == 0) 
            scores[6] += 1;
        else if (pos == 2 || pos == 4 || pos == 6) 
            scores[7] += 1;
    };

    /**
     * Get Name Function
     * 
     * Returns the name of the player
     * @returns players name
     */
    const getName = () => {return name};

    /**
     * Get Marker Function
     * 
     * Returns the marker for the player
     * @returns players marker
     */
    const getMarker = () => {return marker;};

    /**
     * Get Scores Function
     * 
     * Returns the players current scores
     * @returns players scores array
     */
    const getScores = () => {return scores;};

    /**
     * Has Won Function 
     * 
     * Returns true if player has won
     * @returns true if player has won
     */
    const hasWon = () => {return win;};

    /**
     * Update Name Function
     * 
     * Updates player name to user desired name
     * @param {string} newname desired name
     */
    const updateName = newname => {name = newname};

    /**
     * Update Marker Function
     * 
     * Updates player marker to user desired marker
     * @param {string} newmarker desired marker
     */
    const updateMarker = newmarker => {marker = newmarker};
    
    /**
     * Set Win Function
     * 
     * Player has won the game
     */
    const setWin = () => {win = true};

    /**
     * Reset Function
     * 
     * Resets scores to 0
     */
    const reset = () => {
        scores = [0, 0, 0, 0, 0, 0, 0, 0];
        win = false;
        // console.log(`${name}'s Scores: ${scores}`);
    };

    return { play, getName, getMarker, getScores, hasWon, updateName, updateMarker, setWin, reset };
};

/**
 * Game Factory Function
 * 
 * Generates a game object
 * @returns game object
 */
const Game = () => {
    const players = [];
    let gameboard = [];
    let canPlay = false;
    let turn = 0;

    /**
     * Setup Function
     * 
     * Setups the player array & gameboard for a new game
     * @param {string} p1 player 1 name
     * @param {string} m1 player 1 marker
     * @param {string} p2 player 2 name
     * @param {string} m2 player 2 marker
     */
    const setup = (p1, m1, p2, m2) => {
        // If no players exist, fill player array
        if (players.length == 0) {
            players.push(Player(p1, m1));
            players.push(Player(p2, m2));
        } 
        // Otherwise update as required
        else {
            // Check if player 1 requires updates
            if (players[0].getName() != p1)
                players[0].updateName(p1);
            if (players[0].getMarker() != m1)
                players[0].updateMarker(m1);

            // Check if player 2 requires updates
            if (players[1].getName() != p2)
                players[1].updateName(p2);
            if (players[1].getMarker() != m2)
                players[1].updateMarker(m2);
            
            // Reset player scores
            players[0].reset();
            players[1].reset();
        }

        // console.log(`* - ${p1} vs ${p2} - *`);

        // Make it player 1's turn if no Xs
        if (m1 == "X" || m2 == "X")
            turn = m1 == "X" ? 0 : 1;

        // Reset gameboard and toggle canPlay
        gameboard = [];
        for (var i = 0; i < 9; i++) gameboard.push(" ");
        canPlay = true;
        // display();
    }

    /**
     * Display Function
     * 
     * Private function for displaying game on console
     */
    const display = () => {
        let k;
        let current = " ";
        for (var i = 0; i < 9; i++) {
            current += gameboard[i];
            k = i + 1;
            if (k % 3 > 0) current += " | ";
            if (k % 3 == 0 && k < 9) current += "\n\n - * - * - \n\n ";
        }
        console.log(current);
    };

    /**
     * Legal Move Function
     * 
     * Returns true if gameboard cell is occupied
     * @param {int} cell gameboard cell
     * @returns true if cell is empty
     */
    const legalMove = cell => {return gameboard[cell] === " ";};

    /**
     * Has Winning Configuration Function
     * 
     * Checks if the player has won
     * @param {Array} scores players scores array
     * @returns true if scores contains a 3
     */
    const hasWinningConfig = scores => {return scores.includes(3);};

    /**
     * Evaluate Function
     * 
     * Checks if the game should continue
     * @param {int} i index of player
     * @returns true if player hasn't won
     */
    const evaluate = i => {
        canPlay = !hasWinningConfig(players[i].getScores());
        if (!canPlay) players[i].setWin();
    };

    /**
     * Play Function
     * 
     * Plays the players move if it is legal
     * @param {int} pos position on gameboard
     * @returns marker if the game should continue (ILLEGAL if illegal move)
     */
    const play = pos => {
        if (canPlay) {
            // For legal moves, play move and evaluate game
            if (legalMove(pos)) {
                const currentPlayer = players[turn];
                currentPlayer.play(pos);
                gameboard[pos] = currentPlayer.getMarker();
                evaluate(turn);
                turn = turn === 0 ? 1 : 0;
                // display();

                return currentPlayer.getMarker();
            } else {
                console.log(`* - ILLEGAL MOVE: POSITION OCCUPIED - *`);
                return "ILLEGAL";    
            }
        }

        return "";
    }

    /**
     * Get Turn Function
     * 
     * Returns the player's index whose turn it is
     * @returns player's index
     */
    const getTurn = () => {return turn + 1};

    /**
     * Get Winner Function
     * 
     * Returns the winner of the game
     * @returns the name of the winner
     */
    const getWinner = () => {
        if (players.length > 0) {
            for (var i = 0; i < 2; i++)
                if (players[i].hasWon()) return players[i].getName();
        }
        if (!gameboard.includes(" ") && gameboard.length > 0) {
            canPlay = false;
            return "DRAW";
        };

        return "";
    }

    return { setup, canPlay, play, getTurn, getWinner };
}

/* Initialise game object */
const game = Game();