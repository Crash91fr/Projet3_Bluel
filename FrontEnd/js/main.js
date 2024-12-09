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

        logButton.addEventListener("click", () => {
            sessionStorage.removeItem("token")
            window.location.replace("./index.html") // Recharge la page, avec le user logged out
        })
    } else {
        console.log("No token found in sessionStorage")

        logButton.addEventListener("click", () => {
            window.location.replace("./login.html")  // Redirige vers la login page
        })
    }
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
  
  // *** APPEL DES FONCTIONS AU CHARGEMENT DE LA PAGE ***
  
  // Fetch works et afficher les travaux
  getWorks().then(works => displayWorks(works)).catch(error => console.error(error))
  
  // Fetch categories et générer les filtres
  getCategories().then(categories => filterMenu(categories)).catch(error => console.error(error))

  