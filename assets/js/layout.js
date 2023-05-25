/* Variables */

// Elements from DOM
const navbar = document.querySelector(".nav");
const playButton = document.querySelector(".play");
const board = document.querySelector(".board");
const overlay = document.querySelector(".overlay");
const genericSelector = document.querySelector(".generic-selector");
const genericTitle = document.querySelector(".generic-title");
const currentObject = document.querySelector(".current-object");
const selectorOptions = document.querySelector(".selector-options");
const selectorConfirm = document.querySelector(".selector-confirm");
const alertElement = document.querySelector(".alert");
const alertMessage = document.querySelector(".alert-message");

// Aditional Variables
const agents = [Agent(), Agent()];
const defaultNames = ["Nadya", "DOM"];
const SELECT_TYPES = {
    ICON: 0,   // Icon Selection
    MARKER: 1  // Marker Selection
};
const ALERT_TYPES = {
    WIN: 0,
    DRAW: 1,
    MARKER_MATCH_ERROR: 2,
};
let currentTurn;
let winnerName;
let oneCompIndex = -1;
let twoCompToggle = false;
let markers = [
    "O", "X", "A", "B", "C", "D", "E", "F", "G", "H", 
    "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S", 
    "T", "U", "V", "W", "Y", "Z", "0", "1", "2", "3",
    "4", "5", "6", "7", "8", "9", "@", "#", "&"
];
let objectId = "";
let availableEmoji = ["&#129409;", "&#128187;"];  // Emoji List
for (var i = 0; i < 69; i++) availableEmoji.push(`&#${128512 + i};`);
for (var i = 0; i < 8; i++) availableEmoji.push(`&#${129296 + i};`);
for (var i = 0; i < 61; i++) availableEmoji.push(`&#${128000 + i};`);
for (var i = 0; i < 89; i++) availableEmoji.push(`&#${127789 + i};`);

/* Functions */

/**
 * Play Turn Function
 * 
 * For a given cell, play the desired move; If the move 
 * ends the game, return true; Otherwise return false
 * 
 * @param {int} cell cell number on gameboard
 * @returns true if move ends game
 */
function playTurn(cell) {
    // Play move and get result of move
    const gameResult = game.play(cell);

    // Update cell & icon if for a result that isn't illegal
    const cellElement = document.querySelector(`#cell-${cell}`);
    if (gameResult != "ILLEGAL" && gameResult != "") {
        cellElement.textContent = gameResult;
        const currentIcon = document.querySelector(`#${currentTurn}`);
        currentIcon.classList.remove("turn");
        currentTurn = `icon-${game.getTurn()}`;
        const nextIcon = document.querySelector(`#${currentTurn}`);
        nextIcon.classList.add("turn");
    }

    // Raise alert for game ending move
    winnerName = game.getWinner();
    if (winnerName !== "") {
        raiseAlert(winnerName === "DRAW" ? ALERT_TYPES.DRAW : ALERT_TYPES.WIN);
        return true;
    } else
        return false;
}

/**
 * Computer's Turn Function
 * 
 * For any computer agents enabled, this function will
 * find the correct computer to make its move
 * 
 * @param {boolean} start default is false
 */
function computersTurn(start=false) {
    // If no computers, oneCompIndex should be set to -1
    if (oneCompIndex > -1) {
        disableCells(true); // Prevent user from playing
        const delay = agents[oneCompIndex].getDelay(); // fake thinking time
        setTimeout(() => {
            const turnStatus = playTurn(agents[oneCompIndex].play(game.getGameboard(), start));
            // For 2 players, make computer play next turn if game is ongoing
            if (twoCompToggle) {
                oneCompIndex = i == 0 ? 1 : 0;
                if (!turnStatus) computersTurn();
            } 
            
            // Otherwise re-enable cells for user
            else 
                disableCells(false);
        }, delay);
    }
}

