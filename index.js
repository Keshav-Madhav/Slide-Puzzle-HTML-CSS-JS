var columns=3;
var rows=3;

var currTile;
var otherTile;

var turns=0;

window.onload=function(){
    let imgOrder=shuffleTiles();
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile=document.createElement("img");
            tile.id=r.toString()+"-"+c.toString();
            tile.src = "./Assets/"+imgOrder.shift() + ".png";

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
        board.style.backgroundImage = "url('./Assets/puzzle_full.png')";
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

