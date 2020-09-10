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
        answerBox.innerHTML = `<div class="card-body answer-box"><h5 class="card-title"><b>${user.username}</b> said:</h5><p>${message}</p></div>`;
        answersContainer.appendChild(answerBox);
    })

    document.getElementById("delete-question-button").addEventListener('click', async e => {
        try {
            await fetch(window.location.href, { method: 'DELETE' });
        } catch (e) {
            console.log(e);
        }
        console.log("Got here!");
        const homeURL = ['http:/', window.location.href.split('/')[2], 'questions'].join('/');
        console.log(homeURL);
        window.location.href = homeURL;
        // http: - localhost:8080
    })
});
