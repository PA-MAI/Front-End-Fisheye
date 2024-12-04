// Class definition for the application profile
class appProfilPhotographer {
    constructor() {
        // Selecting the container for the photographer profiles
        this.$profilApiWrapper = document.querySelector('.photographer_section');
        // Creating an instance of the ProfilApi to fetch data from the JSON file
        this.profilApi = new ProfilApiPhotographer('./data/photographers.json');
    }

    
    // Main method to fetch and display photographer profiles
    async main() {
        if (document.querySelector('.photographer_section')) {
            try {
            // Fetching profiles from the API
            const { photographers } = await this.profilApi.getProfilAndMedia();
            console.log('Fetched profiles:', photographers);

            // Check if the fetched profiles are in the correct format
            if (!Array.isArray(photographers)) {
                throw new Error('Photographers is not an array');
            }

            // Iterating through each photographer profile
            photographers.forEach((photographer) => {
                // Creating a new photographer card template
                const template = new photographerCardTemplate(photographer);
                // Appending the created photographer card to the wrapper
                this.$profilApiWrapper.appendChild(template.createPhotographerCard());
            });
            } catch (error) {
            // Logging any errors that occur during the fetch process
            console.error('Failed to fetch profiles', error);
            }
        }
    }
}

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Creating an instance of appProfil and calling the main method to start the application
    const appProfilInstance = new appProfilPhotographer();
    appProfilInstance.main();
});





class appPagePhotographer {
    constructor() {
        // Sélection de la section où afficher les détails du photographe
        this.$pageApiWrapper = document.querySelector('.photograph-header');
        // Instance de l'API pour obtenir les profils et médias depuis le fichier JSON
        this.pageApi = new ProfilApiPhotographer('./data/photographers.json');
        // Sélection du conteneur pour les photos/médias
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
