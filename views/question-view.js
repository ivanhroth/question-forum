document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch(`${window.location.href}/answers`);
    const { answers } = await res.json();
    const answersContainer = document.getElementById("answers-container");
    console.log(answersContainer);
    console.log(answers);
    answers.forEach(async answer => {
        console.log(answer);
        const message = answer.message;
        const user = answer.user;
        const answerBox = document.createElement("div");
        answerBox.innerHTML = `<h4>${user.username} said:</h4><p>${message}</p>`;
        console.log(answerBox);
        answersContainer.appendChild(answerBox);
    })
})
