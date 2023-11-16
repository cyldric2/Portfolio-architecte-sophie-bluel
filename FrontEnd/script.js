
//creation works image et titre importation API//
let gallery = document.getElementById("gal")
let data = []

function creatWorks(imageUrl, title) {
    const works = `<figure>
				<img src="${imageUrl}" alt="${title}">
				<figcaption>${title}</figcaption>
			</figure>`
    gallery.innerHTML += works
   
}
const fetchWorks= async () => {
    await fetch("http://localhost:5678/api/works")
        .then( (r)=> r.json())
        .then((promise) => {
            data = promise 
            for (let item of data) {
                creatWorks(item.imageUrl, item.title)
            }
        })
}
fetchWorks()


//creation categories filtre de travaux//
let filtre = document.getElementById("filtre")
let filtreModal = document.getElementById("modal-filtre")
function creatCategories(name, id) {
    const categories = `<button class=" dots " id=${id}>${name}</button>`
    filtre.innerHTML += categories
    const categoriesModale = `<option id=${id} value="${name}">${name}</option>`
   filtreModal.innerHTML += categoriesModale
}
function dot_selected(categories,index) {
	for (let i of categories) {
		i.classList.remove("dot_selection")	
    }
	index.classList.add("dot_selection")
	
}
function categoriesEvent() {
    const categories = document.querySelectorAll(".dots")
    categories.forEach(item => {
        item.addEventListener("click", () => {
            dot_selected(categories,item)
            const id = parseInt(item.id)
            let dataFilter = []
            if (id===0) {
                dataFilter=data
            }
            else {
                dataFilter=data.filter(projet=>projet.categoryId===id)
            }
   gallery.innerHTML=""
              for (let item of dataFilter) {
                creatWorks(item.imageUrl,item.title)
            }
        })
    })
}
   
const fetchCategories= async () => {
    await fetch("http://localhost:5678/api/categories")
        .then( (r)=> r.json())
        .then((promise) => {
            let data = promise
          for (let item of data) {
              creatCategories(item.name, item.id)
            }
            categoriesEvent()
        })
}
fetchCategories()

//apparition des éditeurs//

let alldesactiv = document.querySelectorAll(".desactiv")
let cles = window.localStorage.getItem("token")
let d1 = document.getElementById("filtre")
let d2 = document.getElementById("loginoff")

function editor(data) {
    if (cles) {
        alldesactiv.forEach(item => {
            item.classList.remove("desactiv")
            item.classList.add("activ")
            d1.style.display = "none";
             d2.style.display = "none";
        })
    } else {
        alldesactiv.forEach(item => {
            item.classList.remove("activ")
            item.classList.add("desactiv")
            d1.style.display = "block";
            d2.style.display = "block";
        })
    }
}
editor()

///creation logout//
let logout = document.getElementById("logout")
logout.addEventListener("click", () => {
   window.localStorage.clear("token")
})

//fenêtre modale//
const modalContainer = document.querySelector(".modal-container")
const modalTrigger = document.querySelectorAll(".modal-trigger")
const btnPhoto =document.getElementById("btn-photo")
const modalPhoto = document.querySelector(".modal-photo")
const modal2 = document.querySelector(".modal2")
const fileInput = document.getElementById("file-input")
const erreur = document.getElementById("erreur")
const btnValider = document.getElementById("btn-valider-modal2")
const btnRetour = document.querySelector(".btn-retour")
const erreurModal = document.getElementById("erreur-modal")
const sup= document.querySelector(".sup")

//enclencher=trigger//
modalTrigger.forEach(trigger => trigger.addEventListener("click", toggleModal))
function toggleModal() {
    modalContainer.classList.toggle("active")
    imageModale()
    //modale 2ieme page ajout photo//
    btnPhoto.addEventListener("click", () => {
        modalPhoto.classList.toggle("desactive")
        modal2.classList.toggle("active")
    })
    //désactiver modale 2 flèche retour//
    btnRetour.addEventListener("click", () => {
        modalPhoto.classList.remove("desactive")
        modal2.classList.remove("active")
    })
    //insérer image modale 2//
    fileInput.addEventListener("change", ()=> {
        file = fileInput.files[0]
        afficheImg()
        sup.classList.toggle("desactive")
         sup.classList.remove("active")
    })
    
    //ajouter image après téléchargement modal2//
  
    modal2Form.addEventListener("submit",enregistrerImag )
}

 

//image modale//
function imageModale() {
    let galModale = document.getElementById("gal-mod")
    let i = data.length
    galModale.innerHTML = ""
    for (let i = 0; i < data.length; i++) {
        image = data[i].imageUrl
        title = data[i].title
        id = data[i].id
        const works = `<figure id="${id}">
                    <i class="fa-solid fa-trash-can poubelle"id="btn-sup " data-id="${id}" onClick="deletePost(${id})"></i>
		            <img src="${image}" alt="${title}">
	                </figure>`
        galModale.innerHTML += works

    }
}
function imageGalerie() {
    let gal = document.getElementById("gal")
    gal.innerHTML=""
     for (let item of data) {
                creatWorks(item.imageUrl, item.title)
            }
}
//fonction supprimer image activer dans fonction image modale const works//  
function deletePost(id) {
    let token = window.localStorage.getItem("token") 
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }) 
        .then(response => {
          console.log(response.status);
            if (response.status === 204) {
                data = data.filter(element => element.id != id)
                imageModale()
                imageGalerie()
            } else {
                erreurModal.innerHTML="Erreur"
            }
        })
}

function afficheImg(){
    let resultat = document.querySelector("#resultat")
    if (file !=null) {
        let fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.addEventListener("load", () => {
            resultat.setAttribute("src", fileReader.result)
        })
    }
     else {erreur.innerHTML="Erreur fichier image"
        }
}
 
//ajouter image après téléchargement modal2//
let imagValue= fileInput.value
let titreValue = titre.value
let categorieValue = filtreModal.value
const modal2Form=document.getElementById("modal2-form")
function enregistrerImag(e) {
    e.preventDefault()
    const formData = new FormData(modal2Form)
    const image = formData.get("file-input")
    const titre = formData.get("titre")
    const categorie = formData.get("categorie")
    console.log("categorie", categorie);
    formData.append("image", image)
    formData.append("title", titre)
    formData.append("category", categorie)
    console.log(formData.get("image"));
    console.log(formData.get("title"));
    console.log(formData.get("category"));

    let token = window.localStorage.getItem("token") 
    if (image !=null,titre!=null,categorie!="categorie") {
        fetch("http://localhost:5678/api/works/", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            //verification //
        .then(response => {
            if (response.status === 201) {
                erreur.innerHTML = "Envoyer";
                return response.json()
            } else {
                erreur.innerHTML = "Erreur";
                return
            }
        })
    }
 }