let formDataHistory = [];

class keepForm {
    keepFormData(contactForm) {
    const formData = {};

    // get all form fields 
    const input = contactForm.querySelectorAll("input, textarea");
    if (input.name) { 
        formData[input.name] = input.value;
        }
    
             // push new data in table formDataHistory
            formDataHistory.push(formData);
            console.log("Données du formulaire sauvegardées :", formData);
        }
        //option: Function for view submission history
        getFormDataHistory() {
            return formDataHistory;
        }

    }

