class fPChoice {
    constructor(index, value, label) {
        this.CHOICE_INDEX = index;
        this.CHOICE_VALUE = value;
        this.CHOICE_LABEL = label;
    }
}

fieldProperties = {
    "CHOICES": [
        new fPChoice(0, 1, 'Choice 1'),
        new fPChoice(1, 2, 'Choice 2'),
        new fPChoice(2, 3, 'Choice 3'),
    ],
    "CURRENT_ANSWER": '1 2 3'
}

class Choice {
    constructor(index, label) {
        this.index = index;
        this.label = label;
    }
}

function setAnswer(ans) {
    console.log("Set answer to: " + ans);
}

//Above for testing only*/

var formGroup = document.querySelector('.form-group');
var controlMessage = document.querySelector('.control-message');
var choices = fieldProperties.CHOICES
var choicesHolder = document.querySelector('#choices');
var numChoices = choices.length;
var orderStartSpaces = fieldProperties.CURRENT_ANSWER;
var orderStart = orderStartSpaces.match(/[^ ]+/g);
var hoverValue = 0;

//This creates an object of the choices so they can later be displayed in the proper order.
var choicesObj = {};
for (let c = 0; c < numChoices; c++) {
    let value = choices[c].CHOICE_VALUE;
    let label = choices[c].CHOICE_LABEL;
    choicesObj[value] = new Choice(c, label);
}

//Used to display the choices in the correct order
for (let r = 0; r < numChoices; r++) {
    let choiceValue = orderStart[r];
    let thisChoice = choicesObj[choiceValue];
    let choiceLabel = thisChoice.label;
    let choiceDiv = '<tr><td>' + (r + 1) + '</td><td draggable="true" class="choice">\n'
        + '<span class="spanChoice" id=choiceValue>' + choiceLabel + '</span></td></tr>\n';
    choicesHolder.innerHTML += choiceDiv;
} //End FOR to display choices in the correct order

var choiceDivs = document.querySelectorAll('.choice');




function clearAnswer() {
    choicesHolder.innerHTML =
        '{{#CHOICES}}\n'
        + '<div draggable="true" class="choice">\n'
        + '<span class="spanChoice" id="{{CHOICE_VALUE}}">{{CHOICE_LABEL}}</span>\n'
        + '</div><br>\n'
        + '{{/CHOICES}}'
    setAnswer();
}

function handleConstraintMessage(message) {
    formGroup.classList.add('has-error');
    controlMessage.innerHTML = message;
    setFocus();
}

function handleRequiredMessage(message) {
    handleConstraintMessage(message)
}





////////////////////
//Dragging and dropping
//Thanks to https://www.html5rocks.com/en/tutorials/dnd/basics/
var check = 0;
var lastMove;

var dragSrcEl = null
function moveStart(e) {
    //this.style.opacity = '.4'; //Makes it more clear while being moved.
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function moveEnter(e) {
    //console.log("Entered choice " + choiceValue);
    hoverValue++;
    console.log("Increase: " + hoverValue);
    /*if(lastMove == 'leave' && hoverValue > 1){
        console.log("Setting back down: " + hoverValue)
        hoverValue--;
    }*/


    if(hoverValue > 0){
        this.classList.add('over');
    }
    check++;
    lastMove = 'enter';
}

function moveDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    return false;
}

function moveLeave(e) {
    hoverValue--;
    if(hoverValue < 0){
        hoverValue++;
    }
    if(hoverValue == 0){
        this.classList.remove('over');
    }
    console.log("Decrease: " + hoverValue);
    lastMove = 'leave';
}

function moveDrop(e) {
    console.log("Dropped " + e.target.innerText);
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }

    // Don't do anything if dropping the same column we're dragging.
    if (dragSrcEl != this) {
        // Set the source column's HTML to the HTML of the column we dropped on.
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
    }

    return false;
}

function moveEnd(e) {
    console.log("Stopped moving " + e);
    [].forEach.call(choiceDivs, function (choice) {
        choice.classList.remove('over'); //Removes all moving styling when done moving. Applies to all, since otherwise the place it was moved to will not be turned back.
    });
    gatherAnswer();
}


var selected = null;
function choiceTouched(e) {
    [].forEach.call(choiceDivs, function (choice) {
        choice.classList.remove('over');
    });
    if (selected == null) {
        this.classList.add('over');
        selected = this;
    }
    else {
        let hold = selected.innerHTML;
        selected.innerHTML = this.innerHTML;
        this.innerHTML = hold;
        selected = null;
        moveEnd(e)
    }
}

function gatherAnswer() {
    let answer = [];
    //Puts the current list into an array in its current order.
    var choiceSpans = document.querySelectorAll('.spanChoice');

    /*for (let i = 0; i < numChoices; i++) {
        let choiceId = choiceSpans[i].id;
        answer.push(choiceId);
        fieldProperties.CHOICES[i].CHOICE_VALUE = choiceId;
        console.log(i);
        console.log(fieldProperties.CHOICES);
    }
    console.log(fieldProperties.CHOICES);*/
    [].forEach.call(choiceSpans, function (c) {
        answer.push(c.id);
    });
    let joinedAnswer = answer.join(' ');
    setAnswer(joinedAnswer);
}

[].forEach.call(choiceDivs, function (choice) {
    choice.addEventListener('dragstart', moveStart, false);
    choice.addEventListener('dragenter', moveEnter, false);
    choice.addEventListener('dragover', moveDragOver, false);
    choice.addEventListener('dragleave', moveLeave, false);
    choice.addEventListener('drop', moveDrop, false);
    choice.addEventListener('dragend', moveEnd, false);

    choice.addEventListener('touchstart', choiceTouched, false);
});