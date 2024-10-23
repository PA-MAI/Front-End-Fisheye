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

        let sortedMedia;
        if (selectedValue === 'popularity') {
            sortedMedia = this.sortByLikes(this.media);
        } else if (selectedValue === 'date') {
            sortedMedia = this.sortByDate(this.media);
        } else if (selectedValue === 'title') {
            sortedMedia = this.sortByTitle(this.media);
        }

        //mise à jour de l'affichage des médias avec sortedMedia
        this.updateMediaDisplay(sortedMedia);
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
        // Cmise à jour de l'affichage des médias
        const mediaWrapper = document.querySelector('.photographer-media');
        mediaWrapper.innerHTML = ''; // Effacer l'affichage actuel

        sortedMedia.forEach(media => {
            const mediaTemplate = this.createMediaTemplate(media);
            mediaWrapper.insertAdjacentHTML('beforeend', mediaTemplate);
        });
    }

    createMediaTemplate(media) {
        const photographerFirstName = this.photographers.find(p => p.id === media.photographerId).name.split(" ")[0];
        return `
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