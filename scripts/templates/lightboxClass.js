class Lightbox {
    constructor() {
        this.modal = document.getElementById("lightbox_modal");
        this.pageApi = new ProfilApiPhotographer('./data/photographers.json'); 
        this.currentIndex = 0;
        this.mediaData = [];
        this.mediaIds = []; 
        this.photographerFirstName = "";
    }

    async displayLightbox(mediaData, photographerId, photographerFirstName, sortedMedia = null) {
        //debugger
        // Utiliser `sortedMedia` si disponible, sinon charger les médias par défaut
        this.mediaData = sortedMedia || await this.pageApi.getDefaultMedia(photographerId);

        // Vérifier que `mediaData` est bien un tableau, sinon assigner un tableau vide
        if (!Array.isArray(this.mediaData)) {
            console.error("mediaData n'est pas un tableau. Assignation d'un tableau vide.");
            
            this.mediaData = [];
        }

        // Initialiser `mediaIds` pour la navigation
        this.mediaIds = this.mediaData.map(media => media.id);

        // Déterminer l'index de départ dans `mediaIds`
        this.currentIndex = this.mediaIds.indexOf(mediaData.id);

        // Assigner le prénom du photographe
        this.photographerFirstName = photographerFirstName;

        if (this.currentIndex === -1) {
            console.error("Erreur : ID du média initial non trouvé dans mediaIds.");
            return;
        }

        // Charger le média initial
        this.loadMedia(this.currentIndex);

        // Afficher la lightbox
        this.modal.style.display = "flex";

        // Configurer les écouteurs de navigation
        this.setupNavigationListeners();
    }
    loadMedia(index) {
        const mediaId = this.mediaIds[index];
        
        // Récupérer le média correspondant en fonction de l'ID
        const currentMedia = this.mediaData.find(media => media.id === mediaId);
        if (!currentMedia) {
            console.error("Média non trouvé pour l'ID :", mediaId);
            return;
        }

        // Construire le chemin complet du média en utilisant le prénom du photographe
        const mediaUrl = `./assets/PhotosVideos/${this.photographerFirstName}/${currentMedia.image || currentMedia.video}`;
        const mediaType = currentMedia.image ? 'image' : 'video';

        // Mettre à jour la lightbox avec le titre et le prix
        this.updateLightboxContent(mediaUrl, mediaType, currentMedia.title, currentMedia.price);
    }

    updateLightboxContent(mediaUrl, mediaType, title, price) {
        const lightboxWrapper = this.modal.querySelector(".lightbox_modal");
        lightboxWrapper.innerHTML = ''; // Effacer le contenu précédent

        let lightboxTemplate = '';
        if (mediaType === 'image') {
            lightboxTemplate = `
            <div class="lightbox-left">
                <span class="lightbox-anchor1"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="Previous image"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            <div class="lightbox-center" aria-label="image closeup view of ${title}. For sale ${price}€">
                <div class="player">
                    <img src="${mediaUrl}" alt="${title} - ${price}€" >
                    <div class="lightbox-text">
                        <span>${title}</span><span>${price}€</span>
                    </div> 
                </div>
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="Close dialog" class="lightbox-close-btn" />
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="Next image"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            `;
        } else if (mediaType === 'video') {
            lightboxTemplate = `
            <div class="lightbox-left">
                <span class="lightbox-anchor"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="Previous image"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            <div class="lightbox-center">
                <div class="player">
                    <iframe height="500" width="800" src="${mediaUrl}" allowfullscreen></iframe>
                    <div class="lightbox-text">
                        <span>${title}</span> <span>${price}€</span>
                    </div>
                </div>
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="Close dialog" class="lightbox-close-btn" />
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="Next image"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            `;
        }

        lightboxWrapper.insertAdjacentHTML('beforeend', lightboxTemplate);

        // Attacher l'événement de fermeture de la lightbox
        const closeButton = this.modal.querySelector('.lightbox-close-btn');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeLightbox());
        }

        // Mettre à jour les écouteurs de navigation à chaque chargement de contenu
        this.setupNavigationListeners();
    }

    setupNavigationListeners() {
        // Sélection des boutons de navigation
        const prevButton = this.modal.querySelector('.lightbox-prev');
        const nextButton = this.modal.querySelector('.lightbox-next');

        // Vérification de l'existence des boutons de navigation
        if (!prevButton || !nextButton) {
            console.error("Erreur : les boutons de navigation (précédent ou suivant) sont introuvables.");
            return;
        }

        // Supprimer les anciens écouteurs d'événements
        prevButton.removeEventListener('click', this.handlePrev);
        nextButton.removeEventListener('click', this.handleNext);

        // Ajouter les nouveaux écouteurs en utilisant des fonctions fléchées pour maintenir le contexte `this`
        this.handlePrev = () => this.navigateMedia(-1);
        this.handleNext = () => this.navigateMedia(1);

        prevButton.addEventListener('click', this.handlePrev);
        nextButton.addEventListener('click', this.handleNext);
    }

    navigateMedia(direction) {
        if (!this.mediaIds || this.mediaIds.length === 0) {
            console.error("mediaIds est vide ou non défini.");
            return;
        }

        // Mettre à jour l'index actuel pour qu'il boucle correctement
        this.currentIndex = (this.currentIndex + direction + this.mediaIds.length) % this.mediaIds.length;

        // Charger le média correspondant au nouvel index
        this.loadMedia(this.currentIndex);
    }

    closeLightbox() {
        this.modal.style.display = "none";
    }
}

window.lightboxInstance = new Lightbox();