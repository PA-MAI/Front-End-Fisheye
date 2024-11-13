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
            { value: 'title', text: 'Titre' },
            { value: 'popularity', text: 'Popularité' },
            { value: 'date', text: 'Date' }
            
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
        
        // Obtient l'ID du photographe actuel dynamiquement en récupérant les éléments affichés sur la page
        const photographerName = document.querySelector('.page__card--name').textContent;
        const photographer = this.photographers.find(p => p.name === photographerName);
        
        if (!photographer) {
            console.error("Photographe non trouvé pour le nom :", photographerName);
            return;
        }

        const photographerId = photographer.id;
        const photographerMedia = this.media.filter(media => media.photographerId === photographerId);
    
        // Trier les médias en fonction de la sélection
        let sortedMedia;
        if (selectedValue === 'title') {
            sortedMedia = this.sortByTitle(photographerMedia);
        }  else if (selectedValue === 'date') {
            sortedMedia = this.sortByDate(photographerMedia);
        } else if  (selectedValue === 'popularity') {
            sortedMedia = this.sortByLikes(photographerMedia);
        }
    
        // Met à jour l'affichage des médias avec sortedMedia et passe `photographerId` pour la lightbox
        this.updateMediaDisplay(sortedMedia, photographerId);

        // Recalcule les likes totaux
        let totalLikes = sortedMedia.reduce((sum, media) => sum + media.likes, 0);
        const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);

        // Re-applique les écouteurs d'événements pour les boutons de "like"
        const photographerInstance = new photographerCardTemplate(photographer);
        photographerInstance.handlelikeButton(sortedMedia, wishlistSubject, wishlistCounter);
    }
    
    sortByTitle(media) {
        return media.sort((a, b) => a.title.localeCompare(b.title));
    }
    sortByLikes(media) {
        return media.sort((a, b) => b.likes - a.likes);
    }

    sortByDate(media) {
        return media.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    

    updateMediaDisplay(sortedMedia, photographerId) {
        const mediaWrapper = document.querySelector('.photographer-media');
        mediaWrapper.innerHTML = ''; // Effacer l'affichage actuel
    
        sortedMedia.forEach(media => {
            const mediaTemplate = this.createMediaTemplate(media);
            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
        });
    
        // Configuration des déclencheurs pour ouvrir la lightbox avec les médias filtrés
        const mediaElements = document.querySelectorAll('.lightbox-trigger');
        mediaElements.forEach((element, index) => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const photographerFirstName = this.photographers.find(p => p.id === photographerId).name.split(" ")[0];
                //debugger
                // Passer `null` pour `sortedMedia` si nous utilisons les médias par défaut sans filtre
                const mediaToPass = sortedMedia.length ? sortedMedia : null;
                window.lightboxInstance.displayLightbox(sortedMedia[index], photographerId, photographerFirstName, mediaToPass);
            });
        });
    }

    createMediaTemplate(media) {
        const photographerFirstName = this.photographers.find(p => p.id === media.photographerId).name.split(" ")[0];
        
        let mediaTemplate = '';
    
        if (media.image) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <a href="#" class="lightbox-trigger" role="link" data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.image}" data-type="image">
                        <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="lien vers la photo ${media.title} de ${media.name}">
                    </a>
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
                    <a href="#" class="lightbox-trigger" role="link" data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.video}" data-type="video">
                        <video class="video-thumbnail">
                            <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </a>
                </article>
                <div class="media-text">
                    <span class="media-title">${media.title}</span>
                    <span class="nb-likes">
                        <span class="likes-count">${media.likes}</span>
                        <i class="fa-regular fa-heart wish-btn" aria-hidden="true" data-id="${media.id}"></i>
                    </span>
                </div>
            </div>`;
        }
    
        return mediaTemplate;
    }
    
}

// Récupération des données du JSON
fetch('./data/photographers.json')
    .then(response => response.json())
    .then(data => {
        const photographers = data.photographers;
        const media = data.media;
        new FilterForm(photographers, media);
    })
    .catch(error => console.error('Error fetching the JSON:', error));