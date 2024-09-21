document.addEventListener("DOMContentLoaded", function () {

    const startQuiz = document.querySelector("#start");
    const instructionPage = document.querySelector(".instruction-page");
    const welcomeCandidateElement = document.querySelector(".welcomeCandidate span");

    const header = document.querySelector("header");
    const quizpage = document.querySelector("section");
    const answerBlock = document.querySelector(".ans-block");

    function Startquiz() {
        const name = document.querySelector('input[name="name"]').value.trim();

        if (name !== "") {
            instructionPage.style.display = "none";
            quizpage.style.display = "block";
            header.style.display = "flex";
            answerBlock.style.display = "none";

            welcomeCandidateElement.innerHTML = `${name}!`;

            getQuestionFromJson();
        }
    }

    startQuiz.addEventListener("click", Startquiz);

    // Question container classes
    const questionBlock = document.querySelector(".que-block");
    const quizDesc = document.querySelector(".quiz-desc");
    // const answerBlock = document.querySelector(".ans-block");

    const questionElement = document.querySelector(".question");
    const optionsElement = document.querySelector(".options");
    const nextButton = document.querySelector("#nextQue");
    const submitButton = document.querySelector("#submit-btn");
    const timeElement = document.querySelector("#Q-timer");                 // ---- start to uncomment this

    // Timer functionalities
    let timer;
    let timeLimit = 10;
    let timeLeft = timeLimit;

    // Score
    let score = 0;
    let currentQuestionIndex = 0;
    let questions = [];
    let submit = false;
    let skippedQuestions = [];
    let selectedQuestions = []; // Array to store selected questions

    async function getQuestionFromJson() {
        try {
            let response = await fetch("./data.json");

            if (!response.ok) {
                throw new Error("Failed to fetch questions!");
            }

            const data = await response.json();
            questions = data.questions;

            if (questions.length > 0) {
                displayQuestion(currentQuestionIndex);
            } else {
                console.error("No questions found!");
            }
        } catch (error) {
            console.log("Error", error);
        }
    }
    async function displayQuestion() {


        if (currentQuestionIndex >= questions.length) {
            if (!submit) {
                endQuiz();
            }
            clearInterval(timer);
            return;
        }

        if (currentQuestionIndex === questions.length - 1) {
            nextButton.style.display = "none";
            submitButton.style.display = "block";
            submitButton.disabled = true;

            optionsElement.addEventListener("change", () => {
                submitButton.disabled = false;
            }, { once: true });
        } else {
            nextButton.style.display = "block";
            submitButton.style.display = "none";
        }

        const question = questions[currentQuestionIndex];
        questionElement.textContent = `${currentQuestionIndex + 1}. ${question.question}`;
        optionsElement.innerHTML = "";

        question.options.forEach((option) => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="radio" name="option" value="${option}"><span> ${option}</span>`;
            optionsElement.appendChild(label);
            // optionsElement.appendChild(document.createElement("br"));
        });

        timeLeft = timeLimit;
        timeElement.textContent = `Timer: ${timeLeft}`;
        startTimer();

        optionsElement.addEventListener("change", () => {
            nextButton.disabled = false;
        }, { once: true });
        // nextButton.disabled = true;
    }

    function startTimer() {
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;

            if (timeLeft < 10) {
                timeElement.textContent = `Timer: 0${timeLeft}`;
            } else {
                timeElement.textContent = `Timer: ${timeLeft}`;
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeOut();
            }
        }, 1000);
    }

    function handleTimeOut() {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption) {
            if (selectedOption.value === questions[currentQuestionIndex].correctAnswer) {
                score++;
                // goToNextQuestion();
            }
            selectedQuestions.push({
                question: questions[currentQuestionIndex].question,
                selectedOption: selectedOption.value,
                correctAnswer: questions[currentQuestionIndex].correctAnswer
            });
        } else {
            skipQueArr();
        }

        if (currentQuestionIndex === questions.length - 1) {
            endQuiz();
        } else {
            goToNextQuestion();
        }
    }

    function skipQueArr() {
        const skippedQuestion = {
            question: questions[currentQuestionIndex].question,
            options: questions[currentQuestionIndex].options
        };

        skippedQuestions.push(skippedQuestion);
        displayQuestion();
    }

    function goToNextQuestion() {
        nextButton.disabled = "true"
        currentQuestionIndex++;
        displayQuestion();
    }

    function endQuiz() {
        clearInterval(timer);  // Stop the timer permanently when the quiz ends

        displayScore();
    }


    nextButton.addEventListener("click", () => {
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (!selectedOption) {
            skipQueArr();
            return;
        }

        if (selectedOption.value === questions[currentQuestionIndex].correctAnswer) {
            score++;
        }
        selectedQuestions.push({
            question: questions[currentQuestionIndex].question,
            selectedOption: selectedOption.value,
            correctAnswer: questions[currentQuestionIndex].correctAnswer
        });

        goToNextQuestion();
    });

    submitButton.addEventListener("click", () => {
        submit = true;
        const selectedOption = document.querySelector('input[name="option"]:checked');
        if (selectedOption && selectedOption.value === questions[currentQuestionIndex].correctAnswer) {
            score++;
        }

        selectedQuestions.push({
            question: questions[currentQuestionIndex].question,
            selectedOption: selectedOption ? selectedOption.value : null,
            correctAnswer: questions[currentQuestionIndex].correctAnswer
        });

        endQuiz();
    });

    function displayScore() {
        questionBlock.style.display = "none";
        answerBlock.style.display = "block";
        quizDesc.style.display = "none";

        const name = document.querySelector('input[name="name"]').value.trim();

        header.innerHTML = `${name} Your score: ${score}/${questions.length}`;
        header.style.justifyContent = "space-around";
        header.style.padding = "15px";


        // Display only the selected questions stored in selectedQuestions array
        selectedQuestions.forEach((selectedQuestion, index) => {
            const questionContainer = document.createElement("div");
            questionContainer.classList.add("question-summary");

            const questionText = document.createElement("h3");
            questionText.textContent = `${index + 1}. ${selectedQuestion.question}`;
            questionContainer.appendChild(questionText);

            // Iterate through the options of the selected question
            questions.forEach(question => {
                if (question.question === selectedQuestion.question) {
                    question.options.forEach(option => {
                        const optionLabel = document.createElement("label");
                        optionLabel.classList.add("option");


                        if (option === question.correctAnswer) {
                            optionLabel.classList.add("correct-answer");
                            optionLabel.innerHTML = `<input type="radio" disabled ${option === selectedQuestion.selectedOption ? 'checked' : ''}> <span>${option}</span>`;
                        } else if (option === selectedQuestion.selectedOption) {
                            optionLabel.classList.add("incorrect-answer");
                            optionLabel.innerHTML = `<input type="radio" disabled checked> <span>${option}</span>`;
                        } else {
                            optionLabel.classList.add("white-background");
                            optionLabel.innerHTML = `<input type="radio" disabled> <span>${option}</span>`;
                        }

                        questionContainer.appendChild(optionLabel);


                    });
                }
            });

            answerBlock.appendChild(questionContainer);
        });

        // Display skipped questions (optional)
        if (skippedQuestions.length > 0) {
            const skippedQuestionsContainer = document.createElement("div");
            skippedQuestionsContainer.classList.add("skipped-questions-summary");

            const skippedQuestionsHeader = document.createElement("h3");
            skippedQuestionsHeader.textContent = "Skipped Questions:";
            skippedQuestionsContainer.appendChild(skippedQuestionsHeader);

            skippedQuestions.forEach((skippedQuestion, index) => {
                const skippedQuestionContainer = document.createElement("div");
                skippedQuestionContainer.classList.add("skipped-question-summary");

                const skippedQuestionText = document.createElement("h4");
                skippedQuestionText.textContent = `${index + 1}. ${skippedQuestion.question}`;
                skippedQuestionContainer.appendChild(skippedQuestionText);

                skippedQuestion.options.forEach(option => {
                    const skippedOptionLabel = document.createElement("label");
                    skippedOptionLabel.classList.add("option");
                    skippedOptionLabel.innerHTML = `<input type="radio" disabled> <span>${option}</span>`;
                    skippedQuestionContainer.appendChild(skippedOptionLabel);
                });

                skippedQuestionsContainer.appendChild(skippedQuestionContainer);
            });

            answerBlock.appendChild(skippedQuestionsContainer);
        }
    }
});
