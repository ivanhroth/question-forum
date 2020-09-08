document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch(`${window.location.href}/answers`);
    const { answers, users } = await res.json();
    const answersContainer = document.getElementById("answers-container");
    answers.forEach(async (answer, i) => {
        const message = answer.message;
        const user = users[i];
        const answerBox = document.createElement("div");
        answerBox.innerHTML = `<h4>${user.username} said:</h4><p>${message}</p>`;
        answersContainer.appendChild(answerBox);
    })
})
