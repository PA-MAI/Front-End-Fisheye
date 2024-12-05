// Design Pattern: **Memento Pattern**

let formDataHistory = [];

class keepForm {
    keepFormData(contactForm) {
        const formData = {};

        // Get all input fields (input, textarea)
        const inputs = contactForm.querySelectorAll("input, textarea");

        // Iterates over each field to collect the values
        inputs.forEach((input) => {
            if (input.name) { 
                formData[input.name] = input.value;
            }
        });

        // Adds the collected data to the history
        formDataHistory.push(formData);
       // console.warn("Données du formulaire sauvegardées :", formData);
    }

    // show history
    getFormDataHistory() {
        return formDataHistory;
    }
}