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
 * Play Game Function
 * 
 * Starts/Restarts the Game 
 */
function playGame() {
    // Get User defined Players with Markers
    const gamers = document.querySelectorAll(".player");
    let objs = [];
    gamers.forEach(g => {
        const nameInput = g.querySelector("input");
        const markerButton = g.querySelector(".marker");
        objs.push({
            name: nameInput.value,
            marker: markerButton.textContent
        });
    });

    // Only start games with unique markers
    if (objs[0].marker != objs[1].marker) {
        game.setup(objs[0].name, objs[0].marker, objs[1].name, objs[1].marker);
        currentTurn = `icon-${game.getTurn()}`;
        const firstIcon = document.querySelector(`#${currentTurn}`);
        firstIcon.classList.add("turn");
        const otherIcon = document.querySelector(`#${currentTurn === "icon-1" ? "icon-2" : "icon-1"}`);
        otherIcon.classList.remove("turn");
        playButton.textContent = "Restart";
        resetCells();
    }
    else
        raiseAlert(ALERT_TYPES.MARKER_MATCH_ERROR);
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
 * Fill Selector Function
 * 
 * Fills user selections either with icons or with markers
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
 * Raise Alert Function
 * 
 * Raise the alert window for different types of alerts
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
    }

    // Raise Alert for a draw in the Game
    if (alertType == ALERT_TYPES.DRAW) {
        alertMessage.textContent = "Draw!";
        alertElement.classList.remove("error");
        playButton.textContent = "Play";
    }

    // Raise Error Alert for non-unique markers
    if (alertType == ALERT_TYPES.MARKER_MATCH_ERROR) {
        alertMessage.textContent = "Both markers are the same! Please change one of them."
        alertElement.classList.add("error");
    }
}

/**
 * Create Board Cell Element
 * 
 * Creates a cell for the game board
 * @param {int} i current index 
 * @returns div element
 */
function createBoardCellElement(i) {
    // Generate div
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.id = `cell-${i}`;

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

    // Add Event Listener
    cell.addEventListener("click", (e) => {
        const gameResult = game.play(i);
        if (gameResult != "ILLEGAL" && gameResult != "") {
            cell.textContent = gameResult;
            const currentIcon = document.querySelector(`#${currentTurn}`);
            currentIcon.classList.remove("turn");
            currentTurn = `icon-${game.getTurn()}`;
            const nextIcon = document.querySelector(`#${currentTurn}`);
            nextIcon.classList.add("turn");
        }

        winnerName = game.getWinner();
        if (winnerName == "DRAW")
            raiseAlert(ALERT_TYPES.DRAW);
        else if (winnerName != "")
            raiseAlert();
    });

    return cell;
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
 * Create Player Element Function
 * 
 * Creates a default player element for the DOM
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
    const playerIcon = document.createElement("span");
    playerIcon.id = `icon-${i}`;
    playerIcon.innerHTML = availableEmoji[i - 1];

    // Create Event Listener to allow user to select an Icon
    playerIcon.addEventListener("click", (e) => { 
        activateWindow(playerIcon.innerHTML, playerIcon.id);
    });

    // Generate input for player name
    const playerName = document.createElement("input");
    playerName.type = "text";
    playerName.value = defaultNames[i - 1];

    // Generate marker element
    const marker = document.createElement("button");
    marker.className = "marker";
    marker.textContent = markers[i - 1];
    marker.id = `marker-${i}`;
    marker.addEventListener("click", (e)=> {
        activateWindow(marker.innerHTML, marker.id, SELECT_TYPES.MARKER);
    });

    // Generate div to make player the computer
    const playerComputer = document.createElement("div");
    playerComputer.className = "is-computer";

    // Generate checkbox input for div
    const checkbox = document.createElement("input");
    checkbox.type = "radio";
    checkbox.id = `comp-${i}`;
    if (i == 2) checkbox.className = "checked"

    // Create Event Listener to make player the computer
    checkbox.addEventListener("click", (e) => {
        player.className = player.className === "player" ? "player computer" : "player";
        checkbox.className = checkbox.className === "" ? "checked" : "";
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