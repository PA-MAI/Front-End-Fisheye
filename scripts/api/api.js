class Api {
    /**
     * Constructor for the Api class
     * @param {string} url - The URL to fetch data from
     */
    constructor(url) {
        this._url = url; // Store the URL as a private variable
    }

    // Method to fetch data from the specified URL
    async get() {
        return fetch(this._url) // Make a fetch request to the URL
            .then(photographers => photographers.json()) // Parse the response as JSON
            .then(photographers => photographers.photographers) // Extract the 'photographers' array from the JSON
            .catch(err => {
                console.log('an error occurs', err); // Log any errors that occur
                throw err; // Rethrow the error to allow the caller to handle it
            });
    }
}


class ProfilApi extends Api {
    /**
     * Constructor for the ProfilApi class
     * @param {string} url - The URL to fetch profile data from
     */
    constructor(url) {
        super(url); // Call the constructor of the parent Api class
    }

    // Method to fetch profiles using the inherited get method
    async getprofil() {
        try {
            return await this.get(); // Call the get method and return the result
        } catch (error) {
            console.error('Failed to fetch profile', error); // Log any errors that occur
        }
    }
}