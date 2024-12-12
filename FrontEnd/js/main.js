// code JavaScript pour la structure

// ***CHECK IF USER IS LOGGED IN AND ADD LOGOUT FUNCTION

function userLogged() {
    const logButton = document.getElementById("log-button")
    const token = sessionStorage.getItem("token")

    const blackBar = document.querySelector(".black-bar")
    const filterMenu = document.querySelector(".filtres")
    const editIcon = document.querySelector(".edit-icon")
   

    if (token) {

        console.log("Token is saved:", token)
      
        logButton.textContent = "logout"
        
        blackBar.classList.remove("not-displayed")
        filterMenu.classList.add("not-displayed")
        editIcon.classList.remove("not-displayed")
       

    } else {
        console.log("No token found in sessionStorage")

        blackBar.classList.add("not-displayed")
        filterMenu.classList.remove("not-displayed")
        editIcon.classList.add("not-displayed")
        
    }
    logButton.addEventListener("click", () => {
      if (token) {
        sessionStorage.removeItem("token")
        window.location.replace("./index.html") // Recharge la page, avec le user logged out
        } else {
            window.location.replace("./login.html")  // Redirige vers la login page
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    userLogged();  
})

// ****** GET / requests *************

async function getCategories() {
    try {
      const response = await fetch("http://localhost:5678/api/categories")
      if (!response.ok) throw new Error('Failed to fetch categories')
      let categories = await response.json()
      console.log(categories)
      return categories
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
    }
  }
  
  async function getWorks() {
    try {
      const response = await fetch("http://localhost:5678/api/works")
      if (!response.ok) throw new Error('Failed to fetch works')
      let works = await response.json()
      console.log(works)
      return works
    } catch (error) {
      console.error("Error fetching works:", error)
      return []
    }
  }
  
  // *** FILTER MENU *** 

  // création des boutons 

  function filterMenu(categories) { 
    const filterMenu = document.querySelector(".filtres")
    
    filterMenu.innerHTML = ""
  
      const tous = document.createElement("button")
      tous.textContent = "Tous"
      tous.classList.add("btn-tous", "active") 
      tous.addEventListener("click", function() {
        displayAllWorks()
        handleActiveButton(tous)
      })
      
      filterMenu.appendChild(tous)
    
    categories.forEach(category => {
      if (category) {
        const button = document.createElement("button")
        button.dataset.categoryId = category.id // attache la donnée categoryId à l'élément
        button.textContent = category.name
  
        button.addEventListener("click", () => {
          filtersCategory(category.id)
          handleActiveButton(button)
        })
  
        filterMenu.appendChild(button)
      }
    })
  }
  
  // gestion de l'apparence du bouton actif

  function handleActiveButton(button) {
    const allButtons = document.querySelectorAll(".filtres button");
    allButtons.forEach(btn => btn.classList.remove("active"));
   
    button.classList.add("active");
  }
  
  
  // *** FILTER WORKS BY CATEGORY ***
  
  function filtersCategory(categoryId) {
    getWorks().then(works => {
      const filteredWorks = works.filter(work => work.categoryId === categoryId);
      displayWorks(filteredWorks)
    }).catch(error => {
      console.error(error)
    });
  }
  
  // *** DISPLAY WORKS ***
  
  function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
  
    gallery.innerHTML = ""
  
    works.forEach(work => {
      if (work) {
        const figure = document.createElement("figure")
        figure.id = `work-${work.id}` /** attach the work.id to the figure to handle delete action in the modal */
        gallery.appendChild(figure)
  
        const image = document.createElement("img")
        image.src = work.imageUrl
        figure.appendChild(image)
  
        const caption = document.createElement("figcaption")
        caption.textContent = work.title
        figure.appendChild(caption)
      }
    })
  }
  
  // *** DISPLAY ALL WORKS ***
  
  function displayAllWorks() {
    getWorks().then(works => {
      displayWorks(works)
    }).catch(error => {
      console.error(error)
    })
  }
  
  // *** MODAL **** //

  let modal = null

  function openModal(event) {
    event.preventDefault()
    
    displayModalGallery()

    const target = document.querySelector(event.target.getAttribute("href"))
  
    target.style.display = null
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target

    const modal1 = document.querySelector(".modal-content");
    modal1.style.display = "flex"
  
    modal.addEventListener("click", closeModal)
  
    modal1.addEventListener("click", stopPropagation) 
    
    const closeButtons = modal.querySelectorAll(".close-modal")
        closeButtons.forEach((button) => {
            button.addEventListener("click", closeModal)
        })
  }

  function closeModal(event) {
    if (modal === null) return
    event.preventDefault()

    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")

    modal.removeEventListener("click", closeModal)

    const modal1 = document.querySelector(".modal-content")
    modal1.removeEventListener("click", stopPropagation)
    modal1.style.display = "none" // For modal 1

    const modal2 = document.querySelector(".modal-ajout")
    if (modal2) {
      modal2.removeEventListener("click", stopPropagation)
      modal2.style.display = "none" // For modal 2
    }

    modal = null

  }

  function stopPropagation(event) { // empêche que la modal se ferme lorsqu'on clique dessus
    event.stopPropagation();
  }

  document.querySelector(".js-modal").addEventListener("click", openModal)


// *** Display Modal Gallery *** 

function displayModalGallery() {
  getWorks().then(works => {
    const modalGallery = document.querySelector(".modal-gallery")
    modalGallery.innerHTML = ""

    works.forEach(work => {
      if (work) {
        const modalFigure = document.createElement("figure")
        modalGallery.appendChild(modalFigure)

        const image = document.createElement("img")
        image.src = work.imageUrl;
        modalFigure.appendChild(image)

        const binButton = document.createElement("button")
        binButton.classList.add("bin-button")

        const binIcon = document.createElement("i")
        binIcon.classList.add("fa-solid", "fa-trash-can", "fa-xs")

        binButton.appendChild(binIcon)
        modalFigure.appendChild(binButton)

        //** Delete works with the binButton

        binButton.addEventListener("click", () => {

          const confirmPopup = confirm("Supprimer définitivement ce projet?");
          
          if (!confirmPopup) {
            return; // annulation du click
          }

          let baseUrl = "http://localhost:5678/api/works"
          let deleteWorkid = work.id
          console.log(deleteWorkid)

          let fullUrl = `${baseUrl}/${deleteWorkid}` //** ajoute l'id à l'url */
          console.log(fullUrl)

          // Perform the DELETE request
          fetch(fullUrl, {
            method: 'DELETE',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem("token")}` // Token from sessionStorage
            }
          })
          .then(response => {
            if (response.ok) {
              console.log("Item deleted successfully");
              modalFigure.remove(); // Remove the figure from the modal

              const mainPageWorks = document.getElementById(`work-${deleteWorkid}`)
              if (mainPageWorks) {
                mainPageWorks.remove() // Remove the figure from main page 
              }
              showSuccessMessage("Projet supprimé avec succès!") // confirme la suppression avec une notification

            } else {
              console.error("Error deleting item", response.status)
            }
          })
          .catch(error => console.error("Fetch error:", error))
        })
      }

    })
  }).catch(error => {
    console.error(error)
  })
}

   //** Changement de fenêtre modal */

  // modal 1 vers 2 //

  const switchModal = document.getElementById("btn-modal-ajouter")
    switchModal.addEventListener("click", () => {
      const modal1 = document.querySelector(".modal-content")
      const modal2 = document.querySelector(".modal-ajout")

      modal1.style.display= "none"
      modal2.style.display= "flex"  
      
      modal2.addEventListener("click", stopPropagation)

      addPhotoForm()

  })

  // modal 2 vers 1 //

  const switchBackModal = document.querySelector(".goback-modal")    
      switchBackModal.addEventListener("click", () => {
        const modal1 = document.querySelector(".modal-content");
        const modal2 = document.querySelector(".modal-ajout");
        
        modal1.style.display= "flex"
        modal2.style.display= "none"

  })

    // ** AJOUT D'UNE NOUVELLE PHOTO ** //

    // Construction du formulaire et contrôle //

  function addPhotoForm() {
    const modalPhotoForm = document.querySelector(".modal-add-photo")
    modalPhotoForm.innerHTML = ""  // Clear any existing content
  
    const form = document.createElement("form")
    form.setAttribute("enctype", "multipart/form-data")
    form.setAttribute("method", "post")
    form.classList.add("modal-form")

    // Image input section
    const imageContainer = document.createElement("div")
    imageContainer.classList.add("img-background")
    
    const imageLabel = document.createElement("label")
    imageLabel.classList.add("image-max-label")
    imageLabel.innerHTML = "jpg, png : 4mo max"  

    const previewImage = document.createElement("img")
    previewImage.src = "./assets/icons/imgIcon.png"
    previewImage.alt = "preview"
    previewImage.classList.add("img-preview")

    const imageButton = document.createElement("button")
    imageButton.textContent = "+ Ajouter photo"
    imageButton.classList.add("btn-image")

    const imageInput = document.createElement("input") //** BROWSE... element */
    imageInput.setAttribute("type", "file")
    imageInput.setAttribute("name", "image")
    imageInput.setAttribute("accept", "image/*")
    imageInput.required = true
    imageInput.classList.add("image-upload-input") 

    // charge la preview et contrôle le fichier 

    imageInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file || file.size > 4 * 1024 * 1024) {  // 4MB limit
        alert("La taille de l'image excède la limite autorisé (4MB max).")
        event.preventDefault()
      }
      if (file) {
        previewImage.src = URL.createObjectURL(file)
        imageButton.style.display = "none"  
        imageLabel.style.display = "none"  
      }
      checkForm();  
    })

    // Title input section
    const titleLabel = document.createElement("label")
    titleLabel.innerText = "Titre" // Add label text for the title
    const titleInput = document.createElement("input")
    titleInput.setAttribute("type", "text")
    titleInput.setAttribute("name", "Titre")
    titleInput.setAttribute("placeholder", "")
    titleInput.setAttribute("minlength", "4")  
    titleInput.required = true
    titleInput.classList.add("form-input") // Add styles for the input in CSS

    // CONTROLE DU TITRE

    titleInput.addEventListener("input", checkForm)
  
    // Category input section 
    const categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Catégorie"  
    const categorySelect = document.createElement("select")
    categorySelect.setAttribute("name", "Catégorie")
    categorySelect.required = true
    categorySelect.classList.add("form-select")

    const defaultOption = document.createElement("option") // show blank by default
    defaultOption.value = "" 
    defaultOption.innerText = "" 
    defaultOption.setAttribute("disabled", true) 
    defaultOption.setAttribute("selected", true) 
    categorySelect.appendChild(defaultOption)
  
    // Fetch categories and append options to the category select
    getCategories().then(categories => {
      categories.forEach(category => {
        const option = document.createElement("option")
        option.value = category.id
        option.innerText = category.name
        categorySelect.appendChild(option)
      })
    }).catch(error => {
      console.error("Error fetching categories:", error)
    })
    // CONTROLE DES CATEGORIES 

      categorySelect.addEventListener("change", checkForm)

      //  append all form elements to the modal
      
      imageButton.appendChild(imageInput)
      imageContainer.appendChild(previewImage)
      imageContainer.appendChild(imageLabel)
      imageContainer.appendChild(imageButton)
      form.appendChild(imageContainer)
      form.appendChild(document.createElement("br"))  // Line break
  
      form.appendChild(titleLabel)
      form.appendChild(titleInput)
      form.appendChild(document.createElement("br"))
  
      form.appendChild(categoryLabel)
      form.appendChild(categorySelect)
      form.appendChild(document.createElement("br"))
  
    // Append the form to the modal photo container
      modalPhotoForm.appendChild(form)

    // Contrôler le remplissage du formulaire et changer la couleur du bouton valider   
      
    function checkForm() {
      const submitButton = document.getElementById("btn-modal-valider")
      const file = imageInput.files[0]
      const titleValue = titleInput.value.trim()
      const categoryValue = categorySelect.value

      if (file && titleValue.length >= 4 && categoryValue) {
      submitButton.disabled = false  
      console.log("bouton valider disponible")
      } else {
      submitButton.disabled = true    
      }
  }
}
 
// ** SUBMIT THE FORM //
    const submitButton = document.getElementById("btn-modal-valider")

    submitButton.addEventListener("click", async (event) => {    
    event.preventDefault()
    console.log("Bouton valider cliqué")
    
    const formData = new FormData()    
  
    const form = document.querySelector(".modal-form")
    const imageInput = form.querySelector(".image-upload-input")
    const titleInput = form.querySelector(".form-input")
    const formOptions = form.querySelector(".form-select")
    
    formData.append('image', imageInput.files[0]) //Ajoute le premier fichier sélectionné dans l'élément imageInput à l'objet FormData avec la clé 'image'.
    formData.append('title', titleInput.value) //Ajoute la valeur de l'élément titleInput à l'objet FormData avec la clé 'title'.
    formData.append('category', formOptions.value) //joute la valeur de l'élément formOptions à l'objet FormData avec la clé 'category'.
     
    console.log("Title:", formData.get("title"))
    console.log("Category:", formData.get("category"))
    console.log("Image file:", formData.get("image"))

      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",  
          headers: {
            accept : "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem("token")}`
          }, 
          body: formData, 
        })
        if (response.ok) {
          console.log(response)
          showSuccessMessage("Projet ajouté à la galerie!")
          resetForm()
          displayAllWorks()
          submitButton.disabled = true
        } else {
          console.error("Erreur lors de l'envoi au serveur")
        }
      } catch (error) {
        console.error("Erreur:", error)
      }
    })

  // RESET LE FORMULAIRE

  // *** APPEL DES FONCTIONS AU CHARGEMENT DE LA PAGE ***
  
  // Fetch works et afficher les travaux
  getWorks().then(works => displayWorks(works)).catch(error => console.error(error))
  
  // Fetch categories et générer les filtres
  getCategories().then(categories => filterMenu(categories)).catch(error => console.error(error))


  // ** NOTIFICATION ***

  function showSuccessMessage(message) {
  
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000); //*(2secs)
}

function resetForm(){
  const modalForm = document.querySelector(".modal-form")
  modalForm.reset()
  
  const imageInput = modalForm.querySelector(".image-upload-input")
  const previewImage = modalForm.querySelector(".img-preview")

  imageInput.value = ""
  previewImage.src = "./assets/icons/imgIcon.png"

  const imageButton = document.querySelector(".btn-image").style.display = "block"  
  const imageLabel = document.querySelector(".image-max-label").style.display = "block"  

}