
class ErrorFunctions {
    displayError(input, message) {
        let spanErrorMessage = input.parentElement.querySelector(".errorMessage");
        if (!spanErrorMessage) {
            spanErrorMessage = document.createElement("span");
            spanErrorMessage.className = "errorMessage";
            input.parentElement.appendChild(spanErrorMessage);
            console.log("Création d'un message d'erreur pour :", input.name);
        }
        spanErrorMessage.innerText = message;
        input.classList.add("errorStyle");
        console.log("Message d'erreur affiché :", message);
    }

    deleteError(input) {
        const spanErrorMessage = input.parentElement.querySelector(".errorMessage");
        if (spanErrorMessage) {
            spanErrorMessage.remove();
            input.classList.remove("errorStyle");
            console.log("Message d'erreur supprimé pour :", input.name);
        }
    }
}
class ValidForm {
    constructor(form) {
        this.form = form;
        this.errorFunctions = new ErrorFunctions();
    }

    validFirst(first) {
        const firstRegExp = new RegExp("[a-zA-Z\-\.]+");
        if (first.value === "") {
            throw new Error("Le champ prénom est vide.");
        } else if (!firstRegExp.test(first.value)) {
            throw new Error("Caractères invalides.");
        } else if (first.value.length < 2) {
            throw new Error("Le prénom est trop court.");
        }
    }

    validLast(last) {
        const lastRegExp = new RegExp("[a-zA-Z\-\.]+");
        if (last.value === "") {
            throw new Error("Le champ nom est vide.");
        } else if (!lastRegExp.test(last.value)) {
            throw new Error("Caractères invalides.");
        } else if (last.value.length < 2) {
            throw new Error("Le nom est trop court.");
        }
    }

    validEmail(email) {
        const emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
        if (email.value === "") {
            throw new Error("Le champ email est vide.");
        } else if (!emailRegExp.test(email.value)) {
            throw new Error("L'email n'est pas valide.");
        }
    }

    validMessage(message) {
        if (message.value === "") {
            throw new Error("Le champ message est vide.");
        } else if (message.value.length > 300) {
            throw new Error("Le message ne doit pas dépasser 300 caractères.");
        }
    }

    validForm(event) {
        const input = event.target;
        console.log("Validation de l'input :", input.name);
        try {
            if (input.name === "firstname") {
                this.validFirst(input); 
            } else if (input.name === "lastname") {
                this.validLast(input);
            } else if (input.name === "email") {
                this.validEmail(input);
            } else if (input.name === "message") {
                this.validMessage(input);
            }

            this.errorFunctions.deleteError(input); 
            console.log(`${input.name} champ validé avec succès.`);
        } catch (error) {
            this.errorFunctions.displayError(input, error.message); 
            console.log(`Erreur détectée pour ${input.name} : ${error.message}`);
        }
    }

    runForm(event) {
        event.preventDefault();
        let isValid = true;
        const form = event.target;

        form.querySelectorAll(".errorMessage").forEach(error => error.remove());
        form.querySelectorAll(".errorStyle").forEach(input => input.classList.remove("errorStyle"));

        try {
            this.validFirst(form.firstname); 
            this.errorFunctions.deleteError(form.firstname);
        } catch (error) {
            this.errorFunctions.displayError(form.firstname, error.message);
            isValid = false;
        }

        try {
            this.validLast(form.lastname); 
            this.errorFunctions.deleteError(form.lastname);
        } catch (error) {
            this.errorFunctions.displayError(form.lastname, error.message);
            isValid = false;
        }

        try {
            this.validEmail(form.email); 
            this.errorFunctions.deleteError(form.email);
        } catch (error) {
            this.errorFunctions.displayError(form.email, error.message);
            isValid = false;
        }

        try {
            this.validMessage(form.message); 
            this.errorFunctions.deleteError(form.message);
            isValid = false;
        } catch {

       if (isValid) {
    const firstname = form.firstname.value;
    const lastname = form.lastname.value;
    const email = form.email.value;
    const message = form.message.value;

    // Construire l'URL mailto (remplacer destinataire@example.com par une adresse réelle)
    const mailtoLink = `mailto:destinataire@example.com?subject=Message de ${firstname} ${lastname}&body=${encodeURIComponent(message)}%0D%0A%0D%0AContact : ${email}`;

    // Ouvrir le client de messagerie
    window.location.href = mailtoLink;

    console.log("Formulaire validé avec succès, mailto ouvert !");
    
    // Fermer la modale
    this.closeModal(); // Utiliser la méthode closeModal pour fermer correctement la modale
} else {
            console.log("Formulaire invalide, veuillez corriger les erreurs.");
        }
    }
}
}


class ContactFormModal {
    constructor(photographerName) {
        this.modalWrapper = document.getElementById('contact_modal');
        this.photographerName = photographerName;
        this.form = null; // Initialisé plus tard
        this.validForm = null; // Initialisé plus tard
        this.errorFunctions = null;//Initialisé plus tard
    }

    addEventListeners() {
        if (this.form) {
            this.form.addEventListener("submit", (event) => this.validForm.runForm(event));
        }
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
                        <img src="assets/icons/close.svg" aria-label="fermer la modale de contact" class="close-modal-icon">
                    </div>
                </header>
                <form id="contactForm">
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
                        <input class="text-control" type="email" id="email" name="email" placeholder="Email" required>
                    </div>
                    <div class="formData">
                        <label for="message">Votre message</label>
                        <textarea class="text-control" id="message" name="message" placeholder="your message" required></textarea>
                    </div>
                    <button type="submit" class="contact_button" aria-label="send">Envoyer</button>
                </form>
            </div>
        `;
        

        // Assurer que `this.form` fait bien référence au formulaire injecté
        this.form = document.getElementById("contact-form");

             

        this.addEventListeners();
        console.log('Formulaire injecté et écouteurs ajoutés.');

        // Initialiser les fonctions de validation et d'erreurs après l'injection
        this.errorFunctions = new ErrorFunctions();
        this.validForm = new ValidForm(this.form, this.errorFunctions);

        // Afficher la modale
        this.modalWrapper.style.display = "flex";

        // Ajouter les écouteurs d'événements
        const closeModalIcon = this.modalWrapper.querySelector('.close-modal-icon');
        closeModalIcon.addEventListener('click', () => this.closeModal());
        this.addEventListeners();

        
    }
    addEventListeners() {
        const form = document.querySelector("#contactForm");
        if (form) {
            form.addEventListener("input", (event) => {
                this.validForm.validForm(event);
                console.log("Input détecté :", event.target.name);
            });
    
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                console.log("Formulaire soumis.");
                // Logique d'envoi ou autre ici
            });
        } else {
            console.error('Formulaire non trouvé après injection.'); // Log d'erreur ici
        }
    }

    closeModal() {
        this.modalWrapper.style.display = "none"; // Fermer la modale
        this.modalWrapper.innerHTML = ""; // Vider le contenu HTML de la modale
    }
}