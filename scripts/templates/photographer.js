class photographerCardTemplate {
  /**
   * Constructor for the photographerCardTemplate class
   * @param {Object} pcard - The photographer card data
   */
  constructor(pcard) {
      this._pcard = pcard; // Store the photographer card data as a private variable
  }

  // Method to create the photographer card element
  createPhotographerCard() {
      const $wrapper = document.createElement('div'); // Create a wrapper div for the card
      $wrapper.classList.add('photographer_section-wrapper'); // Add a class to the wrapper

      let CardTemplate = ""; // Initialize the card template string

      // Create the card template using template literals
      CardTemplate = `
          <article class="card" role="figure" aria-label="card-photographer">
              <a class="card-profil" title="View the profile of ${this._pcard.name}" 
                 href="../photographer.html?name=${this._pcard.name}" role="link">
                  <img class="card-portrait" alt="Profile of ${this._pcard.name}, slogan: ${this._pcard.tagline}."
                       src="/assets/photographers/${this._pcard.portrait}">
                  <h2 class="card-name">${this._pcard.name}</h2>
              </a>
              <div class="card-text" aria-label="origin">
                  <p class="card-origine"><h3>${this._pcard.city}, ${this._pcard.country}</h3></p>
                  <p class="card-tag">${this._pcard.tagline}</p>
                  <p class="card-price">${this._pcard.price}€</p>
              </div>
          </article>
      `;

      $wrapper.innerHTML = CardTemplate; // Set the inner HTML of the wrapper to the card template
      return $wrapper; // Return the wrapper containing the card
  }
}