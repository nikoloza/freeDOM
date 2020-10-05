'use strict'

import { overwrite, exec, isObject } from '../utils'
import { throughDefine, throughTransform } from './iterate'
import { registry } from './params'
import * as on from '../event/on'

var update = function (params = {}, forceIteration = false) {
  var element = this
  var { node } = element

  if (typeof element.if === 'function' && !element.if(element)) return void 0

  // If element is string
  if (typeof params === 'string' || typeof params === 'number') {
    params = { text: params }
  }

  overwrite(element, params)

  // iterate through define
  if (isObject(element.define)) {
    var { define } = element
    for (const param in define) {
      if (params[param] !== undefined) {
        let execParam = exec(params[param], element)
        element.data[param] = execParam
        element[param] = define[param](execParam, element)
      } else {
        let execParam = exec(element[param], element)
        element[param] = define[param](element.data[param], element)
      }
    }
  }

  // iterate through transform
  if (isObject(params.transform)) throughTransform(element)

  for (const param in (forceIteration ? element : params)) {
    if ((param === 'set' || param === 'update') || !element[param] === undefined) return

    var execParam = exec(params[param], element)
    var execElementParam = exec(element[param], element)

    var hasDefined = element.define && element.define[param]
    var registeredParam = registry[param]

    if (registeredParam) {
      // Check if it's registered param
      if (typeof registeredParam === 'function') {
        registeredParam(forceIteration ? execElementParam : execParam, element, node)
      }

      if (param === 'style') registry['class'](element['class'], element, node)
    } else if (element[param] && !hasDefined) {
      // Create element
      update.call(execElementParam, execParam, true)
    } // else if (element[param]) create(execParam, element, param)
  }

  // run onUpdate
  if (element.on && typeof element.on.update === 'function') {
    on.update(element.on.update, element)
  }

  return this
}

export default update
