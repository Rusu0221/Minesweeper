var table = []; //all element from table
var checkedCell  = []; // saves checked and unchecked cell
var numberLine = 9; //number of line in game
var numberColumn = 9; //number of column in game
var bombs = 10; //number of bombs in game
var numberFlag = 10 //number of flag in game
var indexClick = 0; //game timer after the first click
var seconds = 0; //seconds of timer

function timerGame() { //timer of the game
    let displaySeconds;
    if (seconds < 999) {
        ++seconds;
    } else {
        endGame();
        document.getElementById("mesage").innerHTML = "You're out of time, game over.";
    }
    if (seconds < 10) {
        displaySeconds = "00" + seconds;
    } else if (seconds <= 99) {
        displaySeconds = "0" + seconds;
    } else {
        displaySeconds = seconds;
    }
    document.getElementById("timer").innerHTML = displaySeconds;
}

function stopTimer() {
    if (indexClick > 0) {
        clearInterval(idInterval);
    }
}

function setDifficulty(line, column, bomb) { // set difficulty of tha game
    numberLine = line;
    numberColumn = column;
    bombs = bomb;
    createTable();
}

function createTable() { //create the table
    stopTimer()
    seconds = 0;
    indexClick = 0;
    numberFlag = bombs;
    document.getElementById("box").innerHTML = "";
    document.getElementById("mesage").innerHTML = "";
    document.getElementById("startButton").style.backgroundImage = "url('img/face-normal.png')";
    document.getElementById("startButton").style.width = "40px";
    document.getElementById("startButton").style.height = "40px";
    document.getElementById("startButton").innerHTML = "";
    document.getElementById("numberFlag").innerHTML =  "0" + numberFlag;
    document.getElementById("timer").innerHTML = "000";
    for (let row = 0; row <= numberLine + 1; ++row) {
        table[row] = [];
        checkedCell[row] = [];
        let elementRow = document.createElement("div");
        for (let column = 0; column <= numberColumn + 1; ++column) {
            table[row][column] = 0;
            checkedCell[row][column] = 1; // 1 -> the cell has not been checked 
            if (row > 0 && column > 0 && row <= numberLine && column <= numberColumn) {
                let cell = document.createElement("button");
                cell.style.width = "25px";
                cell.style.height = "25px";
                cell.style.backgroundImage = "url('img/cell.png')";
                let idCell = row.toString() + "." + column.toString();
                cell.id = idCell;
                elementRow.appendChild(cell);
                cell.onclick = function() {checkCell(row, column)};
                cell.oncontextmenu = function() {setFlag(row, column)};
            }
        }
        document.getElementById("box").appendChild(elementRow);        
    }
    setBombs(bombs);
    setNumber();
}

function setBombs(bomb) { //set bombs to table
    while (bomb > 0) {
        let row = Math.floor(Math.random() * numberLine) + 1;
        let column = Math.floor(Math.random() * numberColumn) + 1;
        while (table[row][column] == -1) {
            row = Math.floor(Math.random() * numberLine) + 1;
            column = Math.floor(Math.random() * numberColumn) + 1;
        }
        table[row][column] = -1;
        --bomb;
    }  
}

function setNumber() { //count the bombs around the cell
    for (let row = 1; row <= numberLine; ++row) { 
        for (let column = 1; column <= numberColumn; ++column) {
            if (table[row][column] == 0) {
                for (let indexRow = row - 1; indexRow <= row + 1; ++indexRow) {
                    for (let indexColumn = column - 1; indexColumn <= column + 1; ++indexColumn) {
                        if (table[indexRow][indexColumn] == -1) {
                            ++table[row][column];
                        }
                    }
                }
            }
        }
    }
}

function setFlag(row, column) { //set the flag on a cell
    let idButton = row.toString() + "." + column.toString();
    if (checkedCell[row][column] == 1 && numberFlag > 0) {
        --numberFlag;
        checkedCell[row][column] = 2; // 2 -> cell is with flag
        document.getElementById(idButton).style.backgroundImage = "url('img/flag.png')";
    } else if (checkedCell[row][column] == 2) {
        ++numberFlag;
        checkedCell[row][column] = 1;
        document.getElementById(idButton).style.backgroundImage = "url('img/cell.png')";
    }
    if (numberFlag > 9) {
        document.getElementById("numberFlag").innerHTML =  "0" + numberFlag;
    } else {
        document.getElementById("numberFlag").innerHTML =  "00" + numberFlag;
    }
}

