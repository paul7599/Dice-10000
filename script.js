var dice, lastDice, heldDice, freeDice, scores, roundScore, activePlayer, gamePlaying, lastDice, sameKind, position, nothing, sum, valuesSoFar, continueTurn, clickScore, unclickScore, stars1, stars2;
var heldDice = document.querySelectorAll('.lastDice');
var freeDice = document.querySelectorAll('.dice');
var rollButton = document.querySelector('.btn-roll');
var unrollButton = document.querySelector('.btn-unroll');

document.querySelector('.btn-new').addEventListener('click', init);
document.querySelector('.btn-roll').addEventListener('click', roll);
document.querySelector('.btn-end').addEventListener('click', nextPlayer);
document.querySelector('.game-arena').addEventListener('click', hold);
document.querySelector('.game-arena').addEventListener('click', unhold);

init();

function init() {
  dice = [0, 0, 0, 0, 0, 0];
  lastDice = [];
  scores = [0, 0];  // scores are set to 0
  activePlayer = 0;  // 'activePlayer' is set to 0
  roundScore = 0;  // curent score is set to 0
  position = [];
  stars1 = '';
  stars2 = '';
  stars1 = document.querySelector('#stars-0');
  stars2 = document.querySelector('#stars-1');
  stars1.textContent = '';
  stars2.textContent = '';
  gamePlaying = true;  // 'gamePlaying' is on
  
  for (var i = 1; i <= dice.length; i++) {
    document.getElementById('dice-' + i).style.display = 'none';  // the dice are hidden       
    document.getElementById('lastDice-' + i).style.display = 'none';  // the last dice are hidden
    document.getElementById('dice-' + i).classList.remove('stuck');
    document.getElementById('lastDice-' + i).classList.remove('stuck');
    document.getElementById('lastDice-' + i).classList.remove('hold');
    unrollButton.style.display = 'none';
    rollButton.style.display = 'block';
  }

  document.getElementById('score-0').textContent = '0';  // the score is set to 0 for the first player
  document.getElementById('score-1').textContent = '0';  // the score is set to 0 for the second player
  document.getElementById('current-0').textContent = '0';  // the curent score is set to 0 for the first player 
  document.getElementById('current-1').textContent = '0';  // the curent score is set to 0 for the second player
  document.getElementById('name-0').textContent = 'Player 1';  
  document.getElementById('name-1').textContent = 'Player 2';
  document.querySelector('.player-0-panel').classList.remove('winner');  // the 'winner' class is removed for the first player
  document.querySelector('.player-1-panel').classList.remove('winner');  // the 'winner' class is removed for the second player
  document.querySelector('.player-0-panel').classList.remove('active');  // the 'active' class is removed for the first player
  document.querySelector('.player-1-panel').classList.remove('active');  // the 'active' class is removed for the second player
  document.querySelector('.player-0-panel').classList.add('active');  // the 'active' class is added for the first player
}
  
