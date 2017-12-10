module.exports = Game;
"use strict";

var Player = require('./player.js');
var Deck = require('./deck.js');
var PokerEvaluator = require("poker-evaluator");

function Game() {
  this.players = [];
  this.visibleCards = [];
  this.maxPlayers = 4
  this.deck = new Deck();
  this.started = false;
  this.currentPlayer = 3;
}

class Strategy {
  constructor(hand) {
    this.cards = hand.slice();
    this.cardObjects = hand.slice();
    this.ranks = [];
    for (var k = 0; k < this.cards.length; k++) {
      this.ranks.push(this.cards[k].rank);
      this.cards[k] = this.cards[k].rank + this.cards[k].suit;
    }
  }

  play() { throw Error("Can't call abstract class method"); }
}

class Strategy1 extends Strategy {
  constructor(hand) {
    super(hand);
  }

  play() {
    var cardsToExchange = [];
    if (PokerEvaluator.evalHand(this.cards).value >= 20480) {
      return [];
    } else {
      var dupes = [];
      for (var i = 0; i < this.ranks.length; i++) {
        if (!this.ranks.includes(this.ranks[i], i + 1) && !dupes.includes(this.ranks[i])) {
          cardsToExchange.push(i);
        } else {
          dupes.push(this.ranks[i]);
        }
      }
    }
    return cardsToExchange;
  }
}

class Strategy2 extends Strategy {
  constructor(hand, isFirst, visibleCards) {
    super(hand);
    this.first = isFirst;
    this.visible = visibleCards.slice();
  }

  play() {
    var cardsToExchange = [];
    var strat1 = new Strategy1(this.cardObjects);

    // Check for a visible 3 of a kind
    var check3OfAKind = 0;
    var keepPairs = false;
    var ranks = this.cardObjects.map(x => x.rank);
    var visibleRanks = this.visible.map(x => x.rank);
    for (var i = 0; i < visibleRanks.length; i++) {
      if (visibleRanks[i] == visibleRanks[i+1]) {
        check3OfAKind += 1;
        if (check3OfAKind == 2) {
          keepPairs = true;
          break;
        }
      } else {
        check3OfAKind = 0;
      }
    }

    if (this.first) {
      return strat1.play();
    } else if (keepPairs) {
      var sortedRanks = this.ranks.slice().sort();
      var dupes = [];
      var ranksToExclude = [];
      for (var i = 0; i < sortedRanks.length; i++) {
        if (sortedRanks[i] != sortedRanks[i+1] && !dupes.includes(sortedRanks[i])) {
          ranksToExclude.push(sortedRanks[i]);
        } else {
          dupes.push(sortedRanks[i]);
        }
      }

      var checkPair = false;
      for (var i = 0; i < this.cardObjects.length; i++) {
        checkPair = false;
        for (var j = 0; j < ranksToExclude.length; j++) {
          if (this.cardObjects[i].rank == ranksToExclude[j]) {
            checkPair = true;
          }
        }
        if (checkPair) {
          cardsToExchange.push(i);
        }
      }
    } else {
      return strat1.play();
    }
    return cardsToExchange;
  }
}

Game.prototype.exchangeCards = function(sid, cardsToExchange) {
  var playerIndex = this.getPlayer(sid);
  var visibleCards = [];
  for (var i = 0; i < cardsToExchange.length; i++) {
    var card = this.deck.draw();
    this.players[playerIndex].cards[cardsToExchange[i]] = card;
    visibleCards.push(this.players[playerIndex].cards[cardsToExchange[i]]);
    this.visibleCards.push(this.players[playerIndex].cards[cardsToExchange[i]]);
  }
  this.players[playerIndex].played = true;
  return visibleCards;
};

Game.prototype.start = function() {
  this.resetPlayers();
  this.visibleCards = [];
  this.currentPlayer = 3;
  this.currentRound = 'deal';
  this.deck = new Deck();
  this.started = true;
  this.deal();
};

