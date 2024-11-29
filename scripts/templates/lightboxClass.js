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
                <span class="lightbox-anchor1" aria-hidden="true"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left lightbox-prev" aria-label="media précédent" role="button" tabindex="0"></i>
                <span class="lightbox-anchor" aria-hidden="true"></span> 
            </div>
            <div class="lightbox-center" aria-label="vue agrandie du media ${title}"role="dialog" tabindex="0" >
                <div class="player">
                    <img src="${mediaUrl}" alt="${title}">
                    <div class="lightbox-text" aria-hidden="true">
                        <span id="lightboxTitle" aria-hidden="true">${title}</span> <!-- Prix optionnel <span>${price}€</span> -->
                    </div> 
                </div>
            </div>
            <div class="lightbox-right">
                <img type="button" src="assets/icons/closelight.svg" aria-label="Fermer la modale" class="lightbox-close-btn" tabindex="0">
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
            <div class="lightbox-center" aria-label="vue agrandie du media ${title}" role="dialog" tabindex="0" >
                <div class="player">
                    <video class="lightbox-video" src="${mediaUrl}" alt="Vidéo ${title}" controls=""></video>
                    <div class="lightbox-text" aria-hidden="true">
                        <span id="lightboxTitle" aria-hidden="true">${title}</span><!-- Prix optionnel <span>${price}€</span> -->
                    </div>
                </div>
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="Close dialog" class="lightbox-close-btn" tabindex="0">
                <i class="fa-sharp fa-solid fa-chevron-right lightbox-next" aria-label="media suivant" role="button" tabindex="0"></i>
                <span class="lightbox-anchor" aria-hidden="true"></span> 
            </div>
            `;
        }
       

        // Insertion du contenu...
        lightboxWrapper.insertAdjacentHTML('beforeend', lightboxTemplate);

        // Réactivation du narrateur pour le titre après un délai
        //const lightboxTitle = this.modal.querySelector('#lightboxTitle');
        //setTimeout(() => {
        //if (lightboxTitle) {
        //lightboxTitle.setAttribute('aria-hidden', 'false'); // Rendre le titre lisible
        //}
        //}, 500); // Délai pour éviter les sauts


        // Mettre à jour les écouteurs de navigation à chaque chargement de contenu
        this.setupCloseListeners();
        this.setupNavigationListeners();

         // Activer le piège à focus
        const lightboxFocusTrap = new LightboxFocusTrap(lightboxWrapper);
        //console.log(lightboxFocusTrap )

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
            const lightboxCenter = this.modal.querySelector('.lightbox-center'); // Conteneur principal
        
            // Vérification de l'existence des boutons de navigation
            if (!prevButton || !nextButton || !lightboxCenter) {
                console.error("Erreur : un élément requis est introuvable pour la navigation.");
                return;
            }
        
            // Supprimer les anciens écouteurs d'événements pour éviter les doublons
            prevButton.removeEventListener('click', this.handlePrev);
            nextButton.removeEventListener('click', this.handleNext);
        
            // Définir les fonctions de navigation
            this.handlePrev = () => this.navigateMedia(-1);
            this.handleNext = () => this.navigateMedia(1);
        
            // Ajouter les événements `click` pour les chevrons
            prevButton.addEventListener('click', this.handlePrev);
            nextButton.addEventListener('click', this.handleNext);
        
            // Gérer les événements `keydown` uniquement dans `.lightbox-center`
            const handleKeydown = (event) => {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault(); // Empêche le comportement par défaut
                    event.stopPropagation(); // Empêche la propagation

                    const direction = event.key === 'ArrowLeft' ? -1 : 1;
                    
                    this.navigateMedia(direction); // Naviguer dans la direction appropriée
                } else if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    this.closeLightbox(); // Fermer la modale
                }
            };
            // Ajouter l'écouteur global pour la navigation clavier
            lightboxCenter.addEventListener('keydown', handleKeydown);
        
            // Gérer la navigation clavier sur les chevrons
            prevButton.addEventListener('keydown', (event) => {
               if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowLeft') {
                  event.preventDefault();
                  this.handlePrev();
               }
            });
        
            nextButton.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
                event.preventDefault();
                this.handleNext();
                }
          });
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
        //const prevButton = this.modal.querySelector('.lightbox-center')
        //('.lightbox-prev');
        //const nextButton = this.modal.querySelector('.lightbox-center')
        //('.lightbox-next');

        // Synchroniser le piège à focus
        const lightboxFocusTrap = new LightboxFocusTrap(this.modal.querySelector('.lightbox_modal'));
        lightboxFocusTrap.updateFocusables();

        // Forcer le focus sur le conteneur principal après navigation
        const lightboxCenter = this.modal.querySelector('.lightbox-center');
        if (lightboxCenter) {
        lightboxCenter.focus();
        }

      //  if (direction === -1 && prevButton) {
      //  prevButton.focus(); // Rester sur le bouton "Précédent"
      //  } else if (direction === 1 && nextButton) {
      //  nextButton.focus(); // Rester sur le bouton "Suivant"
    //}
    }

    closeLightbox() {
        this.modal.style.display = "none";
    
        // Supprimer tous les écouteurs liés à .lightbox-center
        const lightboxCenter = this.modal.querySelector('.lightbox-center');
        if (lightboxCenter) {
            lightboxCenter.removeEventListener('keydown');
        }
    
        // Rediriger le focus vers le déclencheur d'ouverture
        const openTrigger = document.querySelector('[data-lightbox-trigger]');
        if (openTrigger) {
            openTrigger.focus();
        }
    }
}
class LightboxFocusTrap {

    constructor(lightboxWrapper) {
        this.lightboxWrapper = lightboxWrapper;
        this.focusableElements = lightboxWrapper.querySelectorAll(
           'button, [tabindex]:not([tabindex="-1"], img, i, div)'
        );
        this.firstFocusableElement = this.focusableElements[0];
        this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];

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
            } //else {
                // Si Tab normal et focus sur le dernier élément
               // if (document.activeElement === this.lastFocusableElement) {
                //    event.preventDefault();
                //    this.firstFocusableElement.focus();
               // }
          //  }
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            // Empêche les flèches de perturber le piège à focus
            event.stopPropagation();
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
debugger
window.lightboxInstance = new Lightbox();