function roll() {  
  if (gamePlaying) {
    rollButton.style.display = 'none';
    unrollButton.style.display = 'block';
    clickScore = 0;
    unclickScore = 0;
    continueTurn = false;
    
    for (var i = 0; i < 6; i ++) {
      if (freeDice[i].className === 'dice stuck') {
        freeDice[i].classList.remove('stuck');
      }
    }
    
    var lengthWithoutHoles = Object.keys(dice).length;
    nothing = 0;
    sum = 0;
    valuesSoFar = [];
    
    if (lengthWithoutHoles === 0) {
      for (var i = 0; i < 6; i++) {
        dice[i] = 0;
        lastDice[i] = 0;
        heldDice[i].classList.remove('stuck');
        heldDice[i].classList.remove('hold');
        heldDice[i].style.display = 'none';      
        freeDice[i].style.display = 'block';         
      }
    }
       
    // if the players rolls the dice again, make the dice stuck
    for (var i = 0; i < heldDice.length; i++) {
      if (heldDice[i].className === 'lastDice hold' && Object.keys(dice).length !== 0) {
        heldDice[i].classList.remove('hold');
        heldDice[i].classList.add('stuck');
        delete dice[i];
        delete lastDice[i];
      } 
    }
    
    // gets a random value for each die that is not being held
    for (var i = 0; i < dice.length; i++) {
      if (dice[i] !== undefined) {
        dice[i] = Math.floor(Math.random() * 6) + 1; // each die gets a random number
        if (dice[i] === 1 || dice[i] === 5) {
          continueTurn = true;
        }
        document.getElementById('dice-' + (i + 1)).style.display = 'block';  // each die gets displayed
        document.getElementById('dice-' + (i + 1)).src = 'https://cdn.glitch.com/f9ead6d0-a9b7-461e-b3bd-6c5c01b7c17c%2F' + dice[i] + '.png?v=1568107636491';  // each die gets a value based on the random function
      } else {
        continue;
      }     
    }
       
    
    // checking to see how many unique dice there are  
    for (var i = 0; i < dice.length; i++) {
      if (valuesSoFar.indexOf(dice[i]) === -1 && dice[i] !== undefined) {
        valuesSoFar.push(dice[i]);
      }  
    }
    
    // checking how many times each die appears
    var plus = [1, 1, 1, 1, 1, 1];
    for (var i = 0; i < dice.length; i++) {
      if (dice[i] === undefined) {
        continue;
      }
      for (var j = 0; j < dice.length; j++) {
        if (dice[i] === undefined) {
        continue;
      }
        if (i === j) {
          continue;
        }
        if (dice[i] === dice[j]) {
        plus[i]++;
        }
        if (plus[i] >= 3) {
          continueTurn = true;
        }
      }
    }   
    
    // checking for 3x2
    if (Object.keys(dice).length === 6) {
      if (valuesSoFar.length === 3 && plus.every(function(element) {return element === 2;}) || valuesSoFar.length === 2 && (plus.some(function(element) {return element === 4;}) && plus.some(function(element) {return element === 2;}))) {
        unrollButton.style.display = 'none';
        rollButton.style.display = 'block';
        continueTurn = true;
        roundScore += 1500;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
        for (var i = 0; i < heldDice.length; i++) {
          freeDice[i].classList.add('stuck');
        }
      }
    }
    
    // checking for 2x3  
    if (plus.every(function(element) {return element === 3;})) {
      if (valuesSoFar.length === 2 && Object.keys(dice).length === 6) {
        unrollButton.style.display = 'none';
        rollButton.style.display = 'block';
        continueTurn = true;
        roundScore += 2000;
        document.querySelector('#current-' + activePlayer).textContent = roundScore;
        for (var i = 0; i < heldDice.length; i++) {
          freeDice[i].classList.add('stuck');
        }
      } 
    }

    // checking for straight
    if (valuesSoFar.length === 6 && Object.keys(dice).length === 6) {
      unrollButton.style.display = 'none';
      rollButton.style.display = 'block';
      continueTurn = true;
      roundScore += 3000;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
      for (var i = 0; i < heldDice.length; i++) {
        freeDice[i].classList.add('stuck');
      }
    }

    // checking for polonic
    if (valuesSoFar.length === 1 && Object.keys(dice).length === 6) {
      unrollButton.style.display = 'none';
      rollButton.style.display = 'block';
      continueTurn = true;
      roundScore += 10000;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
      for (var i = 0; i < heldDice.length; i++) {
        freeDice[i].classList.add('stuck');
      }
    }
    
          
    // checking for nothing
    for (var i = 0; i < freeDice.length; i++) {
      if (dice[i] === undefined) {
        continue;
      } else if (dice[i] === 2) {  
        nothing++;
      }
    }
    
    if (nothing === 4 || nothing === 5) {
      for (var i = 0; i < 6; i ++) {
        freeDice[i].classList.add('stuck');
        continueTurn = false;
        roundScore = 0;
        rollButton.style.display = 'none';
        unrollButton.style.display = 'block';
      }
      
      if (activePlayer === 0) {        
        stars1.textContent += '*';
      } else {
        stars2.textContent += '*';
      }

      if (stars1.textContent === '***') {
        roundScore += 10000;
        document.querySelector('#current-0').textContent = roundScore;
      }

      if (stars2.textContent === '***') {
        roundScore += 10000;
        document.querySelector('#current-1').textContent = roundScore;
      }  
      
    } else if (!continueTurn && Object.keys(dice).length === 6) {
        for (var i = 0; i < 6; i ++) {
          freeDice[i].classList.add('stuck');
          roundScore = 0;
          rollButton.style.display = 'none';
          unrollButton.style.display = 'block';
        }
      
      if (activePlayer === 0) {
        stars1.textContent += '*';
      } else {
        stars2.textContent += '*';
      }

      if (stars1.textContent === '***') {
        roundScore += 10000;
        document.querySelector('#current-0').textContent = roundScore;
      }

      if (stars2.textContent === '***') {
        roundScore += 10000;
        document.querySelector('#current-1').textContent = roundScore;
      }  
    }
    unclickScore = clickScore;  
  }  
}



