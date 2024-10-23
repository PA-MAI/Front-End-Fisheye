class FilterForm {



    constructor(photographers, media) {
        this.photographers = photographers;
        this.media = media;
        this.filterSelect = document.querySelector('.filter-select'); 
        this.init();
    }

    init() {
        this.populateFilterOptions();
        this.filterSelect.addEventListener('change', this.handleFilterChange.bind(this));
    }

    populateFilterOptions() {
        const options = [
            { value: 'popularity', text: 'Popularité' },
            { value: 'date', text: 'Date' },
            { value: 'title', text: 'Titre' }
        ];

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            this.filterSelect.appendChild(opt);
        });
    }
    
    handleFilterChange() {
        const selectedValue = this.filterSelect.value;
        
        // Filtre les médias pour ne garder que ceux du photographe affiché
        const photographerId = this.photographers[0].id; // Remplace par l'ID du photographe actuel
        const photographerMedia = this.media.filter(media => media.photographerId === photographerId);
    
        let sortedMedia;
        if (selectedValue === 'popularity') {
            sortedMedia = this.sortByLikes(photographerMedia);
        } else if (selectedValue === 'date') {
            sortedMedia = this.sortByDate(photographerMedia);
        } else if (selectedValue === 'title') {
            sortedMedia = this.sortByTitle(photographerMedia);
        }
    
        // Met à jour l'affichage des médias avec sortedMedia
        this.updateMediaDisplay(sortedMedia);
        let totalLikes = photographerMedia.reduce((sum, media) => sum + media.likes, 0);
        console.log("Total Likes au chargement : ", totalLikes); // Vérification de la valeur
        
        const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);

        // Re-applique les écouteurs d'événements pour les boutons de "like"
    const photographerInstance = new photographerCardTemplate(this.photographers[0]); 
    // Assure que wishlistSubject est bien défini ou passé ici
    photographerInstance.handlelikeButton(sortedMedia, wishlistSubject, wishlistCounter); 


}
    

    sortByLikes(media) {
        return media.sort((a, b) => b.likes - a.likes); // Tri décroissant par le nombre de likes
    }

    sortByDate(media) {
        return media.sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri décroissant par date
    }

    sortByTitle(media) {
        return media.sort((a, b) => a.title.localeCompare(b.title)); // Tri croissant par titre
    }

    updateMediaDisplay(sortedMedia) {
        // mise à jour de l'affichage des médias
        const mediaWrapper = document.querySelector('.photographer-media');
        mediaWrapper.innerHTML = ''; // Effacer l'affichage actuel

        sortedMedia.forEach(media => {
            const mediaTemplate = this.createMediaTemplate(media);
            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
        });
    }

    createMediaTemplate(media) {
        const photographerFirstName = this.photographers.find(p => p.id === media.photographerId).name.split(" ")[0];
        
        let mediaTemplate = '';
    
        if (media.image) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="${media.title}">
                </article>
                <div class="media-text">
                    <span class="media-title">${media.title}</span>
                    <span class="nb-likes">
                        <span class="likes-count">${media.likes}</span> 
                        <i class="fa-regular fa-heart wish-btn" aria-hidden="true" data-id="${media.id}"></i>
                    </span>
                </div>
            </div>`;
        } else if (media.video) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <a href="./assets/PhotosVideos/${photographerFirstName}/${media.video}" target="_blank" title="Watch ${media.title}">
                        <video class="video-thumbnail" controls>
                            <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </a>
                    <div class="media-text">
                        <span class="media-title">${media.title}</span>
                        <span class="nb-likes">
                            <span class="likes-count">${media.likes}</span>
                            <i class="fa-regular fa-heart wish-btn" aria-hidden="true" data-id="${media.id}"></i>
                        </span>
                    </div>
                </article>
            </div>`;
        }
    
        return mediaTemplate;
    }
}

// recuperation des données du JSON
fetch('./data/photographers.json')
    .then(response => response.json())
    .then(data => {
        const photographers = data.photographers;
        const media = data.media;
        new FilterForm(photographers, media);
    })
    .catch(error => console.error('Error fetching the JSON:', error));