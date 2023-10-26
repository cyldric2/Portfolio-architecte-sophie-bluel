 //apparition des éditeurs//
let d1 = document.getElementById("editor");
let d2 = document.getElementById("d2");
function editor() {
    if (getComputedStyle(d1).display != "none") {
        d1.style.display = "none";
        console.log(d1.style.display);
    }
}
            


const btn = document.querySelector("#bouton-conect")
btn.addEventListener("click", (e) => {
    e.preventDefault()
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
//récupéré les donner api//
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            accept: "application/json",
            "Content-Type" : "application/json"
        },
        //récupérer et transformer en format json//
        body: JSON.stringify({
            email: email,
            password: password,
        })
    })
        //verification d email et mot de passe //
    .then(response => {
        if (response.status === 200) {
            return response.json()
         } else {
             let messageErreur=document.getElementById("message-erreur")
             messageErreur.innerHTML = "Email ou mot de passe erroné";
             console.log(messageErreur);
             return
         }
     })
    .then(data => {
        window.localStorage.setItem("token", data.token)
        window.location.href = "index.html"
    })
})

  