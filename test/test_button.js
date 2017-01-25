let assert = require('assert');
let jsdom = require('jsdom').jsdom;

let makeEmptyPage = function() {
    return jsdom('<html><body></body></html>');
}

describe("Button", function() {
    describe("Checking mocha", function() {
	it("body starts empty", function() {
	    document = makeEmptyPage();
	    assert.equal(0, document.body.children.length);
	});

	it("button can be pressed", function() {
	    var pressed = false;
	    let document = makeEmptyPage();
	    let button = document.createElement('button');
	    button.addEventListener('click', function() {
		pressed = true;
	    });
	    document.body.appendChild(button);

	    let event = document.createEvent('Event');
	    event.initEvent('click', true, true);
	    button.dispatchEvent(event);
	    assert.equal(true, pressed);
	});
    });
});
