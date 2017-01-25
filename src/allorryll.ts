/*
 * Copyright 2017, Frederick J. Ross
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was
 * not distributed with this file, You can
 * obtain one at https://mozilla.org/MPL/2.0/.
 */

/*
 * The starting point of an MVC app is a model. All models are instances
 * of Observable, that is, observers can register on them to be updated
 * when the model changes.
 */

interface Observable {
    addObserver : (observer: Observer) => void,
    deleteObserver : (observer: Observer) => void,
    notify : () => void
}

interface Observer {
  update: () => void
};

/* To create a model, call Observable on an object literal, e.g.,
 *
 *     let myModel = Observable({
 *         name: "Boris"
 *     });
 */
let Observable = function(subject: any): Observable {
  let observers = new Set();

	subject.addObserver = function(observer: Observer): void {
	    observers.add(observer);
	};

	subject.deleteObserver = function(observer: Observer): void {
	    observers.delete(observer);
	};

	subject.notify = function(): void {
	    observers.forEach((observer: Observer) => {
		    observer.update();
	    });
  };

  return subject;
};

/*
 * The other basic part of MVC is views, but to make views such as buttons
 * and labels reusable, we parameterize their behavior with objects that we
 * call controllers.
 *
 * A view is anything that can be written over an element on the DOM. We choose
 * writing over instead of adding a child because it is uniformly more powerful
 * and makes the code implementing complex views simpler.
 *
 * Types of view are classes implementing View. Each class has a corresponding
 * interface defining the controller for that view.
 */
interface View extends Observer {
    writeOver: (el: HTMLElement) => void,
};


/* Label - a simple span element containing text. */
interface LabelController {
    getText: (o: Observable) => string,
    getClass?: (o: Observable) => string
};

class Label implements View {
  model: Observable;
  controller: LabelController;
  span: HTMLElement;

  constructor(model: Observable, controller: LabelController) {
    this.model = model;
    this.controller = controller;
    this.model.addObserver(this);
  }

  writeOver(el : HTMLElement): void {
    this.span = document.createElement('span');
    this.span.textContent = this.controller.getText(this.model);
    if (this.controller.getClass) {
      this.span.setAttribute('class', this.controller.getClass(this.model));
    }
    if (el.parentNode) {
      el.parentNode.replaceChild(this.span, el);
    }
  }

  update(): void {
    /*
  	  We don't want to do anything to the DOM if there are no
  	  changes needed, nor do we want users to lose whatever
  	  text they may have selected.
  	*/
  	let newText = this.controller.getText(this.model);
  	if (newText !== this.span.textContent) {
  	    this.span.textContent = newText;
  	}
  	if (this.controller.getClass) {
        let newClass = this.controller.getClass(this.model);
        if (newClass !== this.span.getAttribute('class')) {
  	     this.span.setAttribute('class', this.controller.getClass(this.model));
        }
  	}
  }
};
