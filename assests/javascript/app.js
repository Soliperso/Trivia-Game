var i = 0;
var txt = 'Ready, Set, Learn...'; /* The text */
var speed = 100; /* The speed/duration of the effect in milliseconds */

function typeWriter() { 
  if (i < txt.length) {
    document.getElementById("demo").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

const questions = [
    {
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
        question: 'California: According to STATE law, the only United States flah that CANNOT possibly be leggaly flown by a state agency has how many stars?',
        answerOptions: [50, 49, 46, 48],
        answer: 1
    },
    {
        question: 'Colorado: You may take how many PAID hours off from work to vote?',
        answerOptions: ['q, 2, 0, 3'],
        answer: 1
    },
    {
        question: 'Connecticut: A tavern may NOT self which of the following?',
        answerOptions: ['Hard cider', 'Beer', 'Wine', 'Whiskey'],
        answer: 3
    },
    {
        question: 'Delaware: Which of these scientists must must be licensed in order to practice in their field?',
        answerOptions: ['Biologist', 'Botanist', 'Geologist', 'Astronomer'],
        answer: 2
    },
    {
        question: 'Florida: Florida has some weird laws involving people dying intestate (without a will. Which of the following is NOT one of them?',
        answerOptions: ['If a child is conceived before the death of the parent yet is born  after the death of the parent, they get nothin',
                        'Being a holocaust victim can affect a person\'s status as an heir', 
                        'If the spouse has step-children, the spouse gets less of the inheritance than they would with only natural children',
                        'If there are no heirs, the inheritance eventually goes to the state\s School Fund'
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
                        'you apoligize afterwards'],
        answer: 1
    },
    {
        question: 'Idaho: Idaho makes it illegal for one spouse to abandon the other and leave the destitute. What is weird about this law?',
        answerOptions: ['The wife can be punished but the husband cannot.',
                        'The husband can be punished but the wife annot',
                        'Neither party can be punished', 
                        'Abondonment results in an automatic divorce'],
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
        question: 'Kansas: What is the militia of the State of Kansas?',
        answerOptions: ['The Kansas National Guatd', 
                        'Every man between 18 and 45 except those excluded by law',
                        'Citizens of Kansas in the US military', 
                        'Every resident of Kansas 21 or older except women of childbearing years'],
        answer: 1
    },
    {
        question: 'Kentucky: If you want to sell fowl under two months of age, what is the minumum number that you must sell?',
        answerOptions: [6, 3, 4, 5],
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
                        'Not filling an intent to commit suicide within 10 business days before committing suicide'],
        answer: 2
    },
    {
        question: 'Maryland: What is illegal to sell through vending machines at a nursery school?',
        answerOptions: ['Contraceptives', 'Cookies', 'Candy', 'Coffe'],
        answer:0
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
    },
    {
        question: 'Mississipi: Which of these fall under the legal definition of vegrants?',
        answerOptions: [
            'People who could work ro support themseleves and don\'t',
            'Professional gamblers',
            'Prostitutes',
            'All of the above'
        ],
        answer: 3
    },
   
];

alert('Connected');

// Start button clicked
$('.btn').click(function() {
    $(this).hide();
});
