let assert = require('assert');
let jsdom = require('jsdom').jsdom;
let allorryll = require('../build/allorryll');

let makeEmptyPage = function() {
    return jsdom('<html><body></body></html>');
}

describe("Label", function() {
  it("label is written with right text", function() {
     let document = makeEmptyPage();
     let model = allorryll.Observable({
       labelText: 'boris'
     });
     let label = new allorryll.Label(model, {
       getText: function(model) { return model.labelText; }
     });
     allorryll.appendView(document.body, label);
     assert.equal(1, document.body.children.length);
     assert.equal('SPAN', document.body.children[0].tagName);
     assert.equal('boris', document.body.children[0].innerHTML);
  });

  it("defaults to no class", function () {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      labelText: 'boris'
    });
    let label = new allorryll.Label(model, {
      getText: function (model) { return model.labelText; }
    });
    allorryll.appendView(document.body, label);
    assert.equal(1, document.body.children.length);
    assert.equal(false, document.body.children[0].hasAttribute('class'));
  });

  it("read the right class", function () {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      labelText: 'boris',
      classText: 'hilda'
    });
    let label = new allorryll.Label(model, {
      getText: function (model) { return model.labelText; },
      getClass: function (model) { return model.classText; }
    });
    allorryll.appendView(document.body, label);
    assert.equal(1, document.body.children.length);
    assert.equal('hilda', document.body.children[0].getAttribute('class'));
  });

  it("updates its text and class when notified", function() {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      labelText: 'boris',
      classText: 'hilda'
    });
    let label = new allorryll.Label(model, {
      getText: function (model) { return model.labelText; },
      getClass: function (model) { return model.classText; }
    });
    allorryll.appendView(document.body, label);
  
    assert.equal(1, document.body.children.length);
    assert.equal('boris', document.body.children[0].innerHTML);
    assert.equal('hilda', document.body.children[0].getAttribute('class'));

    model.labelText = 'meep';
    model.classText = 'newt';
    model.notify();

    assert.equal(1, document.body.children.length);
    assert.equal('meep', document.body.children[0].innerHTML);
    assert.equal('newt', document.body.children[0].getAttribute('class'));
  })
});

describe("Button", function () {
  it("has the right text", function () {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      buttonText: 'boris',
    });
    let button = new allorryll.Button(model, {
      getText: function (model) { return model.buttonText; }
    });
    allorryll.appendView(document.body, button);
    assert.equal(1, document.body.children.length);
    assert.equal('BUTTON', document.body.children[0].tagName);
    assert.equal('boris', document.body.children[0].innerHTML);
  });

  it("invokes when clicked", function() {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      buttonText: 'boris',
      clicked: false,
      click: function() {
        this.clicked = true;
        this.notify();
      }
    });
    let button = new allorryll.Button(model, {
      getText: function (model) { return model.buttonText; },
      onClicked: function(model) { 
        model.click(); 
        console.log("Hi");
    }
    });
    allorryll.appendView(document.body, button);
    let event = document.createEvent('Event');
    event.initEvent('click', true, true);
    button.button.dispatchEvent(event);
    assert.equal(true, model.clicked);
  });

  it("defaults to no class", function() {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      name: 'boris',   
    });
    let button = new allorryll.Button(model, {
      getText: function (model) { return model.name; }
    });
    allorryll.appendView(document.body, button);
    assert.equal(false, document.body.children[0].hasAttribute('class'));
    
  });

   it("reads correct class", function() {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      name: 'boris',
      class: 'hilda'
   
    });
    let button = new allorryll.Button(model, {
      getText: function (model) { return model.name; },
      getClass: function(model) { return model.class; }
    });
    allorryll.appendView(document.body, button);
    assert.equal('hilda', document.body.children[0].getAttribute('class'));
  });

  it ("updates text, enabled, and class on notify", function() {
    let document = makeEmptyPage();
    let model = allorryll.Observable({
      name: 'boris',
      class: 'hilda',
      enabled: true
    });
    let button = new allorryll.Button(model, {
      getText: function (model) { return model.name; },
      getClass: function(model) { return model.class; },
      isEnabled: function(model) { return model.enabled; }
    });
    allorryll.appendView(document.body, button);

    let el = document.body.children[0];
    assert.equal('boris', el.innerHTML);
    assert.equal('hilda', el.getAttribute('class'));
    assert.equal(false, el.disabled);

    model.name = 'meep';
    model.class = 'newt';
    model.enabled = false;
    model.notify();

    assert.equal('meep', el.innerHTML);
    assert.equal('newt', el.getAttribute('class'));
    assert.equal(true, el.disabled);
  })
});

describe("DropdownButton", function() {
  it("toggles display on click", function() {
    let document = makeEmptyPage();
    let model = allorryll.Observable({});
    let label = new allorryll.Label(model, {
      getText: function(model) { return 'Hilda!'; }
    });
    let dropdownButton = new allorryll.DropdownButton(model, {
      getText: function(model) { return 'boris'; },
      getDropdownView: function(model) { return label; }
    });
    allorryll.appendView(document.body, dropdownButton);

    assert.equal('none', dropdownButton.dropdownContainer.style.display);

    let event = document.createEvent('Event');
    event.initEvent('click', true, true);
    dropdownButton.button.button.dispatchEvent(event);

    assert.equal('block', dropdownButton.dropdownContainer.style.display);

    dropdownButton.button.button.dispatchEvent(event);

    assert.equal('none', dropdownButton.dropdownContainer.style.display);
  })
});