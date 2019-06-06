// Typerwriter effect
var i = 0;
var txt = 'Ready, Set, Learn...';
var speed = 50;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("demo").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}


// Setup the quizz questions
var quizzQuestions = [{
        question: 'Alabama: which of these is NOT illegal to do on Sunday?',
        answerOptions: ["Hunting or playing cards", "Auto racing", "Opening a store that does not provide a necessary service or product", "Having your child mow the lawn"],
        answer: 1
    },
    {
        question: 'Alaska: Which of these is illegal to have on your dining room table?',
        answerOptions: ['Pepper', 'Steak sauce', 'Tabasco sauce', 'Salt'],
        answer: 3
    },
    {
        question: 'Arizona: Can you leggaly be younger than your adopted child?',
        answerOptions: ['Yes', 'No'],
        answer: 0
    },
    {
        question: 'Arkansas: Which of these is it illegal to have within 200 yards to and be visible from a state-designated memorial?',
        answerOptions: ['Scrap iron', ' POW/MIA flags', 'Out flowers', 'Crosses'],
        answer: 1
    },
    {
        question: 'California: According to STATE law, the only United States flag that CANNOT possibly be leggaly flown by a state agency has how many stars?',
        answerOptions: [50, 49, 46, 48],
        answer: 1
    },
    {
        question: 'Colorado: You may take how many PAID hours off from work to vote?',
        answerOptions: ['1', '2', '0', '3'],
        answer: 1
    },
    {
        question: 'Connecticut: A tavern may NOT self which of the following?',
        answerOptions: ['Hard cider', 'Beer', 'Wine', 'Whiskey'],
        answer: 3
    },
    {
        question: 'Delaware: Which of these scientists must be licensed in order to practice in their field?',
        answerOptions: ['Biologist', 'Botanist', 'Geologist', 'Astronomer'],
        answer: 2
    },
    {
        question: 'Florida: Florida has some weird laws involving people dying intestate (without a will. Which of the following is NOT one of them?',
        answerOptions: ['If a child is conceived before the death of the parent yet is born  after the death of the parent, they get nothing',
            'Being a holocaust victim can affect a person\'s status as an heir',
            'If the spouse has step-children, the spouse gets less of the inheritance than they would with only natural children',
            'If there are no heirs, the inheritance eventually goes to the state\'s School Fund'
        ],
        answer: 0
    },
    {
        question: 'Georgia: What is required if a person wants to hold an elected state office?',
        answerOptions: ['They must be a land owner',
            'They must sign an Oath of Allegience to the State of Georgia',
            'They must have resided in the State of Georgia for at leat one year',
            'They must be a registered voter'
        ],
        answer: 3
    },
    {
        question: 'Hawaii: It is illegal to commit a crime provided what?',
        answerOptions: ['you do it the island of Molokai',
            'you only violate the law a little bit',
            'you use a dolphin to commit the crime',
            'you apoligize afterwards'
        ],
        answer: 1
    },
    {
        question: 'Idaho: Idaho makes it illegal for one spouse to abandon the other and leave the destitute. What is weird about this law?',
        answerOptions: ['The wife can be punished but the husband cannot.',
            'The husband can be punished but the wife cannot',
            'Neither party can be punished',
            'Abondonment results in an automatic divorce'
        ],
        answer: 1
    },
    {
        question: 'Illinois: The state has a law on the books that will make a something illegal specifically if the US Supreme Court ever reverses itself. What is the crime-in-waiting?',
        answerOptions: ['Racial descrimination',
            'Unequal funding funding of the women\'s college sports',
            'Possession of handgun',
            'Abortion'
        ],
        answer: 3
    },
    {
        question: 'Indiana: A lot of states have rules regulating the times alcohool can be sold. Which days is it illegal for a convenience store to sell alcohool?',
        answerOptions: ['New Year\'s Day', 'Christmas Day', 'Valentine\'s Day', 'Election Day'],
        answer: 2
    },
    {
        question: 'Iowa: Who are exempted from working on election day?',
        answerOptions: ['Poll workers', 'State legislators', 'Military Personal', 'Ministers and priests'],
        answer: 2
    },

    {
        question: 'Kentucky: If you want to sell fowl under two months of age, what is the minumum number that you must sell?',
        answerOptions: ['6', '3', '4', '5'],
        answer: 0
    },
    {
        question: 'Louisiana: Stealling this pet from somebody may result in a fine of $3000 and up to ten years in prison, possibly at hard labor.',
        answerOptions: ['Aligator', 'Bind', 'Dog', 'Fish'],
        answer: 0
    },
    {
        question: 'Maine: Suicide is not illegal in Maine, however what action is a crime?',
        answerOptions: ['Committing suicide on Sunaday',
            'Committing "homicide" to oneself',
            'Assisting someone in commiting suicide',
            'Not filling an intent to commit suicide within 10 business days before committing suicide'
        ],
        answer: 2
    },
    {
        question: 'Maryland: What is illegal to sell through vending machines at a nursery school?',
        answerOptions: ['Contraceptives', 'Cookies', 'Candy', 'Coffe'],
        answer: 0
    },
    {
        question: 'Massachusetts: it is illegal what natural item',
        answerOptions: ['Grass', 'Fire', 'Ice', 'Air'],
        answer: 2
    },
    {
        question: 'Michigan: According to the state constitution, which of these is NOT a purpose of education?',
        answerOptions: ['Knowledge', 'Morality', 'Citizenship', 'Religion'],
        answer: 2
    },
    {
        question: 'Minnesota: it is illegal for a retail store ro sell flour in the size bag.',
        answerOptions: ['50 lbs', '3 lbs', '6 lbs', '25 lbs'],
        answer: 2
    }
];

