var number;
var round;

$(document).ready(function() {
    newGame();
    $('#game-button').click(function() {
        newGame();
    });
    $('#guess-button').click(function() {
        userGuessHandler();
    });
    $('.myform input').keypress(function(e) {
        if (e.which == 13) {
            userGuessHandler();
        }
    });
});

function newGame() {
    round = 8;
    number = generateNumber();
    $('.myform').show();
    $('.gameover').hide();
    $('.gameover p').remove();
    $('.result').hide();
    $('.result tbody').empty(); 
}

function showLoseMsg() {
    $('.myform').hide();
    $('.gameover h1').after('<p>You lose :( <span>The number is ' + number + '.</span></p>');
    $('.gameover').show();
}

function showWinMsg() {
    $('.myform').hide();
    $('.gameover h1').after('<p>You win :) <span>You guessed the correct number ' + number + ' in ' + (9-round) + ' rounds.</span></p>');
    $('.gameover').show();
}

function userGuessHandler() {
    var userGuess = parseInt($('.myform input[name=guess]').val(), 10);
    $('.myform input[name=guess]').val('');
    var warningMsg;
    if (isNaN(userGuess)) {
        warningMsg = 'Please enter a number';
        showWarning(warningMsg);
    }
    else if (userGuess.toString().length != 4) {
        warningMsg = 'Make sure to enter a <strong>4-digit</strong> number';
        showWarning(warningMsg);
    }
    else {
       var comparison = compareNumber(number, userGuess);
       var toAdd = '<tr><td>' + round + '</td><td>' + userGuess + '</td><td>' + comparison[0] + 'A' + comparison[1] + 'B' + '</td><tr>';
       $('.result tbody').prepend(toAdd);
       $('.result').show();
       if (comparison[0] === 4) {
           showWinMsg();
       }
       else {
            round--;
       }
       if (round <= 0) {
           showLoseMsg();
       }
    }
}

function showWarning(warningMsg) {
    $('.warning p').remove(); 
    $('.warning').append("<p>"+warningMsg+"</p>");
    $('.warning').show();
    window.setTimeout(function() {$('.warning').fadeOut(500, 0);}, 2000);
}

function generateNumber() {
    var firstDigit = Math.floor(Math.random()*9) + 1; 
    var myArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    myArray.splice(firstDigit, 1);
    fisherYates(myArray);
    myArray = [firstDigit].concat(myArray.slice(0, 3));
    return parseInt(myArray.join(''), 10);
}

function compareNumber(num1, num2) {
    /* reference number and guess number have the same number of digits.
    reference number must have unique digits.
    */
    var a = 0;
    var b = 0;
    var digits1 = num1.toString().split('');
    var digits2 = num2.toString().split('');
    var digitsLeft1 = num1.toString().split('');
    var digitsLeft2 = num2.toString().split('');
    for(var i=0; i<digits1.length; i++) {
        if(digits1[i] === digits2[i]) {
            digitsLeft1.splice(i-a, 1);
            digitsLeft2.splice(i-a, 1);
            a++;
        }
    }
    digitsLeft1.sort();
    digitsLeft2.sort();
    b = intersectionDestructive(digitsLeft1, digitsLeft2);
    return [a, b];
}

function fisherYates(myArray) {
    // http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
    var i = myArray.length, j, tempi, tempj;
    if (i === 0) return false;
    while (--i) {
        j = Math.floor(Math.random()*(i+1));
        tempi = myArray[i];
        tempj = myArray[j];
        myArray[i] = tempj;
        myArray[j] = tempi;
   }
}

function intersectionDestructive(array1, array2) {
    // http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    var result = [];
    while (array1.length > 0 && array2.length > 0) {
        if (array1[0] < array2[0]) {
            array1.shift();
        }
        else if (array1[0] > array2[0]) {
            array2.shift();
        }
        else {
            result.push(array1.shift());
            array2.shift();
        }
    }
    return result.length;
}
