const MARKS = {
  o: 'o',
  x: 'x',
  empty: ''
}

const SIZE = 3;

class Board {
  constructor(rows = this.createRows()){
    this.rows = rows;
    this.countMarks = { x:0, o:0}
  }

  createRows(){
    let board = [];
    for (let i = 0; i < SIZE; i++){
      let row = [];
      for (let j = 0; j < SIZE; j++){
        row.push(MARKS.empty);
      }
      board.push(row)
    }
    return board
  }

  getMark(pos){
    let row = pos[0];
    let col = pos[1];
    return this.rows[row][col];
  }

  placeMark(pos, mark){
    let row = pos[0];
    let col = pos[1];
    this.countMarks[mark] += 1;
    return this.rows[row][col] = mark;
  }

  validMove(pos){
    if (!(0 <= pos[0] &&
          pos[0] <= 2 &&
          0 <= pos[1] &&
          pos[1] <= 2)){
      return null;
    }

    let mark = this.getMark(pos);
    return mark === MARKS.empty;
  }

  nextMark(){
    return this.countMarks.x > this.countMarks.o ? MARKS.o : MARKS.x;
  }

  checkPosEmpty(pos){
    let mark = this.getMark(pos);
    return this.getMark(pos) !== undefined;
  }

  checkTied(){
    for(let i = 0; i < this.rows.length; i++){
      for(let j = 0; j < this.rows.length; j++){
        if (this.rows[i][j] === MARKS.empty){
          return false;
        }
      }
    }
    //no empty spaces
    return true;
  }

  gameOver(){
    return this.checkTied() || this.checkWinner();
  }

  checkWinner(){
    // Check rows
    let rowsWin = this.checkSet(this.rows);
    if (rowsWin) {return rowsWin};

    //Check Cols
    let cols = this.createCols();
    let colsWin = this.checkSet(cols);
    if (colsWin) {return colsWin};

    //Check Diags
    let diags = this.createDiags()
    let diagsWin = this.checkSet(diags);
    if (diagsWin) {return diagsWin};

    return null
  }

  checkSet(rows){
    for(let i = 0; i < rows.length; i ++){
      let countMarks = {x: 0, o: 0}
      //Note* For diags, rows may be 2, not 3. So, iteration should be specific number
      for(let j = 0; j < 3; j++){
        if(rows[i][j] === MARKS.x){ countMarks.x += 1 }
        if(rows[i][j] === MARKS.o){ countMarks.o += 1 }
      }

      if (countMarks.x === 3){
        return MARKS.x
      } else if (countMarks.o === 3){
        return MARKS.o
      }
    }
    return null
  }

  createCols(){
    let cols = [[],[],[]];
    for(let i = 0; i < this.rows.length; i++){
      for(let j = 0; j < this.rows.length; j++){
        cols[j].push(this.rows[i][j]);
      }
    }
    return cols
  }

  createDiags(){
    let diagPositions = {
      left: [[0,0], [1,1], [2,2]],
      right: [[0,2], [1,1], [2,0]]
    };
    let diags = [[],[]];

    diagPositions.left.forEach(pos => {
      diags[0].push(this.getMark(pos));
    })

    diagPositions.right.forEach(pos => {
      diags[1].push(this.getMark(pos));
    })

    return diags;
  }

}

module.exports = Board;
