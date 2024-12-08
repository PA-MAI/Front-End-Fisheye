
class ErrorFunctions {
    displayError(input, message) {
        let spanErrorMessage = input.parentElement.querySelector(".errorMessage");
        if (!spanErrorMessage) {
            // If not, create a new span to display the error
            spanErrorMessage = document.createElement("span");
            spanErrorMessage.className = "errorMessage";
            spanErrorMessage.setAttribute("role", "alert");
            spanErrorMessage.setAttribute("aria-invalid", "true");
            input.parentElement.appendChild(spanErrorMessage);
            
        // Create a unique ID for the span
        const errorId = `error-${input.name}`;
        spanErrorMessage.id = errorId;

        // Link the input field to the error message
        input.setAttribute("aria-describedby", errorId);

        input.parentElement.appendChild(spanErrorMessage);
        //console.warn("maintenance : error for :", input.name);
        }
       // Update the error message content
        spanErrorMessage.innerText = message;
        input.classList.add("errorStyle");
        //console.warn("maintenance : display error message :", message);
    }

    deleteError(input) {
        const spanErrorMessage = input.parentElement.querySelector(".errorMessage");
        if (spanErrorMessage) {
            spanErrorMessage.remove();
            // Remove the aria-describedby attribute from the field
            input.removeAttribute("aria-describedby");
            input.classList.remove("errorStyle");
            //console.warn(" maintenance deleting error Message for :", input.name);
        }
    }
}

// Design Pattern: **Observer Pattern**
// The other validation functions here, such as validFirst, validLast, validEmail, etc.
class ValidForm {
    constructor(form) {
        this.form = form;
        this.errorFunctions = new ErrorFunctions();
    }

    validFirst(first) {
        const firstRegExp = new RegExp("[a-zA-Z-.]+");
        if (first.value === "") {
            throw new Error("Le champ prénom est vide.");
        } else if (!firstRegExp.test(first.value)) {
            throw new Error("Caractères invalides.");
        } else if (first.value.length < 2) {
            throw new Error("Le prénom est trop court.");
        }
    }

