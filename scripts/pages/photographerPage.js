// Class definition for the photographer's detailed page
// Design Pattern: Template Method Pattern

class appPagePhotographer {
    constructor() {
        // Select section where display photographer data
        this.$pageApiWrapper = document.querySelector('.photograph-header');
        // Instantiate API for profils and medias from file JSON
        this.pageApi = new ProfilApiPhotographer('./data/photographers.json');
        // Select Div for medias
        this.$mediaWrapper = document.querySelector('.photographer-media');
    }

    // Main method to display photographer details and their media
    async main() {
        try {
            const { photographers, media } = await this.pageApi.getProfilAndMedia();

            // Validate returned data
            if (!photographers || !Array.isArray(photographers)) {
                throw new Error('Invalid photographers data');
            }
            if (!media || !Array.isArray(media)) {
                throw new Error('Invalid media data');
            }

            // Retrieve and validate photographer ID from the URL
            const photographerIdFromUrl = window.location.search;
            const photographerId = new URLSearchParams(photographerIdFromUrl).get('id');
            console.log('Photographer ID:', photographerId);
            if (!photographerId) {
                console.warn('PhotographerId stay your choice');
                return;
            }

            // Find the photographer
            const photographer = photographers.find(m => m.id == photographerId);
            if (!photographer) {
                console.error('No photographer found for ID:', photographerId);
                return;
            }

            // Create the page
            const pageTemplate = new photographerCardTemplate(photographer);
            const photographerMedia = media.filter(m => m.photographerId === photographer.id);

            // Generate and inject DOM element
            const pageElement = pageTemplate.createPhotographerPage(photographerMedia);

            // Append the content to the page
            if (!this.$pageApiWrapper || !(this.$pageApiWrapper instanceof Node)) {
                throw new Error('$pageApiWrapper is not a valid DOM Node.');
            }
            //this.$pageApiWrapper.appendChild(pageElement);
            console.log('Photographer page successfully created.');
        } catch (error) {
            console.error('Failed to fetch profiles and media:', error);
        }
    }
}

// Event listener for DOMContentLoaded to ensure the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const appPageInstance = new appPagePhotographer();
    appPageInstance.main();
});