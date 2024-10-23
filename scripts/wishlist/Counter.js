class WhishListCounter {
    constructor(initialCount = 0) {
        this._count = initialCount;
        this._$wishCount = document.querySelector('.wish-count'); 
        
        // Vérification si l'élément existe
        if (!this._$wishCount) {
            console.error("L'élément .wish-count est introuvable !");
            return;
        }
        
        // Initialiser le compteur dans le DOM
        this.updateDisplay();
    }

    update(action) {
        if (!this._$wishCount) {
            console.error("L'élément .wish-count est introuvable !");
            return;
        }
    
        if (action === 'INC') {
            this._count += 1;
        } else if (action === 'DEC') {
            this._count -= 1;
        } else {
            throw new Error("Action inconnue");
        }

        // Met à jour l'affichage dans le DOM
        this.updateDisplay();
    }

    updateDisplay() {
        // Mettre à jour uniquement le texte du nombre de likes sans toucher à l'icône
        const likesSpan = this._$wishCount.querySelector('span'); // Sélectionner uniquement le texte à l'intérieur
        if (!likesSpan) {
            console.error("L'élément <span> pour les likes est introuvable !");
            return;
        }
        likesSpan.textContent = this._count;
    }
}
