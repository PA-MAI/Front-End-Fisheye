// Design Pattern: Observer Pattern
// Explanation: La classe `WishlistSubject` est la partie "sujet" du **Observer Pattern**. Elle gère 
// une liste d'observateurs et les notifie lorsqu'une action se produit, comme l'ajout ou la suppression 
// d'un élément de la wishlist.

class WishlistSubject {
    constructor() {
        this._observers = []
    }

    subscribe(observer) {
        this._observers.push(observer)
    }

    unsubscribe(observer) {
        this._observers = this._observers.filter(obs => obs !== observer)
    }

    fire(action) {
        this._observers.forEach(observer => observer.update(action))
    }
}
