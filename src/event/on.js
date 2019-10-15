'use strict'

var render = (param, element) => {
  param(element)
}

var click = (param, element) => {
  var { node } = element
  node.addEventListener('click', event => param(event, element), true)
}

var change = (param, element) => {
  var { node } = element
  node.addEventListener('change', event => param(event, element), true)
}

export { render, click, change }
