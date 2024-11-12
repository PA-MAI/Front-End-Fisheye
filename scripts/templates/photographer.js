class photographerCardTemplate {
    constructor(pcard) {
        this._pcard = pcard;
    }

    createPhotographerCard() {
        const $wrapper = document.createElement('div');
        $wrapper.classList.add('photographer_section-wrapper');

        const CardTemplate = `
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

        $wrapper.innerHTML = CardTemplate;
        return $wrapper;
    }

    createPhotographerPage(photographerMedia) {
        const photographHeader = document.querySelector('.photograph-header');
        photographHeader.innerHTML = '';

        const lightboxInstance = new Lightbox(); // Créer une instance de lightbox
        const contactModal = new ContactFormModal(this._pcard.name);

        const pagePhotographerTemplate = `
            <article class="page__card" role="figure" aria-label="card-photographer">
                <div class="page__card--text" aria-label="origin">
                    <h1 class="page__card--name">${this._pcard.name}</h1>
                    <h2 class="page__card--origine">${this._pcard.city}, ${this._pcard.country}</h2>
                    <p class="page__card--tag">${this._pcard.tagline}</p>
                </div>
                <div>
                    <button class="contact_button" role="link" aria-label="Contact Me">Contactez-moi</button>
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

        const photographerFirstName = this._pcard.name.split(" ")[0];
        let totalLikes = photographerMedia.reduce((sum, media) => sum + media.likes, 0);
        console.log("Total Likes au chargement : ", totalLikes);

        photographerMedia.forEach((media) => {
            let mediaTemplate = '';

            if (media.image) {
                mediaTemplate = `
                <div class="media">
                    <article class="media-card">
                        <a href="#" class="lightbox-trigger" role="link" aria-label="${media.title},closeup view” 
                           data-media-id="${media.id}" data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.image}" data-type="image">
                            <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="Picture ${media.title} of ${this._pcard.name}">
                        </a>
                    </article>
                    <div class="media-text">
                        <span class="media-title">${media.title}</span>
                        <span class="nb-likes">
                            <span class="likes-count">${media.likes}</span> 
                            <i class="fa-regular fa-heart wish-btn" aria-label="likes" aria-hidden="true" data-id="${media.id}"></i>
                        </span>
                    </div>
                </div>`;
            } else if (media.video) {
                mediaTemplate = `
                <div class="media">
                    <article class="media-card">
                        <a href="#" class="lightbox-trigger" role="link" aria-label="${media.title},closeup view” 
                           data-media-id="${media.id}" data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.video}" data-type="video">
                            <video class="video-thumbnail">
                                <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </a>
                    </article>
                    <div class="media-text">
                        <span class="media-title">${media.title}</span>
                        <span class="nb-likes">
                            <span class="likes-count">${media.likes}</span>
                            <i class="fa-regular fa-heart wish-btn" aria-label="likes" aria-hidden="true" data-id="${media.id}"></i>
                        </span>
                    </div>
                </div>`;
            }

            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);

            // Attacher l'événement de la lightbox avec toutes les informations
            document.querySelectorAll('.lightbox-trigger').forEach(item => {
                item.addEventListener('click', (event) => {
                    event.preventDefault();

                    const mediaUrl = event.target.closest('a').dataset.mediaUrl;
                    const mediaType = event.target.closest('a').dataset.type;
                    const mediaId = parseInt(event.target.closest('a').dataset.mediaId, 10);
                    
                    // Trouver l'objet media pour récupérer le titre et autres informations
                    const mediaObj = photographerMedia.find(media => media.id === mediaId);
                    
                    lightboxInstance.displayLightbox(mediaUrl, mediaType, mediaObj, this._pcard.id, photographerFirstName);
                });
            });
        });

        // Mettre à jour le total des likes
        const photographLike = document.querySelector('.like-result');
        photographLike.innerHTML = `
            <div class="result-likes">
                <div><span class="wish-count">${totalLikes}  </span><span><i class="fa-solid fa-heart heart" aria-hidden="true"></i></span></div>
                <span><i class="media-likes" aria-label="${totalLikes} likes"></i>${this._pcard.price}€/jours</span>
            </div>
        `;

        const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);

        this.handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter);

        const contactButton = document.querySelector('.contact_button');
        contactButton.addEventListener('click', () => {
            contactModal.openModal(); 
        });
    }

    handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter) {
        document.querySelectorAll('.fa-heart').forEach(icon => {
            icon.addEventListener('click', (event) => {
                const mediaId = event.target.getAttribute('data-id');
                const media = photographerMedia.find(m => m.id == mediaId);
                const likesElement = event.target.closest('.nb-likes').querySelector('.likes-count');

                if (event.target.classList.contains('liked')) {
                    event.target.classList.remove('liked');
                    event.target.classList.replace('fa-solid', 'fa-regular');
                    media.likes -= 1;
                    wishlistCounter.update('DEC');
                } else {
                    event.target.classList.add('liked');
                    event.target.classList.replace('fa-regular', 'fa-solid');
                    media.likes += 1;
                    wishlistCounter.update('INC');
                }

                likesElement.textContent = media.likes;
                wishlistCounter._$wishCount.textContent = wishlistCounter._count;
            });
        });
    }
}