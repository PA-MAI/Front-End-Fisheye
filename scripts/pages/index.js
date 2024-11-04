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
        try {
            console.log('Fetching profiles...');

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
         //   console.error('Failed to fetch profiles', error);
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

    // Méthode pour récupérer le nom du photographe à partir de l'URL
    getPhotographerNameFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('name'); // Extraction du paramètre "name" de l'URL
    }

    // Méthode principale pour afficher les détails du photographe et ses médias
    async main() {
        try {
            const { photographers, media } = await this.pageApi.getProfilAndMedia();
            const photographerName = this.getPhotographerNameFromURL(); // Récupérer le nom du photographe
    
            // Trouver le photographe correspondant au nom récupéré dans l'URL
            const photographer = photographers.find(p => p.name === photographerName);
    
            if (photographer) {
                // Créer une nouvelle page pour ce photographe
                const pageTemplate = new photographerCardTemplate(photographer);
                // Filtrer les médias du photographe
                const photographerMedia = media.filter(m => m.photographerId === photographer.id);
                // Injecter la page créée dans la section photograph-header
                this.$pageApiWrapper.appendChild(pageTemplate.createPhotographerPage(photographerMedia));
            } else {
                console.error('Photographer not found');
            }
        } catch (error) {
            console.error('Failed to fetch profiles and media', error);
        }
    }
   
 }


// Écouter l'événement DOMContentLoaded pour s'assurer que le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
    const appPageInstance = new appPagePhotographer();
    appPageInstance.main();
});

