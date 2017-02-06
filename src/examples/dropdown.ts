import * as allorryll from "../allorryll";

class CountModel extends allorryll.Observable {
    count: number = 5;

    increment(): void {
        this.count++;
        this.notify();
    }
}
let model = new CountModel();

let dropdown = new allorryll.DropdownButton(model, {
    getText: function(model: CountModel): string { return 'Clicks: ' + model.count; },
    dropdownView: new allorryll.Button(model, {
        getText: function(_: CountModel): string { return '++'; },
        onClicked: function(model: CountModel): void { model.increment(); }
    })
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("Hello");
    allorryll.appendView(document.body, dropdown);    
});