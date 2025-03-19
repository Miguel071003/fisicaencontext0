// Obtener todos los elementos requeridos
const start__btn = document.querySelector(".start__btn button");
const info__box = document.querySelector(".info__box");
const exit__btn = info__box.querySelector(".buttons .quit");
const continue__btn = info__box.querySelector(".buttons .restart");
const quiz__box = document.querySelector(".quiz__box");
const result__box = document.querySelector(".result__box");
const timeCount = quiz__box.querySelector(".timer .timer__sec");
const timeLine = quiz__box.querySelector(".quiz__header .time__line");
const option__list = document.querySelector(".option__list");
const next__btn = quiz__box.querySelector(".next__btn");
const restart__btn = result__box.querySelector(".restart");

let que__count = 0;
let que__numb = 1;
let counter;
let counterLine;
let timeValue = 15;
let widthValue = 0;
let score = 0; // Contador de respuestas correctas

// Botón de inicio
start__btn.onclick = () => {
    info__box.classList.add("activeInfo");
};

// Salir del quiz
exit__btn.onclick = () => {
    info__box.classList.remove("activeInfo");
};

// Iniciar el quiz
continue__btn.onclick = () => {
    info__box.classList.remove("activeInfo");
    quiz__box.classList.add("activeQuiz");
    resetQuiz();
};

// Botón siguiente
next__btn.onclick = () => {
    if (que__count < questions.length - 1) {
        que__count++;
        que__numb++;
        showQuestions(que__count);
        queCounter(que__numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
    } else {
        showResult();
    }
};

// Mostrar preguntas
function showQuestions(index) {
    const que__text = document.querySelector(".que__text");
    let que__tag = `<span>${questions[index].numb}. ${questions[index].question}</span>`;
    let option__tag = questions[index].options.map(option =>
        `<div class="option">${option}</div>`
    ).join("");

    que__text.innerHTML = que__tag;
    option__list.innerHTML = option__tag;

    next__btn.classList.add("disabled");

    const options = option__list.querySelectorAll(".option");
    options.forEach(opt => {
        opt.onclick = () => optionSelected(opt);
    });
}

let tickIcon = '<div class="icon tick"><img src="icons/icon3.png"></div>';
let crossIcon = '<div class="icon cross"><img src="icons/icon4.png"></div>';

// Manejar la selección de respuestas
function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);

    let userAns = answer.textContent.trim();
    let correctAns = questions[que__count].answer.trim();
    let allOptions = option__list.children.length;

    if (userAns === correctAns) {
        score++; // Aumenta el puntaje si la respuesta es correcta
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIcon);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIcon);

        for (let i = 0; i < allOptions; i++) {
            if (option__list.children[i].textContent.trim() === correctAns) {
                option__list.children[i].classList.add("correct");
                option__list.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }

    for (let i = 0; i < allOptions; i++) {
        option__list.children[i].classList.add("disabled");
    }

    next__btn.classList.remove("disabled");
}

// Temporizador
function startTimer(time) {
    timeCount.textContent = time;
    counter = setInterval(() => {
        time--;
        timeCount.textContent = time < 10 ? "0" + time : time;
        if (time <= 0) {
            clearInterval(counter);
            timeCount.textContent = "00";
            autoSelectWrong();
        }
    }, 1000);
}

// Línea de tiempo
function startTimerLine(time) {
    counterLine = setInterval(() => {
        time += 1;
        timeLine.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }, 29);
}

// Selección automática de respuesta incorrecta al acabarse el tiempo
function autoSelectWrong() {
    let correctAns = questions[que__count].answer.trim();
    let allOptions = option__list.children.length;

    for (let i = 0; i < allOptions; i++) {
        let option = option__list.children[i];
        if (option.textContent.trim() === correctAns) {
            option.classList.add("correct");
            option.insertAdjacentHTML("beforeend", tickIcon);
        } else {
            option.classList.add("incorrect");
            option.insertAdjacentHTML("beforeend", crossIcon);
        }
        option.classList.add("disabled");
    }

    next__btn.classList.remove("disabled");
}

// Actualizar contador de preguntas
function queCounter(index) {
    const bottom_ques_counter = quiz__box.querySelector(".total__que");
    bottom_ques_counter.innerHTML = `<span><p>${index}</p> de <p>${questions.length}</p> Preguntas</span>`;
}

// Mostrar resultado
function showResult() {
    const quizBox = document.querySelector('.quiz__box');
    const resultBox = document.querySelector('.result__box');
    
    // Ocultar el quiz y mostrar el resultado
    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");

    // Mostrar la caja de resultados con animación
    resultBox.style.opacity = '1';
    resultBox.style.pointerEvents = 'auto';
    resultBox.style.transform = 'translate(-50%, -50%) scale(1)';

    const scoreText = resultBox.querySelector(".score__text");
    
    // Definir el mensaje según el puntaje
    let message = "";
    if (score === questions.length) {
        message = "¡Excelente trabajo! Has respondido todas correctamente. 🎉";
    } else if (score > questions.length / 2) {
        message = "¡Bien hecho! Pero puedes mejorar. 👍";
    } else {
        message = "¡Sigue practicando! Puedes hacerlo mejor. 💪";
    }

    // Mostrar el mensaje y el puntaje final
    scoreText.innerHTML = `<span>${message}<br>Has obtenido <p>${score}</p> de <p>${questions.length}</p></span>`;
}

// Función para cerrar el resultado y volver al inicio del quiz
function closeResult() {
    const quizBox = document.querySelector('.quiz__box');
    const resultBox = document.querySelector('.result__box');

    // Ocultar la caja de resultados y mostrar el quiz nuevamente
    resultBox.style.opacity = '0';
    resultBox.style.pointerEvents = 'none';
    resultBox.style.transform = 'translate(-50%, -50%) scale(0.9)';
    
    // Mostrar la caja del cuestionario
    quizBox.classList.add("activeQuiz");
}

// Asignar el evento al botón para cerrar
const closeButton = document.querySelector('.close__result');
if (closeButton) {
    closeButton.addEventListener('click', closeResult);
}

// Reiniciar el quiz
restart__btn.onclick = () => {
    result__box.classList.remove("activeResult");
    quiz__box.classList.add("activeQuiz");
    resetQuiz();
};

// Función para reiniciar el quiz
function resetQuiz() {
    que__count = 0;
    que__numb = 1;
    score = 0;
    timeValue = 15;
    widthValue = 0;
    showQuestions(que__count);
    queCounter(que__numb);
    startTimer(timeValue);
    startTimerLine(widthValue);
}
