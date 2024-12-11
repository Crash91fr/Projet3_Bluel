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

    modal.addEventListener("click", closeModal)
    modal.querySelector(".modal-content").addEventListener("click", stopPropagation)

    const closeButton = modal.querySelector(".close-modal")
        if (closeButton) {
            closeButton.addEventListener("click", closeModal)
        }

    }

  function closeModal(event) {
    if (modal === null) return
    event.preventDefault()

    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")

    modal.removeEventListener("click", closeModal)
    modal.querySelector(".modal-content").removeEventListener("click", stopPropagation)

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

        binButton.addEventListener("click", function() {

          const confirmPopup = confirm("Êtes-vous sûre de vouloir supprimer ce projet?");
          
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

  // *** APPEL DES FONCTIONS AU CHARGEMENT DE LA PAGE ***
  
  // Fetch works et afficher les travaux
  getWorks().then(works => displayWorks(works)).catch(error => console.error(error))
  
  // Fetch categories et générer les filtres
  getCategories().then(categories => filterMenu(categories)).catch(error => console.error(error))

  // ** MESSAGE D'ALERTE ***

  function showSuccessMessage(message) {
  
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000); //*(2secs)
}