var columns=3;
var rows=3;

var currTile;
var otherTile;
var selectedFolder;
var turns=0;

let folders = ["html", "css", "js", "python"];
let borderColors = {
    "html": "#e54c21",
    "css": "#264de4",
    "js": "#f0db4f",
    "python": "#ffd342"
};

window.addEventListener("keydown", function(event) {
    let blankTile = document.querySelector("img[src$='9.png']");
    let blankCoords = blankTile.id.split("-");
    let blankRow = parseInt(blankCoords[0]);
    let blankCol = parseInt(blankCoords[1]);
    let tileRow = blankRow;
    let tileCol = blankCol;
    if (event.key === "ArrowLeft") {
        tileCol = blankCol + 1;
    } else if (event.key === "ArrowRight") {
        tileCol = blankCol - 1;
    } else if (event.key === "ArrowUp") {
        tileRow = blankRow + 1;
    } else if (event.key === "ArrowDown") {
        tileRow = blankRow - 1;
    }
    if (tileRow >= 0 && tileRow < rows && tileCol >= 0 && tileCol < columns) {
        let tile = document.getElementById(tileRow.toString() + "-" + tileCol.toString());
        currTile = tile;
        otherTile = blankTile;
        dragEnd();
    }
});


window.onload = function() {
    setBoard();

    let resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", resetGame);
}

function setBoard(){
    selectedFolder = folders[Math.floor(Math.random() * folders.length)];
    let board = document.getElementById("board");
    board.style.borderColor = borderColors[selectedFolder];
    let imgOrder = shuffleTiles();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./Assets/" + selectedFolder + "/" + imgOrder.shift() + ".png";

            // if (tile.src.includes("9.png")) {
            //     tile.classList.add("blank");
            // }

            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
    }
}

function dragStart(){
    currTile=this;
}

function dragOver(e){
    e.preventDefault();
}

function dragEnter(e){
    e.preventDefault();
}

function dragLeave(e){
    e.preventDefault();
}

function dragDrop(){
    otherTile=this;
}

function dragEnd(){
    if(!otherTile.src.includes("9.png")){
        return;
    }

    let currCoords=currTile.id.split("-");
    let r=parseInt(currCoords[0]);
    let c=parseInt(currCoords[1]);

    let otherCoords=otherTile.id.split("-");
    let r2=parseInt(otherCoords[0]);
    let c2=parseInt(otherCoords[1]);

    let moveLeft= r==r2 && c2==c-1;
    let moveRight = r==r2 && c2==c+1;
    let moveUp = c==c2 && r2==r-1;
    let moveDown = c==c2 && r2==r+1;

    let isAdjacent = moveLeft || moveRight || moveDown || moveUp;

    if(isAdjacent){
        // otherTile.classList.remove("blank");
        // currTile.classList.add("blank");

        let currImg=currTile.src;
        let otherImg=otherTile.src;
        currTile.src=otherImg;
        otherTile.src=currImg;
        turns+=1;
        document.getElementById("turns").innerText="Turns: "+turns;
        
    }
    if (isSolved()) {
        let board = document.getElementById("board");
        board.innerHTML = "";
        board.style.backgroundImage = "url('./Assets/" + selectedFolder + "/puzzle_full.png')";
        document.getElementById("turns").innerText="Puzzle completed in: "+turns+" turns.";
    }    
}

function shuffleTiles() {
    let imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let blankIndex = 8;
    let blankRow = 2;
    let blankCol = 2;
    let moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let i = 0; i < 100; i++) {
        let move = moves[Math.floor(Math.random() * moves.length)];
        let newRow = blankRow + move[0];
        let newCol = blankCol + move[1];
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
            let newIndex = newRow * columns + newCol;
            [imgOrder[blankIndex], imgOrder[newIndex]] = [imgOrder[newIndex], imgOrder[blankIndex]];
            blankIndex = newIndex;
            blankRow = newRow;
            blankCol = newCol;
        }
    }
    return imgOrder;
}

function isSolved() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let expectedImgNumber = (r * columns + c + 1).toString();
            if (!tile.src.includes(expectedImgNumber)) {
                return false;
            }
        }
    }
    return true;
}

function resetGame() {
    board.style.backgroundImage = "";
    board.innerHTML="";
    setBoard();
    turns = 0;
    document.getElementById("turns").innerText = "Turns: "+turns;
}