/**
 * Disable Cells Function
 * 
 * Disables or enables gameboard cells, preventing user from
 * playing while the computer is taking its turn
 * 
 * @param {boolean} disable default is true
 */
function disableCells(disable=true) {
    const cells = board.querySelectorAll(".cell");
    cells.forEach(c => {
        if (disable)
            c.removeEventListener("click", cellClick);
        else
            c.addEventListener("click", cellClick);
    });
}

/**
 * Reset Cells Function
 * 
 * Clears markers on gameboard, if present
 */
function resetCells() {
    for (var i = 0; i < 9; i++) {
        const cell = document.querySelector(`#cell-${i}`);
        cell.textContent = "";
    }
}

/**
 * Player Icon Click Event Listener
 * 
 * Activates the user selection window upon player icon click
 * 
 * @param {PointerEvent} event icon element clicked
 */
function playerIconClick(event) {
    activateWindow(event.target.innerHTML, event.target.id);
}

/**
 * Marker Click Event Listener
 * 
 * Activates the marker selection window upon player marker click
 * 
 * @param {PointerEvent} event marker element clicked
 */
function markerClick(event) {
    activateWindow(event.target.innerHTML, event.target.id, SELECT_TYPES.MARKER);
}

/**
 * Cell Click Event Listener
 * 
 * Plays a turn for a user
 * 
 * @param {PointerEvent} event cell clicked from gameboard element
 */
function cellClick(event) {
    if(!playTurn(event.target.value))
        computersTurn(); // Only play computer turn if there's an agent
}

/**
 * Fill Selector Function
 * 
 * Fills user selections either with icons or with markers
 * 
 * @param {int} selectType default is 0, i.e. select icons 
 */
function fillSelector(selectType=SELECT_TYPES.ICON) {
    let arr;
    if (selectType == SELECT_TYPES.ICON)
        arr = availableEmoji;
    else if (selectType == SELECT_TYPES.MARKER)
        arr = markers;
    
    selectorOptions.innerHTML = "";
    arr.forEach(e => {
        const element = document.createElement("div");
        element.innerHTML = e;
        selectorOptions.appendChild(element);
        element.addEventListener("click", (event) => {currentObject.innerHTML = element.innerHTML;});
    });
} 

/**
 * Activate Window Function
 * 
 * Creates window for user
 * 
 * @param {string} obj object inner HTML
 * @param {string} id element id
 * @param {int} selectType default is 0, i.e. select icons
 */
function activateWindow(obj, id, selectType=SELECT_TYPES.ICON) {
    overlay.classList.add("active");
    genericSelector.classList.add("active");
    genericTitle.innerHTML = selectType == selectType.ICON ? "Icon" : "Marker";
    fillSelector(selectType);
    currentObject.innerHTML = obj;
    objectId = id;
}

/**
 * Exit Window Function
 * 
 * Returns user to main page
 */
function exitWindow() {
    overlay.classList.remove("active");
    genericSelector.classList.remove("active");
    alertElement.classList.remove("active");
}

/**
 * Raise Alert Function
 * 
 * Raise the alert window for different types of alerts
 * 
 * @param {int} alertType default is 0, i.e. someone won
 */
function raiseAlert(alertType=ALERT_TYPES.WIN) {
    overlay.classList.add("active");
    alertElement.classList.add("active");
    
    // Raise Alert for the winner of the Game
    if (alertType == ALERT_TYPES.WIN) {
        alertMessage.textContent = `Congratulations ${winnerName}!`;
        alertElement.classList.remove("error");
        playButton.textContent = "Play";
        setPlayerEnabled();
        disableCells(false);
    }

    // Raise Alert for a draw in the Game
    if (alertType == ALERT_TYPES.DRAW) {
        alertMessage.textContent = "Draw!";
        alertElement.classList.remove("error");
        playButton.textContent = "Play";
        setPlayerEnabled();
        disableCells(false);
    }

    // Raise Error Alert for non-unique markers
    if (alertType == ALERT_TYPES.MARKER_MATCH_ERROR) {
        alertMessage.textContent = "Both markers are the same! Please change one of them."
        alertElement.classList.add("error");
    }
}

