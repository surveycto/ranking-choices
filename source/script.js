/* class fPChoice {
  constructor(index, value, label) {
    this.CHOICE_INDEX = index
    this.CHOICE_VALUE = value
    this.CHOICE_LABEL = label
  }
}

fieldProperties = {
  CHOICES: [
    new fPChoice(0, 0, 'Choice 1'),
    new fPChoice(1, 1, 'Choice 2'),
    new fPChoice(2, 2, 'Choice 3'),
  ],
  METADATA: '1 2 0',
  LABEL: 'Hi!',
  HINT: 'Lo!',
  PARAMETERS: [
    {
      key: 'allowdef',
      value: '1'
    },
    {
      key: 'numbers',
      value: '0'
    }
  ]
}

function setAnswer(ans) {
  console.log('Set answer to: ' + ans)
}

function setMetaData(string) {
  fieldProperties.METADATA = string
}

function getMetaData() {
  return fieldProperties.METADATA
}

function getPluginParameter(param){
  for(let p of fieldProperties.PARAMETERS){
    let key = p.key
    if(key == param){
      return p.value
    }
  }
  return
}

class Choice {
  constructor(index, label) {
    this.index = index
    this.label = label
  }
}

document.body.classList.add('android-collect')
// Above for testing only */
/* var testDiv = document.querySelector('#testing')
function testing(text){
  testDiv.innerHTML += text + '<br>\n'
} */

/* global setAnswer, fieldProperties, getMetaData, setMetaData, getPluginParameter, Sortable, setFocus */

function dispChoices (orderStart) {
  if (orderStart == null) { // If empty (no order set yet), then should show in original order
    orderStart = []
    for (let i = 0; i < numChoices; i++) {
      orderStart.push(choices[i].CHOICE_VALUE)
    }
    orderStartSpaces = orderStart.join(' ')
  }
  // Used to display the choices in the correct order
  for (let r = 0; r < numChoices; r++) {
    const choiceValue = orderStart[r]
    const thisChoice = choicesObj[choiceValue]
    const choiceLabel = unEntity(thisChoice.label)
    let choiceItem = '<li class="list-item" data-id="' + choiceValue + '">'

    if (useNumbers == 1) {
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
  if (useNumbers == 1) {
    rankSpans = choicesHolder.querySelectorAll('#rank')
    for (let r = 0; r < numChoices; r++) {
      rankSpans[r].innerHTML = (r + 1)
    }
  }
}

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
for (let c = 0; c < numChoices; c++) {
  const value = choices[c].CHOICE_VALUE
  const label = choices[c].CHOICE_LABEL
  choicesObj[value] = {
    index: c,
    label: label
  }
}

if (orderStartSpaces == null) {
  dispChoices()
} else {
  dispChoices(orderStartSpaces.match(/[^ ]+/g)) // Retrieves order of the choices so far
}
rankSpans = choicesHolder.querySelectorAll('#rank')
setRanks()

if (getPluginParameter('allowdef') == 1) {
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

document.addEventListener('mousedown', function () { // This removes the blue border during moveing. Otherwise, it appears in seemingly-random spots. It is removed when the Sortable is done.
  choicesHolder.classList.remove('hovering')
})
