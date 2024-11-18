
class ErrorFunctions {
    displayError(input, message) {
        let spanErrorMessage = input.parentElement.querySelector(".errorMessage");
        if (!spanErrorMessage) {
            // Si non, crée un nouveau span pour afficher l'erreur
            spanErrorMessage = document.createElement("span");
            spanErrorMessage.className = "errorMessage";
            spanErrorMessage.setAttribute("role", "alert");
            spanErrorMessage.setAttribute("aria-invalid", "true");
            input.parentElement.appendChild(spanErrorMessage);
            
        // Crée un ID unique pour le span
        const errorId = `error-${input.name}`;
        spanErrorMessage.id = errorId;

        // Lier le champ d'entrée au message d'erreur
        input.setAttribute("aria-describedby", errorId);

        input.parentElement.appendChild(spanErrorMessage);
        //console.log("Création d'un message d'erreur pour :", input.name);
        }
        // Mettre à jour le contenu du message d'erreur
        spanErrorMessage.innerText = message;
        input.classList.add("errorStyle");
        //console.log("Message d'erreur affiché :", message);
    }

    deleteError(input) {
        const spanErrorMessage = input.parentElement.querySelector(".errorMessage");
        if (spanErrorMessage) {
            spanErrorMessage.remove();
            // Supprime l'attribut aria-describedby du champ
            input.removeAttribute("aria-describedby");
            input.classList.remove("errorStyle");
            //console.log("Message d'erreur supprimé pour :", input.name);
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
            //console.log(`${input.name} champ validé avec succès.`);
        } catch (error) {
            this.errorFunctions.displayError(input, error.message); 
            console.log(`Erreur détectée pour ${input.name} : ${error.message}`);
        }
    }

    runForm(event) {
        event.preventDefault();
        const form = event.target;
        let isValid = true;
    
        // Créer une instance pour garder l'historique des données
        const keepFormInstance = new keepForm();
        
        // Sauvegarder les données du formulaire avant la validation
        keepFormInstance.keepFormData(form);
        
        // Nettoyer les erreurs existantes
        form.querySelectorAll(".errorMessage").forEach(error => error.remove());
        form.querySelectorAll(".errorStyle").forEach(input => input.classList.remove("errorStyle"));
    
        // Fonction de validation générique
        const validateField = (field, validateFn) => {
            try {
                validateFn(field);  // Exécuter la fonction de validation
                this.errorFunctions.deleteError(field);  // Supprimer l'erreur
            } catch (error) {
                this.errorFunctions.displayError(field, error.message);  // Afficher l'erreur
                isValid = false;
            }
        };
    
        // Validation des champs
        validateField(form.firstname, this.validFirst.bind(this));
        validateField(form.lastname, this.validLast.bind(this));
        validateField(form.email, this.validEmail.bind(this));
        validateField(form.message, this.validMessage.bind(this));
    
       
    }
}



class ContactFormModal {
    constructor(photographerName) {
        this.modalWrapper = document.getElementById('contact_modal');
        this.photographerName = photographerName;
        this.form = null; // Initialisé plus tard
        this.validForm = null; // Initialisé plus tard
        this.errorFunctions = null;//Initialisé plus tard
        this.keepFormInstance = new keepForm(); // Instanciation de keepForm
        
        
    }

   