/**
 * Set Players Enabled Function
 * 
 * Function that will enabled or disable the user elements, such as:
 *      - the player icon button
 *      - the player name input
 *      - the marker button
 *      - the computer checkbox
 * 
 * @param {boolean} enabled default is true
 */
function setPlayerEnabled(enabled=true) {
    const icons = document.querySelectorAll(".icon");
    const inputs = document.querySelectorAll(".player-input");
    const markers = document.querySelectorAll(".marker");
    const checkboxes = document.querySelectorAll(".comp-check");

    for (var i = 0; i < 2; i++) {
        if (enabled)
            icons[i].addEventListener("click", playerIconClick);
        else
            icons[i].removeEventListener("click", playerIconClick);
        inputs[i].setAttribute("style", `pointer-events: ${enabled ? "auto" : "none"}`);
        markers[i].disabled = !enabled;
        checkboxes[i].disabled = !enabled;
    }
}

/**
 * Create Board Cell Element
 * 
 * Creates a cell for the game board
 * 
 * @param {int} i current index 
 * @returns div element
 */
function createBoardCellElement(i) {
    // Generate div
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = `cell-${i}`;
    cell.value = i;
    cell.addEventListener("click", cellClick);

    // Remove border around grid
    if (i != 4) {
        let update = ""
        if (i < 3)
            update += "border-top: none; "
        if (i % 3 == 0)
            update += "border-left: none; "
        if (i % 3 == 2)
            update += "border-right: none; "
        if (i > 5)
            update += "border-bottom: none; "
        cell.setAttribute("style", update);
    }
    
    return cell;
}

/**
 * Create Player Element Function
 * 
 * Creates a default player element for the DOM
 * 
 * @param {int} i current index 
 * @returns div element
 */
function createPlayerElement(i) {
    // Generate div container
    const player = document.createElement("div");
    player.className = "player";
    if(i == 2) player.className += " computer"
    player.id = `player-${i}`;

    // Generate icon part of element
    const playerIcon = document.createElement("button");
    playerIcon.className = "icon";
    playerIcon.id = `icon-${i}`;
    playerIcon.innerHTML = availableEmoji[i - 1];
    playerIcon.addEventListener("click", playerIconClick);

    // Generate input for player name
    const playerName = document.createElement("input");
    playerName.className = "player-input";
    playerName.type = "text";
    playerName.value = defaultNames[i - 1];

    // Generate marker element
    const marker = document.createElement("button");
    marker.className = "marker";
    marker.textContent = markers[i - 1];
    marker.id = `marker-${i}`;
    marker.addEventListener("click", markerClick);

    // Generate div to make player the computer
    const playerComputer = document.createElement("div");
    playerComputer.className = "is-computer";

    // Generate checkbox input for div
    const checkbox = document.createElement("input");
    checkbox.className = "comp-check"
    checkbox.type = "radio";
    checkbox.id = `comp-${i}`;
    if (i == 2) checkbox.classList.add("checked");

    // Create Event Listener to make player the computer
    checkbox.addEventListener("click", (e) => {
        const dict = {"computer": player, "checked": checkbox};
        ["computer", "checked"].forEach(k => {
            if (!dict[k].classList.contains(k))
                dict[k].classList.add(k);
            else
                dict[k].classList.remove(k);
        });
    });

    // Generate label for the checkbox
    const compLabel = document.createElement("label");
    compLabel.for = checkbox.id;
    compLabel.innerHTML = "Computer";

    // Add checkbox & label to div
    playerComputer.appendChild(checkbox);
    playerComputer.appendChild(compLabel);

    // Add all elements to main div
    player.appendChild(playerIcon);
    player.appendChild(playerName);
    player.appendChild(marker);
    player.appendChild(playerComputer);

    return player;
}

