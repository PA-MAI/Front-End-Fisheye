class ContactFormModal {
    constructor() {
        this.modalWrapper = document.getElementById('contact_modal');
        //this.photographerName = photographerName;
    }

    openModal() {
        // Injecter le contenu HTML du formulaire dans la modale
        this.modalWrapper.innerHTML = `
            <div class="modal-content">
                <header>
                <div class="header-modal">
                    <div><h2 class="contact-text">Contactez-moi</h2>
                    <span class="Contact-name">${this.photographerName}</span>
                    </div>
                    <img src="assets/icons/close.svg" aria-label="fermer la modale de contact" onclick="contactForm.closeModal()">
                </div>
                    </header>
                <form id="contact-form">
                    <div class="formData">
                        <label for="firstname">Prénom</label>
                        <input class="text-control" type="text" id="firstname" name="firstname" placeholder="Votre prénom" required>
                    </div>
                    <div class="formData">
                        <label for="lastname">Nom</label>
                        <input class="text-control" type="text" id="lastname" name="lastname" placeholder="Votre nom" required>
                    </div>
                    <div class="formData">
                        <label for="email">E-mail</label>
                        <input class="text-control" type="email" id="email" name="email" placeholder="Votre email" required>
                    </div>
                    <div class="formData">
                        <label for="message">Votre message</label>
                        <textarea class="text-control" id="message" name="message" placeholder="Votre message" required></textarea>
                    </div>
                    <button type="submit" class="contact_button" aria-label="Envoyer le message">Envoyer</button>
                </form>
            </div>
        `;

        this.modalWrapper.style.display = "flex"; // Afficher la modale

        // Attacher un écouteur d'événement pour gérer la soumission
        document.getElementById('contact-form').addEventListener('submit', (event) => {
            event.preventDefault(); // Empêcher le rechargement de la page
            runForm(event); // Appeler la fonction de validation
        });
    }

    closeModal() {
        this.modalWrapper.style.display = "none"; // Fermer la modale
        console.log (this.modalWrapper.innerHTML)
        this.modalWrapper.innerHTML = ""; // Vider le contenu HTML de la modale
    }
}