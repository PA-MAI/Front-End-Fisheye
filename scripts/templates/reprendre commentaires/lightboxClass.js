

class Lightbox {
    constructor(title, date) {
        this.modal = document.getElementById("lightbox_modal");
        this.pageApi = new ProfilApiPhotographer('../data/photographers.json');
        this._title = title;
        this._date = date;
        this.currentIndex = 0; // To keep track of the current media index
        this.mediaData = []; // Stocker les données des médias
        this.photographerFirstName = ""; // Stocker le prénom du photographe
    }


    
    // Méthode pour afficher la lightbox
    async displayLightbox(mediaUrl, mediaType, initialMediaData) {
        // Récupérer les données depuis l'API
        const data = await this.pageApi.getProfilAndMedia();
        this.mediaData = data.media;

        // Extraire le prénom du photographe pour l'utiliser dans le chemin du média
        this.photographerFirstName = initialMediaData.photographerName.split(" ")[0];
        
        // Trouver l'index du média initial à afficher
        this.currentIndex = this.mediaData.findIndex(media => media.id === initialMediaData.id);
        const currentMedia = this.mediaData[this.currentIndex];
        const mediaUrl = `../assets/PhotosVideos/${this.photographerFirstName}/${currentMedia.image || currentMedia.video}`;
        const mediaType = currentMedia.image ? 'image' : 'video';

        // Utiliser le média initial pour définir le titre et la date
        this.updateLightboxContent(mediaUrl, mediaType, currentMedia.title, currentMedia.date);

        this.modal.style.display = "flex";
        this.addNavigationListeners(); // Ajouter les listeners de navigation
    }
    // Méthode pour mettre à jour le contenu de la lightbox
    updateLightboxContent(mediaUrl, mediaType,title, date) {
        console.log("Chemin du média:", mediaUrl);
        console.log("Titre:", title);
        console.log("Date:", date);
     // Vérifie les valeurs de title et date
        const lightboxWrapper = this.modal.querySelector(".lightbox_modal");
        lightboxWrapper.innerHTML = ''; // Efface le contenu précédent
        


            // code existant pour afficher le contenu
        

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
                    <span>${this._title}</span> 
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
                        <pan>${title}</pan>
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

    navigateMedia(direction) {
        if (!this.mediaData || this.mediaData.length === 0) {
            console.error("mediaData is undefined or empty.");
            return;
        }
    
        this.currentIndex += direction;
        if (this.currentIndex < 0) {
            this.currentIndex = this.mediaData.length - 1; // Retourne au dernier élément
        } else if (this.currentIndex >= this.mediaData.length) {
            this.currentIndex = 0; // Retourne au premier élément
        }
    
        const currentMedia = this.mediaData[this.currentIndex];
        if (!currentMedia) {
            console.error("currentMedia is undefined at index:", this.currentIndex);
            return;
        }
    
        const mediaUrl = `../assets/PhotosVideos/${this.photographerFirstName}/${currentMedia.image || currentMedia.video}`;
        const mediaType = currentMedia.image ? 'image' : 'video';
    
        this.updateLightboxContent(mediaUrl, mediaType, currentMedia.title, currentMedia.date);
    }
closeLightbox = () => {
    this.modal.style.display = "none";
}
}
window.lightboxInstance = new Lightbox();
