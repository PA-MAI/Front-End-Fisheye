class Lightbox {
    constructor(title, date) {
        this.modal = document.getElementById("lightbox_modal");
        this.pageApi = new ProfilApiPhotographer('./data/photographers.json');
        this._title = title;
        this._date = date;
        this.currentIndex = 0; // To keep track of the current media index
    }

    // Méthode pour afficher la lightbox
    displayLightbox(mediaUrl, mediaType, mediaData) {
        
        this.updateLightboxContent(mediaUrl, mediaType, mediaData);
        this.modal.style.display = "flex";
        this.currentIndex = mediaData.index; // Set the current index for navigation
        this.addNavigationListeners(mediaData); // Add navigation functionality

    }

    // Méthode pour mettre à jour le contenu de la lightbox
    updateLightboxContent(mediaUrl, mediaType, mediaData) {
        
        const lightboxWrapper = this.modal.querySelector(".lightbox_modal");
        lightboxWrapper.innerHTML = ''; // Efface le contenu précédent
        
        let lightboxTemplate = '';
        if (mediaType === 'image') {
            lightboxTemplate = `
            <div class="lightbox-left">
                <span class="lightbox-anchor"> </span> 
                <i class="fa-sharp fa-solid fa-chevron-left"></i>
                <span class="lightbox-anchor"> </span> 
            </div>
            <div class="lightbox-center" aria-label="image closeup view">
                <div class="player">
                    <img src="${mediaUrl}" alt="${this._title} du ${this._date}" aria-label="${this._title} du ${this._date}">
                    <div class="lightbox-text">
                        <span>${this._title} </span>
                    </div> 
                </div>
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="close lightbox window" class="lightbox-close-btn" />
                <i class="fa-sharp fa-solid fa-chevron-right"></i>
                <span class="lightbox-anchor"> </span> 
            </div>
                `;

        } else if (mediaType === 'video') {
            lightboxTemplate = `
             <div class="lightbox-left">
                <span class="lightbox-anchor"> </span> 
                <i class="fa-sharp fa-solid fa-chevron-left"></i>
                <span class="lightbox-anchor"> </span> 
            </div>
            <div class="lightbox-center">
                <div class="player">
                    <iframe
                        height="600"
                        width="800"
                        src="${mediaUrl}"
                        allowfullscreen
                    ></iframe>
                </div>
                <div class="lightbox-text">
                        <pan>Titre</pan>
                </div> 
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="close lightbox window" class="lightbox-close-btn" />
                <i class="fa-sharp fa-solid fa-chevron-right"></i>
                <span class="lightbox-anchor"> </span> 
            </div>
                `;
        }
    
        lightboxWrapper.insertAdjacentHTML('beforeend', lightboxTemplate);

    
        // Utiliser une fonction fléchée pour garder le bon contexte `this`
        this.modal.querySelector('.lightbox-close-btn').addEventListener('click', () => this.closeLightbox());

       }

       addNavigationListeners(mediaData) {
        const prevButton = this.modal.querySelector('.fa-chevron-left');
        const nextButton = this.modal.querySelector('.fa-chevron-right');

        prevButton.addEventListener('click', () => this.navigateMedia(-1, mediaData));
        nextButton.addEventListener('click', () => this.navigateMedia(1, mediaData));
    }

    navigateMedia(direction, mediaData) {
        this.currentIndex += direction;
        if (this.currentIndex < 0) {
            this.currentIndex = mediaData.length - 1; // Loop to last item
        } else if (this.currentIndex >= mediaData.length) {
            this.currentIndex = 0; // Loop to first item
        }
        const currentMedia = mediaData[this.currentIndex];
        const mediaUrl = `./assets/PhotosVideos/${currentMedia.photographerFirstName}/${currentMedia.image || currentMedia.video}`;
        const mediaType = currentMedia.image ? 'image' : 'video';
        this.updateLightboxContent(mediaUrl, mediaType, currentMedia);
    }

closeLightbox = () => {
    this.modal.style.display = "none";
}
}
