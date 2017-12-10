module.exports = Player;

function Player(args) {
  this.name = args.name;
  this.sid = args.sid;
  this.isAI = args.isAI;
  this.playing = args.playing;
  this.played = false;
  this.strategy = 0;

  this.cards = [];
}

Player.prototype.reset = function() {
  this.cards = [];

  this.played = false;
  this.playing = true;
};
