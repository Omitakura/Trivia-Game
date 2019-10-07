$(document).ready(function () {
    //event listeners for my trivia game
    $('#remainingTime').hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click', '.option', trivia.guessChecker);
})
//This is the properties for trivia
var trivia = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',
    //These are all the questions and answers for the trivia game.
    questions: {
        q1: 'In Gene Roddenberrys original treatment for Star Trek, what was the name of the Starship?',
        q2: 'Who was the first actor to play a member of all three of the major alien races in Star Trek?',
        q3: 'What is Sulus primary position on the U.S.S. Enterprise?',
        q4: 'Which Star Trek captain has an artificial heart?',
        q5: 'Who was the first Vulcan science officer aboard the starship Enterprise?',
        q6: 'Which alien race did Ronald Reagan say reminded him of Congress?',
        q7: 'Which species was the first to discover warp drive?',
        q8: 'What Star Trek character was labeled "unknown sample" when discovered by Bajoran scientists?',
        q9: 'Which Star Trek actor originally devised the Klingon language?',
        q10: 'What character was adopted by the Vulcan ambassador Sarek?',
    },
    options: {
        q1: ['Yorktown', 'Enterprise', 'Plymouth', 'Reliant'],
        q2: ['Christopher Lloyd', 'Jeffrey Hunter', 'Mark Lenard', 'Leonard Nimoy'],
        q3: ['Navigator', 'Chief Engineer', 'Helmsman', 'Science Officer'],
        q4: ['Kathryn Janeway', 'Jonathan Arhcher', 'Benjamin Sisko', 'Jean-Luc Picard'],
        q5: ['Sarek', 'Tpol', 'Spock', 'Tuvok'],
        q6: ['Ferengi', 'Klingons', 'Borg', 'Vulcans'],
        q7: ['Borg', 'Klingons', 'Vulcan', 'Humans'],
        q8: ['Seven of Nine', 'Khan Noonien', 'Data', 'Odo'],
        q9: ['Leonard Nimoy', 'James Doohan', 'Michael Ansara', 'Mark Lenard'],
        q10: ['Michael Burham', 'Sybok', 'Sylvia Tilly', 'Spock'],
    },
    answers: {
        q1: 'Yorktown',
        q2: 'Mark Lenard',
        q3: 'Helmsman',
        q4: 'Jean-Luc Picard',
        q5: 'Tpol',
        q6: 'Klingons',
        q7: 'Vulcans',
        q8: 'Odo',
        q9: 'James Doohan',
        q10: 'Michael Burnham',
    },
    //The methods to initialize and start up.  
    //this one starts the game
    startGame: function () {
        //redoing the starting values to 0
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);

        //showing the game section
        $('#game').show();

        //empty the last results from the game
        $('#results').html('');

        //show the timer for the user
        $('#timer').text(trivia.timer);

        //remove the start button when the gaem has bgeun
        $('#start').hide();

        $('#remainingTime').show();

        //ask the first question 
        trivia.nextQuestion();
    },
    //method that will loop through the arrays and display questions and otions
    nextQuestion: function () {

        //setting the timer for each question to 20 seconds.
        trivia.timer = 10;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        //this is to make sure that the timer doesn't speed up
        if (!trivia.timerOn) {
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }
        //This gets all of the questions and indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        //create and array of all the user choices for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        //this will make all the trivia guesses in the html
        $.each(questionOptions, function (index, key) {
            $('#options').append($('<button class="btn btn-primary">' + key + '</button>'));
        })

    },
    //this is the method to lower the counter and also give a unanswered count is the tiemr runs out without an answer
    timerRunning: function () {
        //if the timer still has time left and there are still questions left to answer
        if (trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length) {
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if (trivia.timer === 4) {
                $('#timer').addClass('last-seconds');
            }
        }
        //If time hs run out run this
        else if (trivia.timer === -1) {
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>No more time left!  The correct answer was ' + Object.values(trivia.answers)[trivia.currentSet] + '</h3>');
        }
        //if we got all the questions done then end the game and display results
        else if (trivia.currentSet === Object.keys(trivia.questions).length) {

            //add the results of the game to the page
            $('#results')
                .html('<h3>Thanks for playing!</h3>' +
                    '<p>Correct: ' + trivia.correct + '</p>' +
                    '<p>Incorrect: ' + trivia.incorrect + '</p>' +
                    '<p>Unaswered: ' + trivia.unanswered + '</p>' +
                    '<p>Please play again!</p>');

            //hide the game section
            $('#game').hide();

            //show the start button to we can start a new game
            $('#start').show();
        }
    },
    //this is going to be the method to check the options that are clicked
    guessChecker: function () {

        //the id for gameresult setimeout
        var resultID;

        //this is the answer to the current question asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];

        //if the text of the option picked matches the answer give the correct increment
        if ($(this).text() === currentAnswer) {

            $(this).addClass('btn-success').removeClass('btn-info');

            trivia.correct++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Right Choice!</h3>');
        }
        //else the wrong choice was picked and
        else {

            $(this).addClass('btn-danger').removeClass('btn-info');


            trivia.incorrect++;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult, 1000);
            $('#results').html('<h3>Wrong choice, try again next time! ' + currentAnswer + '</h3>');
        }
    },//end of guess check function

    // method to remove previous question results and options
    guessResult: function () {

        // increment to next question set
        trivia.currentSet++;

        // remove the options and results
        $('.option').empty();
        $('#results h3').empty();

        // begin next question
        trivia.nextQuestion();

    }
}