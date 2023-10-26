
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
function creatCategories(name,id) {
    const categories = `<button class=" dots " id=${id}>${name}</button>`
   filtre.innerHTML += categories
    
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
                creatCategories(item.name,item.id)
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
//enclencher trigger//
modalTrigger.forEach(trigger => trigger.addEventListener("click", toggleModal))
function toggleModal() {
    modalContainer.classList.toggle("active")
    imageModale()
//modale 2ieme page ajout photo//
const btnPhoto =document.getElementById("btn-photo")
const modalPhoto = document.querySelector(".modal-photo")
const ajoutPhoto = document.querySelector(".ajout-photo")
btnPhoto.addEventListener("click", () => {
    console.log(btnPhoto);
    modalPhoto.classList.toggle("desactive")
    ajoutPhoto.classList.toggle("active")
} )
}
   
   

//image modale//
function imageModale() {
    let galModale = document.getElementById("gal-mod")
    let i = data.length
    galModale.innerHTML=""
    for (let i = 0; i < data.length; i++) {
        image = data[i].imageUrl
        title = data[i].title
        id= data[i].id
     const works = `<figure id="${id}">
                    <i class="fa-solid fa-trash-can poubelle"id="btn-sup ${id}"></i>
		            <img src="${image}" alt="${title}">
	                </figure>`
        galModale.innerHTML += works
    }

}
/*supprimer image//
const btnSup = document.querySelectorAll(".poubelle")
console.log(btnSup);
btnSup.addEventListener("click", () => {
    id=document.querySelectorAll(".poubelle").onclick = function() {
    // element
    var elt = this;
    // id de l'element
    var idElt = this.getAttribute('id');
    };
    console.log(id);
    //récupéré les donner api//
    fetch("http://localhost:5678/api/delete/works", {
        method: "DELETE",
    })
})*/
