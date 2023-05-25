/**
 * Agent Factory Function
 * 
 * Generates an Agent to Play Tic-Tac-Toe
 * 
 * @returns agent object
 */
const Agent = () => {
    const virtualBoard = Game();
    let enabled = false;
    let marker = "X";
    let opponent = "O";
    let delay = 1500;
    let bestChoice = {x: 0, y: 0};

    /**
     * Get Enabled Function
     * 
     * Returns true if agent is enabled
     * 
     * @returns true if enabled
     */
    const getEnabled = () => { return enabled; };
    
    /**
     * Set Enabled Function
     * 
     * Enables/disables agent and sets markers for both players
     * when setting enabled
     * 
     * @param {Boolean} enable enable/disable = true/false
     * @param {String} newmarker agents marker
     * @param {String} opposing opponents marker
     */
    const setEnabled = (enable, newmarker="", opposing="") => {
        enabled = enable;
        if (enable) {
            marker = newmarker;
            opponent = opposing;
        }
    };

    /**
     * Get Delay Function
     * 
     * Function that will return the computer's 'condiseration' delay
     * 
     * @returns consideration delay
     */
    const getDelay = () => { return delay; };

    /**
     * Minimax Function
     * 
     * A decision making algorithm aiming to find the best move using
     * a recursive algorithm to work backwards finding the maximum/minimum 
     * possible score an agent can get for a given gameboard
     * 
     * @param {String[][]} gameboard matrix representing game
     * @param {Number} depth current level of the minimax tree
     * @returns maximum/minimum possible score for a given gameboard
     */
    const minimax = (gameboard, depth=0) => {
        // Check if game is complete
        const status = virtualBoard.isGameComplete(gameboard);

        if (status !== "INCOMPLETE") {
            // End of game, user has won
            // Return best score since starting
            if (status === marker)
                return 10 - depth;
            // End of game, opponent has won
            // Return worst score since starting
            else if (status === opponent)
                return depth - 10;
            // Draw. Return 0
            return 0;
        }

        // Game is incomplete, increment depth and prepare recursive step
        depth += 1;
        const scores = [];
        const moves = [];
        const compTurn = depth % 2 === 1;

        // Find all remaining moves at this depth (i.e. blank spaces)
        virtualBoard.getAvailableMoves(gameboard).forEach(move => {
            // For each remaining move, simulate new board after making move
            const gameState = virtualBoard.simulate(gameboard, move.x, move.y, compTurn ? marker : opponent);
            scores.push(minimax(gameState, depth));
            moves.push(move);
        });
        
        // After getting all scores and moves, find the best 
        // possible move, maximising/minimising the score
        if (compTurn) {
            let maxScore = -20;
            for (var i = 0; i < scores.length; i++)
                if (maxScore < scores[i])
                    maxScore = scores[i];
            // Set best move, maximising the score
            bestChoice = moves[scores.indexOf(maxScore)];
            return maxScore;
        } else {
            let minScore = 20;
            for (var i = 0; i < scores.length; i++)
                if (minScore > scores[i])
                    minScore = scores[i];
            // Set best move, minimising the score
            bestChoice = moves[scores.indexOf(minScore)];
            return minScore;
        }
    };

    /**
     * Play Function
     * 
     * For a given game, returns the 'best' move
     * 
     * @param {String[][]} current the current game
     * @param {Boolean} start game just started
     * @returns agents move
     */
    const play = (current, start=false) => {
        if (start)
            return 0;

        minimax(current);

        return virtualBoard.xyToPos(bestChoice.x, bestChoice.y);
    };

    return { getEnabled, setEnabled, getDelay, play };
}