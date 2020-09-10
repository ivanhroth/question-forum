document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch(`${window.location.href}/answers`);
    const { answers, users, currentUserId } = await res.json();
    const answersContainer = document.getElementById("answers-container");
    answers.forEach((answer, i) => {
        const message = answer.message;
        const user = users[i];
        const answerBox = document.createElement("div");
        answerBox.classList.add("card");
        let button;
        if (user.id === currentUserId){
            button = `<button type="submit" class="btn btn-danger delete-answer-button" id=${answer.id}>Delete answer</button>`; // the "id" attribute of the "delete answer" button is the id number of the answer that clicking on it will delete
        } else button = "";
        //answerBox.classList.add("panel-default");
        answerBox.innerHTML = `<div class="card-body answer-box"><h5 class="card-title"><b>${user.username}</b> said:</h5><p>${message}</p>${button}</div>`;
        answersContainer.appendChild(answerBox);
    })

    if (document.querySelectorAll("#delete-question-button").length > 0) {
        document.getElementById("delete-question-button").addEventListener('click', async e => {
            try {
                await fetch(window.location.href, { method: 'DELETE' });
            } catch (e) {
                console.log(e);
            }
            const homeURL = ['http:/', window.location.href.split('/')[2], 'questions'].join('/'); // redirects to the questions list without referencing "localhost" by modifying the current URL
            window.location.href = homeURL;
        })
    }

    document.querySelectorAll(".delete-answer-button").forEach(button => button.addEventListener("click", async event => {
        try {
            await fetch(`${window.location.href}/answers/${event.target.id}`, { method: "DELETE" });
            window.location.reload(true);
        } catch (e){
            console.log(e);
        }
    }))

});
