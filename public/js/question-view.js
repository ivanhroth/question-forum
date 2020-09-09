document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch(`${window.location.href}/answers`);
    const { answers, users } = await res.json();
    const answersContainer = document.getElementById("answers-container");
    answers.forEach((answer, i) => {
        const message = answer.message;
        const user = users[i];
        const answerBox = document.createElement("div");
        answerBox.classList.add("card");
        //answerBox.classList.add("panel-default");
        answerBox.innerHTML = `<div class="card-body"><h5 class="card-title"><b>${user.username}</b> said:</h5><p>${message}</p></div>`;
        answersContainer.appendChild(answerBox);
    })
})