    validLast(last) {
        const lastRegExp = new RegExp("[a-zA-Z-.]+");
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
        } else if (message.value.length < 10) {
            throw new Error("Le message doit faire plus de 10 caractères.");
        }
        else if (message.value.length > 300) {
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
            //console.warn(`${input.name} champ validé avec succès.`);
        } catch (error) {
            this.errorFunctions.displayError(input, error.message); 
            console.log(`Erreur détectée pour ${input.name} : ${error.message}`);
        }
    }

    runForm(event) {
        event.preventDefault();
        const form = event.target;
        let isValid = true;
    
        // Create an instance to keep track of form data history
        const keepFormInstance = new keepForm();
        
        // Save form data before validation
        keepFormInstance.keepFormData(form);
        
        // Clear existing errors
        form.querySelectorAll(".errorMessage").forEach(error => error.remove());
        form.querySelectorAll(".errorStyle").forEach(input => input.classList.remove("errorStyle"));
    
        // Generic validation function
        const validateField = (field, validateFn) => {
            try {
                validateFn(field);  
                this.errorFunctions.deleteError(field);  
            } catch (error) {
                this.errorFunctions.displayError(field, error.message);  
                isValid = false;
            }
        };
    
        // Validate fields
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
        this.form = null; 
        this.validForm = null; 
        this.errorFunctions = null;
        this.keepFormInstance = new keepForm(); // Instanciate keepForm
        
        
    }

    openModal() {
        // Injects the HTML content of the form into the modal
        this.modalWrapper.innerHTML = `
            <div class="modal-content">
                <header>
                    <div class="header-modal" role="dialog" aria-label="pour contacter ${this.photographerName} remplir ce formulaire" tabindex="0">
                        <div><h2 class="contact-text">Contactez-moi</h2>
                        <span class="Contact-name">${this.photographerName}</span>
                        </div>
                        <img src="assets/icons/close.svg" aria-label="ferme le formulaire de contact" class="close-modal-icon" role="button" tabindex="0  ">
                    </div>
                </header>
                <form id="contactForm">
                    <div class="formData">
                        <label for="firstname">Prénom</label>
                        <input class="text-control" type="text" id="firstname" name="firstname"  aria-label="votre prénom" placeholder="Votre prénom" aria-required="true">
                    </div>
                    <div class="formData">
                        <label for="lastname">Nom</label>
                        <input class="text-control" type="text" id="lastname" name="lastname" aria-label="votre nom" placeholder="Votre nom" aria-required="true">
                    </div>
                    <div class="formData">
                        <label for="email">E-mail</label>
                        <input class="text-control" type="text" id="email" name="email" aria-label="votre Email" placeholder="votre Email" aria-required="true">
                    </div>
                    <div class="formData">
                        <label for="message">Votre message</label>
                        <textarea class="text-control" id="message" name="message" aria-label="votre message" placeholder="votre message" aria-required="true"></textarea>
                    </div>
                    <button type="submit" class="contactModal_button" aria-label="Envoyer par mail" tabindex="0">Envoyer</button>
                </form>
            </div>
        `;
        
         

        // Handle focus
        const focusableElements = this.modalWrapper.querySelectorAll(
        'button, textarea, input[type="text"], input[type="email"], [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
        focusableElements[0].focus();
        }

        // Add focus trap
        document.addEventListener("keydown", this.trapFocus.bind(this));
    

        // Ensures `this.form` references the injected form
        this.form = document.getElementById("contactForm");
        console.log('Formulaire injecté et écouteurs ajoutés.');

        // Initialize validation and error functions after injection
        this.errorFunctions = new ErrorFunctions();
        this.validForm = new ValidForm(this.form, this.errorFunctions);


        // Show the modal
        this.modalWrapper.style.display = "flex";   


        // Adds event listeners to close the click or keyboard modal
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
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            console.log('Modale fermée avec Escape !');
            this.closeModal();
        }
    });

        // Add event listeners to close the modal with click or keyboard
        document.addEventListener("keydown", this.trapFocus.bind(this));
        if (focusableElements.length > 0) {
            focusableElements[0].focus(); // focus on first élément
        }
    }
    // Design Pattern: **Observer Pattern**
    trapFocus(event) {
        if (event.key !== "Tab") return; // Ignore if not "Tab"
    
        const focusableElements = this.modalWrapper.querySelectorAll(
            'button, textarea, input[type="text"], input[type="submit"], [tabindex]:not([tabindex="-1"])'
        );
    
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
    
        // If "Shift + Tab" and on the first element
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
        // If "Tab" and on the last element
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
                // console.log("Input detected:", event.target.name);
            });

            form.addEventListener("submit", (event) => {
                event.preventDefault(); 
                //console.warn("Form submitted.");
                this.validForm.runForm(event);

                // Variables for mailto console
                const firstname = form.firstname.value;
                const lastname = form.lastname.value;
                const email = form.email.value;
                const message = form.message.value;

                // Save form data in keepForm (before validating or sending email)
                this.keepFormInstance.keepFormData(form);
                console.log("Données sauvegardées dans keepForm :", this.keepFormInstance.getFormDataHistory());

                // Close modal after successful submission
                if (this.isValidForm()) {

                    //optional: Build the mailto URL
                    // const mailtoLink = `mailto:destinataire@example.com?subject=Message de ${email},${firstname} ${lastname}&body=Bonjour ${this.photographerName}, voici mon message: ${message}, cordialement ${firstname} ${lastname} Contact : ${email}`;
                    //window.location.href = mailtoLink;
                    
                    console.log("Formulaire validé avec succès, mailto ouvert !", email, firstname, lastname, message);

                    // Close the modal after submission
                    this.closeModal();
                }
            });
        } else {
            console.error('Formulaire non trouvé après injection.'); 
        }
    }
    
    isValidForm() {
        // Check if form is valid before close modal 
        return !this.form.querySelector(".errorMessage");

    }

    closeModal() {
       

        // close modale
        this.modalWrapper.style.display = "none"; 

        // Empty the HTML content of the modal
        this.modalWrapper.innerHTML = ""; 

        // Removes the listener for the focus trap
        document.removeEventListener("keydown", this.trapFocus.bind(this));

        // Restores focus to the button that opened the modal
        const openButton = document.querySelector(".open-modal-button");
        if (openButton) {
        openButton.focus();
        }

        //reset form
        this.form.reset();
    }
}