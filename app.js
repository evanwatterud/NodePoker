var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Game = require('./public/model/game');

var game = new Game();
var connections = 0;

// Server listening on port 8080
server.listen(8080);

// Log incoming requests
app.use(function(req, res, next) {
	console.log(req.method + " request for " + req.url);
	next();
});

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function(req, res,next) {
  if (!game.started) {
    res.sendFile(__dirname + '/public/views/menu.html');
    game.started = true;
  } else {
    res.sendFile(__dirname + '/public/views/index.html');
  }
});

// Global logs. Logged on server and on the client
var broadcast = function(msg) {
  console.log(msg);
  io.sockets.emit('broadcast', { message: msg });
};

// Handle connections to the server
io.on('connection', function (socket) {
  connections += 1;

  if (connections != 1) {
    broadcast("A new player has entered the room.");

    game.addPlayer({
      name: 'Player ' + game.players.length,
      sid: socket.id,
      isAI: false,
      playing: false
    });
  }
  // Start the game when the correct number of players are in the room
  if (game.players.length == game.maxPlayers) {
    game.start();
    deal();
    broadcast("Game started.");
    nextTurn();
  }

  socket.on('disconnect', function() {
    game.removePlayer(socket.id);
  });

  socket.on('exchange', function(data) {
    var visible = game.exchangeCards(socket.id, data.cards);
    exchangedCards = game.players[game.getPlayer(socket.id)].cards;

    if (data.cards.length > 0) {
      io.sockets.emit('visible cards', { visibleCards: visible });
    }

    io.to(socket.id).emit('exchanged cards', { cards: exchangedCards });
    nextTurn();
  });

  // Start the game once the host picks the number of AI players
  socket.on('ai players', function(data) {
    for (var i = 0; i < data.aiPlayers; i++) {
      game.addPlayer({
        name: 'AI Player ' + game.players.length,
        sid: i,
        isAI: true,
        playing: false
      });

      game.players[game.getPlayer(i)].strategy = data[i];
    }

    if (game.players.length == game.maxPlayers) {
      game.start();
      deal();
      broadcast("Game started.");
      nextTurn();
    }
  });
});

function nextTurn() {
  if (game.checkRoundEnd()) {
    determineWinner();
  } else if (!game.aiPlayed()) {
    var visibleCardsSet = game.playAI();
    for (var i = 0; i < visibleCardsSet.length; i++) {
      io.sockets.emit('visible cards', { visibleCards: visibleCardsSet[i] });
    }
    nextTurn();
  } else if (game.players[game.currentPlayer].playing && !game.players[game.currentPlayer].played) {
    io.to(game.getCurrentPlayer()).emit('yourTurn', { data: '' });
    game.currentPlayer -= 1;
  } else {
    game.currentPlayer -= 1;
    nextTurn();
  }
}

function deal() {
  for (var i = 0; i < game.players.length; i++) {
    if (!game.players[i].isAI) {
      io.to(game.players[i].sid).emit('deal', { cards: game.players[i].cards });
    }
  }
}

function determineWinner() {
  var rankings = game.determineWinner()
  var winnerName = rankings[0].name;
  io.sockets.emit('winner', { gameWinner: winnerName, ranks: rankings });
  broadcast("Starting next round in 5 seconds.");

  setTimeout(function () {
    game.start();
    deal();
    nextTurn();
  }, 5000);
}


// Handle requests for static files
app.use(express.static(path.join(__dirname, 'public')));

// Send 404 for everything else
app.get("*", function(req, res) {
	res.sendStatus(404);
});

module.exports = server;
