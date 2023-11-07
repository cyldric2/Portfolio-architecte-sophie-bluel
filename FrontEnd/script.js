
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
const btnRetour = document.querySelector(".btn-retour")

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
        file = fileInput.files
        afficheImg()
       /* if (file.length === 1) {
            console.log(file);
            let fileReader = new FileReader()
            fileReader.onload=function(event) {
                document
                    .getElementById("resultat")
                    .setAttribute("scr", event.target.result);
            }
            console.log(fileReader);
            fileReader.readAsDataUrl(file[0])
        }
        else {console.log(file);
            console.log(fileInput);
            erreur.innerHTML="Erreur fichier image"
        }*/
    })
    //supprimer image//
    const btnSup = document.querySelectorAll(".poubelle")
    btnSup.forEach(btn => {
        btn.addEventListener("click", () => {
            id = btn.getAttribute("data-id")
            console.log(id); 
            deletePost()
        })
    })  
    //ajouter image après téléchargement modal2//
    const ajoutImag = document.getElementById("ajout-image")
    function téléchargement(params) {
        
    }
    
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
                    <i class="fa-solid fa-trash-can poubelle"id="btn-sup " data-id="${id}"></i>
		            <img src="${image}" alt="${title}">
	                </figure>`
        galModale.innerHTML += works
    }
}

//fonction supprimer image//  
function deletePost() {
    console.log(id);
    fetch("http://localhost:5678/api/works/${id}", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
    
        }
    }) 
      .then(response => {
            if (response.status === 200) {
                return response.json()
                 console.log(reponse.json());
            } else {
                console.log(reponse.json());
                return
            }
        })
}

function afficheImg(){
    let resultat = document.querySelector("#resultat")
    if (file.length === 1) {
        console.log(file);
        let fileReader = new FileReader()
        console.log(fileReader);
        fileReader.onload = function (event) {
            document
                .getElementById("resultat")
                .setAttribute("scr", event.target.result);
        }
        console.log(fileReader);
        fileReader.readAsDataUrl(file[0])
    }
}