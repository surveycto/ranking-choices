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
} else {
  dispChoices(orderStartSpaces.match(/[^ ]+/g)) // Retrieves order of the choices so far
}
rankSpans = choicesHolder.querySelectorAll('#rank')
setRanks()

if (getPluginParameter('allowdef') === 1) {
  setAnswer(orderStartSpaces)
}

var order
Sortable.create(choicesHolder,
  {
    group: 'choices',
    animation: 150,
    ghostClass: 'moving-choice',

    store: {

      set: function (sortable) {
        order = sortable.toArray()
        getOrder()
        choicesHolder.classList.add('hovering')
      }

    }
  })

var getOrder = function () {
  // conver order arry to space separated list
  var spaceList = order.join(' ')
  setMetaData(spaceList)
  setAnswer(spaceList)
  setRanks()
}

document.addEventListener('mousedown', function () { // This removes the blue border during moving. Otherwise, it appears in seemingly-random spots. It is removed when the Sortable is done.
  choicesHolder.classList.remove('hovering')
})

function dispChoices (orderStart) {
  if (orderStart == null) { // If empty (no order set yet), then should show in original order
    orderStart = []
    for (var i = 0; i < numChoices; i++) {
      orderStart.push(choices[i].CHOICE_VALUE)
    }
    orderStartSpaces = orderStart.join(' ')
  }
  // Used to display the choices in the correct order
  for (var r = 0; r < numChoices; r++) {
    var choiceValue = orderStart[r]
    var thisChoice = choicesObj[choiceValue]
    var choiceLabel = unEntity(thisChoice.label)
    var choiceItem = '<li class="list-item" data-id="' + choiceValue + '">'

    if (useNumbers === 1) {
      choiceItem += '<span id="rank" dir="auto"></span>. '
    }

    choiceItem += choiceLabel + '</li>'
    choicesHolder.innerHTML += choiceItem
  } // End FOR to display choices in the correct order
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
