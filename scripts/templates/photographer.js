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

  handlelikeButton() {
    const that = this
    
    this.$wrapper
        .querySelector('.media-likes')
        .addEventListener('click', function() {
            if (this.classList.contains('liked')) {
                this.classList.remove('liked')
                that.WishListSubject.fire('DEC')
            } else {
                this.classList.add('liked')
                that.WishListSubject.fire('INC')
            }
        })
    }
  createPhotographerPage(photographerMedia) {
    // Sélectionne l'élément .photograph-header pour y injecter les informations du photographe
    const photographHeader = document.querySelector('.photograph-header');
    
    // Vider l'élément pour éviter toute duplication
    photographHeader.innerHTML = '';

    // Template de base pour le photographe
    let pagePhotographerTemplate = `
        <article class="page__card" role="figure" aria-label="card-photographer">
            <div class="page__card--text" aria-label="origin">
                <h1 class="page__card--name">${this._pcard.name}</h1>
                <h2 class="page__card--origine">${this._pcard.city}, ${this._pcard.country}</h2>
                <p class="page__card--tag">${this._pcard.tagline}</p>
            </div>
            <div>
                <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
            </div>
            <div class="page__card--profil" title="View the profile of ${this._pcard.name}" role="title">
                <img class="page__card--portrait" alt="${this._pcard.name}, son slogan: ${this._pcard.tagline}."
                    src="./assets/photographers/${this._pcard.portrait}">
            </div>
            
        </article>
        
    `;

    // Injecter le contenu du photographe dans la balise .photograph-header
    photographHeader.insertAdjacentHTML('beforeend', pagePhotographerTemplate);

    // Sélectionner l'élément .photographer-media existant dans le HTML
    const mediaWrapper = document.querySelector('.photographer-media');
    
    // Vider l'élément pour éviter toute duplication
    mediaWrapper.innerHTML = '';

    // Utilisation du prénom uniquement pour le chemin des fichiers
    const photographerFirstName = this._pcard.name.split(" ")[0];

    // Ajout des médias au wrapper
    photographerMedia.forEach(media => {
        let mediaTemplate = '';

        if (media.image) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="${media.title}">
                </article>
                <div class="media-text">
                        <span>${media.title}</span><span>${media.likes} <i class="fa-solid fa-heart" aria-hidden="true" aria-label=”likes”></i></span>
                </div>
            </div>
            `;
        } else if (media.video) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                <a href="./assets/PhotosVideos/${photographerFirstName}/${media.video}" target="_blank" title="Watch ${media.title}">
                    <video class="video-thumbnail" controls poster="./assets/PhotosVideos/${photographerFirstName}/${media.image}">
                    <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                Your browser does not support the video tag.
                </video>
                </a>
                <div class="media-text">
                <span class="media-title">${media.title}</span><span ><i class="media-likes" aria-label=”likes”>${media.likes}</i></span>
                </div>
                </article>
            </div>
            `;
        }

        // Ajouter chaque média dans la section .photographer-media
        mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
        
    });
    const photographLike = document.querySelector('.like-result');
    
    // Vider l'élément pour éviter toute duplication
    photographLike.innerHTML = '';
    let resultlikesTemplate =`
        <div .result-likes>
        <span class="nb-likes">xxx</span>
        <span <i class="fa-solid fa-heart" aria-hidden="true" aria-label=”likes-result”>
        </div>

    `;
    mediaWrapper.insertAdjacentHTML('beforeend', resultlikesTemplate);
    this.handlelikeButton()
}
    

}