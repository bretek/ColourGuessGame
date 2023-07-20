import Color from "https://colorjs.io/dist/color.js";

var grid;
var turnNum = 0;
var firstRound = true;
var numPlayers = 0;

var width = 30;
var height = 16;

var playerColours = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#000000",
    "#FFFFFF",
    "#AAAAAA"
];

var playerScores = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];

var MAX_PLAYERS = playerColours.length;

function dragMarker(ev) {
    ev.dataTransfer.setData("marker", ev.target.id);
    ev.dataTransfer.setDragImage(ev.target, ev.target.clientWidth/2, ev.target.clientHeight/2);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dropMarker(ev) {
    ev.preventDefault();
    var marker = document.getElementById(ev.dataTransfer.getData("marker"));
    var targetY = ev.target.style["grid-row"] - 1;
    var targetX = ev.target.style["grid-column"] - 1;
    if (!isSpaceOccupied(targetX, targetY) && targetX > 0 && targetY > 0) {
        ev.target.appendChild(marker);
        marker.draggable = false;
    }
    if (document.getElementById("markersSpace").childNodes.length == 0) {
        if (firstRound) {
            playSecondRound();
        }
        else {
            calculateScore(5, 5);
            console.log(playerScores);
            nextTurn();
        }
    }
}

function createTextItem(text, x, y) {
    var textItem = document.createElement('div');
    textItem.className = 'grid-text-item';
    textItem.style["grid-row"] = Number(y);
    textItem.style["grid-column"] = Number(x);
    var textItemText = document.createElement('p');
    textItemText.innerText = text;
    textItem.appendChild(textItemText);

    return textItem;
}

function createColourItem(colour, x, y) {
    var colourItem = document.createElement('div');
    colourItem.className = 'grid-colour-item';

    colourItem.style.backgroundColor = colour.toString({ format: "rgb" });
    colourItem.style["grid-row"] = Number(y);
    colourItem.style["grid-column"] = Number(x);

    colourItem.ondragover = function(){allowDrop(event)};
    colourItem.ondrop = function(){dropMarker(event)};

    return colourItem;
}

function createMarkerItem(id, colour, parent) {
    let marker = document.createElement('div');
    marker.className = 'player-marker';
    marker.style.backgroundColor = colour.toString({ format: "rgb" });

    marker.id = id;
    marker.draggable = true;
    marker.ondragstart = function(){dragMarker(event)};

    parent.appendChild(marker);
}

function isSpaceOccupied(x, y) {
    var colourItems = document.getElementsByClassName("grid-colour-item");
    for (let i = 0; i < colourItems.length; ++i) {
        let item = colourItems[i];
        if (item.style["grid-row"] == y+1 && item.style["grid-column"] == x+1 && item.childNodes.length != 0) {
            return true;
        }
    }

    return false;
}

function placeMarker(colour, x, y) {
    var colourItems = document.getElementsByClassName("grid-colour-item");
    for (let i = 0; i < colourItems.length; ++i) {
        let item = colourItems[i];
        if (item.style["grid-row"] == y+1 && item.style["grid-column"] == x+1) {
            createMarkerItem(colour, item);
        }
    }
}

function createColourGrid(width, height) {
    // create grid
    grid = document.createElement('div');
    grid.className = 'grid';
    grid.style.gridTemplateColumns = "repeat(" + (width + 1) + ", 1fr)";
    let container = document.getElementById('gridSpace');
    container.appendChild(grid);

    // create empty corner
    grid.appendChild(createTextItem('', 1, 1));

    // create top coord row
    for (var i = 0; i < width; ++i) {
        // create letter
        grid.appendChild(createTextItem(i+1, i+2, 1));
    }

    let topLeftColour = new Color("#884B1F");
    let bottomLeftColour = new Color("#7CA441");
    let topRightColour = new Color("#74429B");
    let bottomRightColour = new Color("#0FB1E2");

    let verticalGradient1 = topLeftColour.range(bottomLeftColour, {
        space: "srgb-linear",
        outputSpace: "srgb"
    });
    let verticalGradient2 = topRightColour.range(bottomRightColour, {
        space: "srgb-linear",
        outputSpace: "srgb"
    });

    // create rows
    for (var i = 0; i < height; ++i) {
        // create coord
        grid.appendChild(createTextItem(String.fromCharCode(i+65), 1, i+2));
        for (var j = 0; j < width; ++j) {
            // create colour square
            let verticalGradientIndex = i * (1/height) * 0.8;
            let horizontalGradientIndex = j * (1/width) * 0.7;
            
            let horizontalGradient = verticalGradient1(verticalGradientIndex).range(verticalGradient2(verticalGradientIndex), {
                space: "srgb-linear",
                outputSpace: "srgb"
            });

            let colour = horizontalGradient(horizontalGradientIndex);
            colour.hsl.s = 100;
            grid.appendChild(createColourItem(colour, j+2, i+2));
        }
    }
}

function startGame(players) {
    turnNum = 0;
    firstRound = true;
    numPlayers = players;
    for (var i = 0; i < MAX_PLAYERS; ++i) {
        if (i < playerScores.length) {
            playerScores[i] = 0;
        }
    }
    playFirstRound();
}

function playFirstRound() {
    var grid = document.getElementsByClassName("grid");
    if (grid.length != 0) {
        grid[0].remove();
    }

    createColourGrid(30,16);

    alert("Player " + (turnNum + 1) + ", give your first clue"); // show info

    for (var i = 0; i < numPlayers; ++i) {
        if (i != turnNum) {
            createMarkerItem(i*2, new Color(playerColours[i]), document.getElementById("markersSpace"));
        }
    }
}

function playSecondRound() {
    alert("Player " + (turnNum + 1) + ", give your second clue"); // show info

    firstRound = false;
    for (var i = 0; i < numPlayers; ++i) {
        if (i != turnNum) {
            createMarkerItem(i*2 + 1, new Color(playerColours[i]), document.getElementById("markersSpace"));
        }
    }

    // show scores
}

function addPoints(colourSpace, points) {
    let piece = colourSpace.childNodes;
    if (piece.length != 0) {
        let playerIndex = Math.floor(piece[0].id / 2);
        playerScores[playerIndex] += points;
    }
}

function getSquare(x, y) {
    var squares = document.getElementsByClassName("grid-colour-item");
    for (var i = 0; i < squares.length; ++i) {
        if (squares[i].style["grid-row"] == y && squares[i].style["grid-column"] == x) {
            return squares[i];
        }
    }

    return null;
}

function calculateScore(correctSquareX, correctSquareY) {
    for (let x = -2; x <= 2; ++x) { // for point scoring coords
        for (let y = -2; y <=2; ++y) {
            if (correctSquareX+x > 0 && correctSquareY+y > 0 && correctSquareX+x <= width && correctSquareY+y <= height) {
                var square = getSquare(correctSquareX+x, correctSquareY+y);
                if (square != null && square.childNodes.length != 0) {
                    var points = 3 - (x > y ? Math.abs(x) : Math.abs(y));
                    addPoints(square, points);
                }
            }
        }
    }
}

function showFinalScores() {
    // show final scores
}

function nextTurn() {
    turnNum++;
    if (turnNum < numPlayers)
    {
        firstRound = true;
        playFirstRound();
    }
    else {
        showFinalScores();
    }
}

startGame(4);