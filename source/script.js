/*class fPChoice {
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
    "METADATA": null
}

function setAnswer(ans) {
    console.log("Set answer to: " + ans);
}

function setMetaData(string){
    fieldProperties.METADATA = string;
}

function getMetaData(){
    return fieldProperties.METADATA;
}

class Choice {
    constructor(index, label) {
        this.index = index;
        this.label = label;
    }
}

//Above for testing only*/


var formGroup = document.querySelector('.form-group');
var controlMessage = document.querySelector('.control-message');
var choices = fieldProperties.CHOICES
var choicesHolder = document.querySelector('#choices');
var numChoices = choices.length;
var orderStartSpaces = getMetaData();

console.log("Current answer: " + orderStartSpaces);

var hoverValue = 0;
var buttonAreas = [];

//This creates an object of the choices so they can later be displayed in the proper order.
var choicesObj = {};
for (let c = 0; c < numChoices; c++) {
    let value = choices[c].CHOICE_VALUE;
    let label = choices[c].CHOICE_LABEL;
    choicesObj[value] = {
        "index": c,
        "label": label
    };
}

if (orderStartSpaces == null) {
    dispChoices()
}
else {
    dispChoices(orderStartSpaces.match(/[^ ]+/g));
}


var choiceTds = document.querySelectorAll('.choice');
getChoicePos();


function dispChoices(orderStart){
    console.log(orderStart);
    if(orderStart == null){ //If empty, then should show in original order
        console.log("Start blank");
        orderStart = [];
        for(let i = 0; i < numChoices; i++){
            orderStart.push(choices[i].CHOICE_VALUE);
        }
    }
    //Used to display the choices in the correct order
    for (let r = 0; r < numChoices; r++) {
        let choiceValue = orderStart[r];
        let thisChoice = choicesObj[choiceValue];
        let choiceLabel = thisChoice.label;
        let choiceDiv = '<tr><td class="rank">' + (r + 1) + '</td><td draggable="true" class="choice">\n'
            + '<div class="spanChoice" id=' + choiceValue + '>' + choiceLabel + '</div></td></tr>\n';
        choicesHolder.innerHTML += choiceDiv;
    } //End FOR to display choices in the correct order
}

function clearAnswer() {
    dispChoices();
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
}

function moveDragOver(e) {
    console.log("Over");
    this.classList.add('over');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    return false;
}

function moveLeave(e) {
    this.classList.remove('over');
}

function moveDrop(e) {
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
    [].forEach.call(choiceTds, function (choice) {
        choice.classList.remove('over'); //Removes all moving styling when done moving. Applies to all, since otherwise the place it was moved to will not be turned back.
    });
    gatherAnswer();
}



function resetZ() {
    for (var i = numChoices - 1; i >= 0; i--) {
        choiceTds[i].style.zIndex = 5;
    };
}

var xStart;
var yStart;
var xPos;
var yPos;
var moving = false
var test;

function touchStart(e) {
    var touchedChoice = e.target;
    xStart = touchedChoice.style.left;
    yStart = touchedChoice.style.top;
    touchedChoice.classList.add('dragged');

}
function touchMove(e) {
    var touchedChoice;

    if (e.target.tagName = 'DIV') {
        touchedChoice = e.path[1];
    }
    else {
        touchedChoice = e.target;
    }
    if (!moving) {
        xStart = touchedChoice.style.left;
        yStart = touchedChoice.style.top;
    }

    moving = true;

    var touch = e.touches[0];
    xPos = touch.pageX;
    yPos = touch.pageY;

    touchedChoice.classList.add('dragged');

    touchedChoice.zIndex = 15;
    var objWidth = touchedChoice.offsetWidth;
    var objHeight = touchedChoice.offsetHeight;
    touchedChoice.style.left = xPos - (objWidth / 2);
    touchedChoice.style.top = yPos - (objHeight / 2);

    var touching = touchingOther();
    for (let i = 0; i < numChoices; i++) {
        if (touching == i) {
            choiceTds[i].classList.add('over');
            choiceTds[i].style.zIndex = 0;
        }
        else {
            choiceTds[i].classList.remove('over');
        }
    }
}
function touchEnd(e) {

    var touchedChoice;

    if (e.target.tagName = 'DIV') {
        touchedChoice = e.path[1];
    }
    else {
        touchedChoice = e.target;
    }
    touchedChoice.zIndex = 5;

    var touching = touchingOther(touchedChoice);

    if ((touching != -1) && moving) {
        var draggedHTML = touchedChoice.innerHTML;
        touchedChoice.innerHTML = choiceTds[touching].innerHTML;
        choiceTds[touching].innerHTML = draggedHTML;
    }

    gatherAnswer();

    for (let i = 0; i < numChoices; i++) {
        choiceTds[i].classList.remove('dragged');
        choiceTds[i].classList.remove('over');
    }

    moving = false;

    //Below sets it back if not hovering over another td
    touchedChoice.style.left = xStart;
    touchedChoice.style.top = yStart;

    getChoicePos();

}

function touchingOther() {

    for (let i = 0; i < numChoices; i++) {
        let thisArea = buttonAreas[i];


        if (((xPos > thisArea[0]) && (xPos < thisArea[1])) &&
            ((yPos > thisArea[2]) && (yPos < thisArea[3]))) {
            return i;
        }

    }
    return -1;
}

function touchCancel(e) {
    console.log("touchCancel");
}



function gatherAnswer() {
    let answer = [];
    //Puts the current list into an array in its current order.
    var choiceSpans = document.querySelectorAll('.spanChoice');

    [].forEach.call(choiceSpans, function (c) {
        answer.push(c.id);
    });
    let joinedAnswer = answer.join(' ');
    console.log("Gathered answer: " + joinedAnswer);

    setAnswer(joinedAnswer);
    setMetaData(joinedAnswer);
}

function getChoicePos() {
    for (let i = 0; i < numChoices; i++) {
        let td = choiceTds[i];
        let tdDim = [];
        tdDim[0] = td.offsetLeft;
        tdDim[1] = tdDim[0] + td.offsetWidth;
        tdDim[2] = td.offsetTop;
        tdDim[3] = tdDim[2] + td.offsetHeight;
        buttonAreas[i] = tdDim;
    }
}

[].forEach.call(choiceTds, function (choice) {
    choice.addEventListener('dragstart', moveStart, false);
    choice.addEventListener('dragenter', moveEnter, false);
    choice.addEventListener('dragover', moveDragOver, false);
    choice.addEventListener('dragleave', moveLeave, false);
    choice.addEventListener('drop', moveDrop, false);
    choice.addEventListener('dragend', moveEnd, false);

    //choice.addEventListener('touchstart', touchStart, false);
    choice.addEventListener('touchmove', touchMove, false);
    choice.addEventListener('touchend', touchEnd, false);
    choice.addEventListener('touchcancel', touchCancel, false);
});