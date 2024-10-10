// Class definition for the application profile
class appProfil {
    constructor() {
        // Selecting the container for the photographer profiles
        this.$profilApiWrapper = document.querySelector('.photographer_section');
        // Creating an instance of the ProfilApi to fetch data from the JSON file
        this.profilApi = new ProfilApi('./data/photographers.json');
    }

    // Main method to fetch and display photographer profiles
    async main() {
        try {
            // Fetching profiles from the API
            const profils = await this.profilApi.getprofil();
            // Iterating through each photographer profile
            profils.forEach((photographer) => {
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

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Creating an instance of appProfil and calling the main method to start the application
    const appProfilInstance = new appProfil();
    appProfilInstance.main();
});