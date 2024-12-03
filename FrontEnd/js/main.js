// code JavaScript pour la structure

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
        button.dataset.categoryId = category.id
        button.textContent = category.name
  
        button.addEventListener("click", () => {
          filtersCategory(category.id)
          handleActiveButton(button)
        })
  
        filterMenu.appendChild(button)
      }
    })
  }
  
  function handleActiveButton(button) {
    // Remove 'active' class from all filter buttons
    const allButtons = document.querySelectorAll(".filtres button");
    allButtons.forEach(btn => btn.classList.remove("active"));
  
    // Add 'active' class to the clicked button
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
  
  // *** INITIALIZATION ***
  
  // Fetch works and display them on page load
  getWorks().then(works => displayWorks(works)).catch(error => console.error(error))
  
  // Fetch categories and generate filter menu on page load
  getCategories().then(categories => filterMenu(categories)).catch(error => console.error(error))
  