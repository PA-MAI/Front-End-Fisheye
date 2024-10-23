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
    const photographHeader = document.querySelector('.photograph-header');
    photographHeader.innerHTML = '';

    // Template pour afficher les informations du photographe
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
    
    photographHeader.insertAdjacentHTML('beforeend', pagePhotographerTemplate);

    const mediaWrapper = document.querySelector('.photographer-media');
    mediaWrapper.innerHTML = '';

    const photographerFirstName = this._pcard.name.split(" ")[0]; // Pour accéder aux médias du photographe
    let totalLikes = photographerMedia.reduce((sum, media) => sum + media.likes, 0);
    console.log("Total Likes au chargement : ", totalLikes); // Vérification de la valeur
    
    // Affichage des médias
    photographerMedia.forEach((media) => {
        let mediaTemplate = '';

        if (media.image) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="${media.title}">
                </article>
                <div class="media-text">
                    <span class="media-title">${media.title}</span>
                    <span class="nb-likes">
                        <span class="likes-count">${media.likes}</span> 
                        <i class="fa-regular fa-heart wish-btn" aria-hidden="true" data-id="${media.id}"></i>
                    </span>
                </div>
            </div>`;
        } else if (media.video) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <a href="./assets/PhotosVideos/${photographerFirstName}/${media.video}" target="_blank" title="Watch ${media.title}">
                        <video class="video-thumbnail" controls>
                            <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </a>
                    <div class="media-text">
                        <span class="media-title">${media.title}</span>
                        <span class="nb-likes">
                            <span class="likes-count">${media.likes}</span>
                            <i class="fa-regular fa-heart wish-btn" aria-hidden="true" data-id="${media.id}"></i>
                        </span>
                    </div>
                </article>
            </div>`;
        }

        // Ajoute les likes actuels au total global
        //totalLikes += media.likes;

        mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
    });
    

    // Mise à jour du total des likes et du prix dans le DOM
    const photographLike = document.querySelector('.like-result');
    
    photographLike.innerHTML = `
        <div class="result-likes">
            <div><span class="wish-count">${totalLikes}</span><span><i class="fa-solid fa-heart heart" aria-hidden="true"></i></span></div>
            <span><i class="media-likes" aria-label="likes"></i>${this._pcard.price}€/jours</span>
        </div>
    `;
        // Pub/Sub pour gérer les likes
       
         const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);

    // Gérer les clics sur les icônes de cœur pour incrémenter/décrémenter les likes
    this.handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter); // Appel à handlelikeButton

    return mediaWrapper;
}

// Méthode du bouton des like : Incrémentation et décrémentation des likes
handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter) {
    document.querySelectorAll('.fa-heart').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const mediaId = event.target.getAttribute('data-id');
            const media = photographerMedia.find(m => m.id == mediaId);
            const likesElement = event.target.closest('.nb-likes').querySelector('.likes-count');

            // Vérifier si l'icône est déjà "likée"
            if (event.target.classList.contains('liked')) {
                event.target.classList.remove('liked');
                event.target.classList.replace('fa-solid', 'fa-regular');
                media.likes -= 1; // Décrémenter uniquement media.likes
                wishlistCounter.update('DEC'); // Mettre à jour le compteur
            } else {
                event.target.classList.add('liked');
                event.target.classList.replace('fa-regular', 'fa-solid');
                media.likes += 1; // Incrémenter uniquement media.likes
                wishlistCounter.update('INC'); // Mettre à jour le compteur
            }

            // Mettre à jour le nombre de likes dans le DOM pour ce média
            likesElement.textContent = media.likes;

            // Mettre à jour le nombre de likes dans le compteur global
            wishlistCounter._$wishCount.textContent = wishlistCounter._count;
            
        });
    });
}
    
}