// Check if everyone has played this round
Game.prototype.checkRoundEnd = function() {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].playing && !this.players[i].played) {
      return false;
    }
  }
  return true;
};

Game.prototype.aiPlayed = function() {
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].isAI && !this.players[i].played) {
      return false;
    }
  }
  return true;
};

Game.prototype.playAI = function() {
  var first = 0;
  var visibleCardsSet = [];
  var visible = [];
  for (var i = 0; i < this.players.length; i++) {
    if (this.players[i].isAI && !this.players[i].played) {
      if (this.players[i].strategy == 1) { // Strategy 1
        var strat1 = new Strategy1(this.players[i].cards);
        visible = this.exchangeCards(this.players[i].sid, strat1.play());
        visibleCardsSet.push(visible);
      } else { // Strategy 2
        if (first == 0) { // Not first player, play Strategy 2
          var strat2 = new Strategy2(this.players[i].cards, true, this.visibleCards);
          visible = this.exchangeCards(this.players[i].sid, strat2.play());
          visibleCardsSet.push(visible);
        } else { // Tell Strategy 2 to play Strategy 1 when first player
          var strat2 = new Strategy2(this.players[i].cards, false, this.visibleCards);
          visible = this.exchangeCards(this.players[i].sid, strat2.play());
          visibleCardsSet.push(visible);
        }
      }
      this.players[i].played = true;
    }
    first += 1;
  }
  return visibleCardsSet;
};

Game.prototype.getPlayer = function(sid) {
  return this.players.findIndex(function(player) { return player.sid === sid; });
};

Game.prototype.addPlayer = function(args) {
  var newPlayer = new Player(args);
  if (this.players.length < this.maxPlayers) {
    this.players.push(new Player(args));
  }
};

Game.prototype.removePlayer = function(sid) {
  this.players = this.players.filter(function(player) {
    return player.sid !== sid;
  });
};

Game.prototype.resetPlayers = function() {
  for (var i=0; i<this.players.length; i++) {
    this.players[i].reset();
  }
};

Game.prototype.getCurrentPlayer = function() {
  return this.players[this.currentPlayer].sid;
};

Game.prototype.deal = function() {
  for (var i=0; i<this.players.length; i++) {
    this.players[i].cards.push(this.deck.draw());
    this.players[i].cards.push(this.deck.draw());
    this.players[i].cards.push(this.deck.draw());
    this.players[i].cards.push(this.deck.draw());
    this.players[i].cards.push(this.deck.draw());
  }
  this.requestPlayerAction();
};

Game.prototype.requestPlayerAction = function() {
  for (var i=0; i<this.players.length; i++) {
    if (!this.players[i].fold && !this.players[i].allin) {
      this.players[i].played = false;
    }
  }
  this.currentPlayer = 3;
};

Game.prototype.determineWinner = function() {
  // Put together hands in correct format for poker evaluator
  var hands = [];
  var evaluations = [];
  var rankings = [];
  for (var i=0; i < this.players.length; i++) {
    hand = [];
    hand.push(this.players[i].cards[0]);
    hand.push(this.players[i].cards[1]);
    hand.push(this.players[i].cards[2]);
    hand.push(this.players[i].cards[3]);
    hand.push(this.players[i].cards[4]);

    for (var k = 0; k < hand.length; k++) {
      hand[k] = hand[k].rank + hand[k].suit;
    }
    hands.push(hand);
  }

  // Evaluate each hand
  for (var i = 0; i < hands.length; i++) {
    evaluations.push(PokerEvaluator.evalHand(hands[i]).value);
    rankings[i] = { name: this.players[i].name, value: PokerEvaluator.evalHand(hands[i]).value, hand: hands[i] };
  }

  rankings.sort(function(a, b){return b.value - a.value});

  var maxValue = Math.max.apply(Math, evaluations);

  // Return the player with the highest valued hand
  return rankings;
};
