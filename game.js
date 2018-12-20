const Board = require('./board');

class Game {
  constructor(player1, player2){
    this.players = {
      x: player1,
      o: player2
    }
    this.board = new Board();
  }

  startGame(){
    let message = ["New Game! Let's get started!"]
    message.push(this.showBoard());
    message.push(this.promptMove());

    return message.join('\n');
  }

  promptMove(){
    return "Enter a coordinate with the move command! Ex: @slacktttbot move x y";
  }

  showBoard(){
    let rows = this.board.rows;

    let response = [];
    for(let i = 0; i < rows.length; i++){
      let line = '|';
      for(let j = 0; j < rows.length; j++){
        if(rows[i][j] !== ''){
          let mark = rows[i][j].toUpperCase();
          line += ` ${mark} |`
        } else {
          let mark = '-';
          line += `  ${mark}  |`
        }
      }
      response.push(line);
    }

    let player = `<@${this.players[this.board.nextMark()]}>`;

    return response.join('\n|---+---+---|\n')+`\n${player}, its your turn.`;
  }


  playTurn(user, move){
    let nextMark = this.board.nextMark();

    // Check if player who has inputted move is next player
    if(this.players[nextMark] !== user){
      return 'Careful, its not quite your turn yet!'
    }

    // Make a move, if that move is valid, otherwise, shortcircuit
    if(!(this.board.gameOver())){
      if (this.board.validMove(move)) {
        this.board.placeMark(move, nextMark);
      } else {
        return "Hmm, that's not a valid move. Try again!"
      }
    }

    //Show board and add message to message array
    let message = [this.showBoard()];
    // Determine if the game is over, otherwise, queue next prompt
    message.push(this.nextGameStep());

    return message.join('\n')
  }

  nextGameStep(){
    let gameOver = this.board.gameOver();

    if (gameOver){
      let player = this.players[gameOver];
      return `<@${player}>, you won! Congrats!!! Take a victory lap!` +
         ` When you're ready, use the restart command to play again.`
    } else {
      return this.promptMove();
    }
  }
}

module.exports = Game;
