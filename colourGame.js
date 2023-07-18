import Color from "https://colorjs.io/dist/color.js";

var grid;

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
    return colourItem;
}

function createMarkerItem(colour, parent) {
    let marker = document.createElement('div');
        marker.className = 'player-marker';
        marker.style.backgroundColor = colour.toString({ format: "rgb" });
        parent.appendChild(marker);
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

createColourGrid(30,16);
placeMarker(new Color("#FF0000"), 1, 1);
placeMarker(new Color("#FFFF00"), 5, 10);