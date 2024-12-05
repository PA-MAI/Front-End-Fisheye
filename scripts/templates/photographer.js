// Design Pattern: **Factory Pattern, Module pattern and Composite Pattern**

class photographerCardTemplate {
    constructor(pcard) {
        this._pcard = pcard;
    }
    // Photographer cards injected on the homepage
    createPhotographerCard() {
        const $wrapper = document.createElement('div');
        $wrapper.classList.add('photographer_section-wrapper');

        const CardTemplate = `
            <article class="card" role="figure" aria-label="carte du photographer">
                <a class="card-profil" title="vue du profil de ${this._pcard.name}" href="photographer.html?id=${this._pcard.id}" >
                    <img class="card-portrait" alt="" src="./assets/photographers/${this._pcard.portrait}">
                    <h2 class="card-name">${this._pcard.name}</h2>
                </a>
                <div class="card-text" aria-label="origin">
                    <p class="card-origine"><h3>${this._pcard.city}, ${this._pcard.country}</h3></p>
                    <p class="card-tag">${this._pcard.tagline}</p>
                    <p class="card-price">${this._pcard.price}€</p>
                </div>
            </article>
        `;

        $wrapper.innerHTML = CardTemplate;
        return $wrapper;
    }

    // Photographer's page
    createPhotographerPage(photographerMedia) {
        const photographHeader = document.querySelector('.photograph-header');
        photographHeader.innerHTML = '';
    
        // Instantiate the lightbox
        const lightboxInstance = new Lightbox();
        const contactModal = new ContactFormModal(this._pcard.name);
    
        // Photographer header injected
        const pagePhotographerTemplate = `
            <article class="page__card" role="figure" aria-label="carte du photographer">
                <div class="page__card--text" aria-label="origine">
                    <h1 class="page__card--name">${this._pcard.name}</h1>
                    <h2 class="page__card--origine">${this._pcard.city}, ${this._pcard.country}</h2>
                    <p class="page__card--tag">${this._pcard.tagline}</p>
                </div>
                <div>
                    <button class="contact_button" tabindex="0">Contactez-moi</button>
                </div>
                <div class="page__card--profil" title="Vue du profil de ${this._pcard.name}" role="title">
                    <img class="page__card--portrait" alt="portrait de ${this._pcard.name}"
                        src="./assets/photographers/${this._pcard.portrait}">
                </div>
            </article>
        `;
    
        photographHeader.insertAdjacentHTML('beforeend', pagePhotographerTemplate);
    
        const mediaWrapper = document.querySelector('.photographer-media');

        // Stop if mediaWrapper is not found
        if (!mediaWrapper) {
            console.error('mediaWrapper is not found in the DOM.');
            return; 
        }
        // Clear existing media
        mediaWrapper.innerHTML = ''; 
    
        // Access media path
        const photographerFirstName = this._pcard.name.split(" ")[0];
        let totalLikes = photographerMedia.reduce((sum, media) => sum + media.likes, 0);
        console.log("Total Likes au chargement : ", totalLikes);
    
        // Inject photographer's media
        photographerMedia.forEach((media) => {
            let mediaTemplate = '';
    
            if (media.image) {
                mediaTemplate = `
                    <div class="media">
                        <article class="media-card">
                            <a href="#" class="lightbox-trigger" 
                               title="image ${media.title}, vue réduite" 
                               data-media-id="${media.id}" 
                               data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.image}" 
                               data-type="image">
                                <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" 
                                     alt="lien vers le média ${media.title} de ${this._pcard.name}">
                            </a>
                        </article>
                        <div class="media-text">
                            <span class="media-title">${media.title}</span>
                            <span class="nb-likes">
                                <span class="likes-count">${media.likes}</span>
                                <i role="button" class="fa-regular fa-heart wish-btn" 
                                   data-id="${media.id}" 
                                   aria-pressed="false" 
                                   aria-label="Activer le like pour ce média" 
                                   tabindex="0"></i>
                            </span>
                        </div>
                    </div>`;
            } else if (media.video) {
                mediaTemplate = `
                    <div class="media">
                        <article class="media-card">
                            <a href="#" class="lightbox-trigger" 
                               title="vidéo ${media.title}, vue réduite" 
                               data-media-id="${media.id}" 
                               data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.video}" 
                               data-type="video">
                                <video class="video-thumbnail" tabindex="-1">
                                    <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                                </video>
                            </a>
                        </article>
                        <div class="media-text">
                            <span class="media-title">${media.title}</span>
                            <span class="nb-likes">
                                <span class="likes-count">${media.likes}</span>
                                <i role="button" class="fa-regular fa-heart wish-btn" 
                                   data-id="${media.id}" 
                                   aria-pressed="false" 
                                   aria-label="Activer le like pour ce média" 
                                   tabindex="0"></i>
                            </span>
                        </div>
                    </div>`;
            }
    
            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
        });
    
        // Attach the lightbox event once all media have been injected
        mediaWrapper.addEventListener('click', async (event) => {
            const mediaElement = event.target.closest('.lightbox-trigger');
            if (!mediaElement) return; // If the click is not on a lightbox-trigger, ignore

            event.preventDefault();
    
            // Retrieve clicked element's data
            const mediaId = parseInt(mediaElement.dataset.mediaId, 10);
            console.log("mediaID",mediaId)
            if (isNaN(mediaId)) {
                console.warn(" The value of MediaID is NaN because it is only used for the unfiltered page.", mediaElement.dataset.mediaId);
              return;
            }
    
            // Load photographer data
            this.photographerId = this._pcard.id;
            this.pageApi = new ProfilApiPhotographer('./data/photographers.json');
            const mediaData = await this.pageApi.getDefaultMedia(this.photographerId);
    
            // Find the media index
            const currentIndex = mediaData.findIndex(media => media.id === mediaId);
            if (currentIndex === -1) {
                console.error("Error: Media not found in mediaData. mediaId:", mediaId);
                return;
            }
    
             // Display the lightbox with correct data
            lightboxInstance.displayLightbox(
                mediaData[currentIndex],
                this.photographerId,
                // Photographer's first name
                this._pcard.name.split(" ")[0], 
                mediaData
            );
        });
    
       // Inject and update total likes div
        const photographLike = document.querySelector('.like-result');
        if (photographLike) {
            photographLike.innerHTML = `
                <div class="result-likes">
                    <div>
                        <span class="wish-count" tabindex="0" Aria-label="Nombre total de likes ${totalLikes}">${totalLikes}</span>
                        <i class="fa-solid fa-heart heart"></i>
                    </div>
                    <div>
                        <span>${this._pcard.price} €/jour</span>
                    </div>
                </div>`;
        }


        //Design Pattern: **Observer Pattern **
        //Instantiate the wishlist
        const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);
    
