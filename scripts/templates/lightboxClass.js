class Lightbox {
    constructor() {
        this.modal = document.getElementById("lightbox_modal");
    }

    // Méthode pour afficher la lightbox
    displayLightbox(mediaUrl, mediaType) {
        
        this.updateLightboxContent(mediaUrl, mediaType);
        this.modal.style.display = "flex";
        
        
        
    }

    // Méthode pour mettre à jour le contenu de la lightbox
    updateLightboxContent(mediaUrl, mediaType, media) {
        
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
                    <img src="${mediaUrl}" alt="${this.title} du ${this.date}" aria-label="${this.title} du ${this.date}">
                    <div class="lightbox-text">
                        <span>${this.title} </span>
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

       
closeLightbox = () => {
    this.modal.style.display = "none";
}
}
