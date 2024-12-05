// Class definition for filtering and displaying media
// Design Pattern: Observer Pattern & Factory Method Pattern


class FilterForm {
    constructor(photographers, media) {
        //init data for photographers and medias
        this.photographers = photographers;
        this.media = media;
        // Sélection div for menu
        this.filterSelect = document.querySelector('.filter-select'); 
        //init class and listeners
        this.init();
    }
    // Initialization method
    init() {
        this.populateFilterOptions();
        this.filterSelect.addEventListener('change', this.handleFilterChange.bind(this));
    }
    // Populate the filter options dynamically
    populateFilterOptions() {
        const options = [
            { value: 'title', text: 'Titre' },
            { value: 'popularity', text: 'Popularité' },
            { value: 'date', text: 'Date' }
            
        ];
        //options for menu 
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            this.filterSelect.appendChild(opt);
        });
    }
    // Handle changes in the filter selection
    handleFilterChange() {
        const selectedValue = this.filterSelect.value;
        
        // Dynamic retrieval of photographer ID by the DOM
        const photographerName = document.querySelector('.page__card--name').textContent;
        const photographer = this.photographers.find(p => p.name === photographerName);
        
        if (!photographer) {
            console.error("Photographe non trouvé pour le nom :", photographerName);
            return;
        }

        const photographerId = photographer.id;
        const photographerMedia = this.media.filter(media => media.photographerId === photographerId);
    
        // filter medias by selection
        let sortedMedia = this.sortByTitle(photographerMedia);
        console.log(photographerMedia)

        if (selectedValue === 'title') {
            sortedMedia = this.sortByTitle(photographerMedia);
        }  else if (selectedValue === 'date') {
            sortedMedia = this.sortByDate(photographerMedia);
        } else if  (selectedValue === 'popularity') {
            sortedMedia = this.sortByLikes(photographerMedia);
        }
    
        // update display of medias with sortedMedia and give `photographerId` for lightbox
        this.updateMediaDisplay(sortedMedia, photographerId);

        // Recalculate total likes and manage subscriptions
        let totalLikes = sortedMedia.reduce((sum, media) => sum + media.likes, 0);
        const wishlistSubject = new WishlistSubject();
        const wishlistCounter = new WhishListCounter(totalLikes);
        wishlistSubject.subscribe(wishlistCounter);

        // Adding events for the "like" buttons
        const photographerInstance = new photographerCardTemplate(photographer);
        photographerInstance.handlelikeButton(sortedMedia, wishlistSubject, wishlistCounter);
    }
    // Sorting methods for media
    sortByTitle(media) {
        return media.sort((a, b) => a.title.localeCompare(b.title));
    }
    sortByLikes(media) {
        return media.sort((a, b) => b.likes - a.likes);
    }

    sortByDate(media) {
        return media.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Update the media display dynamically
    updateMediaDisplay(sortedMedia, photographerId) {
        const mediaWrapper = document.querySelector('.photographer-media');
        mediaWrapper.innerHTML = ''; 
    // Added sorted media models
        sortedMedia.forEach(media => {
            const mediaTemplate = this.createMediaTemplate(media);
            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
        });
    
        // Setting up triggers to open lightbox with filtered media
        const mediaElements = document.querySelectorAll('.lightbox-trigger');
        mediaElements.forEach((element, index) => {
            element.addEventListener('click', (event) => {
            event.preventDefault();
            const photographerFirstName = this.photographers.find(p => p.id === photographerId).name.split(" ")[0];
            // Pass `null` for `sortedMedia` if we use default media without filter
            const mediaToPass = sortedMedia.length ? sortedMedia : null;
            // Displays the lightbox with sorted media
             window.lightboxInstance.displayLightbox(sortedMedia[index], photographerId, photographerFirstName, mediaToPass);
            });
         // Recalculate focusables for LightboxFocusTrap
         const lightboxWrapper = document.querySelector('.lightbox_modal');
         const lightboxFocusTrap = new LightboxFocusTrap(lightboxWrapper);
         // Explicit focus on .lightbox-center
         const lightboxCenter = lightboxWrapper.querySelector('.lightbox-center');
         if (lightboxCenter) {
             lightboxCenter.focus(); 
         }
     });
 }
    // Create a template for media items (images/videos)
    createMediaTemplate(media) {
        const photographerFirstName = this.photographers.find(p => p.id === media.photographerId).name.split(" ")[0];
        
        let mediaTemplate = '';
    
        if (media.image) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <a href="#" class="lightbox-trigger" title="image ${media.title}, vue réduite" 
                        data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.image}" data-type="image">
                        <img src="./assets/PhotosVideos/${photographerFirstName}/${media.image}" alt="lien vers le media ${media.title} de ${media.name}">
                    </a>
                </article>
                <div class="media-text">
                    <span class="media-title">${media.title}</span>
                    <span class="nb-likes" >
                    <span class="likes-count">${media.likes}</span>
                        <i role="button" class="fa-regular fa-heart wish-btn" data-id="${media.id}" aria-pressed="false" aria-label="Activer le like pour ce media"  tabindex="0" ></i>
                    </span>
                </div>
            </div>`;
        } else if (media.video) {
            mediaTemplate = `
            <div class="media">
                <article class="media-card">
                    <a href="#" class="lightbox-trigger" title="video ${media.title}, vue réduite" 
                    data-media-url="./assets/PhotosVideos/${photographerFirstName}/${media.video}" data-type="video">
                        <video class="video-thumbnail" tabindex="-1" >
                            <source src="./assets/PhotosVideos/${photographerFirstName}/${media.video}" type="video/mp4">
                        </video>
                    </a>
                </article>
                <div class="media-text">
                    <span class="media-title">${media.title}</span>
                    <span class="nb-likes" >
                    <span class="likes-count">${media.likes}</span>
                        <i role="button" class="fa-regular fa-heart wish-btn" data-id="${media.id}" aria-pressed="false" aria-label="Activer le like pour ce media"  tabindex="0" ></i>
                    </span>
                </div>
            </div>`;
        }
    
        return mediaTemplate;
    }
    
}

// Fetch data from JSON file and initialize the FilterForm
fetch('./data/photographers.json')
    .then(response => response.json())
    .then(data => {
        const photographers = data.photographers;
        const media = data.media;
        new FilterForm(photographers, media);
    })
    .catch(error => console.error('Error fetching the JSON:', error));