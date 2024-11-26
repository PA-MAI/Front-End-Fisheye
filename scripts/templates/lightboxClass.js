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
        this.setupCloseListeners();
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
        lightboxWrapper.innerHTML = ''; // Efface le contenu précédent

        let lightboxTemplate = '';
        if (mediaType === 'image') {
            lightboxTemplate = `
            
            <div class="lightbox-left">
                <span class="lightbox-anchor1"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="media précédente" tabindex="0"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            <div class="lightbox-center" aria-label="vue agrandie du media ${title}. Vendue ${price} euros" tabindex="0" aria-live="assertive">
                <div class="player">
                    <img src="${mediaUrl}" alt="${title} - ${price}€" >
                    <div class="lightbox-text" aria-labelledby="lightboxTitle" >
                        <span id="lightboxTitle">${title}</span><span>${price}€</span>
                    </div> 
                </div>
            </div>
            <div class="lightbox-right">
                <img type="button" src="assets/icons/closelight.svg" aria-label="Fermer la modale" class="lightbox-close-btn" tabindex="0">
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="media suivante" tabindex="0"></i>
                <span class="lightbox-anchor"></span> 
            </div>
           </div>
            `;
        } else if (mediaType === 'video') {
            lightboxTemplate = `
            <div class="lightbox-left">
                <span class="lightbox-anchor"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="media précédente" tabindex="0"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            <div class="lightbox-center" aria-label="vue agrandie du media ${title}. Vendue ${price} euros" tabindex="0" aria-live="assertive">
                <div class="player">
                    <iframe height="500" width="800" src="${mediaUrl}" allowfullscreen></iframe>
                    <div class="lightbox-text" aria-labelledby="lightboxTitle">
                        <span id="lightboxTitle">${title}</span><span>${price}€</span>
                    </div>
                </div>
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="Close dialog" class="lightbox-close-btn" tabindex="0">
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="media suivante" tabindex="0"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            `;
        }
       

        // Insertion du contenu...
        lightboxWrapper.insertAdjacentHTML('beforeend', lightboxTemplate);
        // Mettre à jour les écouteurs de navigation à chaque chargement de contenu
        this.setupCloseListeners();
        this.setupNavigationListeners();

         // Activer le piège à focus
        const lightboxFocusTrap = new LightboxFocusTrap(lightboxWrapper);
        console.log(lightboxFocusTrap )
        // **Forcer le focus initial sur .lightbox-center**
        setTimeout(() => {
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
            if (lightboxCenter) {
                lightboxCenter.focus();
            }
        }, 0); // Délai minimal pour attendre le rendu DOM
    
        }

    

        // Attacher l'événement de fermeture de la lightbox avec fermeture click ou clavier
        setupCloseListeners() {
            const closeButton = this.modal.querySelector('.lightbox-close-btn');
            if (closeButton) {
                closeButton.addEventListener('click', () => this.closeLightbox());
                closeButton.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        this.closeLightbox();
                    }
                });
            }
    
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.closeLightbox();
                }
            });
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

        
        if (prevButton) {
            prevButton.addEventListener('click', this.handlePrev);
            prevButton.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ' || event.key ===  'ArrowLeft'){ 
                    event.preventDefault(); 
                  //  console.log('previous picture via le clavier !');
                    this.handlePrev(); 
        }
        });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', this.handleNext);      
            nextButton.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') { 
                    event.preventDefault(); 
                  //  console.log('next picture via le clavier !');
                    this.handleNext(); 
        }
        });
        }
      
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
        // Gérer le focus en fonction de la direction
        const prevButton = this.modal.querySelector('.lightbox-center')
        //('.lightbox-prev');
        const nextButton = this.modal.querySelector('.lightbox-center')
        //('.lightbox-next');

        if (direction === -1 && prevButton) {
        prevButton.focus(); // Rester sur le bouton "Précédent"
        } else if (direction === 1 && nextButton) {
        nextButton.focus(); // Rester sur le bouton "Suivant"
    }
    }

    closeLightbox() {
        
        this.modal.style.display = "none";
        const lightboxWrapper = this.modal.querySelector('.lightbox_modal');
        lightboxWrapper.classList.add('hidden'); 
       
        // Redonne le focus au bouton qui a ouvert la lightbox
        document.querySelector('.lightbox_modal').focus();
    }
}
class LightboxFocusTrap {
    constructor(lightboxWrapper) {
        this.lightboxWrapper = lightboxWrapper;
        this.focusableElements = lightboxWrapper.querySelectorAll(
            'button, [tabindex]:not([tabindex="-1"], a, input, select, textarea)'
        );
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

        // Ajoute l'écouteur d'événements
        document.addEventListener("keydown", this.trapFocus.bind(this));
    }

    trapFocus(e) {
        if (e.key !== "Tab") return;

        if (e.shiftKey) {
            // Si la touche Shift est enfoncée et que le focus est sur le premier élément, on le déplace sur le dernier
            if (document.activeElement === this.firstFocusableElement) {
                this.lastFocusableElement.focus();
                e.preventDefault(); // Empêche le focus de sortir
            }
        } else {
            // Si la touche Tab est enfoncée, et que le focus est sur le dernier élément, on le déplace sur le premier
            if (document.activeElement === this.lastFocusableElement) {
                this.firstFocusableElement.focus();
                e.preventDefault(); // Empêche le focus de sortir
            }
        }
    }
    updateFocusables() {
        this.focusableElements = this.lightboxWrapper.querySelectorAll(
            'button, [tabindex]:not([tabindex="-1"], a, input, select, textarea)'
        );
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
    }
}
window.lightboxInstance = new Lightbox();