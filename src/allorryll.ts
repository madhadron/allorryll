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

export interface Observable {
    addObserver : (observer: Observer) => void,
    deleteObserver : (observer: Observer) => void,
    notify : () => void
}

export interface Observer {
  update: () => void
};

/* To create a model, call Observable on an object literal, e.g.,
 *
 *     let myModel = Observable({
 *         name: "Boris"
 *     });
 */
export function Observable(subject: any): Observable {
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
export interface View extends Observer {
    writeOver: (el: HTMLElement) => void,
};

/* For convenience, we sometimes want to append a child, though. */
export function appendView(el: HTMLElement|DocumentFragment, view: View): void {
    var div = el.ownerDocument.createElement('div');
    el.appendChild(div);
    view.writeOver(div);
};


/* Label - a simple span element containing text. */
export interface LabelController {
    getText: (model: Observable) => string,
    getClass?: (model: Observable) => string
};

export class Label implements View {
  model: Observable;
  controller: LabelController;
  span: HTMLElement;

  constructor(model: Observable, controller: LabelController) {
    this.model = model;
    this.controller = controller;
    this.model.addObserver(this);
  }

  writeOver(el : HTMLElement): void {
    this.span = el.ownerDocument.createElement('span');
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

/* Button */
export interface ButtonDisplayController {
  getText: (model: Observable) => string,
  getClass?: (model: Observable) => string,
  isEnabled?: (model: Observable) => boolean,
}

export interface ButtonController extends ButtonDisplayController {
  onClicked?: (model: Observable) => void
}

export class Button implements View {
  model: Observable;
  controller: ButtonController;
  button: HTMLButtonElement;

  constructor(model: Observable, controller: ButtonController) {
    this.model = model;
    this.controller = controller;
    this.model.addObserver(this);
  }


  writeOver(el: HTMLElement): void {
    let button: HTMLButtonElement = el.ownerDocument.createElement('button');
    button.textContent = this.controller.getText(this.model);
    if (this.controller.isEnabled) {
      button.disabled = !this.controller.isEnabled(this.model);
    }
    button.addEventListener(
      'click',
      () => { if (this.controller.onClicked) this.controller.onClicked(this.model); }
    );
    if (this.controller.getClass) {
      button.setAttribute('class', this.controller.getClass(this.model));
    }
    this.button = button;
    if (el.parentNode) {
      el.parentNode.replaceChild(button, el);
    }
  };

  update(): void {
    if (this.button) {
      this.button.textContent = this.controller.getText(this.model);
      if (this.controller.isEnabled) {
        this.button.disabled = !this.controller.isEnabled(this.model);
      }
      if (this.controller.getClass) {
        this.button.setAttribute('class', this.controller.getClass(this.model));
      }
    }
  };
}

/* Dropdown button */

export interface DropdownController extends ButtonDisplayController {
  getDropdownView: (model: Observable) => View
}

export class DropdownButton implements View {
  model: Observable;
  controller: DropdownController;
  button: Button;
  dropdownContainer: HTMLDivElement;
  dropdownView: View;

  constructor(model: Observable, controller: DropdownController) {
    this.model = model;
    this.controller = controller;
    this.model.addObserver(this);
  }

  writeOver(el: HTMLElement): void {
    let doc = el.ownerDocument;
    let outerSpan = doc.createElement('span');

    let innerDiv = doc.createElement('div');
    innerDiv.style.display = 'none';
    innerDiv.style.position = 'absolute';

    this.button = new Button(this.model, {
      getText: this.controller.getText,
      getClass: this.controller.getClass,
      isEnabled: this.controller.isEnabled,
      onClicked: (_: Observable): void => {
        innerDiv.style.display = innerDiv.style.display === 'none' ? 'block': 'none';
      }
    });

    appendView(outerSpan, this.button);
    this.dropdownView = this.controller.getDropdownView(this.model);
    appendView(innerDiv, this.dropdownView);
    outerSpan.appendChild(innerDiv);
    this.dropdownContainer = innerDiv;
    if (el.parentNode) {
      el.parentNode.replaceChild(outerSpan, el);
    }
  }

  update(): void {
    this.button.update();
    this.dropdownView.update();
  }

}