/**
 * Extract Player Information Function
 * 
 * Function that extracts user selection from DOM's 
 * player elements, including name, maker and is-computer
 * 
 * @returns player array of objects
 */
function extractPlayerInfo() {
    // Get Player Element information
    const gamers = document.querySelectorAll(".player");
    let objs = [];
    gamers.forEach(g => {
        // Extract name, marker and is-computer data
        const nameInput = g.querySelector("input");
        const markerButton = g.querySelector(".marker");
        const computerCheck = g.querySelector(".is-computer").querySelector("input");

        // Push data into array
        objs.push({
            name: nameInput.value,
            marker: markerButton.textContent,
            computer: computerCheck.classList.contains("checked")
        });
    });

    return objs;
}

/**
 * Handle Computer Players
 * 
 * If there is at least one computer player playing the game,
 * enable each agent and then start game if computer is opening
 * 
 * @param {Object[]} objs array of player objects
 */
function handleComputerPlayers(objs) {
    // Initialise Variables
    let compStart = false;
    let compCount = 0;

    // Iterate over 2 (maximum 2 players per game)
    for (var i = 0; i < 2; i++) {
        if (objs[i].computer) {
            compCount += 1;
            oneCompIndex = compCount < 2 ? i : -1;
            twoCompToggle = compCount == 2;

            // Enable computer if not enabled
            if (!agents[i].getEnabled())
                agents[i].setEnabled(true, objs[i].marker, objs[i === 0 ? 1 : 0].marker);
            if (objs[i].marker === "X" || i == 0) {
                compStart = true;
                oneCompIndex = i;
            }
        } else // Disable agents otherwise
            agents[i].setEnabled(false);
    }

    // Run Computer Turns, only
    if (compCount == 2) {
        oneCompIndex = oneCompIndex === -1 ? 0 : oneCompIndex;
        setPlayerEnabled(false);
        resetCells();
        computersTurn(true);
    }
    
    // Start Computer's Turn first
    else if (compStart) {
        setPlayerEnabled(false);
        resetCells();
        computersTurn(true);
    }
}

/**
 * Play Game Function
 * 
 * Starts/Restarts the Game 
 */
function playGame() {
    let objs = extractPlayerInfo();

    // Only start games with unique markers
    if (objs[0].marker != objs[1].marker) {
        game.setup(objs[0].name, objs[0].marker, objs[1].name, objs[1].marker);
        currentTurn = `icon-${game.getTurn()}`;
        const firstIcon = document.querySelector(`#${currentTurn}`);
        firstIcon.classList.add("turn");
        const otherIcon = document.querySelector(`#${currentTurn === "icon-1" ? "icon-2" : "icon-1"}`);
        otherIcon.classList.remove("turn");
        playButton.textContent = "Restart";

        handleComputerPlayers(objs);
    }
    
    // Prevent the same markers
    else
        raiseAlert(ALERT_TYPES.MARKER_MATCH_ERROR);
}

/* Initialise DOM & Setup Event Listeners */

// Build Game Board for DOM
for (var i = 0; i < 9; i++) {
    board.appendChild(createBoardCellElement(i));
}

// Create Event Listener for Play button
playButton.addEventListener("click", (e) => {playGame();});

// Create Player Elements for DOM
for (var i = 1; i <= 2; i++) {
    navbar.appendChild(createPlayerElement(i));
}

// Create Event Listener for Exiting Window
overlay.addEventListener("click", (e) => {
    exitWindow();
});

// Create Event Listener to Confirm Icon Selection
selectorConfirm.addEventListener("click", (e) => {
    const obj = document.querySelector(`#${objectId}`);
    obj.innerHTML = currentObject.innerHTML;
    objectId = "";
    exitWindow();
});

// Create Event Listener to Exit Alert
alertElement.addEventListener("click", (e) => {exitWindow();});