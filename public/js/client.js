$(document).ready(function(){
  var socket = io();
  toggleButtons(true);

  socket.on('broadcast',function(data) {
    $('#global-message').text(data.message);
    setTimeout(function () {
      $('#global-message').text('');
    }, 5000);
  });

  socket.on('yourTurn', function(data) {
    toggleButtons(false);
  });

  socket.on('deal', function(data) {
    var cards = data.cards;
    updateCards(cards);
  });

  socket.on('exchanged cards', function(data) {
    var cards = data.cards;
    updateCards(cards);
  });

  socket.on('visible cards', function(data) {
    var imageNames = [];
    var rankDict = {"A": "ace", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7",
                    "8": "8", "9": "9", "T": "10", "J": "jack", "Q": "queen", "K": "king"};
    var suitDict = {"c": "clubs", "d": "diamonds", "h": "hearts", "s": "spades"};
    for (var i = 0; i < data.visibleCards.length; i++) {
      var imageName = '';
      imageName = 'cards/PNG-cards-1.3/' + rankDict[data.visibleCards[i].rank] + '_of_' + suitDict[data.visibleCards[i].suit] + '.png';
      imageNames.push(imageName);
    }

    for (var i = 0; i < imageNames.length; i++) {
      var html = '<div class="visible-card"><img class="visible-card-image" src="' + imageNames[i] + '" /></div>';
      $('#visible-cards-wrapper').append(html);
    }
  });

  socket.on('winner', function(data) {
    $('#winner-message').text(data.gameWinner + ' is the winner of the round.');
    $('#rank1').text('1. ' + data.ranks[0].name + ' hand: ' + data.ranks[0].hand + ' ' + data.ranks[0].value);
    $('#rank2').text('2. ' + data.ranks[1].name + ' hand: ' + data.ranks[1].hand + ' ' + data.ranks[1].value);
    $('#rank3').text('3. ' + data.ranks[2].name + ' hand: ' + data.ranks[2].hand + ' ' + data.ranks[2].value);
    $('#rank4').text('4. ' + data.ranks[3].name + ' hand: ' + data.ranks[3].hand + ' ' + data.ranks[3].value);
    $('#visible-cards-wrapper').html('<h3>Visible Cards</h3>');
    setTimeout(function () {
      $('#winner-message').text('');
    }, 5000);
  });

  $('#done-button').click(function() {
    var cardsToExchange = [];

    if($('#exchange-button1').prop('disabled')) cardsToExchange.push(0);
    if($('#exchange-button2').prop('disabled')) cardsToExchange.push(1);
    if($('#exchange-button3').prop('disabled')) cardsToExchange.push(2);
    if($('#exchange-button4').prop('disabled')) cardsToExchange.push(3);
    if($('#exchange-button5').prop('disabled')) cardsToExchange.push(4);

    socket.emit('exchange', { cards: cardsToExchange });
    toggleButtons(true);
  });

  $('#exchange-button1').click(function() {
    $('#exchange-button1').prop('disabled', true);
  });

  $('#exchange-button2').click(function() {
    $('#exchange-button2').prop('disabled', true);
  });

  $('#exchange-button3').click(function() {
    $('#exchange-button3').prop('disabled', true);
  });

  $('#exchange-button4').click(function() {
    $('#exchange-button4').prop('disabled', true);
  });

  $('#exchange-button5').click(function() {
    $('#exchange-button5').prop('disabled', true);
  });

  function updateCards(cards) {
    var imageNames = [];
    var rankDict = {"A": "ace", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7",
                    "8": "8", "9": "9", "T": "10", "J": "jack", "Q": "queen", "K": "king"};
    var suitDict = {"c": "clubs", "d": "diamonds", "h": "hearts", "s": "spades"};
    for (var i = 0; i < cards.length; i++) {
      var imageName = '';
      imageName = 'cards/PNG-cards-1.3/' + rankDict[cards[i].rank] + '_of_' + suitDict[cards[i].suit] + '.png';
      imageNames.push(imageName);
    }

    $('#card1').attr('src', imageNames[0]);
    $('#card2').attr('src', imageNames[1]);
    $('#card3').attr('src', imageNames[2]);
    $('#card4').attr('src', imageNames[3]);
    $('#card5').attr('src', imageNames[4]);
  }

  function toggleButtons(option) {
    $('#exchange-button1').prop('disabled', option);
    $('#exchange-button2').prop('disabled', option);
    $('#exchange-button3').prop('disabled', option);
    $('#exchange-button4').prop('disabled', option);
    $('#exchange-button5').prop('disabled', option);
    $('#done-button').prop('disabled', option);
  }
});
