// code Javascript pour le Login

// sophie.bluel@test.tld
// S0phie 

const loginForm = document.querySelector(".login-form")
const error_message = document.getElementById("error_message")

// **** LOGIN FORM HANDLING *****

loginForm.addEventListener("submit", (event) => {
    
    event.preventDefault(); //empêche le reloading de la page
    console.log("envoi du formulaire effectué")

    const emailInput = document.getElementById("email")
    const passwordInput = document.getElementById("password")

    const email = emailInput.value
    const password = passwordInput.value

    emailInput.placeholder = ""  
    passwordInput.placeholder = ""

    // vérifier le remplissage des champs email et mot de passe
    // si champs vides, message d'erreur dans le placeholder et pas de fetch

    let errors = getLoginErrors(emailInput, passwordInput)

    if (errors.length > 0) {
        console.log(errors)
        return
    }

    // si pas d'erreur, envoi de la requête au serveur ->

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
    })
        .then((response) => {
            console.log("Login Response: ", response)
            if (response.status === 200) {
                return response.json()
            } else if (response.status === 401) {
                error_message.innerText = "E-mail et/ou mot de passe incorrect";
            } else if (response.status === 404) {
                error_message.innerText = "Utilisateur inconnu, merci de vérifier vos identifiants."
            } else {
                error_message.innerText = `Erreur: ${response.status}`
            }
        })
        .then((user) => {
            if (user) {
                console.log(user)
                sessionStorage.setItem("token", user.token)
                window.location.replace("../index.html")
            }
        })
        .catch((error) => console.error(error))
});

// indique une erreur lorsque le champ email ou mot de passe est vide

function getLoginErrors(emailInput, passwordInput) {
    let errors = []

    if (emailInput.value.trim() === "") {
        emailInput.placeholder = "E-mail requis"
        emailInput.classList.add("incorrect")
        errors.push("E-mail requis")
    }
    if (passwordInput.value.trim() === "") {
        passwordInput.placeholder = "Mot de passe requis"
        passwordInput.classList.add("incorrect")
        errors.push("Mot de passe requis")
    }
    return errors
}

// nettoyer les champs email et mot de passe après affichage d'une erreur

const allInputs = [document.getElementById("email"), document.getElementById("password")];
    allInputs.forEach((input) => {
        input.addEventListener("focus", () => {
            if (input.classList.contains("incorrect")) {
                input.placeholder = input.id === "email" ? "" : ""
                input.classList.remove("incorrect")
            }
        })

        input.addEventListener("input", () => {
            input.classList.remove("incorrect")
            input.placeholder = input.id === "email" ? "" : ""
        })
    });