    openModal() {
        // Injecte le contenu HTML du formulaire dans la modale
        this.modalWrapper.innerHTML = `
            <div class="modal-content">
                <header>
                    <div class="header-modal" aria-label="Contact me ${this.photographerName}">
                        <div><h2 class="contact-text">Contactez-moi</h2>
                        <span class="Contact-name">${this.photographerName}</span>
                        </div>
                        <img src="assets/icons/close.svg" aria-label="Close Contact form" class="close-modal-icon" tabindex="0">
                    </div>
                </header>
                <form id="contactForm">
                    <div class="formData">
                        <label for="firstname">Prénom</label>
                        <input class="text-control" type="text" id="firstname" name="firstname" aria-label="First name" placeholder="Votre prénom" aria-required="true">
                    </div>
                    <div class="formData">
                        <label for="lastname">Nom</label>
                        <input class="text-control" type="text" id="lastname" name="lastname" aria-label="Last name" placeholder="Votre nom" aria-required="true">
                    </div>
                    <div class="formData">
                        <label for="email">E-mail</label>
                        <input class="text-control" type="text" id="email" name="email" aria-label="Email" placeholder="Email" aria-required="true">
                    </div>
                    <div class="formData">
                        <label for="message">Votre message</label>
                        <textarea class="text-control" id="message" name="message" aria-label="your message" placeholder="votre message" aria-required="true"></textarea>
                    </div>
                    <button type="submit" class="contact_button" aria-label="send" tabindex="0">Envoyer</button>
                </form>
            </div>
        `;
        
         

        // Gérer le focus
        const focusableElements = this.modalWrapper.querySelectorAll(
        'a, button, textarea, input[type="text"], input[type="email"], [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
        focusableElements[0].focus();
        }

        // Ajouter le piège de focus
        document.addEventListener("keydown", this.trapFocus.bind(this));
    

        // Assure que `this.form` fait bien référence au formulaire injecté
        this.form = document.getElementById("contactForm");
        console.log('Formulaire injecté et écouteurs ajoutés.');

        // Initialise les fonctions de validation et d'erreurs après l'injection
        this.errorFunctions = new ErrorFunctions();
        this.validForm = new ValidForm(this.form, this.errorFunctions);


        // Affiche la modale
        this.modalWrapper.style.display = "flex";


        // Ajoute les écouteurs d'événements pour fermer la modale click ou clavier
        const closeModalIcon = this.modalWrapper.querySelector('.close-modal-icon');
        closeModalIcon.addEventListener('click', () => this.closeModal());
        this.addEventListeners();
        closeModalIcon.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') { 
                event.preventDefault(); 
                console.log('modale fermée via le clavier !');
                this.closeModal(); 
        }
    });

        // Ajoute un écouteur pour intercepter les tabulations
        document.addEventListener("keydown", this.trapFocus.bind(this));
        if (focusableElements.length > 0) {
            focusableElements[0].focus(); // Met le focus sur le premier élément
        }
    }

    trapFocus(event) {
        if (event.key !== "Tab") return; // Ignorer si ce n'est pas "Tab"
    
        const focusableElements = this.modalWrapper.querySelectorAll(
            'a, button, textarea, input[type="text"], input[type="email"], input[type="submit"], [tabindex]:not([tabindex="-1"])'
        );
    
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
    
        // Si "Shift + Tab" et on est sur le premier élément
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
        // Si "Tab" et on est sur le dernier élément
        else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    addEventListeners() {
        const form = this.form;
        

        if (form) {
            form.addEventListener("input", (event) => {
                this.validForm.validForm(event);
                // console.log("Input détecté :", event.target.name);
            });

            form.addEventListener("submit", (event) => {
                // Empêche le comportement par défaut du formulaire
                event.preventDefault(); 
                //console.log("Formulaire soumis.");
                this.validForm.runForm(event);

                // variables pour le mailto
                const firstname = form.firstname.value;
                const lastname = form.lastname.value;
                const email = form.email.value;
                const message = form.message.value;

                // Sauvegarde les données dans keepForm (avant de valider ou envoyer l'email)
                this.keepFormInstance.keepFormData(form);
                console.log("Données sauvegardées dans keepForm :", this.keepFormInstance.getFormDataHistory());

                // Ferme la modale après une soumission valide
                if (this.isValidForm()) {
                    // Construire l'URL mailto
                    const mailtoLink = `mailto:destinataire@example.com?subject=Message de ${email},${firstname} ${lastname}&body=Bonjour ${this.photographerName}, voici mon message: ${message}, cordialement ${firstname} ${lastname} Contact : ${email}`;

                    // Ouvre le client de messagerie
                    window.location.href = mailtoLink;
                    console.log("Formulaire validé avec succès, mailto ouvert !", email, firstname, lastname, message);

                    // Ferme la modale après soumission
                    this.closeModal();
                }
            });
        } else {
            console.error('Formulaire non trouvé après injection.'); 
        }
    }
    
    isValidForm() {
        // Vérifie si le formulaire est valide avant de fermer la modale
        return !this.form.querySelector(".errorMessage");

    }

    closeModal() {
       

        // Ferme la modale
        this.modalWrapper.style.display = "none"; 

        // Vide le contenu HTML de la modale
        this.modalWrapper.innerHTML = ""; 

         // Retire l'écouteur pour le piège de focus
         document.removeEventListener("keydown", this.trapFocus.bind(this));

        // Optionnel : Restaurer le focus sur le bouton qui a ouvert la modale
        const openButton = document.querySelector(".open-modal-button");
        if (openButton) {
        openButton.focus();
        }

        //reset form
        this.form.reset();
    }
}