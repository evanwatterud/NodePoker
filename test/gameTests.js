var assert = require("assert");
var Game = require('../public/model/game.js');
var Player = require('../public/model/player.js');
var Deck = require('../public/model/deck.js');


describe('Strategy 1', function() {

  var game = new Game();

  game.addPlayer({
    name: 'AI Player 1',
    sid: 0,
    isAI: true,
    playing: true
  });

  game.addPlayer({
    name: 'AI Player 2',
    sid: 1,
    isAI: true,
    playing: true
  });

  game.addPlayer({
    name: 'AI Player 3',
    sid: 2,
    isAI: true,
    playing: true
  });

  game.addPlayer({
    name: 'Player 1',
    sid: 3,
    isAI: false,
    playing: true
  });

  game.players[0].strategy = 1;
  game.players[1].strategy = 1;
  game.players[2].strategy = 1;

  beforeEach(function() {
    game.players[0].reset();
    game.players[1].reset();
    game.players[2].reset();
    game.deck = new Deck();
    game.visibleCards = [];

    game.players[0].cards = [
      game.deck.drawCard({rank: '2', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '3', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: '4', suit: 's', hidden: false}),
      game.deck.drawCard({rank: '5', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '6', suit: 'c', hidden: false})
    ];
    game.players[1].cards = [
      game.deck.drawCard({rank: 'J', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: 'J', suit: 's', hidden: false}),
      game.deck.drawCard({rank: 'J', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: '5', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: '6', suit: 's', hidden: false})
    ];
    game.players[2].cards = [
      game.deck.drawCard({rank: 'T', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '5', suit: 's', hidden: false}),
      game.deck.drawCard({rank: 'Q', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: 'Q', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '7', suit: 'c', hidden: false})
    ];
  });

   describe('All AI players', function() {
    it('should still have 5 cards', function() {
      game.playAI();
      assert.equal(game.players[0].cards.length, 5);
      assert.equal(game.players[1].cards.length, 5);
      assert.equal(game.players[2].cards.length, 5);
    });
  });

  describe('AI player', function() {
    it('should hold all cards when it has a straight or better', function() {
      var visibleCards = game.playAI();
      assert.deepEqual(visibleCards[0], []);
    });

    it('should hold a 3 pair and exchange others', function() {
      game.playAI();
      assert.deepEqual(game.players[1].cards[0], {rank: 'J', suit: 'c', hidden: false});
      assert.deepEqual(game.players[1].cards[1], {rank: 'J', suit: 's', hidden: false});
      assert.deepEqual(game.players[1].cards[2], {rank: 'J', suit: 'd', hidden: false});
      assert.notDeepEqual(game.players[1].cards[3], {rank: '5', suit: 'd', hidden: false});
      assert.notDeepEqual(game.players[1].cards[4], {rank: '6', suit: 's', hidden: false});
    });

    it('should hold a pair and exchange others', function() {
      game.playAI();
      assert.notDeepEqual(game.players[2].cards[0], {rank: 'T', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[1], {rank: '5', suit: 's', hidden: false});
      assert.deepEqual(game.players[2].cards[2], {rank: 'Q', suit: 'd', hidden: false});
      assert.deepEqual(game.players[2].cards[3], {rank: 'Q', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[4], {rank: '7', suit: 'c', hidden: false});
    });

    it('should hold 2 pairs and exchange other card', function() {
      game.players[2].cards = [
        game.deck.drawCard({rank: 'T', suit: 'c', hidden: false}),
        game.deck.drawCard({rank: 'T', suit: 's', hidden: false}),
        game.deck.drawCard({rank: 'Q', suit: 'd', hidden: false}),
        game.deck.drawCard({rank: 'Q', suit: 'c', hidden: false}),
        game.deck.drawCard({rank: '8', suit: 'c', hidden: false})
      ];

      game.playAI();
      assert.deepEqual(game.players[2].cards[0], {rank: 'T', suit: 'c', hidden: false});
      assert.deepEqual(game.players[2].cards[1], {rank: 'T', suit: 's', hidden: false});
      assert.deepEqual(game.players[2].cards[2], {rank: 'Q', suit: 'd', hidden: false});
      assert.deepEqual(game.players[2].cards[3], {rank: 'Q', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[4], {rank: '8', suit: 'c', hidden: false});
    });
  });
});

describe('Strategy 2', function() {

  var game = new Game();

  game.addPlayer({
    name: 'AI Player 2',
    sid: 1,
    isAI: true,
    playing: true
  });

  game.addPlayer({
    name: 'AI Player 3',
    sid: 2,
    isAI: true,
    playing: true
  });

  game.addPlayer({
    name: 'Player 1',
    sid: 3,
    isAI: true,
    playing: true
  });

  game.players[0].strategy = 2;
  game.players[1].strategy = 2;
  game.players[2].strategy = 2;

  beforeEach(function() {
    game.players[0].reset();
    game.players[1].reset();
    game.players[2].reset();
    game.deck = new Deck();
    game.visibleCards = [];

    game.players[0].cards = [
      game.deck.drawCard({rank: '3', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '4', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: '5', suit: 's', hidden: false}),
      game.deck.drawCard({rank: '6', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '7', suit: 'c', hidden: false})
    ];
    game.players[1].cards = [
      game.deck.drawCard({rank: 'J', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: 'J', suit: 's', hidden: false}),
      game.deck.drawCard({rank: 'J', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: '5', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: '6', suit: 's', hidden: false})
    ];
    game.players[2].cards = [
      game.deck.drawCard({rank: 'T', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '5', suit: 'h', hidden: false}),
      game.deck.drawCard({rank: 'Q', suit: 'd', hidden: false}),
      game.deck.drawCard({rank: 'Q', suit: 'c', hidden: false}),
      game.deck.drawCard({rank: '8', suit: 'c', hidden: false})
    ];
  });

  describe('AI player', function() {
    describe('First player', function() {
      it('should reuse strategy 1 and hold a straight or better', function() {
        var visibleCards = game.playAI();
        assert.deepEqual(visibleCards[0], []);
      });

      it('should reuse strategy 1 and hold a pair and exchange others', function() {
        game.players[0].cards = [
          game.deck.drawCard({rank: '9', suit: 'c', hidden: false}),
          game.deck.drawCard({rank: '9', suit: 's', hidden: false}),
          game.deck.drawCard({rank: '2', suit: 'd', hidden: false}),
          game.deck.drawCard({rank: '6', suit: 'c', hidden: false}),
          game.deck.drawCard({rank: '8', suit: 'c', hidden: false})
        ];

        game.playAI();
        assert.deepEqual(game.players[0].cards[0], {rank: '9', suit: 'c', hidden: false});
        assert.deepEqual(game.players[0].cards[1], {rank: '9', suit: 's', hidden: false});
        assert.notDeepEqual(game.players[0].cards[2], {rank: '2', suit: 'd', hidden: false});
        assert.notDeepEqual(game.players[0].cards[3], {rank: '6', suit: 'c', hidden: false});
        assert.notDeepEqual(game.players[0].cards[4], {rank: '8', suit: 'c', hidden: false});
      });
    });

    it('should keep a pair and exchange other cards when any player before has a visible 3 of a kind', function() {
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 'c', hidden: false}));
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 's', hidden: false}));
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 'd', hidden: false}));

      game.playAI();
      assert.notDeepEqual(game.players[2].cards[0], {rank: 'T', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[1], {rank: '5', suit: 'h', hidden: false});
      assert.deepEqual(game.players[2].cards[2], {rank: 'Q', suit: 'd', hidden: false});
      assert.deepEqual(game.players[2].cards[3], {rank: 'Q', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[4], {rank: '8', suit: 'c', hidden: false});
    });

    it('should keep 2 pairs and exchange other card when any player before has a visible 3 of a kind', function() {
      game.players[2].cards = [
        game.deck.drawCard({rank: 'T', suit: 'c', hidden: false}),
        game.deck.drawCard({rank: 'T', suit: 's', hidden: false}),
        game.deck.drawCard({rank: 'Q', suit: 'd', hidden: false}),
        game.deck.drawCard({rank: 'Q', suit: 'c', hidden: false}),
        game.deck.drawCard({rank: '8', suit: 'c', hidden: false})
      ];
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 'c', hidden: false}));
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 's', hidden: false}));
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 'd', hidden: false}));

      game.playAI();
      assert.deepEqual(game.players[2].cards[0], {rank: 'T', suit: 'c', hidden: false});
      assert.deepEqual(game.players[2].cards[1], {rank: 'T', suit: 's', hidden: false});
      assert.deepEqual(game.players[2].cards[2], {rank: 'Q', suit: 'd', hidden: false});
      assert.deepEqual(game.players[2].cards[3], {rank: 'Q', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[4], {rank: '8', suit: 'c', hidden: false});
    });

    it('should exchange all cards if it has no pairs when any player before has a visible 3 of a kind', function() {
      game.players[2].cards = [
        game.deck.drawCard({rank: '9', suit: 'c', hidden: false}),
        game.deck.drawCard({rank: 'T', suit: 's', hidden: false}),
        game.deck.drawCard({rank: 'J', suit: 'h', hidden: false}),
        game.deck.drawCard({rank: 'Q', suit: 'h', hidden: false}),
        game.deck.drawCard({rank: 'K', suit: 'c', hidden: false})
      ];

      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 'c', hidden: false}));
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 's', hidden: false}));
      game.visibleCards.push(game.deck.drawCard({rank: 'A', suit: 'd', hidden: false}));

      game.playAI();
      assert.notDeepEqual(game.players[2].cards[0], {rank: '9', suit: 'c', hidden: false});
      assert.notDeepEqual(game.players[2].cards[1], {rank: 'T', suit: 's', hidden: false});
      assert.notDeepEqual(game.players[2].cards[2], {rank: 'J', suit: 'h', hidden: false});
      assert.notDeepEqual(game.players[2].cards[3], {rank: 'Q', suit: 'h', hidden: false});
      assert.notDeepEqual(game.players[2].cards[4], {rank: 'K', suit: 'c', hidden: false});
    });

    describe('Not first player', function() {
      it('should reuse strategy 1 and keep a straight or better when no player before has a visible 3 of a kind', function() {
        game.players[1].cards = [
          game.deck.drawCard({rank: 'J', suit: 'c', hidden: false}),
          game.deck.drawCard({rank: 'J', suit: 's', hidden: false}),
          game.deck.drawCard({rank: 'J', suit: 'd', hidden: false}),
          game.deck.drawCard({rank: 'J', suit: 'h', hidden: false}),
          game.deck.drawCard({rank: '6', suit: 's', hidden: false})
        ];

        game.playAI();
        assert.deepEqual(game.players[1].cards[0], {rank: 'J', suit: 'c', hidden: false});
        assert.deepEqual(game.players[1].cards[1], {rank: 'J', suit: 's', hidden: false});
        assert.deepEqual(game.players[1].cards[2], {rank: 'J', suit: 'd', hidden: false});
        assert.deepEqual(game.players[1].cards[3], {rank: 'J', suit: 'h', hidden: false});
        assert.deepEqual(game.players[1].cards[4], {rank: '6', suit: 's', hidden: false});
      });

      it('should reuse strategy 1 and exchange when no player before has a visible 3 of a kind', function() {
        game.players[1].cards = [
          game.deck.drawCard({rank: 'J', suit: 'c', hidden: false}),
          game.deck.drawCard({rank: 'J', suit: 's', hidden: false}),
          game.deck.drawCard({rank: 'J', suit: 'd', hidden: false}),
          game.deck.drawCard({rank: 'J', suit: 'h', hidden: false}),
          game.deck.drawCard({rank: '6', suit: 's', hidden: false})
        ];

        game.playAI();
        assert.deepEqual(game.players[1].cards[0], {rank: 'J', suit: 'c', hidden: false});
        assert.deepEqual(game.players[1].cards[1], {rank: 'J', suit: 's', hidden: false});
        assert.deepEqual(game.players[1].cards[2], {rank: 'J', suit: 'd', hidden: false});
        assert.deepEqual(game.players[1].cards[3], {rank: 'J', suit: 'h', hidden: false});
        assert.deepEqual(game.players[1].cards[4], {rank: '6', suit: 's', hidden: false});
      });
    });
  });
});