// Setup the gif array, variables and messaged tht
var gifArray = ['q-1', 'q-2', 'q-3', 'q-4', 'q-5', 'q-6', 'q-7', 'q-8', 'q-9', 'q-10', 'q-11', 'q-12', 'q-13', 'q-14', 'q-15', 'q-17', 'q-18', 'q-19', 'q-20', 'q-21', 'q-22', 'q-23'];
var currentQuestion, correctAnswer, incorrectAnswer, unanswered, seconds, time, answered, userSelect;
var messages = {
    correct: "Yes, that's right!",
    incorrect: "No, that's not it.",
    endTime: "Out of time!",
    finished: "Alright! Let's see how well you did."
}

$('#startBtn').on('click', function () {
    $(this).hide();
    newGame();
});

$('#startOverBtn').on('click', function () {
    $(this).hide();
    newGame();
});

function newGame() {
    $('#finalMessage').empty();
    $('#correctAnswers').empty();
    $('#incorrectAnswers').empty();
    $('#unanswered').empty();
    currentQuestion = 0;
    correctAnswer = 0;
    incorrectAnswer = 0;
    unanswered = 0;
    newQuestion();
}

function newQuestion() {
    $('#message').empty();
    $('#correctedAnswer').empty();
    $('#gif').empty();
    answered = true;

    //sets up new questions & answerOptions
    $('#currentQuestion').html('Question #' + (currentQuestion + 1) + '/' + quizzQuestions.length);
    $('.question').html('<h2>' + quizzQuestions[currentQuestion].question + '</h2>');
    for (var i = 0; i < 4; i++) {
        var choices = $('<div>');
        choices.text(quizzQuestions[currentQuestion].answerOptions[i]);
        choices.attr({
            'data-index': i
        });
        choices.addClass('thisChoice');
        $('.answerOptions').append(choices);
    }
    countdown();
    //clicking an answer will pause the time and setup answerPage
    $('.thisChoice').on('click', function () {
        userSelect = $(this).data('index');
        clearInterval(time);
        answerPage();
    });
}

function countdown() {
    seconds = 15;
    $('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
    answered = true;
    //sets timer to go down
    time = setInterval(showCountdown, 1000);
}

function showCountdown() {
    seconds--;
    $('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
    if (seconds < 1) {
        clearInterval(time);
        answered = false;
        answerPage();
    }
}

function answerPage() {
    $('#currentQuestion').empty();
    $('.thisChoice').empty();
    $('.question').empty();

    var rightAnswerText = quizzQuestions[currentQuestion].answerOptions[quizzQuestions[currentQuestion].answer];
    var rightAnswerIndex = quizzQuestions[currentQuestion].answer;
    $('#gif').html('<img src = "assets/images/' + gifArray[currentQuestion] + '.webp" width = "400px">');
    //checks to see correct, incorrect, or unanswered questions
    if ((userSelect == rightAnswerIndex) && (answered == true)) {
        correctAnswer++;
        $('#message').html(messages.correct);
    } else if ((userSelect != rightAnswerIndex) && (answered == true)) {
        incorrectAnswer++;
        $('#message').html(messages.incorrect);
        $('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
    } else {
        unanswered++;
        $('#message').html(messages.endTime);
        $('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
        answered = true;
    }

    if (currentQuestion == (quizzQuestions.length - 1)) {
        setTimeout(scoreboard, 5000)
    } else {
        currentQuestion++;
        setTimeout(newQuestion, 5000);
    }
}

// 
function scoreboard() {
    $('#timeLeft').empty();
    $('#message').empty();
    $('#correctedAnswer').empty();
    $('#gif').empty();

    $('#finalMessage').html(messages.finished);
    $('#correctAnswers').html("Correct Answers: " + correctAnswer);
    $('#incorrectAnswers').html("Incorrect Answers: " + incorrectAnswer);
    $('#unanswered').html("Unanswered: " + unanswered);
    $('#startOverBtn').addClass('reset');
    $('#startOverBtn').show();
    $('#startOverBtn').html('Start Over?');
}