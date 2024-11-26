class photographerCardTemplate {
    constructor(pcard) {
        this._pcard = pcard;
    }
    //cartes des photographes injectées
    createPhotographerCard() {
        const $wrapper = document.createElement('div');
        $wrapper.classList.add('photographer_section-wrapper');

        const CardTemplate = `
            <article class="card" role="figure" aria-label="carte du photographer">
                <a role ="link" class="card-profil" title="vue du profil de ${this._pcard.name} tabindex="0" aria-label=" aller sur le profile de ${this._pcard.name} de ${this._pcard.city}, ${this._pcard.country} son slogan: ${this._pcard.tagline}"
                   href="photographer.html?id=${this._pcard.id}" >
                    <img class="card-portrait" alt="Profile of ${this._pcard.name}, ."
                         src="./assets/photographers/${this._pcard.portrait}" alt="image du photographe ${this._pcard.name}">
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

    //page du photographe
    createPhotographerPage(photographerMedia) {
        const photographHeader = document.querySelector('.photograph-header');
        photographHeader.innerHTML = '';

            // Créer une instance de lightbox
        const lightboxInstance = new Lightbox(); 
        const contactModal = new ContactFormModal(this._pcard.name);

        // header du photographe injecté
        const pagePhotographerTemplate = `
            <article class="page__card" role="figure" aria-label="carte du photographer">
                <div class="page__card--text" aria-label="origine">
                    <h1 class="page__card--name" tabindex="0" aria-label="nom du photographe ${this._pcard.name}">${this._pcard.name}</h1>
                    <h2 class="page__card--origine" tabindex="0" aria-label="ville ${this._pcard.city} et pays ${this._pcard.country}">${this._pcard.city}, ${this._pcard.country}</h2>
                    <p class="page__card--tag" tabindex="0" aria-label=" son slogan ${this._pcard.tagline}">${this._pcard.tagline}</p>
                </div>
                <div>
                    <button class="contact_button" role="link" aria-label="Contactez-moi" tabindex="0">Contactez-moi</button>
                </div>
                <div class="page__card--profil" title="Vue du profil de ${this._pcard.name}" role="title">
                    <img class="page__card--portrait" role="img" tabindex="0" alt="${this._pcard.name}, son slogan: ${this._pcard.tagline}."
                        src="./assets/photographers/${this._pcard.portrait}">
                </div>
            </article>
        `;
        
        photographHeader.insertAdjacentHTML('beforeend', pagePhotographerTemplate);

        const mediaWrapper = document.querySelector('.photographer-media');
        mediaWrapper.innerHTML = '';
        // acces au chemin des medias
        const photographerFirstName = this._pcard.name.split(" ")[0];

        let totalLikes = photographerMedia.reduce((sum, media) => sum + media.likes, 0);
        console.log("Total Likes au chargement : ", totalLikes);

        //médias injectés du photographe
        photographerMedia.forEach((media) => {
            let mediaTemplate = '';

            if (media.image) {
                mediaTemplate = `
                 <div class="media">
            <article class="media-card">
                <a href="#" class="lightbox-trigger" role="link" aria-label="image ${media.title}, vue réduite" 
                   data-media-id="${media.id}" data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.image}" data-type="image" >
                    <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="lien vers le média ${media.title} de ${this._pcard.name}">
                </a>
            </article>
            <div class="media-text">
                <span class="media-title">${media.title}</span>
                <span class="nb-likes" >
                    <span class="likes-count" tabindex="0" aria-label="Nombre de likes ${media.likes}">${media.likes}</span>
                     <button class="wish-btn" aria-label="Liker ce media" tabindex="-1" aria-pressed="false" >
                    <i class="fa-regular fa-heart" data-id="${media.id}" aria-label="Activer le like pour ce media"  tabindex="0" ></i>
                    </button>
                </span>
            </div>
        </div>`;
    } else if (media.video) {
        mediaTemplate = `
        <div class="media">
            <article class="media-card">
                <a href="#" class="lightbox-trigger" role="link" aria-label=" image ${media.title}, vue réduite" 
                   data-media-id="${media.id}" data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.video}" data-type="video" src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                   <video class="video-thumbnail" tabindex="-1">
                        <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </a>
            </article>
            <div class="media-text">
                <span class="media-title">${media.title}</span>
                <span class="nb-likes" >
                     <span class="likes-count" tabindex="0" aria-label="Nombre de likes ${media.likes}">${media.likes}</span>
                     <button class="wish-btn" aria-label="Liker ce media" tabindex="-1" aria-pressed="false">
                    <i class="fa-regular fa-heart" data-id="${media.id}" aria-label="Activer le like pour ce media"  tabindex="0" ></i>
                    </button>
                </span>
            </div>
        </div>`;
    }

            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);

            // Attacher l'événement de la lightbox avec toutes les informations
            document.querySelector('.photographer-media').addEventListener('click', async (event) => {
                const mediaElement = event.target.closest('.lightbox-trigger');
                if (!mediaElement) return; // Si le clic n'est pas sur une lightbox-trigger, ignorer
            
                event.preventDefault();
            
                // Récupérer les données de l'élément cliqué
                const mediaId = parseInt(mediaElement.dataset.mediaId, 10);
                if (isNaN(mediaId)) {
                    console.error("Erreur : mediaId n'est pas un nombre valide.", mediaElement.dataset.mediaId);
                    return;
                }
            
                // Charger les données du photographe
                this.photographerId = this._pcard.id;
                this.pageApi = new ProfilApiPhotographer('./data/photographers.json');
                const mediaData = await this.pageApi.getDefaultMedia(this.photographerId);
            
                // Trouver l'index du média
                const currentIndex = mediaData.findIndex(media => media.id === mediaId);
                if (currentIndex === -1) {
                    console.error("Erreur : média non trouvé dans mediaData. mediaId:", mediaId);
                    return;
                }
            
                // Afficher la lightbox avec les bonnes données
                lightboxInstance.displayLightbox(
                    mediaData[currentIndex],
                    this.photographerId,
                    this._pcard.name.split(" ")[0], // Prénom du photographe
                    mediaData
        );
    });

  });
    

        // injection et mise à jour de la div du total des likes
        const photographLike = document.querySelector('.like-result');
        photographLike.innerHTML = 
      
       `<div class="result-likes" tabindex="0" aria-label="Le photographe a reçu ${totalLikes} likes, son tarif ${this._pcard.price} euros par jour." aria-live="polite">
        <!-- Bloc du resultat des likes -->
            <div aria-hidden="true">
            <span class="wish-count">${totalLikes}</span>
            <span >
            <i class="fa-solid fa-heart heart" aria-hidden="true" tabindex="-1" ></i>
            </span>
            </div>

        <!-- Tarif -->
            <div tabindex="-1" aria-hidden="true">
                <span>${this._pcard.price} €/jour</span>
            </div>
        </div>
       `;
    

        const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);

        this.handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter);

        // ouverture de la modale de contact
        const contactButton = document.querySelector('.contact_button');
        contactButton.addEventListener('click', () => {
            contactModal.openModal(); 
        });
    };

    handlelikeButton(photographerMedia, wishlistSubject, wishlistCounter) {
        // Sélectionner tous les icônes de cœur
        document.querySelectorAll('.fa-heart').forEach(icon => {
            // Vérifier si l'icône est dans .result-likes
            if (icon.closest('.result-likes')) {
                // Ne pas ajouter tabindex ni rôle sur cet élément
                icon.setAttribute('tabindex', '-1'); 
            } else {
                // Ajouter tabindex pour tous les autres cœurs
                icon.setAttribute('tabindex', '0');
                icon.setAttribute('role', 'button'); // Optionnel pour une meilleure accessibilité
                icon.setAttribute('aria-pressed', 'false'); // Attribut ARIA pour indiquer l'état
            }
    
            // Ajouter un gestionnaire pour le clic
            icon.addEventListener('click', (event) => {
                this._toggleLike(event, photographerMedia, wishlistCounter);
            });
    
            // Ajouter un gestionnaire pour la touche Entrée ou Espace
            icon.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') { // Vérifie Entrée ou Espace
                    event.preventDefault(); // Empêche le défilement pour Espace
                    this._toggleLike(event, photographerMedia, wishlistCounter);
                }
            });
        });
    }

    // Nouvelle méthode privée pour gérer le toggle du like
    _toggleLike(event, photographerMedia, wishlistCounter) {
        const mediaId = event.target.getAttribute('data-id');
        const media = photographerMedia.find(m => m.id == mediaId);
        const likesElement = event.target.closest('.nb-likes').querySelector('.likes-count');
    
        if (event.target.classList.contains('liked')) {
            event.target.classList.remove('liked');
            event.target.classList.replace('fa-solid', 'fa-regular');
            media.likes -= 1;
            wishlistCounter.update('DEC');
            event.target.setAttribute('aria-pressed', 'false'); // Mise à jour ARIA
        } else {
            event.target.classList.add('liked');
            event.target.classList.replace('fa-regular', 'fa-solid');
            media.likes += 1;
            wishlistCounter.update('INC');
            event.target.setAttribute('aria-pressed', 'true'); // Mise à jour ARIA
        }
    
        likesElement.textContent = media.likes;
        wishlistCounter._$wishCount.textContent = wishlistCounter._count;
    }
    
}
