let formDataHistory = [];

class keepForm {
    keepFormData(contactForm) {
        const formData = {};

        // Récupère tous les champs d'entrée (input, textarea)
        const inputs = contactForm.querySelectorAll("input, textarea");

        // Itère sur chaque champ pour collecter les valeurs
        inputs.forEach((input) => {
            if (input.name) { // S'assure que le champ a un nom valide
                formData[input.name] = input.value;
            }
        });

        // Ajoute les données collectées à l'historique
        formDataHistory.push(formData);

        // Affiche les données dans la console
       // console.log("Données du formulaire sauvegardées :", formData);
    }

    // Fonction pour afficher l'historique
    getFormDataHistory() {
        return formDataHistory;
    }
}