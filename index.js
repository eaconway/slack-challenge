const SlackBot = require('slackbots');
const Game = require('./game');
const slackToken = require('./credentials');

const bot = new SlackBot({
  token: slackToken,
  name: 'slacktttbot'
});

const COMMANDS = {
  ttt: 'ttt',
  restart: 'restart',
  move: 'move',
  show: 'show',
  help: 'help'
}

let params = { icon_emoji: ':video_game:' };
let games = {};

// Starting up the bot
bot.on('start', () => {
  bot.postMessageToChannel(
    'general',
    'Slack TTT Bot is up and running! To get started, type ttt for a new game, or help for more information.',
    params
  );
});

//Errors
bot.on('error', (err) => console.log(err));

//Receive Messages
bot.on('message', (data) =>{
  //Don't act if we dont have a message or if message came from the slack Bot
  // where data.user is undefined
  if(data.type !== 'message' || data.user === undefined){ return; }

  const message = data.text.split(' ');
  const channel = data.channel;

  const command = parseMessage(message[1]);
  // Respond to game commands
  if (command === COMMANDS.ttt || command === COMMANDS.restart){
    let player1 = data.user;
    let player2 = message[2];

    if (player2 === undefined){
      return   messageChannel('Try that command again, but this time,' +
      " challenge who you'd like to play by @mentioning them!", channel);
    }

    player2 = player2.slice(2,-1);

    let game = setUpGame(player1, player2, channel);
    messageChannel(game.startGame(), channel);

  } else if (command === COMMANDS.move) {

    if(!games[channel]) {
      return messageChannel("A game hasn't been made at this channel yet! " +
      "To start one, use the ttt command!", channel);
    }

    let move = parseMove(message)
    let game = games[channel];

    messageChannel(game.playTurn(data.user, move), channel);

  } else if (command === COMMANDS.show){
    if(!games[channel]) {
      return messageChannel("A game hasn't been made at this channel yet! " +
      "To start one, use the ttt command!", channel);
    }

    let game = games[channel];
    messageChannel(game.showBoard(), channel);

  } else if (command === COMMANDS.help) {
    runHelp(channel);
  }
});

// function to message back to channel
const messageChannel = (message, channel) => {
  bot.postMessage(
    channel,
    message,
    params
  );
}

//How to play - help response
const runHelp = (channel) =>{
  messageChannel(' To play, type @slacktttbot ttt to get going!'+
  "To restart the game, use the restart command. \n To play, you'll need"+
  "two players, so invite another player by @mentioning them as you start a new game.",channel)
}

const setUpGame = (player1, player2, channel) => {
  let game = new Game(player1, player2);
  games[channel] = game;
  return game;
}

const parseMessage = (message) => {
  return COMMANDS[message];
}

const parseMove = (message) => {
  let x = parseInt(message[2]);
  let y = parseInt(message[3]);
  return [x,y];
}
