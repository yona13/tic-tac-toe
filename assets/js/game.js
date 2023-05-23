/**
 * Player Factory Function
 * 
 * Generates a Player Object
 * 
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
     * 
     *     x |   0   |   1   |   2  
     *   y   |       |       |    
     * - - - + - - - + - - - + - - -
     *   0   | (0, 0)| (1, 0)| (2, 0)
     * - - - + - - - + - - - + - - -
     *   1   | (0, 1)| (1, 1)| (2, 1)
     * - - - + - - - + - - - + - - -
     *   2   | (0, 2)| (1, 2)| (2, 2)
     * 
     * @param {int} x x-coordinate for move
     * @param {int} y y-coordinate for move
     */
    const play = (x, y) => {
        scores[x + 3] += 1;                 // rows
        scores[y] += 1;                     // columns
        scores[6] += (x === y ? 1 : 0);     // positive diagonal
        scores[7] += (x + y === 2 ? 1 : 0); // negative diagonal
    }

    /**
     * Get Name Function
     * 
     * Returns the name of the player
     * 
     * @returns players name
     */
    const getName = () => { return name; };

    /**
     * Get Marker Function
     * 
     * Returns the marker for the player
     * 
     * @returns players marker
     */
    const getMarker = () => { return marker; };

    /**
     * Get Scores Function
     * 
     * Returns the players current scores
     * 
     * @returns players scores array
     */
    const getScores = () => { return scores; };

    /**
     * Has Won Function 
     * 
     * Returns true if player has won
     * 
     * @returns true if player has won
     */
    const hasWon = () => { return win; };

    /**
     * Update Name Function
     * 
     * Updates player name to user desired name
     * 
     * @param {string} newname desired name
     */
    const updateName = newname => { name = newname; };

    /**
     * Update Marker Function
     * 
     * Updates player marker to user desired marker
     * 
     * @param {string} newmarker desired marker
     */
    const updateMarker = newmarker => { marker = newmarker; };
    
    /**
     * Set Win Function
     * 
     * Player has won the game
     */
    const setWin = () => { win = true; };

    /**
     * Reset Function
     * 
     * Resets scores to 0
     */
    const reset = () => {
        scores = [0, 0, 0, 0, 0, 0, 0, 0];
        win = false;
    };

    return { 
        play, 
        getName, 
        getMarker, 
        getScores, 
        hasWon, 
        updateName, 
        updateMarker, 
        setWin, 
        reset 
    };
};

