class Lightbox {
    constructor() {
        this.modal = document.getElementById("lightbox_modal");
        this.modal.querySelector('.lightbox-close-btn').addEventListener('click', () => this.closeLightbox());
        this.currentIndex = 0; // To keep track of the current media index
    }

    displayLightbox(mediaUrl, mediaType, mediaData) {
        this.updateLightboxContent(mediaUrl, mediaType, mediaData);
        this.modal.style.display = "flex";
        this.currentIndex = mediaData.index; // Set the current index for navigation
        this.addNavigationListeners(mediaData); // Add navigation functionality
    }

    updateLightboxContent(mediaUrl, mediaType, mediaData) {
        const lightboxWrapper = this.modal.querySelector(".lightbox_modal");
        lightboxWrapper.innerHTML = ''; // Clear previous content

        let lightboxTemplate = this.createLightboxTemplate(mediaUrl, mediaType, mediaData);
        lightboxWrapper.insertAdjacentHTML('beforeend', lightboxTemplate);
    }

    createLightboxTemplate(mediaUrl, mediaType, mediaData) {
        let template = `
            <div class="lightbox-left">
                <span class="lightbox-anchor"></span> 
                <i class="fa-sharp fa-solid fa-chevron-left" aria-label="Previous media"></i>
                <span class="lightbox-anchor"></span> 
            </div>
            <div class="lightbox-center" aria-label="Image closeup view">
                <div class="player">${this.getMediaElement(mediaUrl, mediaType, mediaData.title)}</div>
            </div>
            <div class="lightbox-right">
                <img src="assets/icons/closelight.svg" aria-label="Close lightbox window" class="lightbox-close-btn" />
                <i class="fa-sharp fa-solid fa-chevron-right" aria-label="Next media"></i>
                <span class="lightbox-anchor"></span> 
            </div>
        `;
        return template;
    }

    getMediaElement(mediaUrl, mediaType, title) {
        if (mediaType === 'image') {
            return `<img src="${mediaUrl}" alt="${title}" aria-label="${title}">`;
        } else if (mediaType === 'video') {
            return `<iframe height="600" width="800" src="${mediaUrl}" allowfullscreen></iframe>`;
        }
        return '';
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

    closeLightbox() {
        this.modal.style.display = "none";
    }
}