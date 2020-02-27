var formGroup = document.querySelector('.form-group');
var controlMessage = document.querySelector('.control-message');
var choices = document.querySelectorAll('.choice');
var choicesHolder = document.querySelector('#choices');
var numChoices = choices.length;

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

var dragSrcEl = null
function moveStart(e) {
    //this.style.opacity = '.4'; //Makes it more clear while being moved.
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function moveEnter(e) {
    this.classList.add('over');
}

function moveDragOver(e) {
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
    [].forEach.call(choices, function (choice) {
        choice.classList.remove('over'); //Removes all moving styling when done moving. Applies to all, since otherwise the place it was moved to will not be turned back.
    });
    gatherAnswer();
}


var selected = null;
function choiceTouched(e) {
    [].forEach.call(choices, function (choice) {
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

[].forEach.call(choices, function (choice) {
    choice.addEventListener('dragstart', moveStart, false);
    choice.addEventListener('dragenter', moveEnter, false);
    choice.addEventListener('dragover', moveDragOver, false);
    choice.addEventListener('dragleave', moveLeave, false);
    choice.addEventListener('drop', moveDrop, false);
    choice.addEventListener('dragend', moveEnd, false);

    choice.addEventListener('touchstart', choiceTouched, false);
});