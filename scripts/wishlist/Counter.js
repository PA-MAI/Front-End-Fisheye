// Design Pattern: Observer Pattern

class WhishListCounter {
    constructor(initialCount = 0) {
        this._count = initialCount;
        this._$wishCount = document.querySelector('.wish-count'); 
        
        // Checking if the element exists
        if (!this._$wishCount) {
            console.error("L'élément .wish-count est introuvable !");
            return;
        }
        
        // Initialize the counter in the DOM
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

        // update display in DOM
        this.updateDisplay();
    }

    updateDisplay() {
        // Update only the text of the number of likes without touching the icon
        const likesSpan = this._$wishCount.querySelector('span'); 
        if (!likesSpan) {
            //console.warn("The <span> element for likes was not found!");
            return;
        }
        likesSpan.textContent = this._count;
    }
}
