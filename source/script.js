/* global setAnswer, fieldProperties, getMetaData, setMetaData, getPluginParameter, Sortable, setFocus */

var label = document.querySelector('.label')
var hint = document.querySelector('.hint')
var formGroup = document.querySelector('.form-group')
var controlMessage = document.querySelector('.control-message')
var choices = fieldProperties.CHOICES
var choicesHolder = document.querySelector('#choices')
var rankSpans
var numChoices = choices.length
var orderStartSpaces = getMetaData()
var useNumbers = getPluginParameter('numbers')
if (useNumbers == null) {
  useNumbers = 1
}

label.innerHTML = unEntity(fieldProperties.LABEL)
hint.innerHTML = unEntity(fieldProperties.HINT)

var allChoiceValues = []
for (var c in choices) {
  var choice = choices[c]
  allChoiceValues.push(String(choice.CHOICE_VALUE))
}

// This creates an object of the choices so they can later be displayed in the proper order.
var choicesObj = {}
for (var c = 0; c < numChoices; c++) {
  var value = choices[c].CHOICE_VALUE
  var choiceLabel = choices[c].CHOICE_LABEL
  choicesObj[value] = {
    index: c,
    label: choiceLabel
  }
}

if (orderStartSpaces == null) {
  dispChoices()
} else { // Remove choices that are not valid choices
  var orderStartList = orderStartSpaces.match(/[^ ]+/g)
  var orderStartListHold = []
  var numStart = orderStartList.length
  for (var n = 0; n < numStart; n++) {
    var thisChoice = orderStartList[n]
    if (allChoiceValues.indexOf(thisChoice) !== -1) {
      orderStartListHold.push(thisChoice)
    }
  }
  orderStartList = orderStartListHold
  dispChoices(orderStartList) // Retrieves order of the choices so far
  orderStartSpaces = orderStartList.join(' ')
}
var liContainers = choicesHolder.querySelectorAll('li')
rankSpans = choicesHolder.querySelectorAll('#rank')
setRanks()

if (getPluginParameter('allowdef') === 1) {
  setAnswer(orderStartSpaces)
}

var order
var lastDragged
Sortable.create(choicesHolder,
  {
    group: 'choices',
    animation: 300,
    ghostClass: 'moving-choice',

    store: {

      set: function (sortable) {
        order = sortable.toArray()
        getOrder()
      }

    },
    onMove: function (sortable) {
      if (lastDragged != null) {
        lastDragged.classList.remove('last-moved')
      }
      lastDragged = sortable.dragged
    },
    onEnd: function (sortable) {
      choicesHolder.classList.remove('hovering')
      lastDragged = sortable.item
      lastDragged.classList.add('last-moved')
    }
  })

var getOrder = function () {
  // convert order array to space-separated list
  var spaceList = order.join(' ')
  setMetaData(spaceList)
  setAnswer(spaceList)
  setRanks()
}

// Remove blue border when ready to move again
document.addEventListener('mousemove', function () {
  choicesHolder.classList.add('hovering')
  if (lastDragged != null) {
    lastDragged.classList.remove('last-moved')
  }
})

function createChoice (choiceValue) {
  var thisChoice = choicesObj[choiceValue]
  var choiceLabel = unEntity(thisChoice.label)
  var choiceItem = '<li class="list-item" data-id="' + choiceValue + '">'

  if (useNumbers === 1) {
    choiceItem += '<span id="rank" dir="auto"></span>. '
  }

  choiceItem += choiceLabel + '</li>'
  return choiceItem
}

function dispChoices (orderStart) {
  if (orderStart == null) { // If empty (no order set yet), then should show in original order
    orderStart = []
    for (var i = 0; i < numChoices; i++) {
      orderStart.push(choices[i].CHOICE_VALUE)
    }
    orderStartSpaces = orderStart.join(' ')
  }

  var orderStartLength = orderStart.length
  // Used to display the choices in the correct order
  for (var c = 0; c < orderStartLength; c++) {
    var choiceValue = orderStart[c]
    if (allChoiceValues.includes(choiceValue)) { // Skip those that may have been removed due to choice filtering
      var choiceItem = createChoice(choiceValue)
      choicesHolder.innerHTML += choiceItem
    }
  }

  for (var c = 0; c < numChoices; c++) {
    var choiceValue = allChoiceValues[c]
    if (!orderStart.includes(choiceValue)) { // Add choices that may have been added due to choice filtering
      var choiceItem = createChoice(choiceValue)
      choicesHolder.innerHTML += choiceItem
    }
  }
}

function clearAnswer () {
  dispChoices()
  setAnswer()
}

function handleConstraintMessage (message) {
  formGroup.classList.add('has-error')
  controlMessage.innerHTML = message
  setFocus()
}

function handleRequiredMessage (message) {
  handleConstraintMessage(message)
}

function unEntity (str) {
  if (str == null) {
    return null
  } else {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  }
}

function setRanks () {
  if (useNumbers === 1) {
    rankSpans = choicesHolder.querySelectorAll('#rank')
    for (var r = 0; r < numChoices; r++) {
      rankSpans[r].innerHTML = (r + 1)
    }
  }
}
