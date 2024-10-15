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
        return fetch(this._url)
            .then(response => response.json())
            .then(data => {
                return {
                    photographers: data.photographers,
                    media: data.media
                };
            })
            .catch(err => {
                console.error('An error occurred while fetching data:', err);
                throw err;
            });
    }
}

class ProfilApiPhotographer extends Api {
    /**
     * Constructor for the ProfilApiPhotographer class
     * @param {string} url - The URL to fetch profile data from
     */
    constructor(url) {
        super(url); // Call the constructor of the parent Api class
    }

    // Method to fetch both profiles and media using the inherited get method
    async getProfilAndMedia() {
        try {
            return await this.get(); // Call the get method and return the result
        } catch (error) {
            console.error('Failed to fetch profiles and media', error);
        }
    }
}