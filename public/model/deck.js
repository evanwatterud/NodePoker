module.exports = Deck;

var _ = require('lodash')

function Deck() {
  this.suits = ["c", "d", "h", "s"];
  this.ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"];
  this.cards = [];

  this.generate();
  this.shuffle();
}

Deck.prototype.generate = function() {
  for (var i = 0; i < this.suits.length; i++) {
    for (var j = 0; j < this.ranks.length; j++) {
      this.cards.push({rank: this.ranks[j], suit: this.suits[i], hidden: false});
    }
  }
}

Deck.prototype.shuffle = function() {
  this.cards = _.shuffle(this.cards);
};

Deck.prototype.draw = function() {
  return this.cards.pop();
};

Deck.prototype.drawCard = function(card) {
  this.cards = this.cards.filter(function(c) {
    return !(c.rank == card.rank && c.suit == card.suit);
  });
  return card;
};
