class photographerCardTemplate {
  /**
   * Constructor for the photographerCardTemplate class
   * @param {Object} pcard - The photographer card data
   */
  constructor(pcard) {
      this._pcard = pcard; // Store the photographer card data as a private variable
  }

  // Method to create the photographer card element
  createPhotographerCard() {
      const $wrapper = document.createElement('div'); // Create a wrapper div for the card
      $wrapper.classList.add('photographer_section-wrapper'); // Add a class to the wrapper

      let CardTemplate = ""; // Initialize the card template string

      // Create the card template using template literals
      CardTemplate = `
          <article class="card" role="figure" aria-label="card-photographer">
              <a class="card-profil" title="View the profile of ${this._pcard.name}" 
                 href="photographer.html?name=${this._pcard.name}" role="link">
                  <img class="card-portrait" alt="Profile of ${this._pcard.name}, slogan: ${this._pcard.tagline}."
                       src="./assets/photographers/${this._pcard.portrait}">
                  <h2 class="card-name">${this._pcard.name}</h2>
              </a>
              <div class="card-text" aria-label="origin">
                  <p class="card-origine"><h3>${this._pcard.city}, ${this._pcard.country}</h3></p>
                  <p class="card-tag">${this._pcard.tagline}</p>
                  <p class="card-price">${this._pcard.price}€</p>
              </div>
          </article>
      `;

      $wrapper.innerHTML = CardTemplate; // Set the inner HTML of the wrapper to the card template
      return $wrapper; // Return the wrapper containing the card
  }


  createPhotographerPage(photographerMedia) {
    const $wrapper = document.createElement('div'); // Créer un wrapper div pour la page
    $wrapper.classList.add('photographer_header-wrapper'); // Ajouter une classe au wrapper

    // Template de base pour le photographe
    let pagePhotographerTemplate = `
        <article class="page__card" role="figure" aria-label="card-photographer">
            <div class="page__card--text" aria-label="origin">
                <h1 class="page__card--name">${this._pcard.name}</h1>
                <h2 class="page__card--origine">${this._pcard.city}, ${this._pcard.country}</h2></p>
                <p class="page__card--tag">${this._pcard.tagline}</p>
                
            </div>
            <div>
            <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
            </div>
            <div class="page__card--profil" title="View the profile of ${this._pcard.name}" role="title">
                <img class="page__card--portrait" alt="Profile of ${this._pcard.name}, slogan: ${this._pcard.tagline}."
                    src="./assets/photographers/${this._pcard.portrait}">
            </div>
        </article>
        <section class="filtre"
        <section>

    `;

    // Injection du template de base
    $wrapper.innerHTML = pagePhotographerTemplate; // Mettre le HTML dans le wrapper

    // Injecter les médias
    const mediaWrapper = document.createElement('div'); // Créer un wrapper pour les médias
    mediaWrapper.classList.add('photographer-media');
    // chemin prénom uniquement
    const photographerFirstName = this._pcard.name.split(" ")[0]; 
    // Ajout des médias au wrapper
    photographerMedia.forEach(media => {
        let mediaTemplate = '';

        if (media.image) {
            mediaTemplate = `
                <article class="media-card">
                    <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="${media.title}" />
                    <div class="media-text">
                    <span>${media.title}</span><span>${media.likes} likes</span>
                    </div>
                </article>
            `;
        } else if (media.video) {
            mediaTemplate = `
                <article class="media-card">
                    <h3>${media.title}</h3>
                    <p>${media.likes} likes</p>
                    <a href="./assets/PhotosVideos/${photographerFirstName}/${media.video}" target="_blank">
                        <button>Watch Video</button>
                    </a>
                </article>
            `;
        }

        // Ajouter le média au wrapper
        mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
    });

    // Ajouter le wrapper des médias au wrapper principal
    $wrapper.appendChild(mediaWrapper);

    return $wrapper; // Retourner le wrapper contenant la page du photographe
}
}