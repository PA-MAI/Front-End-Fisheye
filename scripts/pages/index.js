// Class definition for the application profile
// Design Pattern: Singleton Pattern


class appProfilPhotographer {
    constructor() {
        // Container selection for photographer profiles
        this.$profilApiWrapper = document.querySelector('.photographer_section');
        // Creating a ProfilApi instance to retrieve data from the JSON file
        this.profilApi = new ProfilApiPhotographer('./data/photographers.json');
    }

    // Main method to fetch and display photographer profiles
    async main() {
        if (document.querySelector('.photographer_section')) {
            try {
                // Fetching profiles via the API
                const { photographers } = await this.profilApi.getProfilAndMedia();
                console.log('Fetched profiles:', photographers);

                // Check if the fetched profiles are in the correct format
                if (!Array.isArray(photographers)) {
                    throw new Error('Photographers is not an array');
                }

                // Iterating through each photographer profile
                photographers.forEach((photographer) => {
                    // Creating a photographer card template
                    const template = new photographerCardTemplate(photographer);
                    // Appending the photographer card to the wrapper
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


