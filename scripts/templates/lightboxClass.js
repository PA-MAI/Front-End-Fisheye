// Design Pattern: **State Pattern**
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
    // Design Pattern: **Promise-based Handling** (Programmation Asynchrone)
    async displayLightbox(mediaData, photographerId, photographerFirstName, sortedMedia = null) {

        // Promise: Uses `sortedMedia` if available, otherwise loads default media
        this.mediaData = sortedMedia || await this.pageApi.getDefaultMedia(photographerId);

        // Ensure `mediaData` is an array, otherwise assign an empty array
        if (!Array.isArray(this.mediaData)) {
            console.error("mediaData n'est pas un tableau. Assignation d'un tableau vide.");
            
            this.mediaData = [];
        }

        // Initialize `mediaIds` for navigation
        this.mediaIds = this.mediaData.map(media => media.id);

        // Determine the starting index in `mediaIds`
        this.currentIndex = this.mediaIds.indexOf(mediaData.id);

        // Assign the photographer's first name
        this.photographerFirstName = photographerFirstName;

        if (this.currentIndex === -1) {
            console.error("Erreur : ID du média initial non trouvé dans mediaIds.");
            return;
        }

        // Load the initial media
        this.loadMedia(this.currentIndex);

        // Show the lightbox
        this.modal.style.display = "flex";

        // Setup navigation and close listeners
        this.setupNavigationListeners();
        this.setupCloseListeners();
    }
    
    // Design Pattern: **Factory Pattern**
    // brings up information from the media
    loadMedia(index) {
        const mediaId = this.mediaIds[index];
        
        // Retrieve the corresponding media by ID
        const currentMedia = this.mediaData.find(media => media.id === mediaId);
        if (!currentMedia) {
            console.error("Média non trouvé pour l'ID :", mediaId);
            return;
        }

        // Build the full path of the media using the photographer's first name
        const mediaUrl = `./assets/PhotosVideos/${this.photographerFirstName}/${currentMedia.image || currentMedia.video}`;
        const mediaType = currentMedia.image ? 'image' : 'video';

        // Update the lightbox with title and price
        this.updateLightboxContent(mediaUrl, mediaType, currentMedia.title, currentMedia.price);
    }
    
    // Design Pattern: **Template Method**
    // inject the lightbox
    updateLightboxContent(mediaUrl, mediaType, title, price) {
        const lightboxWrapper = this.modal.querySelector(".lightbox_modal");
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
       

        // Insert new content
        lightboxWrapper.insertAdjacentHTML('beforeend', lightboxTemplate);

        // Update navigation listeners and enable focus trap
        this.setupCloseListeners();
        this.setupNavigationListeners();

        // Activate focus trap
        const lightboxFocusTrap = new LightboxFocusTrap(lightboxWrapper);
        //console.warn("vision de lightboxFocusTrap", lightboxFocusTrap )

        // Force initial focus on `.lightbox-center`
        setTimeout(() => {
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
            if (lightboxCenter) {
                lightboxCenter.focus();
            }
        }, 300); // Minimal delay for DOM rendering
    
        }

        
        // Design Pattern: **Observer Pattern**
        // Attaches the lightbox close event with click or keyboard close
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

        //Attach other keyboard and click events to the lightbox
        setupNavigationListeners() {
            // Sélect sections
            const prevButton = this.modal.querySelector('.lightbox-prev');
            const nextButton = this.modal.querySelector('.lightbox-next');
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
        
            // Checking the presence of elements
            if (!prevButton || !nextButton || !lightboxCenter) {
                console.error("Erreur : un élément requis est introuvable pour la navigation.");
                return;
            }
        
            // Delete old listeners to avoid duplicates
            prevButton.removeEventListener('click', this.handlePrev);
            nextButton.removeEventListener('click', this.handleNext);
            lightboxCenter.removeEventListener('keydown', this.handleKeydown);
        
            // Attach navigation handlers
            this.handlePrev = () => this.navigateMedia(-1);
            this.handleNext = () => this.navigateMedia(1);

            // Handling click and keyboard events on chevrons
            let isProcessing = false;
            
            const handlePrevButton = (event) => {
                if (isProcessing) return; 
                isProcessing = true;
                event.preventDefault();
                event.stopPropagation();
            
                if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
                    console.log(`Navigation déclenchée: direction -1, index actuel : ${this.currentIndex}`);
                    this.handlePrev();
                }
                setTimeout(() => { isProcessing = false; }, 200); // Delay to prevent double execution
            };
        
            const handleNextButton = (event) => {
                if (isProcessing) return; 
                isProcessing = true;
            
                event.preventDefault();
                event.stopPropagation();
            
                if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
                    console.log(`Navigation déclenchée: direction +1, index actuel : ${this.currentIndex}`);
                    this.handleNext();
                }
            
                setTimeout(() => { isProcessing = false; }, 200); // Delay to prevent double execution
            };
            // Add listeners for buttons
            nextButton.addEventListener('click', handleNextButton,  { once: true });
            nextButton.addEventListener('keydown', handleNextButton, { once: true });
            prevButton.addEventListener('click', handlePrevButton, { once: true });
            prevButton.addEventListener('keydown', handlePrevButton, { once: true });
        


            // Keyboard event handler on the central modal
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
                    this.closeLightbox(); // close lightbox
                }
            };
            lightboxCenter.addEventListener('keydown', this.handleKeydown);

        }
        // manages navigation between media
        navigateMedia(direction) {
            if (!this.mediaIds || this.mediaIds.length === 0) {
                console.error("mediaIds est vide ou non défini.");
                return;
            }
        
            // Update the current index so that it loops properly
            this.currentIndex = (this.currentIndex  + direction + this.mediaIds.length) % this.mediaIds.length;
            console.log(`Navigation déclenchée : direction ${direction}, index actuel : ${this.currentIndex}`);
        
            // Load the media corresponding to the new index
            this.loadMedia(this.currentIndex);
        
            // Synchronize the focus trap
            const lightboxFocusTrap = new LightboxFocusTrap(this.modal.querySelector('.lightbox_modal'));
            lightboxFocusTrap.updateFocusables();
        
            // Force focus on main container after navigation
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
            if (lightboxCenter) {
                lightboxCenter.focus();
            }
            
            console.log("Focus avant navigation :", document.activeElement);
            
        }
        // manages closing the lightbox
        closeLightbox() {
            this.modal.style.display = "none";
        
            //Remove all listeners related to .lightbox-center
            const lightboxCenter = this.modal.querySelector('.lightbox-center');
            if (lightboxCenter) {
                lightboxCenter.removeEventListener('keydown',this.handleKeydown);
            }
        
            // Redirect focus to the opening trigger
            const openTrigger = document.querySelector('[data-lightbox-trigger]');
            if (openTrigger) {
                openTrigger.focus();
            }
            // Allows you to reset listeners if necessary
            this.listenersSetup = false; 

        
    }
}
//focus trap for lightbox
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

        // add eventlistener
        document.addEventListener("keydown", this.trapFocus.bind(this));
        
    }

    trapFocus(event) {
        if (event.key === "Tab") {
            if (event.shiftKey) {
                // If Shift + Tab and focus on the first element
                if (document.activeElement === this.firstFocusableElement) {
                    event.preventDefault();
                    this.lastFocusableElement.focus();
                }
            } else {
                //If normal Tab and focus on last element
               if (document.activeElement === this.lastFocusableElement) {
                    event.preventDefault();
                    this.firstFocusableElement.focus();
                }
            }
        } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            // Prevents arrows from disrupting the focus trap
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
       
    }
}
// Activate lightbox
window.lightboxInstance = new Lightbox();