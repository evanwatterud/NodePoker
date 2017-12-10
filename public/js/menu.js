$(document).ready(function(){
  var socket = io();

  $('#start-button').click(function() {
    var selectedAINumber = Number($('#ai-players-dropdown').val());
    var strategy1 = Number($('#ai-strategy-dropdown1').val());
    var strategy2 = Number($('#ai-strategy-dropdown2').val());
    var strategy3 = Number($('#ai-strategy-dropdown3').val());
    socket.emit('ai players', { aiPlayers: selectedAINumber, 0: strategy1, 1: strategy2, 2: strategy3 });
    window.location.href = '/';
  });
});
