/*class fPChoice {
    constructor(index, value, label) {
        this.CHOICE_INDEX = index;
        this.CHOICE_VALUE = value;
        this.CHOICE_LABEL = label;
    }
}

fieldProperties = {
    "CHOICES": [
        new fPChoice(0, 0, 'Choice 1'),
        new fPChoice(1, 1, 'Choice 2'),
        new fPChoice(2, 2, 'Choice 3'),
    ],
    "METADATA": null,
    "LABEL": 'Hi!',
    "HINT": 'Lo!',
    PARAMETERS: [
        {
            "key": 'allowdef',
            "value": '1'
        }
    ]
}

function setAnswer(ans) {
    console.log("Set answer to: " + ans);
}

function setMetaData(string) {
    fieldProperties.METADATA = string;
}

function getMetaData() {
    return fieldProperties.METADATA;
}

class Choice {
    constructor(index, label) {
        this.index = index;
        this.label = label;
    }
}

document.body.classList.add('web-collect');
//Above for testing only*/

var isWebCollect = (document.body.className.indexOf("web-collect") >= 0);
var isAndroid = (document.body.className.indexOf("android-collect") >= 0);
var isIOS = (document.body.className.indexOf("ios-collect") >= 0);

var label = document.querySelector('.label');
var hint = document.querySelector('.hint');
var formGroup = document.querySelector('.form-group');
var controlMessage = document.querySelector('.control-message');
var choices = fieldProperties.CHOICES
var choicesHolder = document.querySelector('#choices');
var choiceRows, choiceTds;
var numChoices = choices.length;
var orderStartSpaces = getMetaData();
var parameters = fieldProperties.PARAMETERS;

var hoverValue = 0;
var buttonAreas = [];

label.innerHTML = unEntity(fieldProperties.LABEL);
hint.innerHTML = unEntity(fieldProperties.HINT);

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
    dispChoices(orderStartSpaces.match(/[^ ]+/g)); //Retrieves order of the choices so far
}

if((orderStartSpaces == null) && (parameters.length > 0) && (parameters[0].value == 0)){ //If it is okay to leave the default display of choices without any tapping or dragging of the choices
    gatherAnswer();
}
else if (orderStartSpaces != null){
    setAnswer(orderStartSpaces);
}