        // Handle likes
        this.handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter);
    
        // Open the contact modal
        const contactButton = document.querySelector('.contact_button');
        if (contactButton) {
            contactButton.addEventListener('click', () => {
                contactModal.openModal();
            });
        }
    }
    // Like button handler
    handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter) {
        // Select all heart icons
        document.querySelectorAll('.fa-heart').forEach(icon => {
            // Check if the icon is within .result-likes
            if (icon.closest('.result-likes')) {
                // Don't add tabindex or role on this element
                icon.setAttribute('tabindex', '-1'); 
            } else {
                // Add tabindex for all other hearts
                icon.setAttribute('tabindex', '0');
                icon.setAttribute('role', 'button'); 
                // ARIA attribute to indicate state
                icon.setAttribute('aria-pressed', 'false'); 
            }
    
            // Click handler
            icon.addEventListener('click', (event) => {
                this._toggleLike(event, photographerMedia, wishlistCounter);
            });
    
            //  Enter or Space handler
            icon.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { 
                    event.preventDefault(); // Empêche le défilement pour Espace
                    this._toggleLike(event, photographerMedia, wishlistCounter);
                }
            });
        });
    }

    // Toggle of like handler
    _toggleLike(event, photographerMedia, wishlistCounter) {
        const mediaId = event.target.getAttribute('data-id');
        const media = photographerMedia.find(m => m.id == mediaId);
        const likesElement = event.target.closest('.nb-likes').querySelector('.likes-count');
    
        if (event.target.classList.contains('liked')) {
            event.target.classList.remove('liked');
            event.target.classList.replace('fa-solid', 'fa-regular');
            media.likes -= 1;
            wishlistCounter.update('DEC');
            // Update ARIA for delete like
            event.target.setAttribute('aria-pressed', 'false'); 
            event.target.setAttribute('aria-label', 'like supprimé'); 
        } else {
            event.target.classList.add('liked');
            event.target.classList.replace('fa-regular', 'fa-solid');
            media.likes += 1;
            wishlistCounter.update('INC');
            // Update ARIA for add like
            event.target.setAttribute('aria-pressed', 'true'); 
            event.target.setAttribute('aria-label', 'like ajouté');
        }
    
        likesElement.textContent = media.likes;
        wishlistCounter._$wishCount.textContent = wishlistCounter._count;
    }
    
}