class Lightbox {
    constructor() {
        this.modal = document.getElementById("lightbox_modal");
        this.pageApi = new ProfilApiPhotographer('./data/photographers.json'); 
        this.currentIndex = 0;
        this.mediaData = [];
        this.mediaIds = []; 
        this.photographerFirstName = "";
        this.focusTrap = null;
        


    }

    async displayLightbox(mediaData, photographerId, photographerFirstName, sortedMedia = null) {
        
    
        // promesse: Utilise `sortedMedia` si disponible, sinon charge les médias par défaut
        this.mediaData = sortedMedia || await this.pageApi.getDefaultMedia(photographerId);

        // Vérifie que `mediaData` est bien un tableau, sinon assigne un tableau vide
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
    // fait remonter les informations du média
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
    // injecte la lightbox
    updateLightboxContent(mediaUrl, mediaType, title, price) {
        const lightboxWrapper = this.modal.querySelector(".lightbox_modal");
        // Efface le contenu précédent
        lightboxWrapper.innerHTML = ''; 

        let lightboxTemplate = '';
        if (mediaType === 'image') {
            lightboxTemplate = `
            
            <div class="lightbox-left">
                <span class="lightbox-anchor1" aria-hidden="true"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="media précédent" role="button" tabindex="0"></i>
                <span class="lightbox-anchor" aria-hidden="true"></span> 
            </div>
            <div class="lightbox-center" aria-label="vue rapprochée du media ${title}" role="dialog" tabindex="0" >
                <div class="player">
                    <img src="${mediaUrl}" alt="${title}">
                    <div class="lightbox-text" aria-hidden="true">
                        <span id="lightboxTitle" aria-hidden="true">${title}</span> <!-- Prix optionnel <span>${price}€</span> -->
                    </div> 
                </div>
            </div>
            <div class="lightbox-right">
                <img role="button" src="assets/icons/closelight.svg" aria-label="Fermer la modale" class="lightbox-close-btn" tabindex="0">
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="media suivante" role="button" tabindex="0"></i>
                <span class="lightbox-anchor" aria-hidden="true"></span> 
            </div>
           </div>
            `;
        } else if (mediaType === 'video') {
            lightboxTemplate = `
            <div class="lightbox-left">
                <span class="lightbox-anchor" aria-hidden="true"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="media précédent" role="button" tabindex="0"></i>
                <span class="lightbox-anchor" aria-hidden="true"></span> 
            </div>
            <div class="lightbox-center" aria-label="vue rapprochée du media ${title}" role="dialog" tabindex="0" >
                <div class="player">
                    <video class="lightbox-video" src="${mediaUrl}" alt="Vidéo ${title}" controls=""></video>
                    <div class="lightbox-text" aria-hidden="true">
                        <span id="lightboxTitle" aria-hidden="true">${title}</span><!-- Prix optionnel <span>${price}€</span> -->
                    </div>
                </div>
            </div>
            <div class="lightbox-right">
                <img role="button" src="assets/icons/closelight.svg" aria-label="ferme la lightbox" class="lightbox-close-btn" tabindex="0">
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="media suivant" role="button" tabindex="0"></i>
                <span class="lightbox-anchor" aria-hidden="true"></span> 
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
        //console.warn("vision de lightboxFocusTrap", lightboxFocusTrap )

        // **Forcer le focus initial sur .lightbox-center**
        setTimeout(() => {
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
            if (lightboxCenter) {
                lightboxCenter.focus();
            }
        }, 300); // Délai minimal pour attendre le rendu DOM
    
        }

        // Attache l'événement de fermeture de la lightbox avec fermeture click ou clavier
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

        //Attache les autres evenements clavier et click sur la lightbox
        setupNavigationListeners() {
            // Sélection des éléments nécessaires
            const prevButton = this.modal.querySelector('.lightbox-prev');
            const nextButton = this.modal.querySelector('.lightbox-next');
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
        
            // Vérification de la présence des éléments
            if (!prevButton || !nextButton || !lightboxCenter) {
                console.error("Erreur : un élément requis est introuvable pour la navigation.");
                return;
            }
        
            // Supprimer les anciens écouteurs pour éviter les doublons
            prevButton.removeEventListener('click', this.handlePrev);
            nextButton.removeEventListener('click', this.handleNext);
            lightboxCenter.removeEventListener('keydown', this.handleKeydown);
        
            // Attacher les gestionnaires de navigation
            this.handlePrev = () => this.navigateMedia(-1);
            this.handleNext = () => this.navigateMedia(1);




        // Gestion des événements click et clavier sur les chevrons
        let isProcessing = false;
        
        const handlePrevButton = (event) => {
            if (isProcessing) return; // Ignore si déjà en traitement
            isProcessing = true;
            event.preventDefault();
            event.stopPropagation();
        
            if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
                console.log(`Navigation déclenchée: direction -1, index actuel : ${this.currentIndex}`);
                this.handlePrev();
            }
            setTimeout(() => { isProcessing = false; }, 200); // Délai pour empêcher une double exécution
        };
        
        const handleNextButton = (event) => {
            if (isProcessing) return; // Ignore si déjà en traitement
            isProcessing = true;
        
            event.preventDefault();
            event.stopPropagation();
        
            if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
                console.log(`Navigation déclenchée: direction +1, index actuel : ${this.currentIndex}`);
                this.handleNext();
            }
        
            setTimeout(() => { isProcessing = false; }, 200); // Délai pour empêcher une double exécution
        };
        // Ajout des écouteurs pour les boutons
        nextButton.addEventListener('click', handleNextButton,  { once: true });
        nextButton.addEventListener('keydown', handleNextButton, { once: true });
        prevButton.addEventListener('click', handlePrevButton, { once: true });
        prevButton.addEventListener('keydown', handlePrevButton, { once: true });
        


            // Gestionnaire d'événements clavier sur 
            this.handleKeydown = (event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.handlePrev(); 
                    

                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.handleNext(); 


                } else if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.closeLightbox(); // Fermer la lightbox
                }
            };
            lightboxCenter.addEventListener('keydown', this.handleKeydown);

        }

        navigateMedia(direction) {
            if (!this.mediaIds || this.mediaIds.length === 0) {
                console.error("mediaIds est vide ou non défini.");
                return;
            }
        
            // Mettre à jour l'index actuel pour qu'il boucle correctement
            this.currentIndex = (this.currentIndex + direction + this.mediaIds.length) % this.mediaIds.length;
            console.log(`Navigation déclenchée : direction ${direction}, index actuel : ${this.currentIndex}`);
        
            // Charger le média correspondant au nouvel index
            this.loadMedia(this.currentIndex);
        
            // Synchroniser le piège à focus
            const lightboxFocusTrap = new LightboxFocusTrap(this.modal.querySelector('.lightbox_modal'));
            lightboxFocusTrap.updateFocusables();
        
            // Forcer le focus sur le conteneur principal après navigation
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
            if (lightboxCenter) {
                lightboxCenter.focus();
            }
            
            console.log("Focus avant navigation :", document.activeElement);
            
        }

    closeLightbox() {
        this.modal.style.display = "none";
    
        // Supprimer tous les écouteurs liés à .lightbox-center
        const lightboxCenter = this.modal.querySelector('.lightbox-center');
        if (lightboxCenter) {
            lightboxCenter.removeEventListener('keydown',this.handleKeydown);
        }
    
        // Rediriger le focus vers le déclencheur d'ouverture
        const openTrigger = document.querySelector('[data-lightbox-trigger]');
        if (openTrigger) {
            openTrigger.focus();
        }
        // Permet de réinitialiser les écouteurs si nécessaire
        this.listenersSetup = false; 

        
    }
}
//piege à focus pour la lightbox
class LightboxFocusTrap {

    constructor(lightboxWrapper) {
        this.lightboxWrapper = lightboxWrapper;
        this.focusableElements = lightboxWrapper.querySelectorAll(
           'button, [tabindex]:not([tabindex="-1"])'
        );
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
        if (this.focusableElements.length === 0) {
            console.error("Aucun élément focusable trouvé dans la lightbox !");
        }

        // Ajoute l'écouteur d'événements
        document.addEventListener("keydown", this.trapFocus.bind(this));
        
    }

    trapFocus(event) {
        if (event.key === "Tab") {
            if (event.shiftKey) {
                // Si Shift + Tab et focus sur le premier élément
                if (document.activeElement === this.firstFocusableElement) {
                    event.preventDefault();
                    this.lastFocusableElement.focus();
                }
            } else {
                //Si Tab normal et focus sur le dernier élément
               if (document.activeElement === this.lastFocusableElement) {
                    event.preventDefault();
                    this.firstFocusableElement.focus();
                }
            }
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            // Empêche les flèches de perturber le piège à focus
            event.stopPropagation();
        }
       
    }
    updateFocusables() {
        this.focusableElements = this.lightboxWrapper.querySelectorAll(
            'button, [tabindex]:not([tabindex="-1"])'
        );
        if (!this.firstFocusableElement || !this.lastFocusableElement) {
            console.error("Focusable elements incorrects. Vérifie le DOM de la lightbox.");
            return;
        }
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
        //console.log("first",firstFocusableElement)
        //console.log("last",lastFocusableElement)
    }
}

window.lightboxInstance = new Lightbox();