function hold(event) {  
  if (gamePlaying) {
    var elementClicked = event.target;
    var index = getDice(elementClicked);
    var temp = roundScore;
    position = [];
    sameKind = 1;
    
    if (elementClicked.className === 'dice') {
      position.push(index - 1);
      clickScore = 0;

      for (var i = 0; i < dice.length; i++) {
        if ((index - 1) === i) {
          continue;
        }

        if (dice[index - 1] === dice[i]) {
          sameKind++;
          position.push(i);
        } else {
          continue;
        }

        if (sameKind === 3 && dice[index - 1] !== 1) {
          roundScore += dice[i] * 100;
          clickScore = dice[i] * 100;
          break;
        } else if (sameKind === 3 && dice[index - 1] === 1) {
          roundScore += 1000;
          clickScore += 1000;
          break;
        } 
      }

      if (dice[index - 1] === 1 && sameKind < 3) {
        roundScore += 100;
        clickScore += 100;
      } else if (dice[index - 1] === 5 && sameKind < 3) {
        roundScore += 50;
        clickScore += 50;
      }
      
      // this is for not selecting 2 dice of the same kind at a time
      if (sameKind === 2) {
        position.pop();
      }
      
      if (roundScore !== temp) {
        for (var i = 0; i < position.length; i++) {
          lastDice[position[i]] = dice[position[i]];
          delete dice[position[i]];
          document.querySelector('#current-' + activePlayer).textContent = roundScore;
          document.getElementById('dice-' + (position[i] + 1)).style.display = 'none';
          document.getElementById('lastDice-' + (position[i] + 1)).src = 'https://cdn.glitch.com/f9ead6d0-a9b7-461e-b3bd-6c5c01b7c17c%2F' + lastDice[position[i]] + '.png?v=1568107636491';
          document.getElementById('lastDice-' + (position[i] + 1)).style.display = 'block';
          document.getElementById('lastDice-' + (position[i] + 1)).classList.add('hold');
        }  
      }
      unclickScore += clickScore;
      if (clickScore !== 0) {
        unrollButton.style.display = 'none';
        rollButton.style.display = 'block';
      }
    }    
  }
}
      
