/**
 * The Observer Pattern consist of using observables to notify subscribers when an event occurs.
 * With the observer pattern, we can subscribe certain objects, the observers, to another object,
 * called the observable. Whenever an event occurs, the observable notifies all its observers!
 *
 * Using the observer pattern is a great way to enforce separation of concerns and the single-responsiblity principle.
 * The observer objects aren't tightly coupled to the observable object, and can be (de)coupled at any time.
 * The observable object is responsible for monitoring the events, while the observers simply handle the received data.
 * more info can be found in this article: https://www.patterns.dev/posts/observer-pattern
 **/

export default class Observable {
    constructor() {
        this._observers = [];
    }

    subscribe(func) {
        const unsubscribe = (fn) =>
            (this._observers = this._observers.filter(
                (observer) => observer !== fn
            ));

        this._observers.push(func);
        return () => unsubscribe(func);
    }

    notify(data) {
        this._observers.forEach((observer) => observer(data));
    }
}
