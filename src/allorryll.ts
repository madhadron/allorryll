/*
 * Copyright 2017, Frederick J. Ross
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL was
 * not distributed with this file, You can 
 * obtain one at https://mozilla.org/MPL/2.0/.
 */


interface Observable {
    addObserver,
    deleteObserver,
    notify
}

let Observable = function(content) {
    function() {
	let observers = new Set();

	this.addObserver = function(observer) {
	    this.observers.add(observer);
	};

	this.deleteObserver = function(observer) {
	    this.observers.delete(observer);
	};

	this.notify = function() {
	    this.observers.forEach(function(observer) {
		observer.update();
	    });
	};
    }();

    // TODO Add fields from content
};

interface View {
    writeOver(el),
    update(msg)
}

interface LabelController {
    getText : function(Observable) -> string,
}

let Label = function(model : Observable, controller : LabelController) {
    this.model = model;
    this.controller = controller;
    this.model.addObserver(this);

    this.writeOver = function(el) {
	this.span = document.createElement('span');
	this.span.textContent = this.controller.getText(this.model);
	if (this.controller.getClass) {
	    this.span.setAttribute('class', this.controller.getClass());
	}
	el.parentNode.replaceChild(this.span, el);
    };

    this.update = function() {
	/*
	  We don't want to do anything to the DOM if there are no
	  changes needed, nor do we want users to lose whatever
	  text they may have selected.
	*/
	var newText = this.controller.getText(model);
	if (newText !== this.span.textContent) {
	    this.span.textContent = newText;
	}
	if (this.controller.getClass &&
	    this.controller.getClass(msg) !== this.span.getAttribute('class')) {
	    this.span.setAttribute('class', this.controller.getClass(msg));
	}
    };
}
