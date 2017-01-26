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
});

describe("Button", function() {
  it("has the right text", function() {
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
});