function dispChoices(orderStart) {
    if (orderStart == null) { //If empty (no order set yet), then should show in original order
        orderStart = [];
        for (let i = 0; i < numChoices; i++) {
            orderStart.push(choices[i].CHOICE_VALUE);
        }
    }
    //Used to display the choices in the correct order
    for (let r = 0; r < numChoices; r++) {
        let choiceValue = orderStart[r];
        let thisChoice = choicesObj[choiceValue];
        let choiceLabel = unEntity(thisChoice.label);
        let choiceTdLoc = '<tr><td class="rank">' + (r + 1) + '</td><td draggable="true" class="choice';

        if (isWebCollect) { choiceTdLoc += ' webcollect'; }

        choiceTdLoc += '">\n'
            + '<div class="choiceDiv" id=' + choiceValue + '>' + choiceLabel + '</div></td></tr>\n';
        choicesHolder.innerHTML += choiceTdLoc;
    } //End FOR to display choices in the correct order
    choiceRows = document.querySelector('#choices').querySelectorAll('tr'); //Gathered for later adjusting box height
    choiceTds = document.querySelectorAll('.choice');
    boxHeightAdjuster();
    getChoicePos();
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

function unEntity(str) {
    if (str == null) {
        return null;
    }
    else {
        return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }
}

//Changes each box's height to be as tall as the tallest one so that no box is dominant
function boxHeightAdjuster() {
    let allHeights = [];
    for (let i = 0; i < numChoices; i++) {
        allHeights.push(choiceTds[i].offsetHeight);
    }
    let topHeight = Math.max(...allHeights);

    for (let i = 0; i < numChoices; i++) {
        choiceRows[i].style.height = topHeight;
    }
}



var selectedTd = null;

function clicked(e) { //For click-select or tap-select to swap
    var target;
    if (e.target.tagName == 'DIV') { //Chain of IFs ensures the TD is selected, and not anything above or below
        target = e.path[1];
    }
    else if (e.target.tagName == 'TR') {
        target = e.target.querySelector('.choice');
    }
    else {
        target = e.target;
    }

    if (selectedTd == null) {
        selectedTd = target;
        selectedTd.classList.add('dragged');
    }
    else {
        target.classList.add('over');
        window.setTimeout(
            function () {
                try { //Swap if clicked or tapped instead of dragged
                    let hold = selectedTd.innerHTML;
                    selectedTd.innerHTML = target.innerHTML;
                    target.innerHTML = hold;
                    selectedTd.classList.remove('over');
                    selectedTd = null;
                    removeSelectedFormatting();
                    gatherAnswer();
                }
                catch (e) {
                    console.log(e);
                    console.log(selectedTd)
                }
            },
            200); //Delay so that it is easier to see what is being swapped based on color
    }
    event.stopPropagation();
    event.preventDefault();
}

////////////////////
//Dragging and dropping
//Thanks to https://www.html5rocks.com/en/tutorials/dnd/basics/

var dragSrcEl = null
function dragStart(e) {
    //this.style.opacity = '.4'; //Makes it more clear while being moved.
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

/*function dragEnter(e) {
}*/

function dragOver(e) {
    e.preventDefault();
    this.classList.add('over');
    e.dataTransfer.dropEffect = 'move';

    return false;
}

function dragLeave(e) {
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

function dragEnd(e) {
    [].forEach.call(choiceTds, function (choice) {
        choice.classList.remove('over'); //Removes all moving styling when done moving. Applies to all, since otherwise the place it was moved to will not be turned back.
    });

    gatherAnswer();
}


/////Touchscreen
/*var xStart;
var yStart;*/ //xStart and yStart is used when dragging on touchscreen shows the choice being dragged with the finger, but this does not work in SurveyCTO Collect right now, so not being used.
var xPos; //x position of mouse/finger
var yPos; //y position of mouse/finger
var moving = false;
var touchedAnother = false; //Ensures that when a choice is tapped and the finger moves slightly, but not to another choice, that choice remains seleced

function removeSelectedFormatting() { //Removes formatting when a swap is done
    for (let i = 0; i < numChoices; i++) {
        choiceTds[i].classList.remove('dragged');
        choiceTds[i].classList.remove('over');
    }
}

function touchMove(e) {
    //console.log("Touch move")
    if(touchedAnother){
        selectedTd = null;
    }

    var touchedChoice;
    if (e.target.tagName == 'DIV') {
        touchedChoice = e.path[1];
    }
    else if (e.target.tagName == 'TR') {
        touchedChoice = e.target.querySelector('.choice');
    }
    else {
        touchedChoice = e.target;
    }
    /*if (!moving) {
        xStart = touchedChoice.style.left;
        yStart = touchedChoice.style.top;
    }*/

    moving = true;

    var touch = e.touches[0];
    xPos = touch.pageX;
    yPos = touch.pageY;

    touchedChoice.classList.add('dragged');

    //touchedChoice.zIndex = 15; //Not working as intended right now, but may address later
    var objWidth = touchedChoice.offsetWidth;
    var objHeight = touchedChoice.offsetHeight;
    touchedChoice.style.left = xPos - (objWidth / 2);
    touchedChoice.style.top = yPos - (objHeight / 2);

    var touching = touchingOther();
    for (let i = 0; i < numChoices; i++) {
        let locChoice = choiceTds[i];
        if ((touching == i) && (!locChoice.classList.contains('dragged'))) { //Turns to color of dragover if being dragged over
            locChoice.classList.add('over');
            touchedAnother = true;
            locChoice.style.zIndex = 0;
        }
        else if (touchedAnother) { //Removed dragover coloring when exited
            locChoice.classList.remove('over');
        }
    }
}
function touchEnd(e) {
    //console.log("Touch end")
    touchedAnother = false;
    var touchedChoice;

    if (e.target.tagName == 'DIV') {
        touchedChoice = e.path[1];
    }
    else if (e.target.tagName == 'TR') {
        touchedChoice = e.target.querySelector('.choice');
    }
    else {
        touchedChoice = e.target;
    }
    touchedChoice.zIndex = 5;

    var touching = touchingOther(touchedChoice);

    if ((touching != -1) && moving) { //The "moving" var prevents occasional issues where tapping the same choice twice in a row prevents it from moving in the future.
        var draggedHTML = touchedChoice.innerHTML;
        touchedChoice.innerHTML = choiceTds[touching].innerHTML;
        choiceTds[touching].innerHTML = draggedHTML;
    }

    if (selectedTd == null) { //This way, if a TD is selected, it does not gather the answer and remove the formatting yet
        gatherAnswer();
    }

    if ((selectedTd == null)) {
        removeSelectedFormatting();
    }

    moving = false;

    //Below puts the box back where it was
    /*touchedChoice.style.left = xStart;
    touchedChoice.style.top = yStart;*/
}

//Checks if the dragged choice is over another choice so it can be highlighted and swapped
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

    moving = false;
    dragSrcEl = null
    selectedTd = null;
    removeSelectedFormatting();
}


function gatherAnswer() {
    let answer = [];
    //Puts the current list into an array in its current order.
    let choiceSpans = document.querySelectorAll('.choiceDiv');
    [].forEach.call(choiceSpans, function (c) {
        answer.push(c.id);
    });
    let joinedAnswer = answer.join(' ');

    setAnswer(joinedAnswer);
    setMetaData(joinedAnswer); //Stored in metadata so if the enumerator comes back, it is in the order they left it in
    selectedTd = null; //Undoes having a selected TD in case one was clicked before deciding to drag instead
    removeSelectedFormatting();
}

function getChoicePos() { //Gathers dimensions of each choice so it can be detected if they are being dragged over
    for (let i = 0; i < numChoices; i++) {
        let tdRect = choiceTds[i].getBoundingClientRect();
        let tdDim = [];
        tdDim[0] = tdRect.left;
        tdDim[1] = tdRect.right;
        tdDim[2] = tdRect.top;
        tdDim[3] = tdRect.bottom;
        buttonAreas[i] = tdDim;
    }
}

for (let c = 0; c < numChoices; c++) { //Assigns the touch events
    let choice = choiceTds[c];

    if (isWebCollect) {
        choice.addEventListener('click', clicked, false);
        choice.addEventListener('dragstart', dragStart, false);
        //choice.addEventListener('dragenter', dragEnter, false);
        choice.addEventListener('dragover', dragOver, false);
        choice.addEventListener('dragleave', dragLeave, false);
        choice.addEventListener('drop', moveDrop, false);
        choice.addEventListener('dragend', dragEnd, false);
    }

    choice.addEventListener('touchstart', clicked, false);
    choice.addEventListener('touchmove', touchMove, false);
    choice.addEventListener('touchend', touchEnd, false);
    choice.addEventListener('touchcancel', touchCancel, false);
}