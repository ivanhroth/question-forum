# Database Structure

## Tables

* Users
    * username - STRING(50)
    * hashedPassword - STRING.BINARY
    * email - STRING(100)

* Questions
    * userId - INTEGER
    * title - STRING(280)
    * message - TEXT

* Answers
    * questionId - INTEGER
    * userId - INTEGER
    * message - TEXT

## Example user

email: example@example.com
username: example
password: example

# User Stories

## Logging in

As a registered user, I want to log in so that I can ask and answer questions.

### Questions

* Will we use oauth?
    * Not for now, we may add it in later.

* Where should the user be redirected after login?
    * To the homepage ("/")

* What happens if the user doesn't exist?
    * Display "invalid login, please try again".

* What happens if the password is wrong?
    * Display "invalid login, please try again".

* What information will the user use to log in?
    * The user will log in with username and password.

* What routes will we use for login?
    * /users/log-in - GET to that path to see the login page, POST to that path to make a login attempt.

* Should there be an option to reset their password?
    * Not right now, may be added later.

* Should we use session- or token-based authentication?
    * Session-based authentication.

### Acceptance criteria

* User can visit the /users/log-in route and see a form to enter their username and password.

* After a user enters a valid username and password they're redirected to the home page.

* If a user enters an invalid username or password they receive the message "Invalid login, please try again"

* Refreshing the page after login maintains the user's session.


## Signing up

As an unregistered user, I want to create an account so that I can log in and ask and answer questions.

### Questions

* What information will the user need to enter to sign up?
    * Username, password, and email

* Where should the user be redirected after signing up?
    * To the home page; they should be automatically "signed in" after signing up.

* What happens if the user has signed up previously (using the same username or email)?
    * Display "username or email already in use" message

* What password requirements will we have?
    * Minimum length of 6 characters, at least one capital and one lowercase letter.

* What happens if a user's password isn't strong enough?
    * Display the message "Password not strong enough" and allow them to try entering a new one.

* Will the user be able to confirm their email?
    * Not right now, may be added as a bonus.

* What routes will be used for signup?
    * /users/sign-up - GET to this path displays the signup page, POST to that path makes a signup attempt.

* Will the user have to type their password twice?
    * Yes.


### Acceptance criteria

* User can visit the /users/sign-up route and see a form to enter their email, username, and password, and a field to confirm their password.

* After a user fills in valid information they'll be redirected to the home page, signed in.

* If a user enters a username or email that's already in use they receive the message "Username or email already in use".

* If a user enters a password that is less than six characters long they'll receive a "Password must be at least six characters" message.

* If a user enters a password that doesn't have at least one uppercase and one lowercase letter, they'll receive the message "Password must contain at least one uppercase and one lowercase letter"


## Asking a question

As a registered user, I want to post a question so that others can see my question and try to answer it.

### Questions

* What routes will be used to ask a question?
    * The /questions/ask route - GET to that route to view the question-asking form, POST to that route to post a question.

* What will the fields be on the question-asking form?
    * "Question" (title) and "Body" (message)

* Will the form page mention the length limit (280 characters) on the title?
    * Sure.

* Where will the user be redirected after posting a question?
    * To the page for the question they just posted (/questions/:id)

* What happens if the user tries to post a question with a title that is too long?
    * They'll receive a "Title is too long" message.

* What happens if the user tries to post a question with an empty title or an empty body?
    * They'll receive a message that says "Please provide a non-empty title and body".


### Acceptance criteria

* User can visit the /questions/ask route and see a form to enter a title ("Question") and message ("Body"), with a "Submit" button.

* After a user fills in a question and body and hits "Submit", the question will be posted and the user will be redirected to that question's newly-created page.

* If a user hits "Submit" with one of those two fields empty they will receive the message "Please provide a non-empty title and body".

* If a user hits "Submit" and the text in the title field is more than 200 characters, they'll receive the message "Title is too long."


## View a question page

As a user (who may be registered or unregistered), I want to view the page for a specific question so that I can see the full text of its body and what answers have been provided.

### Questions

* What routes will be used to view a question page?
    * A GET request to the path /questions/:id for the specific question's id should display that question's individual page.

* What will be displayed on a question's page?
    * The question's title and message body, the username of the person who posted it, any answers that have been provided so far (each with their own message content and username), and a form to post a new answer.

* Will a logged-out user be able to see the answer form?
    * Yes, but they won't be able to succesfully post an answer (see below).

* What order will the answers be displayed in?
    * Chronological order (newest to oldest).

### Acceptance criteria

* User can visit the /questions/:id route for a particular question id and see the question title, the question body, the username of the user who posted the question, a list of answers that have been provided so far (with message body and username for each answer), and a form to post a new answer.


## Answering a question

### Questions

* What routes will be used to answer a question?
    * The form to answer will be on the question page (/questions/:id), accessible with a GET request to /qurestions/:id, and a POST request to /questions/:id/answer path will be used to post the answer.

* What happens if a user who's not logged in tries to post an answer with the form?
    * They'll be redirected to the login page.


## Logging out


## Browse questions

