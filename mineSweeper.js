





var minefield={};
var rows;
var cols;
var mines;
/**************Creating the game*****************/
function createMinefield(rows,cols) {
    minefield.rows = [];
    for(var i = 0; i <rows; i++) {
        var row = {};
        row.spots = [];
        for(var j = 0; j < cols; j++) {
            var spot = {};
            spot.row=i;
            spot.col=j;
            spot.isCovered = true;
            spot.isFlaged=false;
            spot.content = "empty";
            row.spots.push(spot);
        }
        minefield.rows.push(row);
    }
    placeManyRandomMines();
    calculateAllNumbersInSpots();
    return minefield;
}
//gets a spot from the minefield according to the row and colum
function getSpot( row, column) {
    return minefield.rows[row].spots[column];
}


//places a mine in random position around the field
function placeRandomMine() {
    do{
        var row = Math.round(Math.random() * (rows-1));
        var column = Math.round(Math.random() * (cols-1));
        var spot = getSpot( row, column);
    }
while(spot.content=="mine")
        spot.content = "mine";
}
//places mines all around the minefield
function placeManyRandomMines() {
    for(var i = 0; i < mines; i++) {
        placeRandomMine();
    }
}
//calculate for all spots  in the minefield howm many mines are around it.
function calculateAllNumbersInSpots() {
    for(var y = 0; y < cols; y++) {
        for(var x = 0; x < rows; x++) {
            calculateNumber( x, y);
        }
    }
}
//calculate which number to set in the content of a spot=how many mines is surrounding it.
function calculateNumber( row, column) {
    var thisSpot = getSpot(row, column);

    // if this spot contains a mine then we can't place a number here
    if(thisSpot.content == "mine") {
        return;
    }
    var mineCount = 0;
    // check row above if this is not the first row
    if(row > 0) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot above and to the left
            var spot = getSpot( row - 1, column - 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }

        // get the spot right above
        var spot = getSpot( row - 1, column);
        if(spot.content == "mine") {
            mineCount++;
        }

        // check column to the right if this is not the last column
        if(column < cols-1) {
            // get the spot above and to the right
            var spot = getSpot( row - 1, column + 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }
    }

    // check column to the left if this is not the first column
    if(column > 0) {
        // get the spot to the left
        var spot = getSpot( row, column - 1);
        if(spot.content == "mine") {
            mineCount++;
        }
    }

    // check column to the right if this is not the last column
    if(column < cols-1) {
        // get the spot to the right
        var spot = getSpot( row, column + 1);
        if(spot.content == "mine") {
            mineCount++;
        }
    }

    // check row below if this is not the last row
    if(row < rows-1) {
        // check column to the left if this is not the first column
        if(column > 0) {
            // get the spot below and to the left
            var spot = getSpot( row + 1, column - 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }

        // get the spot right below
        var spot = getSpot( row + 1, column);
        if(spot.content == "mine") {
            mineCount++;
        }

        // check column to the right if this is not the last column
        if(column < cols-1) {
            // get the spot below and to the right
            var spot = getSpot( row + 1, column + 1);
            if(spot.content == "mine") {
                mineCount++;
            }
        }
    }
    if(mineCount > 0) {
        thisSpot.content = mineCount;
    }
}



/***************validation functions****************/

//return true if the point is a legal point in the minefield
function pointisValid(row,col) {
    if(col<0||col>=cols||row<0||row>=rows)
        return false;
    return true;

}
//check if spot can be exposed.
function canExpostSpot(row,col){

        var spot=getSpot(row,col);
    if(spot==undefined)
        var k=1;
        if(spot.isCovered&&!spot.isFlaged&&spot.content=="empty")
            return true;
        return false;

}
function canExpostSpotAndisNotAMine(row,col){

    var spot=getSpot(row,col);
    if(spot==undefined)
        var k=1;
    if(spot.isCovered&&!spot.isFlaged&&spot.content!="mine")
        return true;
    return false;

}
/*****************game function********************/
//exposes all none-mine spots after pressing an empty spot
function uncoverRemainingSpots(spot) {
    //using scanlinefill algorithem in an iterative function.
var stack=new Array();
var currentCol;
var spanAbove,spanBelow;
var discoveredOnRight=0;
stack.push(spot);
while(stack.length!=0){
    var currentSpot=stack.pop();
    var row=currentSpot.row;
    currentCol=currentSpot.col;
    while(currentCol>=0&&(canExpostSpot(row,currentCol)))currentCol--;
        if(currentCol>=0&&(canExpostSpotAndisNotAMine(row,currentCol)&&getSpot(row,currentCol)).content!="empty"){
            (getSpot(row,currentCol)).isCovered=false;
        }
        currentCol++;
        spanAbove=0;
        spanBelow=0;
        while(canExpostSpotAndisNotAMine(row,currentCol))
        {
             (getSpot(row,currentCol)).isCovered=false;
            if((getSpot(row,currentCol)).content!="empty")
             {
                currentCol++;
                break;
             }
        if(spanAbove==0&&currentSpot.row>0&&canExpostSpotAndisNotAMine(row-1,currentCol))
        {
            if((getSpot(row-1,currentCol)).content!="empty"){
                (getSpot(row-1,currentCol)).isCovered=false;
            }
            else{
                stack.push(getSpot(row-1,currentCol));
                spanAbove=1;
            }
        }
        else if(spanAbove==1&&currentSpot.row>0&&((!canExpostSpot(row-1,currentCol)))){
            spanAbove=0;
        }
        if(spanBelow==0&&currentSpot.row<rows-1&&(canExpostSpotAndisNotAMine(row+1,currentCol)))
        {
            if((getSpot(row+1,currentCol)).content!="empty"){
                (getSpot(row+1,currentCol)).isCovered=false;
            }
            else{
                stack.push(getSpot(row+1,currentCol));
                spanBelow=1;
            }

        }
        else if(spanBelow==1&&currentSpot.row<rows-1&&((!canExpostSpot(row+1,currentCol)))){
           spanBelow=0;
        }
        currentCol++;
        if(currentCol>=cols)
            break;
     }
    }
}
var app = angular.module('TryApp', [], function() {})
app.controller('MinesweeperController', function($scope) {
    $scope.data = {};
    var matchedMinesAndFlags;
    $scope.submit = function() {
        matchedMinesAndFlags=0 ;
        rows=$scope.data.numOfRows;
        cols=$scope.data.numOfCols;
        mines=$scope.data.numOfMines;
        $scope.data.numOfFlags=mines;
        minefield = createMinefield(rows,cols);
        $scope.minefield=minefield;
        $scope.uncoverSpot = function($event, spot) {
            //user wants to put flag on spot
                if($event.shiftKey == true ){
                    if(spot.isFlaged==false&&spot.isCovered){
                        if($scope.data.numOfFlags==0){
                            window.alert("You ran out of flags...");
                        }
                        else{
                            spot.isFlaged=true;
                            $scope.data.numOfFlags--;
                            if(spot.content=="mine")
                                matchedMinesAndFlags++;
                            if(matchedMinesAndFlags==mines){
                                exsposeAllSpots();
                                window.alert("You Won!!!");

                            }
                        }

                    }
                    else{
                        //user wants to remove flag from spot
                        if(spot.isFlaged){
                            spot.isFlaged=false;
                            $scope.data.numOfFlags++;
                            if(spot.content=="mine")
                                matchedMinesAndFlags--;
                        }
                    }
                }
                else{
                    if(spot.isFlaged==false&&spot.isCovered){

                        if(spot.content=="empty") {


                            //get all options
                            uncoverRemainingSpots(spot);
                        }
                        else
                            spot.isCovered = false;
                            if(spot.content=="mine"){
                                window.alert("You Lost!!!");
                                exsposeAllSpots();
                            }
                    }
                }
        };
    }
})

function exsposeAllSpots(){
    for(var y = 0; y < cols; y++) {
        for(var x = 0; x < rows; x++) {
            minefield.rows[y].spots[x].isCovered=false;
        }
    }


}
















