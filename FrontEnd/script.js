
//creation works image et titre importation API//
let gallery = document.getElementById("gal")
let data = []

function creatWorks(imageUrl, title) {
    const works = `<figure>
				<img class="image" src="${imageUrl}" alt="${title}">
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
    const categoriesModale = `<option id=${id} value="${id}">${name}</option>`
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
const modal2Form=document.getElementById("modal2-form")
//enclencher=trigger//
modalTrigger.forEach(trigger => trigger.addEventListener("click", toggleModal))
function toggleModal() {
    modalContainer.classList.toggle("active")
    imageModale()
    //modale 2ieme page ajout photo//
    btnPhoto.addEventListener("click", () => {
        modalPhoto.classList.toggle("desactive")
        modal2.classList.toggle("active")
        erreur.innerHTML= " "
    })
    //désactiver modale 2 flèche retour//
    btnRetour.addEventListener("click", () => {
        modalPhoto.classList.remove("desactive")
        modal2.classList.remove("active")
        modal2Form.reset()
        sup.classList.toggle("active")
        sup.classList.remove("desactive")
        resultat.setAttribute("src", "")
        imageModale()
    })
    //insérer image modale 2//
    fileInput.addEventListener("change", () => {
        file = fileInput.files[0]
        //fichier max 4mo
        var fileLimit = 100;
        let files = fileInput.files; 
        let fileSize = files[0].size; 
        let fileSizeInKB = (fileSize / 4000);
        if(fileSizeInKB < fileLimit){
            afficheImg()  
             verifFormulaire()
            sup.classList.toggle("desactive")
            sup.classList.remove("active")
            erreur.innerHTML= " "
        } else {
            erreur.innerHTML= "votre fichier fait plus de 4 mo "
        }
    })
    modal2Form.addEventListener("submit", enregistrerImag)
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
		            <img  class="imag" src="${image}" alt="${title}">
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
  let resultat = document.querySelector("#resultat")
function afficheImg(){
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

const titre = document.getElementById("titre")
const categorie = document.getElementById("modal-filtre")
    
titre.addEventListener("change", verifFormulaire)
categorie.addEventListener("change", verifFormulaire)

function verifFormulaire() {
    const image = document.getElementById("file-input").files[0]
    console.log(image);
        console.log(titre.value);
    if (image != undefined && titre.value != null && categorie.value > 0) {
        btnValider.classList.remove("btn-gris")
        btnValider.classList.add("btn-vert")
    } else {
        btnValider.classList.add("btn-gris")
        btnValider.classList.remove("btn-vert")
    }

}
function enregistrerImag(e) {
    e.preventDefault()
     const image = document.getElementById("file-input").files[0]
    const titre = document.getElementById("titre").value
    const categorie = document.getElementById("modal-filtre").value
 
       
    const formData = new FormData()
    formData.append("image", image)
    formData.append("title", titre)
    formData.append("category", categorie)

    let token = window.localStorage.getItem("token")
    if (image != undefined && titre != null && categorie > 0) {
            erreur.innerHTML = "";
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            //verification //
            .then(response => {
                if (response.status === 201) {
                     gallery.innerHTML= ""
                    fetchWorks()
                    erreur.innerHTML = "Envoyer";
                    modal2Form.reset()
                    sup.classList.toggle("active")
                    sup.classList.remove("desactive")
                    resultat.setAttribute("src","")

                    return response.json()
                } else {
                    
                    return
                }
            })
    } else {
            erreur.innerHTML = "Veuillez remplir tous les champs";
    } 

      
 }