function checkCell(row, column) { //check if the cell is empty, with a number or bomb
    if (indexClick == 0) {
        idInterval = setInterval(timerGame, 1000);
    }
    ++indexClick;
    if (table[row][column] == 0 && checkedCell[row][column] == 1) {
        moreCell(row, column);
    } if (table[row][column] > 0 && checkedCell[row][column] == 1) {
        showCell(row, column);
        checkedCell[row][column] = 0; // 0 -> cell is checked
    } else if (table[row][column] == -1 && checkedCell[row][column] == 1) {
        endGame(row, column);
    }
    checkWin();
}

function endGame(row, column) { //end the game and reveal the bombs
    document.getElementById("mesage").innerHTML = "Lose the game";
    document.getElementById("startButton").style.backgroundImage = "url('img/face-lose.png')";
    for (let indexRow = 1; indexRow <= numberLine; ++indexRow) {
        for (let indexColumn = 1; indexColumn <= numberColumn; ++indexColumn) {
            let idCell = indexRow.toString() + "." + indexColumn.toString();
            if (row == indexRow && column == indexColumn) {
                document.getElementById(idCell).style.backgroundImage = "url('img/bomb-end.png')";
            } else if (checkedCell[indexRow][indexColumn] == 2 && table[indexRow][indexColumn] == -1) {
                document.getElementById(idCell).style.backgroundImage = "url('img/bomb-guess.png')";
            } else if (table[indexRow][indexColumn] == -1) {
                document.getElementById(idCell).style.backgroundImage = "url('img/bomb.png')";
            } else {
                table[indexRow][indexColumn] = -2;
            }
            checkedCell[indexRow][indexColumn] = 0;
        }
    }
    clearInterval(idInterval);
}

function checkWin() { //verify if win the game is won
    let index = 0;
    for (let row = 1; row <= numberLine; ++row) {
        for (let column = 1; column <= numberColumn; ++column) {
            if (checkedCell[row][column] == 0) {
                ++index;
            }
        }
    }
    if (index == numberLine * numberColumn - bombs) {
        document.getElementById("mesage").innerHTML = "Win the game";
        document.getElementById("startButton").style.backgroundImage = "url('img/face-win.png')";
        clearInterval(idInterval);
    }
}

function moreCell(row, column) { //check if an empty cell is around
    for (let indexRow = row - 1; indexRow <= row + 1; ++indexRow) {
        for (let indexColumn = column - 1; indexColumn <= column + 1; ++indexColumn) {
            if (indexRow == 0) {
                ++indexRow;
            } else if (indexRow == numberLine + 1) {
                continue;
            }
            if (indexColumn == 0) {
                ++indexColumn;
            } else if (indexColumn == numberColumn + 1) {
                continue;
            }
            if (table[indexRow][indexColumn] >= 0) {
                if (checkedCell[indexRow][indexColumn] == 1) {
                    checkedCell[indexRow][indexColumn] = 0;
                    showCell(indexRow, indexColumn);
                    table[indexRow][indexColumn] == -2;
                    if (table[indexRow][indexColumn] == 0) {
                        moreCell(indexRow, indexColumn);
                    }
                }  
            }
        }
    }
}

function showCell(row, column) { //reveals the cells that are not checked
    let idCell = row.toString() + "." + column.toString();
    if (table[row][column] == 0) {
         document.getElementById(idCell).style.backgroundImage = "url('img/empty-cell.png')";
    } else if (table[row][column] == 1) {
        document.getElementById(idCell).style.backgroundImage = "url('img/1.png')";
    } else if (table[row][column] == 2) {
        document.getElementById(idCell).style.backgroundImage = "url('img/2.png')";
    } else if (table[row][column] == 3) {
        document.getElementById(idCell).style.backgroundImage = "url('img/3.png')";
    } else if (table[row][column] == 4) {
        document.getElementById(idCell).style.backgroundImage = "url('img/4.png')";
    } else if (table[row][column] == 5) {
        document.getElementById(idCell).style.backgroundImage = "url('img/5.png')";
    } else if (table[row][column] == 6) {
        document.getElementById(idCell).style.backgroundImage = "url('img/6.png')";
    } else if (table[row][column] == 7) {
        document.getElementById(idCell).style.backgroundImage = "url('img/7.png')";
    } else if (table[row][column] == 8) {
        document.getElementById(idCell).style.backgroundImage = "url('img/8.png')";
    }
}