function unhold(event) {
  if (gamePlaying) {
    var elementClicked = event.target;
    var index = getDice(elementClicked);   
    var temp = roundScore;
    position = [];
    sameKind = 1;
    if (elementClicked.className === 'lastDice hold') {
      position.push(index - 1);

      for (var i = 0; i < dice.length; i++) {
        if ((index - 1) === i) {
          continue;
        }

        if (lastDice[index - 1] === lastDice[i]) {
          sameKind++;
          position.push(i);
        } else {
          continue;
        }

        // && dice[position[1]].className === 'lastDice hold' && dice[position[2]].className === 'lastDice hold'
        if (sameKind === 3 && lastDice[index - 1] !== 1) {
          roundScore -= lastDice[i] * 100;
          unclickScore -= lastDice[i] * 100;
          break;
        } else if (sameKind === 3 && lastDice[index - 1] === 1) {
          roundScore -= 1000;
          unclickScore -= 1000;
          break;
        } 
      }

      if (lastDice[index - 1] === 1 && sameKind < 3) {  
        roundScore -= 100;
        unclickScore -= 100;
      } else if (lastDice[index - 1] === 5 && sameKind < 3) {
        roundScore -= 50;
        unclickScore -= 50;
      }
      
      if (sameKind === 2) {
        position.pop();
      }
      
      if (roundScore !== temp) {
        for (var i = 0; i < position.length; i++) {
          dice[position[i]] = lastDice[position[i]];
          delete lastDice[position[i]];
          document.querySelector('#current-' + activePlayer).textContent = roundScore;
          document.getElementById('lastDice-' + (position[i] + 1)).classList.remove('hold');
          document.getElementById('lastDice-' + (position[i] + 1)).style.display = 'none';  
          document.getElementById('dice-' + (position[i] + 1)).src = 'https://cdn.glitch.com/f9ead6d0-a9b7-461e-b3bd-6c5c01b7c17c%2F' + dice[position[i]] + '.png?v=1568107636491';
          document.getElementById('dice-' + (position[i] + 1)).style.display = 'block';  
        }  
      }
      if (unclickScore === 0) {
        rollButton.style.display = 'none';
        unrollButton.style.display = 'block';
      }
    }  
  }
}

function getDice(element) {
  var el = JSON.stringify(element.id);
  var diceNumber = el.charAt(el.length - 2);
  return diceNumber;
}

function nextPlayer() {
  
  if (scores[activePlayer] === 0 && roundScore < 500) {
    roundScore = 0;
  }
  
  if (activePlayer === 0 && scores[0] < 10000) {
    scores[activePlayer] += roundScore;
    if (scores[0] >= 10000) {
    }
  } else if (activePlayer === 1) {
    scores[activePlayer] += roundScore;
    if (scores[0] >= 10000 && scores[0] === scores[1]) {
      document.querySelector('#name-0').textContent = 'Draw';
      document.querySelector('#name-1').textContent = 'Draw';
      document.querySelector('.player-0-panel').classList.remove('active');
      document.querySelector('.player-1-panel').classList.remove('active');
    }
    if (scores[0] === 10000 && scores[1] !== 10000) {
      document.querySelector('#name-0').textContent = 'Loser!';
      document.querySelector('#name-1').textContent = 'Winner!';
      document.querySelector('.player-1-panel').classList.add('winner');
      document.querySelector('.player-1-panel').classList.remove('active');
      document.querySelector('.player-0-panel').classList.remove('active');
      gamePlaying = false;
    } else if (scores[1] === 10000 && scores[0] !== 10000) {
      document.querySelector('#name-1').textContent = 'Loser!';
      document.querySelector('#name-0').textContent = 'Winner!';
      document.querySelector('.player-0-panel').classList.add('winner');
      document.querySelector('.player-0-panel').classList.remove('active');
      document.querySelector('.player-1-panel').classList.remove('active');
      gamePlaying = false;
    } else if (scores[0] > scores[1] && scores[0] > 10000) {
      document.querySelector('#name-0').textContent = 'Winner!';
      document.querySelector('.player-0-panel').classList.add('winner');
      document.querySelector('.player-0-panel').classList.remove('active');
      document.querySelector('.player-1-panel').classList.remove('active');
      gamePlaying = false;
    } else if (scores[0] < scores[1] && scores[1] > 10000) {
      document.querySelector('#name-1').textContent = 'Winner!';
      document.querySelector('.player-1-panel').classList.add('winner');
      document.querySelector('.player-1-panel').classList.remove('active');
      document.querySelector('.player-0-panel').classList.remove('active');
    } 
 }    
      
  
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('score-0').textContent = scores[0];
  document.getElementById('score-1').textContent = scores[1];
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
  
  for (var i = 0; i < heldDice.length; i++) {
    heldDice[i].classList.remove('hold');
    heldDice[i].classList.remove('stuck');
    heldDice[i].style.display = 'none';  
  }
  
  for (var i = 0; i < heldDice.length; i++) {
    freeDice[i].style.display = 'none';
  }
  
  unrollButton.style.display = 'none';
  rollButton.style.display = 'block';
   
  dice = [0, 0, 0, 0, 0, 0];
  
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  roundScore = 0;
}