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
        try {
            const response = await fetch(this._url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return {
                photographers: data.photographers,
                media: data.media
            };
        } catch (err) {
            console.error('An error occurred while fetching data:', err);
            throw err;  // Propagate error for better handling
        }
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

    // Fetch both profiles and media
    async getProfilAndMedia() {
        return await this.get().catch((error) => {
            console.error('Failed to fetch profiles and media', error);
            return null; // Optionally return null to signify failure
        });
    }

    // Fetch media specific to a photographer
    async getDefaultMedia(photographerId) {
        const data = await this.getProfilAndMedia();
        if (data && data.media) {
            return data.media.filter(media => media.photographerId === photographerId);
        }
        return []; // Return an empty array if no media is found
    }
}
