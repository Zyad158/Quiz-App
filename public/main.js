let canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    theGradient = ctx.createLinearGradient(0, 0, 70, 0),
    w = canvas.width,
    h = canvas.height;

const question = document.getElementById("question");
const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const label3 = document.getElementById("label3");
const label4 = document.getElementById("label4");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const answers =  document.querySelectorAll("input[name='answer']");
const questionNumber = document.getElementById("question-number");
const main = document.querySelector("main");
const timer = document.getElementById("timer")
const progressBar = document.getElementById("progress-bar");
let currentQuestion = 0;
let timeLeft = 600;
let userAnswers = [];
const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            "Hyper Text Markup Language",
            "Home Tool Markup Language",
            "Hyperlinks Text Markup Language",
            "Hyper Tool Multi Language"
        ],
        correct: 0
        
    },
    {
        question: "Which language is used for styling web pages?",
        answers: [
            "HTML",
            "CSS",
            "Python",
            "Java"
        ],
        correct: 1
    },
    {
        question: "What does CSS stand for?",
        answers: [
            "Computer Style Sheets",
            "Creative Style System",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correct: 2
    },
    {
        question: "Which language is used to make web pages interactive?",
        answers: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        correct: 2
    },
    {
        question: "Which HTML tag is used to create a hyperlink?",
        answers: [
            "<link>",
            "<a>",
            "<href>",
            "<url>"
        ],
        correct: 1
    },
    {
        question: "Which CSS property changes text color?",
        answers: [
            "font-color",
            "text-color",
            "color",
            "background-color"
        ],
        correct: 2
    },
    {
        question: "Which company developed JavaScript?",
        answers: [
            "Microsoft",
            "Google",
            "Netscape",
            "Apple"
        ],
        correct: 2
    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        answers: [
            "//",
            "**",
            "##",
            "<!-- -->"
        ],
        correct: 0
    },
    {
        question: "What does API stand for?",
        answers: [
            "Application Programming Interface",
            "Application Process Integration",
            "Advanced Program Internet",
            "Automated Programming Interface"
        ],
        correct: 0
    },
    {
        question: "Which method is used to select an element by ID in JavaScript?",
        answers: [
            "querySelectorAll()",
            "getElementById()",
            "getElementsByClassName()",
            "selectElement()"
        ],
        correct: 1
    }
]

theGradient.addColorStop(0, "blue")
theGradient.addColorStop(1, "#008b8b")
ctx.strokeStyle = theGradient
ctx.font = "bold 60px Arial"
ctx.strokeText("QA", 3, 55)

answers.forEach((answer, index) => {
    answer.addEventListener("change", () => {
        userAnswers[currentQuestion] = index;

        document.querySelectorAll(".answers span").forEach((span) => {
            span.classList.remove("selected");
        })
        answer.parentElement.classList.add("selected")
    })
})

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function updateProgressBar () {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`
}


function showQuestion () {
    questionNumber.textContent = `
    Question ${currentQuestion +1} of ${questions.length}`
    question.textContent = questions[currentQuestion].question;
    label1.textContent = questions[currentQuestion].answers[0];
    label2.textContent = questions[currentQuestion].answers[1];
    label3.textContent = questions[currentQuestion].answers[2];
    label4.textContent = questions[currentQuestion].answers[3];

    answers.forEach((answer) => {
        answer.checked = false
    })
    
    document.querySelectorAll(".answers span").forEach((span) => {
        span.classList.remove("selected");
    })

    if (userAnswers[currentQuestion] !== undefined) {
        answers[userAnswers[currentQuestion]].checked = true;
        answers[userAnswers[currentQuestion]].parentElement.classList.add("selected");
    }

    updateProgressBar()
}


function displayBackBtn () {
    if (currentQuestion === 0) {
        backBtn.style.display = "none";
    }else {
        backBtn.style.display = "inline-block";
    }
}

function calculateScore () {
    let score = 0;

    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correct) {
            score++
        }
    })

    return score;
}

function correctAnswers() {
    let reviewHtml = "";

    questions.forEach((q, index) => {
        const userAnswer =
            userAnswers[index] !== undefined
                ? q.answers[userAnswers[index]]
                : "No Answer";

        const correctAnswer =
            q.answers[q.correct]

        if (userAnswers[index] === q.correct) {
            reviewHtml += `
            <div class="review-card correct">
                <h3>✅ Question ${index + 1}</h3>
                <p>${escapeHtml(userAnswer)}</p>
            </div>`;
        } else {
            reviewHtml += `
            <div class="review-card wrong">
                <h3>❌ Question ${index + 1}</h3>

                <p>
                    <strong>Your Answer:</strong>
                    ${escapeHtml(userAnswer)}
                </p>

                <p>
                    <strong>Correct Answer:</strong>
                    ${escapeHtml(correctAnswer)}
                </p>
            </div>`;
        }
    });

    return reviewHtml;
}

const interval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60

    timer.textContent = 
    `${minutes}:${seconds.toString().padStart(2, "0")}`;

    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(interval);
        const finalScore = calculateScore();

        main.innerHTML = `
        <h2>⏰ Time's Up!</h2>
        <h3>Yor Score: ${finalScore}/ ${questions.length}</h3>
        ${correctAnswers()}
        <button class="restart-btn" id="restart-btn">Restart Quiz</button>`;
        const restartBtn = document.getElementById("restart-btn");
        restartBtn.addEventListener("click", () => {
            location.reload();
        });
    }

    if (timeLeft <= 10) {
        timer.style.color = "red"
    }
}, 1000);


showQuestion();
displayBackBtn()

nextBtn.addEventListener("click", () => {
    let selectedAnswer;
    answers.forEach((answer, index) => {
        if (answer.checked) {
            selectedAnswer = index;
        }
    });

    if (selectedAnswer === undefined) {
        alert("Please Choose Answer");
        return;
    }

    currentQuestion++;
    displayBackBtn()

    answers.forEach((answer) => {
    answer.checked = false;
    document.querySelectorAll(".answers span").forEach((span) => {
        span.classList.remove("selected")
    })
})

    if (currentQuestion < questions.length) {
        main.classList.add("slide-in")
        setTimeout(() => {
            showQuestion();
            main.classList.remove("slide-in")
        }, 300);
    }else {
        clearInterval(interval)
        const finalScore = calculateScore();
        main.innerHTML = `
        <h2>🎉 Quiz Finished!</h2>
        <h3>Yor Score: ${finalScore}/ ${questions.length}</h3>
        ${correctAnswers()}
        <button class="restart-btn" id="restart-btn">Restart Quiz</button>`
        const restartBtn = document.getElementById("restart-btn");
        restartBtn.addEventListener("click", () => {
            location.reload();
        })
    }

})


backBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--
        main.classList.add("slide-out")
        setTimeout(() => {
            showQuestion();
            main.classList.remove("slide-out")
        }, 300);
        displayBackBtn()
    }
})