/**
 * Game Factory Function
 * 
 * Generates a game object
 * 
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
     * 
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


        // Make it player 1's turn if no Xs
        if (m1 == "X" || m2 == "X")
            turn = m1 == "X" ? 0 : 1;

        // Reset gameboard and toggle canPlay
        gameboard = [[], [], []];
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++) {
                gameboard[i].push(" ");
            }
        
        canPlay = true;
    }

    /**
     * Legal Move Function
     * 
     * Returns true if gameboard cell is occupied
     * 
     *     x |   0   |   1   |   2  
     *   y   |       |       |    
     * - - - + - - - + - - - + - - -
     *   0   | (0, 0)| (1, 0)| (2, 0)
     * - - - + - - - + - - - + - - -
     *   1   | (0, 1)| (1, 1)| (2, 1)
     * - - - + - - - + - - - + - - -
     *   2   | (0, 2)| (1, 2)| (2, 2)
     * 
     * @param {int} x 
     * @param {int} y 
     * @returns true if cell is empty
     */
    const legalMove = (x, y) => { return gameboard[x][y] === " "; };

    /**
     * Has Winning Configuration Function
     * 
     * Checks if the player has won
     * 
     * @param {Array} scores players scores array
     * @returns true if scores contains a 3
     */
    const hasWinningConfig = scores => {return scores.includes(3);};

    /**
     * Evaluate Function
     * 
     * Checks if the game should continue
     * 
     * @param {int} i index of player
     * @returns true if player hasn't won
     */
    const evaluate = i => {
        canPlay = !hasWinningConfig(players[i].getScores());
        if (!canPlay) players[i].setWin();
    };

    /**
     * Cell-position to Cartesian-coordinates Function
     * 
     * For a given cell-position, function returns the 
     * corresponding cartesian-coordinate
     * 
     * @param {int} pos cell-position
     * @returns corresponding cartesian-coordinate
     */
    const cellToCartesian = pos => {
        const y = pos % 3;
        if (pos < 3)
            return [0, y];
        else if (pos < 6)
            return [1, y];
        
        return [2, y];
    };

    /**
     * Play Cartesian-coordinate Function
     * 
     * If given coordinate is legal, function returns current
     * marker; returns "ILLEGAL" if position occupied; Returns
     * "" while game isn't active
     * 
     *     x |   0   |   1   |   2  
     *   y   |       |       |    
     * - - - + - - - + - - - + - - -
     *   0   | (0, 0)| (1, 0)| (2, 0)
     * - - - + - - - + - - - + - - -
     *   1   | (0, 1)| (1, 1)| (2, 1)
     * - - - + - - - + - - - + - - -
     *   2   | (0, 2)| (1, 2)| (2, 2)
     * 
     * @param {int} x x-position for given move
     * @param {int} y y-position for given move
     * @returns string result corresponding to move
     */
    const playXY = (x, y) => {
        if (canPlay && x < 3 && y < 3) {
            if (legalMove(x, y)) {
                // Make move for the game
                const currentPlayer = players[turn];
                currentPlayer.play(x, y);
                gameboard[x][y] = currentPlayer.getMarker();

                // Check if game is over
                evaluate(turn);

                // Toggle turns
                turn = turn === 0 ? 1 : 0;

                return currentPlayer.getMarker();
            } else {
                console.log("* - ILLEGAL MOVE: POSITION OCCUPIED - *");
                return "ILLEGAL";
            }
        }

        return "";
    };

    /**
     * Update Scores Function
     * 
     * For a given move, updates the score array
     * 
     *     x |   0   |   1   |   2  
     *   y   |       |       |    
     * - - - + - - - + - - - + - - -
     *   0   | (0, 0)| (1, 0)| (2, 0)
     * - - - + - - - + - - - + - - -
     *   1   | (0, 1)| (1, 1)| (2, 1)
     * - - - + - - - + - - - + - - -
     *   2   | (0, 2)| (1, 2)| (2, 2)
     * 
     * @param {Array} scores array of scores to update
     * @param {int} x x-position for given move
     * @param {int} y y-position for given move
     * @returns updated scores array
     */
    const updateScores = (scores, x, y) => {
        scores[x + 3] += 1;                 // columns
        scores[y] += 1;                     // rows
        scores[6] += (x === y ? 1 : 0);     // negative diagonal
        scores[7] += (x + y === 2 ? 1 : 0); // positive diagonal

        return scores;
    };

    /**
     * Is Game Complete Function
     * 
     * For a given gameboard, check if game is complete &
     * returns the winner's marker, "DRAW" or "INCOMPLETE"
     * 
     * @param {Array} gameboard matrix of cells
     * @returns status of the gameboard
     */
    const isGameComplete = gameboard => {
        // Create score array for 2 players
        let scores = {
            a: {score: [0, 0, 0, 0, 0, 0, 0, 0], marker: ""},
            b: {score: [0, 0, 0, 0, 0, 0, 0, 0], marker: ""}
        };

        let filled = true; // if all cells have markers, this must be true

        // Iterate through matrix
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                // Check if given cell has a marker
                if (gameboard[i][j] !== " ") {
                    // Initialise player 1
                    if (scores.a.marker === "")
                        scores.a.marker = gameboard[i][j];

                    // Initialise player 2
                    else if (scores.b.marker === "" && gameboard[i][j] !== scores.a.marker)
                        scores.b.marker = gameboard[i][j];
                    
                    // Update player 1 score for given cells move
                    if (gameboard[i][j] === scores.a.marker)
                        scores.a.score = updateScores(scores.a.score, i, j);

                    // Update player 2 score for given cells move
                    else if (gameboard[i][j] === scores.b.marker)
                        scores.b.score = updateScores(scores.b.score, i, j);
                } else
                    filled = false; // toggle filled to false, blank detected
            }
        }

        // Find if a player has won
        let winningMarker = "";
        Object.keys(scores).forEach(k => {
            if (scores[k].score.includes(3))
                winningMarker = scores[k].marker; // winning marker
        });

        // Return relevant string
        if (winningMarker !== "")
            return winningMarker;
        if (!filled)
            return "INCOMPLETE";

        return "DRAW";
    };

    /**
     * Get Available Moves Function
     * 
     * For a given gameboard, function will return all
     * available moves
     * 
     * @param {Array} gameboard matrix of cells
     * @returns all moves available on matrix
     */
    const getAvailableMoves = gameboard => {
        // Initialise moves array
        const moves = [];

        // Iterate through matrix
        for (var i = 0; i < 3; i++)
            for (var j = 0; j < 3; j++)
                // Only push moves when cell is blank
                if (gameboard[i][j] === " ")
                    moves.push({x: j, y: i});
        
        return moves;
    };

    /**
     * Simulate Function
     * 
     * Return new state of the gameboard for a given move
     * 
     *     x |   0   |   1   |   2  
     *   y   |       |       |    
     * - - - + - - - + - - - + - - -
     *   0   | (0, 0)| (1, 0)| (2, 0)
     * - - - + - - - + - - - + - - -
     *   1   | (0, 1)| (1, 1)| (2, 1)
     * - - - + - - - + - - - + - - -
     *   2   | (0, 2)| (1, 2)| (2, 2)
     * 
     * @param {Array} gameboard matrix of cells
     * @param {int} x x-position for a given move
     * @param {int} y y-position for a given move
     * @param {string} marker marker for given move 
     * @returns 
     */
    const simulate = (gameboard, x, y, marker) => {
        // Initialise new game-state
        const newState = [[], [], []];

        // Iterate through matrix
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                // Add Marker to cell that matches move
                if (j === x && i === y)
                    newState[i].push(marker);

                // Add original game-cell string otherwise
                else
                    newState[i].push(gameboard[i][j]);
            }
        }

        return newState;
    };

    /**
     * Cartesian-coordinate to Game-position Function
     * 
     * For a given cartesian-coordinate, function returns
     * the corresponding game-position
     * 
     *     x |     0    |     1    |    2  
     *   y   |          |          |    
     * - - - +  - - - - +  - - - - + - - - - -
     *   0   | 0: (0, 0)| 1: (1, 0)| 2: (2, 0)
     * - - - +  - - - - +  - - - - + - - - - -
     *   1   | 3: (0, 1)| 4: (1, 1)| 5: (2, 1)
     * - - - +  - - - - +  - - - - + - - - - -
     *   2   | 6: (0, 2)| 7: (1, 2)| 8: (2, 2)
     * 
     * @param {int} x x-position for grid
     * @param {int} y y-position for grid
     * @returns corresponding game-position
     */
    const xyToPos = (x, y) => {
        return x + 3 * y;
    };

    /**
     * Play Function
     * 
     * Plays the players move if it is legal
     * 
     *     x |     0    |     1    |    2  
     *   y   |          |          |    
     * - - - +  - - - - +  - - - - + - - - - -
     *   0   | 0: (0, 0)| 1: (1, 0)| 2: (2, 0)
     * - - - +  - - - - +  - - - - + - - - - -
     *   1   | 3: (0, 1)| 4: (1, 1)| 5: (2, 1)
     * - - - +  - - - - +  - - - - + - - - - -
     *   2   | 6: (0, 2)| 7: (1, 2)| 8: (2, 2)
     * 
     * @param {int} pos position on gameboard
     * @returns marker if the game should continue (ILLEGAL if illegal move)
     */
    const play = pos => {
        const coords = cellToCartesian(pos);
        const x = coords[0];
        const y = coords[1];
        return playXY(x, y);
    };

    /**
     * Get Gameboard Function
     * 
     * Returns the current gameboard
     * 
     * @returns the current gameboard
     */
    const getGameboard = () => { return gameboard; };

    /**
     * Get Turn Function
     * 
     * Returns the player's index whose turn it is
     * 
     * @returns player's index
     */
    const getTurn = () => {return turn + 1};

    /**
     * Get Winner Function
     * 
     * Returns the winner of the game
     * 
     * @returns the name of the winner
     */
    const getWinner = () => {
        if (players.length > 0) {
            for (var i = 0; i < 2; i++)
                if (players[i].hasWon()) return players[i].getName();
        }
        if (canPlay) {
            let filled = true;
            for (var i = 0; i < 3; i++)
                if (gameboard[i].includes(" "))
                    filled = false;
            
            if (filled) {
                canPlay = false;
                return "DRAW";
            }
        }

        return "";
    }

    return { 
        setup, 
        canPlay, 
        play, 
        playXY, 
        getTurn, 
        getGameboard, 
        getWinner, 
        isGameComplete, 
        getAvailableMoves, 
        simulate, 
        xyToPos 
    };
}

/* Initialise game object */
const game = Game();